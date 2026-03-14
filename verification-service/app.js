const express = require("express");
const { producer, consumer } = require("./kafka");

const app = express();

async function startService() {
  await producer.connect();
  await consumer.connect();

  // listen for workflow start
  await consumer.subscribe({
    topic: "verification_request",
    fromBeginning: true
  });

  // listen for compensation
  await consumer.subscribe({
    topic: "verification_compensate",
    fromBeginning: true
  });

  console.log("Verification service listening...");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {

      const data = JSON.parse(message.value.toString());

      if (topic === "verification_request") {

        console.log("Received verification request:", data);

        const success = Math.random() > 0.2;

        const result = {
          workflowId: data.workflowId,
          status: success ? "success" : "failed"
        };

        await producer.send({
          topic: "verification_result",
          messages: [{ value: JSON.stringify(result) }]
        });

        console.log("Verification result sent:", result);
      }

      if (topic === "verification_compensate") {

        console.log("Compensating verification for workflow:", data.workflowId);

        // rollback simulation
        console.log("Verification rollback completed");

      }
    }
  });
}

startService();

app.listen(3001, () => {
  console.log("Verification service running on port 3001");
});