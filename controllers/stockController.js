const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = require('../config').apikey;
const finnhubClient = new finnhub.DefaultApi();
const fs = require('fs');

class StockController {
    dev = true;
    INTERVAL = 5 * 60 * 1000; //ms

    constructor() {
        this.counter = 1;
        this.minuteOfLastUpdate = new Date().getMinutes() + new Date().getHours() * 60;
        this.activeStocks = this.getActiveStocksFromFinnhub();
    }

    getActiveStocksFromFinnhub() {
        let activeStocks = [];
        finnhubClient.stockSymbols('ME',null, (error, data, response) => {
            if (error) {
                console.error(error);
                return;
            }
            for (let i = 0; i < data.length; i++) {
                activeStocks.push(data[i].symbol);
            }
        });
    }

    canUpdate() {
        return this.counter < 60 && this.updateMinute();
    }
    
    updateMinute() {
        const now = new Date().getMinutes() + new Date().getHours() * 60;
        if (now != this.minuteOfLastUpdate) {
            this.minuteOfLastUpdate = now;
            this.counter = 0;
        }
        return true;

    }

    updateData() {
        // Проверить есть ли список всех акций
        // Если нет, то загрузить из финансового портала
        console.log(stock);
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
                            timestamp: new Date().getTime() - 3 * this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 2 * this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 1 * this.INTERVAL,
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
                            timestamp: new Date().getTime() - 3 * this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 2 * this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 1 * this.INTERVAL,
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
                            timestamp: new Date().getTime() - 3 * this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 2 * this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 1 * this.INTERVAL,
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

    async indexPage(req, res) {
    }

    async downloadCSV() {
    }
}

module.exports = new StockController();