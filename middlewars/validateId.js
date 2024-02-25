const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers/HttpError");

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    next(HttpError(400, `${id} is not valid id`));
      
    return;
  };

  next();
};

module.exports = { validateId };