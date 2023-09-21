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

// Define el valor del encabezado Authorization
const apiKey = "Api-Key eKYDLLOc.V0PqeGIsb8jFbolijarcews8kZfULFzm";

// Configura los encabezados de la solicitud
const headers = {
  Authorization: apiKey,
};

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
    console.log(`ENTRANDO EN TEST`);
    let clienteId = agent.parameters.nclient;
    // URL del endpoint
    const url = "https://api.wisphub.net/api/clientes/";

    // ID del servicio que deseas buscar
    const servicioId = clienteId;

    // Realiza la solicitud GET
    return axios
      .get(url, { headers })
      .then((response) => {
        console.log("Entrando en then");
        // Accede a la respuesta y busca el cliente por su ID de servicio
        const data = response.data;
        const results = data.results;
        console.log(`Esto es results: ${results}`);
        const idServiciosEncontrados = [];

        results.forEach((cliente) => {
          idServiciosEncontrados.push(cliente.id_servicio);
        });

        console.log(
          `ESTOS SON TODOS LOS IDS ENCONTRADOS: ${idServiciosEncontrados}`
        );

        // Busca el cliente con el ID de servicio igual a 9267
        const clienteEncontrado = results.find(
          (cliente) => cliente.id_servicio === servicioId
        );

        if (clienteEncontrado) {
          const nombreCliente = clienteEncontrado.nombre;
          console.log(
            `Nombre del cliente con ID de servicio ${servicioId}: ${nombreCliente}`
          );
          agent.add(
            `Nombre del cliente con ID de servicio ${servicioId}: *${nombreCliente}*`
          );
          agent.add(`¿Los datos son correctos?`);
        } else {
          agent.add(`Cliente con ID de servicio ${servicioId} no encontrado.`);
        }
      })
      .catch((error) => {
        // Maneja el error aquí
        console.error("Error:", error);
      });
  }

  function linkPago(agent) {
    let clienteId = agent.parameters.nclient;
    // URL del endpoint
    const url = `https://api.wisphub.net/api/clientes/${clienteId}/saldo/`;

    // ID del servicio que deseas buscar
    const servicioId = clienteId;

    // Realiza la solicitud GET
    return axios
      .get(url, { headers })
      .then((response) => {
        // Accede a la respuesta y busca el cliente por su ID de servicio
        const data = response.data;
        console.log(data);
        const urlPago = response.data.url_pago;
        agent.add(`Este es su link de pago: ${urlPago}`);
      })
      .catch((error) => {
        // Maneja el error aquí
        console.error("Error:", error);
      });
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("client - nclient", test);
  intentMap.set("client - nclient - yes - pagar", linkPago);

  agent.handleRequest(intentMap);
};
