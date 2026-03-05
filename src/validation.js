import * as yup from 'yup';

const buildSchema = (existingUrls, i18n) => {
  yup.setLocale({
    mixed: {
      required: () => i18n.t('errors.required'),
      notOneOf: () => i18n.t('errors.notOneOf'),
    },
    string: {
      url: () => i18n.t('errors.url'),
    },
  });

  return yup
    .string()
    .required()
    .url()
    .notOneOf(existingUrls);
};

const validate = (url, existingUrls, i18n) => {
  const schema = buildSchema(existingUrls, i18n);
  return schema.validate(url);
};

export default validate;