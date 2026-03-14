# FlowMaster - Distributed Workflow Orchestrator

FlowMaster is a distributed workflow orchestration system built using microservices and event-driven architecture.  
It demonstrates how multiple services can coordinate tasks asynchronously using Apache Kafka.

The system simulates a simple loan approval workflow consisting of verification and credit checking steps.

---

## Architecture Overview

The system follows an event-driven microservices architecture:

Client
↓
Orchestrator Service
↓
Kafka Event Bus
↓
Verification Service
↓
Kafka
↓
Credit Service

Each service communicates via Kafka topics instead of direct API calls.

---

## Components

### 1. Orchestrator Service
Responsible for controlling the workflow execution.

Responsibilities:
- Start new workflows
- Listen to service responses
- Trigger the next step in the workflow
- Manage workflow state

Runs on:

http://localhost:3000


---

### 2. Verification Service
Simulates user verification.

Responsibilities:
- Consume `verification_request`
- Process verification logic
- Produce `verification_result`

Runs on:

http://localhost:3001


---

### 3. Credit Service
Simulates credit approval.

Responsibilities:
- Consume `credit_request`
- Process credit logic
- Produce `credit_result`

Runs on:

http://localhost:3002


---

### 4. Apache Kafka
Kafka acts as the event bus enabling asynchronous communication between services.

Kafka Topics Used:

- verification_request
- verification_result
- credit_request
- credit_result

---

### 5. PostgreSQL
PostgreSQL is used to persist workflow state so that workflows can be recovered if the orchestrator crashes.

Workflow Table:

| workflow_id | step | status | created_at |
|-------------|------|--------|------------|

---

## Technologies Used

- Node.js
- Express.js
- Apache Kafka
- KafkaJS
- PostgreSQL
- Docker
- Microservices Architecture
- Event-driven Architecture
- Saga Pattern

---

## Project Structure


flowmaster
│
├── docker-compose.yml
│
├── orchestrator-service
│ ├── app.js
│ ├── kafka.js
│ ├── workflowExecutor.js
│ └── db.js
│
├── verification-service
│ ├── app.js
│ └── kafka.js
│
└── credit-service
├── app.js
└── kafka.js


---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository_url>
cd flowmaster
2. Start Infrastructure

Start Kafka, Zookeeper, and PostgreSQL using Docker:

docker compose up -d

Verify containers are running:

docker ps

Expected containers:

kafka

zookeeper

postgres

3. Install Dependencies

Install dependencies for each service.

cd orchestrator-service
npm install
cd verification-service
npm install
cd credit-service
npm install
4. Start Services

Run each service in separate terminals.

Terminal 1:

cd orchestrator-service
node app.js

Terminal 2:

cd verification-service
node app.js

Terminal 3:

cd credit-service
node app.js
Running the Workflow

Trigger a new workflow:

curl -X POST http://localhost:3000/workflow/start

Example response:

{
  "message": "Workflow started",
  "workflowId": "d5289119-bc23-48c4-9779-453e8c42f137"
}
Workflow Execution

Step 1: Orchestrator publishes verification_request.

Step 2: Verification Service processes request and emits verification_result.

Step 3: If verification succeeds, Orchestrator publishes credit_request.

Step 4: Credit Service processes request and emits credit_result.

Step 5: Orchestrator marks workflow as completed.

Failure Handling

The system demonstrates the Saga orchestration pattern:

If verification fails → workflow stops.

If credit fails → rollback logic can be triggered.

Future Improvements

Workflow configuration via YAML

Retry mechanism for failed tasks

Saga compensation logic

Monitoring and logging

Distributed tracing

Web dashboard for workflow tracking

Author

Developed as part of a distributed systems project demonstrating microservices orchestration using Kafka.


---

# After This

When Postgres finishes downloading we will continue with:

### Step 2
Implement **Workflow State Storage in PostgreSQL**

Then:

### Step 3
Implement **Saga Rollback**

Then:

### Step 4
Add **YAML Workflow Engine**

After that your project will look like a **real distributed workflow engine** 🚀