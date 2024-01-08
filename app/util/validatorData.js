const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

// create One User data
exports.createOneUserData = (data) => {
  let allErrors = {};

  if (isEmpty(data.name)) {
    allErrors.name = "Kullancı İsim giriniz, boş bırakılamaz !!";
  }

  return {
    allErrors,
    valid: Object.keys(allErrors).length === 0 ? true : false,
  };
};


exports.createOneBookData = (data) => {

  console.log("dataOn", data)
  let allErrors = {};

  if (isEmpty(data.name)) {
    allErrors.name = "Kullancı İsim giriniz, boş bırakılamaz !!";
  }

  return {
    allErrors,
    valid: Object.keys(allErrors).length === 0 ? true : false,
  };
};
