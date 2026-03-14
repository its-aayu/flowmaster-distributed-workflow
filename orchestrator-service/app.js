const express = require("express");
const { producer, consumer } = require("./kafka");
const { startWorkflow } = require("./workflowExecutor");
const { v4: uuidv4 } = require("uuid");
const pool = require("./db");
const { loadWorkflow } = require("./workflowLoader");
const steps = loadWorkflow();

const app = express();
app.use(express.json());

async function startService() {

  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({
    topic: "verification_result",
    fromBeginning: true
  });

  await consumer.subscribe({
    topic: "credit_result",
    fromBeginning: true
  });

    await consumer.run({
    eachMessage: async ({ topic, message }) => {

        const data = JSON.parse(message.value.toString());
        console.log("Received:", topic, data);

        const step = steps.find(s => s.response_topic === topic);

        if (!step) return;

        // update workflow state
        await pool.query(
        "UPDATE workflows SET status=$1 WHERE workflow_id=$2 AND step=$3",
        [data.status, data.workflowId, step.name]
        );

        if (data.status !== "success" && data.status !== "approved") {

        console.log("Step failed:", step.name);

        // Saga compensation
        await producer.send({
            topic: "verification_compensate",
            messages: [
            { value: JSON.stringify({ workflowId: data.workflowId }) }
            ]
        });

        return;
        }

        // find next step
        const currentIndex = steps.findIndex(s => s.name === step.name);
        const nextStep = steps[currentIndex + 1];

        if (!nextStep) {

        console.log("Workflow completed successfully!");
        return;
        }

        console.log("Moving to next step:", nextStep.name);

        await producer.send({
        topic: nextStep.request_topic,
        messages: [
            { value: JSON.stringify({ workflowId: data.workflowId }) }
        ]
        });

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