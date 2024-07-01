const { Kafka } = require('@confluentinc/kafka-javascript').KafkaJS;

async function sendMessage(msg) {
    const producer = new Kafka().producer({
        'bootstrap.servers': process.env.BOOTSTRAP_SERVERS,
        'sasl.mechanisms': 'PLAIN',
        'security.protocol': 'SASL_SSL',
        'sasl.username': process.env.SASL_USERNAME,
        'sasl.password': process.env.SASL_PASSWORD,
    });

    await producer.connect();

    const deliveryReports = await producer.send({
        topic: process.env.DLQ_TOPIC,
        messages: [
            { value: msg }
        ]
    });

    console.log('Sent:', JSON.stringify(deliveryReports, null, 2));

    await producer.disconnect();
}

async function consumerStart() {
    let consumer;

    consumer = new Kafka().consumer({
        'bootstrap.servers': process.env.BOOTSTRAP_SERVERS,
        'group.id': process.env.GROUP_ID,
        'sasl.mechanisms': 'PLAIN',
        'security.protocol': 'SASL_SSL',
        'sasl.username': process.env.SASL_USERNAME,
        'sasl.password': process.env.SASL_PASSWORD,
    });

    await consumer.connect();
    console.log("Connected successfully");

    await consumer.seek({ topic: process.env.TOPIC, partition: process.env.PARTITION, offset: process.env.OFFSET });
    console.log("Seeked successfully");

    await consumer.subscribe({ topic: process.env.TOPIC })
    console.log("Subscribed successfully")

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
                key: message.key.toString(),
                headers: message.headers,
            });

            await sendMessage(message.value);
        },
    });

    await consumer.disconnect();
}

consumerStart();