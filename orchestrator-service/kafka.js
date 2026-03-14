const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "orchestrator-service",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "orchestrator-group" });

module.exports = { producer, consumer };