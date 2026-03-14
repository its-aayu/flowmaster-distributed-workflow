const { producer } = require("./kafka");
const pool = require("./db");
const { loadWorkflow } = require("./workflowLoader");

const steps = loadWorkflow();

async function startWorkflow(workflowId) {

  console.log("Starting workflow:", workflowId);

  const firstStep = steps[0];

  await producer.send({
    topic: firstStep.request_topic,
    messages: [
      { value: JSON.stringify({ workflowId }) }
    ]
  });

  await pool.query(
    "INSERT INTO workflows(workflow_id, step, status) VALUES($1,$2,$3)",
    [workflowId, firstStep.name, "started"]
  );

  console.log(firstStep.name, "step started");
}

module.exports = { startWorkflow };