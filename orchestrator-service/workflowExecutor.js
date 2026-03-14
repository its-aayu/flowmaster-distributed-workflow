const { producer } = require("./kafka");

async function startWorkflow(workflowId) {

  console.log("Starting workflow:", workflowId);

  await producer.send({
    topic: "verification_request",
    messages: [
      {
        value: JSON.stringify({ workflowId })
      }
    ]
  });

  console.log("Verification step started");
}

module.exports = { startWorkflow };