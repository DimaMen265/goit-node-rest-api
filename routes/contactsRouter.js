const express = require("express");
const {
  getAllContacts,
  getOneContact,
  removeContact,
  createContact,
  improveContact,
  improveStatus,
} = require("../controllers/contactsControllers.js");
const { validateBody } = require("../helpers/validateBody.js");
const { validateId } = require("../helpers/validateId.js");
const {
  createContactSchema,
  improveContactSchema,
  improveStatusSchema
} = require("../schemas/contactsSchemas.js")

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", validateId, removeContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(improveContactSchema), improveContact);

contactsRouter.patch("/:id/favorite", validateBody(improveStatusSchema), improveStatus);

module.exports = contactsRouter;
