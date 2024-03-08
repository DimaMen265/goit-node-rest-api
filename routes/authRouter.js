const express = require("express");
const {
    register,
    login,
    getCurrent,
    logout,
    updateSubscription,
    updateAvatar,
    verifyEmail,
    resendVerifyEmail,
} = require("../controllers/authControllers");
const { validateBody } = require("../middlewars/validateBody");
const { validateJWT } = require("../middlewars/validateJWT");
const upload = require("../middlewars/upload");
const {
    registerSchema,
    loginSchema,
    updateSubscriptionSchema,
    verificationEmailSchema,
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

authRouter.patch(
    "/avatars",
    validateJWT,
    upload.single("avatar"),
    updateAvatar
);

authRouter.get("/verify/:verificationToken", verifyEmail);

authRouter.post(
    "/verify",
    validateBody(verificationEmailSchema),
    resendVerifyEmail
);

module.exports = authRouter;
