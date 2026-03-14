const express = require("express");
const { producer, consumer } = require("./kafka");

const app = express();

async function startService() {
  await producer.connect();
  await consumer.connect();

  // Listen to verification requests
  await consumer.subscribe({
    topic: "verification_request",
    fromBeginning: true
  });

  console.log("Verification service listening...");

  await consumer.run({
    eachMessage: async ({ message }) => {

      const data = JSON.parse(message.value.toString());

      console.log("Received verification request:", data);

      // simulate verification
      const success = Math.random() > 0.2;

      const result = {
        workflowId: data.workflowId,
        status: success ? "success" : "failed"
      };

      // send result back
      await producer.send({
        topic: "verification_result",
        messages: [
          { value: JSON.stringify(result) }
        ]
      });

      console.log("Verification result sent:", result);
    }
  });
}

startService();

app.listen(3001, () => {
  console.log("Verification service running on port 3001");
});