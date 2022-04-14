const apikey = require('../config').apikey;
const av = require('alphavantage')({key: apikey});
const fs = require('fs');
const request = require("request");
const {StringStream} = require("scramjet");

class StockController {
    INTERVAL = 10000; //ms
    FOLLOWED_STOCKS = [
        'YNDX',
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
        this.timestamp = new Date().getTime() - 10000;
        this.rate = this.getRate();
    }
    canUpdate() {
        return new Date().getTime() - this.timestamp > this.INTERVAL;
    }

    async getRate() {
        const response = await av.forex.rate('USD', 'RUB');
        return response['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    }

    async updateRate() {
        this.rate = await getRate();
    }

    async indexPage(req, res) {
    }

    async getStock(req, res) {
        if (!this.canUpdate()) {
            return undefined;
        }
        this.timestamp = new Date().getTime();
        const stock = await av.data.intraday('AAPL', 'compact', '1min');
        const polished = av.util.polish(stock);
        console.log(stock);
    }

    async downloadCSV() {
        request.get("https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=demo")
            .pipe(new StringStream())
            .CSVParse()
    }
}

module.exports = new StockController();