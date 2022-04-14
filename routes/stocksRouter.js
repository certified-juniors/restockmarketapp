const { Router } = require('express');
const router = Router();
const { controller: userController, getUser } = require('../controllers/userController');
const stockController = require('../controllers/stockController');
const { check, cookie } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const User = require('../models/User');

router.get('/', async (req, res) => {
    const user = await getUser(req);
    const page = req.query.page || 0
    stocks = stockController.indexPage(page);
    res.render('index', {
        user,
        title: 'Stocks',
        page,
        mainstock: stockController.getData().stocks[0],
        stocks: stockController.getData().stocks,
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
    check('username', 'Username is required').notEmpty(),
    check('password', 'Пароль должен содержать не меньше 6 символов').isLength({ min: 6 }),
    check('email', 'E-mail is required').isEmail(),
], userController.registration);

router.post('/login', userController.login);
router.get('/users', userController.getUsers);
router.get('/logout', (req, res) => {
    res.setHeader('Set-Cookie', `token=; HttpOnly; Max-Age=0`);
    res.redirect('/');
});
router.post('/topup', userController.topup);

module.exports = router;