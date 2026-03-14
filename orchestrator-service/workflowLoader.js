const fs = require("fs");
const yaml = require("js-yaml");

function loadWorkflow() {
  const file = fs.readFileSync("./workflow.yaml", "utf8");
  const config = yaml.load(file);
  return config.workflow.steps;
}

module.exports = { loadWorkflow };