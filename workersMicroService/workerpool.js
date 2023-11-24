const workerpool = require('workerpool');
const amqp = require('amqplib');
const {url, exchangeName} = require('../rabbitmq/rabbitConfig').rabbitMQ;

const MAX_ACTIVE_WORKERS_COUNT_ALLOWED = 2;

const pool = workerpool.pool(__dirname + '/worker.js', { maxWorkers: MAX_ACTIVE_WORKERS_COUNT_ALLOWED });


function runTask(coeficient = 1) {
    pool.exec('hardOperation', [coeficient])
        .then(function (result) {
            console.log(result)
        })
        .catch(function (err) {
            console.error(err);
        })
        .then(function () {
            console.log('worker is terminated. work is done!')
            pool.terminate(); // terminate all workers when done
        });
}


async function consumeMessages() {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "direct");

    const q = await channel.assertQueue("InfoQueue");

    await channel.bindQueue(q.queue, exchangeName, "CalculationTask");

    channel.consume(q.queue, message => {
        const data = JSON.parse(message.content);
        console.log(data, ' *data* ')
        const coeffitient = data.message;
        runTask(coeffitient);
        channel.ack(message)
    })
}

consumeMessages();

// runTask()