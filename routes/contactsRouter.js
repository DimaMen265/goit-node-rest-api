const express = require("express");
const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} = require("../controllers/contactsControllers");
const { validateBody } = require("../middlewars/validateBody");
const { validateId } = require("../middlewars/validateId");
const { validateJWT } = require("../middlewars/validateJWT");
const {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} = require("../schemas/contactsSchemas")

const contactsRouter = express.Router();

contactsRouter.get("/", validateJWT, getAllContacts);

contactsRouter.get(
  "/:id",
  validateJWT,
  validateId,
  getOneContact
);

contactsRouter.delete(
  "/:id",
  validateJWT,
  validateId,
  deleteContact
);

contactsRouter.post(
  "/",
  validateJWT,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  validateJWT,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  validateJWT,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

module.exports = contactsRouter;
