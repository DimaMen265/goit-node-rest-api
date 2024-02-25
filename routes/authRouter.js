const express = require("express");
const {
    register,
    login,
    getCurrent,
    logout,
    updateSubscription,
} = require("../controllers/authControllers");
const { validateBody } = require("../middlewars/validateBody");
const { validateJWT } = require("../middlewars/validateJWT");
const {
    registerSchema,
    loginSchema,
    updateSubscriptionSchema,
} = require("../schemas/userSchema");

const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(registerSchema),
    register
);

authRouter.post(
    "/login",
    validateBody(loginSchema),
    login
);

authRouter.get(
    "/current",
    validateJWT,
    getCurrent
);

authRouter.post(
    "/logout",
    validateJWT,
    logout
);

authRouter.patch(
    "/",
    validateJWT,
    validateBody(updateSubscriptionSchema),
    updateSubscription
);

module.exports = authRouter;
