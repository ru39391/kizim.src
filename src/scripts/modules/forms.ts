import Utils from '../utils';
import {
  SITE_API_URL,
  STATE_MOD,
  FORM_SELECTORS,
  INPUT_CLASSNAMES,
  ERROR_MESSAGES,
} from '../utils/constants';

/**
 * Проверка необязательности заполнения поля
 */
const isInputOptional = (
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
): boolean => field.classList.contains(INPUT_CLASSNAMES.inputOptional);

/**
 * Отображение описания ошибки поля при обработке формы
 */
const showErrorMessage = (
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  message: string
) => {
  const holder = field.closest(FORM_SELECTORS.inputHolder);
  const errorItem = holder?.querySelector(FORM_SELECTORS.errorContent) as HTMLElement;

  errorItem.textContent = message;
};

/**
 * Добавляет/убирает модификатор контейнеру поля ввода
 */
const handleInputHolder = (
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  isValid: boolean
) => {
  const inputHolder = field.closest(FORM_SELECTORS.inputHolder);

  if(!inputHolder) {
    console.log(field);
    return;
  }

  isValid
    ? inputHolder.classList.add(STATE_MOD.error)
    : inputHolder.classList.remove(STATE_MOD.error);
};

/**
 * Валидация поля без дополнительных условий
 */
const checkPlainField = (field: HTMLInputElement | HTMLTextAreaElement, isValueValid: boolean, key: string): boolean => {
  const { value } = field;
  const isValid = isInputOptional(field) && value.length === 0 ? !isValueValid : isValueValid;

  if (value.length === 0 && !isInputOptional(field)) {
    showErrorMessage(field, ERROR_MESSAGES.inputRequired);
  } else {
    // TODO: установить корректные типы для key
    if(!isValueValid) showErrorMessage(field, ERROR_MESSAGES[key]);
  }

  handleInputHolder(field, !isValid);

  return isValid;
}

/**
 * Валидация электронной почты
 */
const validateEmail = (email: string): boolean => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}

/**
 * Валидация телефона по длине, так как используется маска телефона
 */
const validatePhone = (phone: string): boolean => !(phone.length < 18);

/**
 * Валидация строки (напр. - имя фамилия)
 */
const validateString = (string: string) => {
  const re = /^[a-zа-яё\s]+$/iu;
  return re.test(string);
}

/**
 * Валидация обычного поля (мин. длина строки - 2 симв., макс. длина - 76)
 */
const checkStringField = (input: HTMLInputElement): boolean => {
  const { value } = input;
  const [isValid, isMinLength] = isInputOptional(input)
    ? [validateString(value) || value.length === 0, value.length > 1 || value.length === 0]
    : [validateString(value), value.length > 1];

  const incorrectCases = [
    !isValid,
    !isMinLength,
    value.length > 76
  ];
  const errorMessages = [
    ERROR_MESSAGES.textInvalid,
    ERROR_MESSAGES.minLengthInvalid,
    ERROR_MESSAGES.maxLengthInvalid
  ];

  if (value.length === 0 && !isInputOptional(input)) {
    showErrorMessage(input, ERROR_MESSAGES.inputRequired);
  } else {
    incorrectCases.forEach((item, index) => {
      if(item) showErrorMessage(input, errorMessages[index]);
    });
  }

  handleInputHolder(input, incorrectCases.some(item => item));

  return incorrectCases.filter(item => item).length === 0;
}

/**
 * Валидация поля электронной почты, если не проходит, то добавляем класс ошибки
 */
const checkEmailField = (input: HTMLInputElement): boolean => checkPlainField(input, validateEmail(input.value), 'emailInvalid');

/**
 * Валидация поля телефона, если не проходит, то добавляем класс ошибки
 * 9, 8, 4, 3 - допустимые цифры после +7
 */
const checkPhoneField = (input: HTMLInputElement): boolean => {
  const { value } = input;
  const incorrectCases = [
    !validatePhone(value),
    ![3,4,8,9].includes(Number(value.split('')[4]))
  ];
  const isValid = incorrectCases.some(item => item);

  if (value.length === 0 && !isInputOptional(input)) {
    showErrorMessage(input, ERROR_MESSAGES.inputRequired);
  } else {
    incorrectCases.forEach(item => {
      if(item) showErrorMessage(input, ERROR_MESSAGES.phoneInvalid);
    });
  }

  handleInputHolder(input, isValid);

  return isInputOptional(input) ? isValid && value.length === 0 : incorrectCases.filter(item => item).length === 0;
}

/**
 * Валидация текстовых областей, максимальное количество символов - 500
 */
const checkCommentField = (textarea: HTMLTextAreaElement): boolean => {
  const { value } = textarea;

  return checkPlainField(textarea, value.length < 500 && value.length !== 0, 'maxLengthInvalid');
}

/**
 * Валидация списков
 */
const validateSelect = (select: HTMLSelectElement): boolean => {
  const isValid = isInputOptional(select) ? isInputOptional(select) : Boolean(select.value);
  handleInputHolder(select, !isValid);

  if(!isValid) showErrorMessage(select, ERROR_MESSAGES.selectInvalid);

  return isValid;
}

/**
 * Валидация чекбоксов
 */
const validateCheckbox = (input: HTMLInputElement): boolean => {
  handleInputHolder(input, input.checked);

  return input.checked;
}

/**
 * Проверка полей формы при потере фокуса
 */
const checkFieldOnOutFocus = (form: HTMLFormElement) => {
  const {
    input,
    checkbox,
    textarea: textareaSel,
    submitBtn: submitBtnSel
  } = FORM_SELECTORS;
  const {
    phoneInput,
    emailInput,
    defaultInput
  } = INPUT_CLASSNAMES;

  const inputsArr = Array.from(form.querySelectorAll(input)) as HTMLInputElement[];
  const checkboxArr = Array.from(form.querySelectorAll(checkbox)) as HTMLInputElement[];
  const textarea = form.querySelector(textareaSel) as HTMLTextAreaElement;
  const submitBtn = form.querySelector(submitBtnSel) as HTMLButtonElement;

  // включает/отключает кнопку отправки формы
  const checkAndToggleSubmit = (
    input: HTMLInputElement | HTMLTextAreaElement,
    checkFunction: Function
  ) => {
    checkFunction(input)
      ? submitBtn.removeAttribute('disabled')
      : submitBtn.disabled = true;
  };

  // Для каждого input элемента добавляем обработчик события "focusout"
  inputsArr.forEach((input) => {
    input.addEventListener('focusout', () => {
      // Проверяем и переключаем состояние кнопки отправки формы в зависимости от типа input поля
      if (input.classList.contains(phoneInput)) {
        checkAndToggleSubmit(input, checkPhoneField);
      } else if (input.classList.contains(emailInput)) {
        checkAndToggleSubmit(input, checkEmailField);
      } else if (input.classList.contains(defaultInput)) {
        checkAndToggleSubmit(input, checkStringField);
      }
    });
  });

  checkboxArr.forEach((input) => {
    input.addEventListener('focusout', () => {
      checkAndToggleSubmit(input, validateCheckbox);
    });
  });

  if (textarea) {
    textarea.addEventListener('focusout', () => {
      checkAndToggleSubmit(textarea, checkCommentField);
    });
  }
};

/**
 * Полная валидация формы (используется перед отправкой)
 */
const validateForm = (form: HTMLFormElement): boolean => {
  const {
    input,
    select,
    checkbox,
    textarea: textareaSel
  } = FORM_SELECTORS;
  const {
    phoneInput,
    emailInput,
    defaultInput
  } = INPUT_CLASSNAMES;

  const inputsArr = Array.from(form.querySelectorAll(input)) as HTMLInputElement[];
  const selectsArr = Array.from(form.querySelectorAll(select)) as HTMLSelectElement[];
  const checkboxArr = Array.from(form.querySelectorAll(checkbox)) as HTMLInputElement[];
  const textarea = form.querySelector(textareaSel) as HTMLTextAreaElement;

  const validFieldsStatus: boolean[] = [];
  let isValid = true;

  inputsArr.forEach((input) => {
    if (input.classList.contains(phoneInput)) {
      checkPhoneField(input);
      validFieldsStatus.push(checkPhoneField(input));
    }
    if (input.classList.contains(emailInput)) {
      checkEmailField(input);
      validFieldsStatus.push(checkEmailField(input));
    }
    if (input.classList.contains(defaultInput)) {
      checkStringField(input);
      validFieldsStatus.push(checkStringField(input));
    }
  });

  selectsArr.forEach((select) => {
    validateSelect(select);
    validFieldsStatus.push(validateSelect(select));
  });

  checkboxArr.forEach((input) => {
    validFieldsStatus.push(validateCheckbox(input));
  });

  if (textarea) {
    checkCommentField(textarea);
    validFieldsStatus.push(checkCommentField(textarea));
  }

  if (validFieldsStatus.includes(false)) {
    isValid = false;
  }

  return isValid;
}

/**
 * Собираем данные формы перед отправкой
 */
const serializeForm = (form: HTMLFormElement): FormData => new FormData(form);

/**
 * Валидация и отправка формы
 */
const submitForm = () => {
  const {
    form,
    formContent: formContentSel,
    formSuccess: formSuccessSel,
    formFailure: formFailureSel,
    formHeader: formHeaderSel,
    submitBtn: submitBtnSel
  } = FORM_SELECTORS;
  const forms: HTMLFormElement[] = Array.from(document.querySelectorAll(form));

  if (!forms.length) {
    return;
  }

  forms.forEach((form) => {
    const formEl = form.querySelector('form');
    const submitBtn = form.querySelector(submitBtnSel) as HTMLButtonElement;
    const formContent = form.querySelector(formContentSel) as HTMLElement;
    const formSuccess = form.querySelector(formSuccessSel) as HTMLElement;
    const formFailure = form.querySelector(formFailureSel) as HTMLElement;
    const formHeader = form.querySelector(formHeaderSel) as HTMLElement;
    const formNode = formEl ? formEl : form;

    formNode.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;

      const formData = serializeForm(formNode);
      const validate = validateForm(formNode);
      const values = Array.from(formData.entries()).reduce((acc, item) => {
        const [key, value] = item;
        const { dataset } = formNode.querySelector(`[name="${key}"]`) as HTMLInputElement;

        return { ...acc, [dataset.name as string]: value };
      }, {});

      if (!validate) {
        console.error(ERROR_MESSAGES.formInvalid);
      } else {
        try {
          const response = await fetch(
            `${SITE_API_URL}/feedback`,
            {
              method: 'POST',
              body: JSON.stringify([values])
            }
          );

          if(!response.ok) {
            return;
          }

          const { data: { uri }, success } = await response.json();

          if (success) {
            formNode.reset();
            formHeader?.classList.add(STATE_MOD.hidden);
            formContent?.classList.add(STATE_MOD.hidden);
            formSuccess?.classList.remove(STATE_MOD.hidden);
            window.location = uri;
          } else {
            submitBtn.disabled = true;
          }
        } catch (error) {
          console.error(error);
          submitBtn.disabled = false;
          formFailure?.classList.remove(STATE_MOD.hidden);
          //formFailure.textContent = error as string;
        }
      }
    });

    Utils.phoneMask();
    checkFieldOnOutFocus(formNode);
  });
}

export {
  submitForm
}
