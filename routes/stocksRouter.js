const { Router } = require('express');
const router = Router();
const { controller: userController, getUser } = require('../controllers/userController');
const stockController = require('../controllers/stockController');
const { check, cookie } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const User = require('../models/User');
const UserStock = require('../models/UserStock');

router.get('/', async (req, res) => {
    const user = await getUser(req);
    const page = req.query.page || 0
    stocks = stockController.indexPage(page);
    const data = {
        user,
        title: 'Stocks',
        page,
        stocks: stockController.getData(),
        get_data: true,
    }
    data.all = JSON.stringify(data);
    res.render('index', data);
});

router.get('/login', async (req, res) => {
    if (await getUser(req)) {
        return res.redirect('/lk');
    }
    return res.render('login', {
        title: 'Login',
    });
});

async function getCorrectUserStocks(userstocks) {
    let newus = [];
    const lastdata = stockController.getData();
    for(let i = 0; i < userstocks.length; i++) {
        const corus = await UserStock.findOne({_id: userstocks[i]}).lean();
        corus.cur_price = lastdata[corus.symbol].cur_price;
        newus.push(corus);
    }
    return newus;
}


router.get('/lk', async (req, res) => {
    const user = await getUser(req);
    user.userstocks = await getCorrectUserStocks(user.userstocks);
    if (user) {
        res.render('lk', {
            user,
            title: "Мой портфель",
            get_data: true,
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
router.post('/getdata', (req, res) => res.json(stockController.getData()))
router.post('/buystock', async (req, res) => {
    console.log(req.body);
    const data = stockController.getData();
    const user = await getUser(req);
    const realUser = await User.findById(user._id);
    console.log(user);
    const { price, stock, symbol } = req.body;
    if (+stock < 1 || !data[symbol] || !data[symbol].cur_price || user.balance < stock*data[symbol].cur_price) {
        return res.render('index', {
            error: 'Ошибка',
            title: 'Биржа',
            get_data: true,
            stocks: stockController.getData(),
        });
    }
    realUser.balance -= +stock*data[symbol].cur_price;

    let realStock = await UserStock.findOne({user: user._id, symbol});
    if (realStock) {
        realStock.amount += +stock;
        realStock.price_at_buy = data[symbol].cur_price
    }
    else {
        realStock = new UserStock({
            user: user._id,
            amount: +stock,
            symbol,
            price_at_buy: data[symbol].cur_price,
        });
        realUser.userstocks.push(realStock);
    }

    await realStock.save()
    await realUser.save()
    res.redirect('/lk');
});

router.post('/sellstock', async (req, res) => {
    console.log(req.body);
    const data = stockController.getData();
    const user = await getUser(req);
    const realUser = await User.findById(user._id);
    const realStock = await UserStock.findOne({user: user._id, symbol});
    console.log(user);
    const { price, stock, symbol } = req.body;
    if (+stock < 1 || !data[symbol] || !data[symbol].cur_price || realStock.amount < +stock) {
        return res.render('index', {
            error: 'Ошибка',
            title: 'Биржа',
            get_data: true,
            stocks: stockController.getData(),
        });
    }
    realUser.balance += +stock*data[symbol].cur_price;
    realStock.remove()

    await realStock.save()
    await realUser.save()
    res.redirect('/lk');
});
module.exports = router;