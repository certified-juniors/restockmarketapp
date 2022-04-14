const UserStock = require('../models/UserStock');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const generateAccessToken = (id, userstocks) => {
    const payload = {
        id,
    }
    return jwt.sign(payload, secret, { expiresIn: '2h' });
}

async function getUser(req) {
    if (req.headers.cookie && req.headers.cookie.split("=")[0] === 'token') {
        try {
            const token = req.headers.cookie.split('=')[1];
            const decodedData = jwt.verify(token, secret);
            let user = await User.findById(decodedData.id).lean();
            delete user.password;
            console.log(user);
            return user;
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }
    return undefined
}

class UserController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.render('login', {
                    title: 'Вход',
                    error: "Invalid email"
                });
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.render('login', {
                    title: 'Вход',
                    error: "Invalid password"
                });
            }
            const token = generateAccessToken(user._id, user.userstocks);
            req.user = user;
            res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Max-Age=${60 * 60 * 2}`);

            return res.redirect('/lk');
        } catch (error) {
            console.log(error);
            return res.render('login', {
                title: 'Вход',
                error: error.message,
            });
        }
    }
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.render('reg', {
                    title: 'Регистрация',
                    error: errors,
                });
            }
            const { username, password, email } = req.body;
            const candidate = await User.findOne({ username }) || await User.findOne({ email });
            if (candidate) {
                return res.status(400).json({ message: "Username/E-mail already taken" });
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({ username, password: hashPassword, email, balance: 0 });
            await user.save();
            return res.redirect('/login');
        } catch (error) {
            console.log(error);
            res.render('reg', {
                title: 'Регистрация',
                error: error.message,
            });
        }
    }

    async topup(req, res) {
        try {
            const {amount} = req.body;
            const token = req.headers.cookie.split('=')[1];
            const decodedData = jwt.verify(token, secret);
            let user = await User.findById(decodedData.id);
            if (+amount < 0) {
                return res.render('lk', {
                    title: 'Личный кабинет',
                    error: "Неверное значение пополнения",
                    user: user.lean(),
                });
            }
            user.balance += +amount;
            await user.save();
            res.redirect('/lk');
        } catch (error) {
            console.log(error);
            res.redirect('/lk');
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = {
    "controller": new UserController(),
    "getUser": getUser,
}