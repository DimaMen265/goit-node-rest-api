const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { sendEmail } = require("../helpers/senderEmail");
const { HttpError } = require("../helpers/HttpError");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const { randomUUID } = require("crypto");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (user) {
            throw HttpError(409, "Email in use");
        };
        
        const avatarURL = gravatar.url(email);
        const hashPassword = await bcrypt.hash(password, 10);
        const verificationToken = randomUUID();
        const newUser = await User.create({
            ...req.body,
            password: hashPassword,
            avatarURL,
            verificationToken,
        });

        const mail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="http://localhost:3000/users/register/verify/${verificationToken}">Verify email</a>`,
        };

        await sendEmail(mail);
        res.status(201).json({
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
            message: "Verification email sent",
        });
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!user || !passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        };

        if (!user.verify) {
            throw HttpError(401, "Email not verified. Access denied");
        };

        const payload = {
            id: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    
        await User.findByIdAndUpdate(user._id, { token });
        res.status(201).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const getCurrent = async (req, res) => {
    try {
        const { token, email, subscription, avatarURL } = req.user;

        if (!token) {
            throw HttpError(401);
        };

        res.status(201).json({
            email,
            subscription,
            avatarURL,
        });
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const logout = async (req, res) => {
    try {
        const { _id } = req.user;

        await User.findByIdAndUpdate(_id, { token: "" });
        res.status(204).json({
            message: "Logout success. Content not found",
        });
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const updateSubscription = async (req, res) => {
    try {
        const { _id } = req.user;
        const { subscription } = req.body;
        const updatedSubscription = await User.findByIdAndUpdate(
            _id,
            { subscription },
            { new: true }
        );

        if (!updatedSubscription) {
            throw HttpError(404);
        };

        res.status(200).json({
            email: updatedSubscription.email,
            subscription: updatedSubscription.subscription,
        });
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const updateAvatar = async (req, res) => {
    try {
        const { _id } = req.user;
    
        if (!req.file) {
            throw HttpError(400, "File not uploaded");
        };

        const { path: tempUpload, originalname } = req.file;
        const filename = `${_id}_${originalname}`;
        const resultUpload = path.join("public", "avatars", filename);
        const img = await Jimp.read(tempUpload);
        await img.resize(250, 250).writeAsync(tempUpload);

        try {
            await fs.rename(tempUpload, resultUpload);
        } catch (error) {
            await fs.unlink(tempUpload);
            console.log(error);
        };

        const avatarURL = path.join("avatars", filename);
        const updatedAvatar = await User.findByIdAndUpdate(_id, { avatarURL });
    
        if (!updatedAvatar) {
            throw HttpError(404);
        };

        res.status(200).json({ avatarURL });
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const verifyEmail = async (req, res) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });

        if (!user) {
            throw HttpError(404);
        };

        await User.findByIdAndUpdate(user._id, {
            verify: true,
            verificationToken: null,
        });

        res.status(200).json({ message: "Verification successful" });
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const resendVerifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!email) {
            throw HttpError(400, "Missing required field email");
        };

        if (!user) {
            throw HttpError(404);
        };

        if (user.verify) {
            throw HttpError(400, "Verification has already been passed");
        };

        const verifyEmail = {
            to: email,
            subject: "Verify your email",
            html: `<a target="_blank" href="http://localhost:3000/users/verify/${user.verificationToken}">Verify email</a>`,
        };

        await sendEmail(verifyEmail);

        res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    }
};

module.exports = {
    register,
    login,
    getCurrent,
    logout,
    updateSubscription,
    updateAvatar,
    verifyEmail,
    resendVerifyEmail,
};
