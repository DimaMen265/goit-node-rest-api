const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { HttpError } = require("../helpers/HttpError");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use");
    };

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        users: {
            email: newUser.email,
            subscription: newUser.subscription,
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
    const { token, email, subscription } = req.user;

    if (!token) {
        throw HttpError(401);
    };

    res.status(201).json({
        email,
        subscription,
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

    if (updatedSubscription.token === null) {
        throw HttpError(401);
    };

    res.status(200).json({
        email: updatedSubscription.email,
        subscription: updatedSubscription.subscription,
    });
};

module.exports = {
    register,
    login,
    getCurrent,
    logout,
    updateSubscription,
};
