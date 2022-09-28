const checkRequiredFields = (fields) => {
  for (let field in fields) {
    if (fields[field].trim() === "") return false;
  }

  return true;
};

module.exports = checkRequiredFields;