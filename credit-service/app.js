const express = require("express");
const { producer, consumer } = require("./kafka");

const app = express();

async function startService() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({
    topic: "credit_request",
    fromBeginning: true
  });

  console.log("Credit service listening...");

  await consumer.run({
    eachMessage: async ({ message }) => {

      const data = JSON.parse(message.value.toString());

      console.log("Received credit request:", data);

      // simulate credit approval
      const approved = Math.random() > 0.3;

      const result = {
        workflowId: data.workflowId,
        status: approved ? "approved" : "rejected"
      };

      await producer.send({
        topic: "credit_result",
        messages: [
          { value: JSON.stringify(result) }
        ]
      });

      console.log("Credit result sent:", result);
    }
  });
}

startService();

app.listen(3002, () => {
  console.log("Credit service running on port 3002");
});