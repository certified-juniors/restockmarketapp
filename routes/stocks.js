const { Router } = require('express');
const router = Router();
const controller = require('../controllers/userController');
const { check, cookie } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const e = require('express');
const User = require('../models/User');

async function getUser(req) {
    if (req.headers.cookie && req.headers.cookie.split("=")[0] === 'token') {
        try {
            const token = req.headers.cookie.split('=')[1];
            const decodedData = jwt.verify(token, secret);
            let user = await User.findById(decodedData.id).lean();
            delete user.password;
            return user;
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }
    return undefined
}

router.get('/', async (req, res) => {
    const user = await getUser(req);
    res.render('index', {
        user,
        title: 'Stocks',
    });
});

router.get('/login', async (req, res) => {
    if (await getUser(req)) {
        return res.redirect('/lk');
    }
    return res.render('login', {
        title: 'Login',
    });
});

router.get('/lk', async (req, res) => {
    const user = await getUser(req);
    if (user) {
        res.render('lk', {
            user,
            title: "Мой портфель",
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/reg', async (req, res) => {
    if (await getUser(req)) {
        return res.redirect('/lk');
    }
    return res.render('reg', {
        title: 'Регистрация',
    });
});

router.post('/registration', [
    check('login', 'Login is required').notEmpty(),
    check('password', 'Пароль должен содержать не меньше 6 символов').isLength({ min: 6 }),
    check('email', 'E-mail is required').isEmail(),
], controller.registration);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);
router.get('/logout', (req, res) => {
    res.setHeader('Set-Cookie', `token=; HttpOnly; Max-Age=0`);
    res.redirect('/');
});

module.exports = router;