const express = require("express");
const { producer, consumer } = require("./kafka");
const { startWorkflow } = require("./workflowExecutor");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

async function startService() {

  await producer.connect();
  await consumer.connect();

  // listen for verification result
  await consumer.subscribe({
    topic: "verification_result",
    fromBeginning: true
  });

  // listen for credit result
  await consumer.subscribe({
    topic: "credit_result",
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {

      const data = JSON.parse(message.value.toString());

      console.log("Received:", topic, data);

      if (topic === "verification_result") {

        if (data.status === "success") {

          console.log("Verification passed, requesting credit check");

          await producer.send({
            topic: "credit_request",
            messages: [
              {
                value: JSON.stringify({
                  workflowId: data.workflowId
                })
              }
            ]
          });

        } else {

          console.log("Workflow failed at verification");

        }

      }

      if (topic === "credit_result") {

        if (data.status === "approved") {

          console.log("Workflow completed successfully!");

        } else {

          console.log("Workflow failed at credit check");

        }

      }

    }
  });
}

startService();

app.post("/workflow/start", async (req, res) => {

  const workflowId = uuidv4();

  await startWorkflow(workflowId);

  res.send({
    message: "Workflow started",
    workflowId
  });

});

app.listen(3000, () => {

  console.log("Orchestrator running on port 3000");

});