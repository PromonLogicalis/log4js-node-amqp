var util = require('util')
var amqp = require('amqp')

var config = {
  connection: {
    url: 'amqp://guest:guest@localhost:5672'
  },
  exchange: {
    name: 'logExchange',
    type: 'fanout',
    durable: true,
    autoDelete: false
  },
  queue: {
    name: 'logQ',
    durable: true,
    autoDelete: false
  }
}

var onReady = function () {
  // create exchange and queue (if they don't exist) and bind the queue to the exchange
  connection.removeListener('ready', onReady)
  connection.exchange(config.exchange.name, config.exchange, function (exchange) {
    connection.queue(config.queue.name, config.queue, function (queue) {
      queue.bind(exchange, '*')

      queue.subscribe(function (message, headers, deliveryInfo) {
        console.log("-------------------")
        console.log(util.format("deliveryInfo: %j", deliveryInfo))
        console.log(util.format("headers: %j", headers))
        console.log(util.format("message: %j", message))
      })
    })
  })
}

var connection = amqp.createConnection(config.connection)
connection.on('ready', onReady)
