function validateCustomFieldDefinitions(customFields, validationErrors) {
  let isValid = true;
  const fieldNames = new Set();

  for (const field of customFields) {
    if (!field.fieldName || !field.fieldType) {
      validationErrors.push(
        "Each custom field must have a fieldName and a fieldType.",
      );
      isValid = false;
      break;
    }
    if (fieldNames.has(field.fieldName)) {
      validationErrors.push(`Duplicate fieldName found: ${field.fieldName}.`);
      isValid = false;
      break;
    } else {
      fieldNames.add(field.fieldName);
    }
    if (!["Integer", "String", "Boolean", "Date"].includes(field.fieldType)) {
      validationErrors.push(
        `Invalid fieldType for ${field.fieldName}: ${field.fieldType}.`,
      );
      isValid = false;
      break;
    }
  }

  return isValid;
}

module.exports = { validateCustomFieldDefinitions };
