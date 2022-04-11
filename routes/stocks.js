const { Router } = require('express');
const router = Router();
const controller = require('../controllers/userController');
const {check, cookie} = require('express-validator');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const e = require('express');

function checkAuth(req, res, next) {
      if (req.user) next()
      else res.redirect('/login')
}


router.get('/', (req, res) => {
    res.render('index', {
        isAuthorised: req.headers.authorization,
        title: 'Stocks',
    });
});

router.get('/login', (req, res) => {
    res.render('login', {
        isAuthorised: !!req.headers.authorization,
        title: 'Login',
    });
});

router.get('/lk', [checkAuth] , (req, res) => {
    console.log(req.headers);
    if (req.headers.cookie.includes('jwt')) {
        const token = req.headers.cookie.split('=')[1].split(';')[0].split(' ')[0];
        console.log(token);
        const decodedData = jwt.verify(token, secret)
        req.user = decodedData;
        res.render('lk', {
            title: 'LK',
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/reg', (req, res) => {
    res.render('reg', {
        title: 'Регистрация',
    });
});

router.post('/registration', [
    check('login', 'Login is required').notEmpty(),
    check('password', 'Пароль должен содержать не меньше 6 символов').isLength({min: 6}),
    check('email', 'E-mail is required').isEmail(),
], controller.registration);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);

module.exports = router;