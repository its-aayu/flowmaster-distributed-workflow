const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "verification-service",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "verification-group" });

module.exports = { producer, consumer };