const FORM_SELECTORS = {
  form: '.js-form',
  formContent: '.js-form-content',
  formSuccess: '.js-form-content-success',
  formFailure: '.js-form-content-failure',
  formHeader: '.js-form-header',
  submitBtn: '.js-form-submit',
  inputHolder: '.js-input-holder',
  input: '.js-input-field',
  select: '.js-select',
  checkbox: '.js-input-checkbox',
  textarea: '.js-textarea',
  errorContent: '.js-error-message',
}

const INPUT_CLASSNAMES = {
  phoneInput: 'js-input-type-phone',
  emailInput: 'js-input-type-email',
  defaultInput: 'js-input-type-default',
  inputOptional: 'js-optional'
}

const FORM_STATE = {
  error: 'is-error',
  visible: 'is-visible',
  hidden: 'is-hidden',
}

const ERROR_MESSAGES = {
  formInvalid: 'Поля формы заполнены неверно',
  phoneInvalid: 'Неверно введен телефон',
  emailInvalid: 'Неверно введен e-mail',
  textInvalid: 'Недопустимые символы',
  selectInvalid: 'Ничего не выбрано',
  inputRequired: 'Поле не может быть пустым',
  minLengthInvalid: 'Слишком короткое значение',
  maxLengthInvalid: 'Значение слишком длинное'
};

const SITE_URL = import.meta.env.VITE_SITE_URL;
const API_URL = import.meta.env.VITE_API_URL;
const TPL_URL = import.meta.env.VITE_TPL_URL;
const SITE_API_URL = `${SITE_URL}${API_URL}`;

export {
  SITE_URL,
  API_URL,
  TPL_URL,
  SITE_API_URL,
  FORM_STATE,
  FORM_SELECTORS,
  INPUT_CLASSNAMES,
  ERROR_MESSAGES,
}
