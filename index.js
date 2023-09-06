const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("SERVIDOR MEGABIT FUNCIONANDO CORRECTAMENTE");
});

app.post("/", (request, response) => {
  dialogflowFulfillment(request, response);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const dialogflowFulfillment = (request, response) => {
  const agent = new WebhookClient({ request, response });
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function test(agent) {
    agent.add(`Esto viene de vercel`);
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("client - nclient", test);

  agent.handleRequest(intentMap);
};
