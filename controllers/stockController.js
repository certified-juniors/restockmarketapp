const apikey = require('../config').apikey;
const av = require('alphavantage')({key: apikey});

class StockController {
    INTERVAL = 10000; //ms
    FOLLOWED_STOCKS = [
        'AAPL',
        'AMZN',
        'GOOGL',
        'FB',
        'NFLX',
        'TSLA',
        'MSFT',
        'INTC',
        'CSCO',
        'AMD',
        'NVDA',  
    ];
    constructor() {
        this.timestamp = new Date().getTime();
        
    }
    canUpdate() {
        return new Date().getTime() - this.timestamp > this.INTERVAL;
    }

    async indexPage(req, res) {
    }

    async getStock(req, res) {
    }
}

module.exports = new StockController();