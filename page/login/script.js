function Validator(options) {
  // Hàm lấy thẻ cha dựa vào selector
  function getParent(element, selector) {
    while (element.parentElement) {
      // Sửa 'parentElemnet' thành 'parentElement'
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
    return null; // Trường hợp không tìm thấy thẻ cha
  }

  // Đối tượng lưu trữ các rule theo selector
  var selectorRules = {};

  // Hàm thực hiện validate một trường nhập liệu
  function validate(inputElement, rule) {
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);

    var errorMessage;
    var rules = selectorRules[rule.selector];

    // Lặp qua từng rule và kiểm tra
    for (var i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break; // Nếu có lỗi thì dừng kiểm tra
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      ); // Sửa 'add' thành 'remove'
    }

    return !errorMessage; // Trả về true nếu không có lỗi
  }

  // Lấy form element trong DOM
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // Xử lý sự kiện submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();
      var isFormValid = true;

      // Lặp qua từng rule và validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // Kiểm tra nếu có onSubmit do người dùng định nghĩa
        if (typeof options.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll("[name]");

          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            values[input.name] = input.value;
            return values;
          },
          {});

          options.onSubmit(formValues);
        } else {
          formElement.submit(); // Nếu không, submit mặc định
        }
      }
    };

    // Lặp qua từng rule để xử lý (lắng nghe sự kiện)
    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        // Xử lý trường hợp blur khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        // Xử lý khi người dùng nhập
        inputElement.oninput = function () {
          var errorElement = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.errorSelector);
          errorElement.innerText = "";
          getParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid"
          );
        };
      }
    });
  }
}

// Định nghĩa rule kiểm tra email
Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Vui lòng nhập đúng định dạng email!";
    },
  };
};

// Định nghĩa rule kiểm tra độ dài tối thiểu
Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} kí tự!`;
    },
  };
};

// Định nghĩa rule kiểm tra nếu trường bắt buộc nhập
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Bắt buộc nhập thông tin!";
    },
  };
};
