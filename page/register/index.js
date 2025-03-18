function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
    return null;
  }

  // tao object luu tru cac rules
  var selectorRules = {};

  function validate(inputElement, rule) {
    // get element cua error
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);

    var errorMessage;
    var rules = selectorRules[rule.selector];

    // lap qua tung rules de kiem tra
    for (var i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value); // input value
      if (errorMessage) break;
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = " ";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }
    return !errorMessage;
  }
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // xu li khi nguoi dung submit
    formElement.onsubmit = function (e) {
      // ngan su kien load lai page khi submit
      e.preventDefault();
      var isFormValid = true;

      // thuc hien validate qua tung rule
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
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
          formElement.submit();
        }
      }
    };

    //xu li cac su kien
    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

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
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Bắt buộc nhập thông tin!";
    },
  };
};
Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : "Vui lòng nhập đúng định dạng email!";
    },
  };
};
Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập password đủ ${min} kí tự!`;
    },
  };
};
Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Vui lòng nhập đúng password!";
    },
  };
};
Validator.isString = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      const isNotNumber = isNaN(value);
      return isNotNumber
        ? undefined
        : "Vui lòng nhập tên là chuỗi ký tự hợp lệ (không phải số)!";
    },
  };
};
