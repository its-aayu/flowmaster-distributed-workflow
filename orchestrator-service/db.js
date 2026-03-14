const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "workflow_user",
  password: "workflow_pass",
  database: "workflow_db"
});

module.exports = pool;