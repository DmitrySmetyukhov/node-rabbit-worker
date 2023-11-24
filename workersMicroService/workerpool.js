const workerpool = require('workerpool');
const amqp = require('amqplib');
const {url, exchangeName} = require('../rabbitmq/rabbitConfig').rabbitMQ;
const Producer = require('../rabbitmq/rabbitProducer');

const producer = new Producer();

const MAX_ACTIVE_WORKERS_COUNT_ALLOWED = 4;

const pool = workerpool.pool(__dirname + '/worker.js', { maxWorkers: MAX_ACTIVE_WORKERS_COUNT_ALLOWED });


function runTask(coeficient = 1) {
    pool.exec('hardOperation', [coeficient])
        .then(async function (result) {
            await producer.publishMessage('Result', result)
        })
        .catch(function (err) {
            console.error(err);
        })
        .then(function () {
            console.log('worker is terminated. work is done!')
            // pool.terminate(); // terminate all workers when done
        });
}


async function consumeMessages() {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "direct");

    const q = await channel.assertQueue("TasksQueue");

    await channel.bindQueue(q.queue, exchangeName, "Task");

    channel.consume(q.queue, message => {
        const data = JSON.parse(message.content);
        console.log(data, ' *data* ')
        const coeffitient = data.message;
        runTask(coeffitient);
        channel.ack(message)
    })
}

consumeMessages();