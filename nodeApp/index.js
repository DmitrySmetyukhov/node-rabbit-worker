const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const {url, exchangeName} = require('../rabbitmq/rabbitConfig').rabbitMQ;
const Producer = require('../rabbitmq/rabbitProducer');


const producer = new Producer();


const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello')
});

app.post('/calculate', async (req, res) => {
    await producer.publishMessage('Task', req.body.coeffitient)
    res.send('Calculate')
})

app.listen(3000, () => {
    console.log('Server started on PORT: 3000')
})


async function consumeMessages() {
    console.log('consumeMessages***')
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "direct");

    const q = await channel.assertQueue("ResultsQueue");

    await channel.bindQueue(q.queue, exchangeName, "Result");

    channel.consume(q.queue, message => {
        const data = JSON.parse(message.content);
        // console.log(data, ' *data* ')
        const result = data.message;
        console.log(result, '* result *')
        channel.ack(message)
    })
}

consumeMessages();
