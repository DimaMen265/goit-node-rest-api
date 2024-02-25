const { model, Schema } = require("mongoose");
const { handleMongooseError } = require("../helpers/handleMongooseError");

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },

    { versionKey: false },
);

contactsSchema.post("save", handleMongooseError);

const Contact = model("contacts", contactsSchema);

module.exports = { Contact };
