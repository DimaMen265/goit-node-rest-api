const { isValidObjectId } = require("mongoose");
const HttpError = require("./HttpError");

const validateId = (req, _, next) => {
    if (!isValidObjectId(req.params.id)) {
        next(HttpError(404));
        return;
    };

    next();
};

module.exports = { validateId };
