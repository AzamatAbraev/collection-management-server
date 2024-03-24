function validateCustomFields(customValues, customFields, validationErrors) {
  let isValid = true;

  customFields.forEach((field) => {
    const value = customValues[field.fieldName];
    if (value !== undefined) {
      switch (field.fieldType) {
        case "Integer":
          if (!Number.isInteger(value)) {
            validationErrors.push(`${field.fieldName} must be an integer.`);
            isValid = false;
          }
          break;
        case "String":
          if (typeof value !== "string") {
            validationErrors.push(`${field.fieldName} must be a string.`);
            isValid = false;
          }
          break;
        case "Boolean":
          if (typeof value !== "boolean") {
            validationErrors.push(`${field.fieldName} must be a boolean.`);
            isValid = false;
          }
          break;
        case "Date":
          if (isNaN(Date.parse(value))) {
            validationErrors.push(`${field.fieldName} must be a valid date.`);
            isValid = false;
          }
          break;
        default:
          validationErrors.push(`Invalid type for ${field.fieldName}.`);
          isValid = false;
      }
    } else {
      validationErrors.push(`${field.fieldName} is required.`);
      isValid = false;
    }
  });

  return isValid;
}

module.exports = { validateCustomFields };
