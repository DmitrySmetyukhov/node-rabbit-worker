const express = require('express');
const bodyParser = require('body-parser');
const Producer = require('../rabbitmq/rabbitProducer');

const producer = new Producer();


const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello')
});

app.post('/calculate', async (req, res) => {
    await producer.publishMessage('CalculationTask', req.body.coeffitient)
    res.send('Calculate')
})

app.listen(3000, () => {
    console.log('Server started on PORT: 3000')
})