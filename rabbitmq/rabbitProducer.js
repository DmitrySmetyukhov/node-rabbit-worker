const ampq = require('amqplib');
const config = require('./rabbitConfig');

class Producer {
    channel;

    async createChannel() {
        const connection = await ampq.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, message) {
        if(!this.channel){
            await this.createChannel();
        }
    
        const exchangeName = config.rabbitMQ.exchangeName;

        await this.channel.assertExchange(exchangeName, "direct");

        const logDetails = {
            logType: routingKey,
            message,
            dateTime: new Date()
        }

        await this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(logDetails))
        )

        console.log(`The new ${routingKey} is sent to exchange ${exchangeName}`)
    }
}

module.exports = Producer;