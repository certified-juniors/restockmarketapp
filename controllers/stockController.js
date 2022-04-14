const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = require('../config').apikey;
const finnhubClient = new finnhub.DefaultApi();

class StockController {
    dev = true;
    INTERVAL = 5 * 60 * 1000; //ms
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
        if (this.dev) {
            // todo load form disk
            // if error continue with nodev else return
            try {
                console.log(this.getData());
                return;
            } catch (error) {
                console.log(error);
            }
        }
        this.timestamp = new Date().getTime() - 10000;
        this.rate = this.getRate();
    }
    canUpdate() {
        return new Date().getTime() - this.timestamp > this.INTERVAL;
    }

    // На страницах обновляется Дата и время последнего обновления данных, Последняя цена акции, Необходимые данные для графиков.
    getData() {
        return {
            date: "2020-04-17 20:30:00",
            stocks: [
                {
                    symbol: "YNDX",
                    name: "Yandex",
                    last_price: 321.5,
                    graph: [
                        {
                            timestamp: new Date().getTime() - 3*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 2*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 1*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                    ]
                },
                {
                    symbol: "AAPL",
                    name: "Apple",
                    last_price: 321.5,
                    graph: [
                        {
                            timestamp: new Date().getTime() - 3*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 2*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 1*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                    ]
                },
                {
                    symbol: "NVDA",
                    name: "Nvidia",
                    last_price: 321.5,
                    graph: [
                        {
                            timestamp: new Date().getTime() - 3*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 2*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 1*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                    ]
                },
            ]
        }
    }

    async getRate() {
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
        console.log(stock);
    }

    async downloadCSV() {
    }
}

module.exports = new StockController();