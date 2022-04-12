const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const stockRoutes = require('./routes/stocks');
const bodyparser = require('body-parser');

const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');


app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json())
app.use(stockRoutes);

const PORT = process.env.PORT || 3000;


async function start() {
    try {
        await mongoose.connect('mongodb+srv://PowerOne:OnePower@cluster0.pyxoe.mongodb.net/stocks', {
            useNewUrlParser: true,
        });
    } catch (e) {
        console.log(e);
    }
}

start()

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});