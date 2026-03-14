const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "credit-service",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "credit-group" });

module.exports = { producer, consumer };