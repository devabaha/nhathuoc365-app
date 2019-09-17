export default function handleErrors(formValues = {}, rulesDefinition = {}) {
  const errors = {};
  Object.keys(rulesDefinition).forEach(fieldName => {
    const rules = rulesDefinition[fieldName];
    if (rules && Array.isArray(rules.validators)) {
      rules.validators.some(validator => {
        if (typeof validator === 'function') {
          const hasError = validator(formValues[fieldName]);
          if (hasError) {
            errors[fieldName] = hasError;
            return true;
          }
        }
      });
    }
  });
  return errors;
}
