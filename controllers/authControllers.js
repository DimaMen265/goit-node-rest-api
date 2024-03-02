const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { HttpError } = require("../helpers/HttpError");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use");
    };

    const avatarURL = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL
    });

    res.status(201).json({
        users: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!user || !passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    };

    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    
    await User.findByIdAndUpdate(user._id, { token });
    res.status(201).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
};

const getCurrent = async (req, res) => {
    const { token, email, subscription, avatarURL } = req.user;

    if (!token) {
        throw HttpError(401);
    };

    res.status(201).json({
        email,
        subscription,
        avatarURL,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json({
        message: "Logout success. Content not found",
    });
};

const updateSubscription = async (req, res) => {
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
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    
    if (!req.file) {
        throw HttpError(400, "File not uploaded");
    };

    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join("public", "avatars", filename);
    const img = await Jimp.read(tempUpload);
    img.resize(250, 250).writeAsync(tempUpload);

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
};

module.exports = {
    register,
    login,
    getCurrent,
    logout,
    updateSubscription,
    updateAvatar,
};
