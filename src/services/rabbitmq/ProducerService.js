const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    // Membuka koneksi dengan RabbitMQ sesuai penamaan
    const connection = await amqp.connect(process.env.AMQP_URL || `amqp://${process.env.RABBITMQ_HOST || 'localhost'}`);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true,
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  },
};

module.exports = ProducerService;