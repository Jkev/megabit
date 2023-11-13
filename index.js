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

  function getClient(agent) {
    console.log(`ENTRANDO EN GETCLIENT`);
    const cel = agent.parameters.cel;
    // URL del endpoint
    const url = `https://api.wisphub.net/api/clientes/?telefono=${cel}`;

    // Realiza la solicitud GET
    return axios
      .get(url, { headers })
      .then((response) => {
        const nombre = response.data.results[0].nombre;
        agent.add(`Nombre del cliente: *${nombre}*`);
        agent.add(`¿Los datos son correctos? Si/No`);
      })
      .catch((error) => {
        // Maneja el error aquí
        agent.add(
          `No se encontró el numero celular del cliente ingresado ${servicioId}, un asesor se pondrá en contacto con usted`
        );
        console.error("Error:", error);
      });
  }

  function getClientEmail(agent) {
    console.log(`ENTRANDO EN GETCLIENT EMAIL`);
    const email = agent.parameters.email;
    // URL del endpoint
    const url = `https://api.wisphub.net/api/clientes/?email=${email}`;

    // Realiza la solicitud GET
    return axios
      .get(url, { headers })
      .then((response) => {
        const nombre = response.data.results[0].nombre;
        agent.add(`Nombre del cliente: *${nombre}*`);
        agent.add(`¿Los datos son correctos? Si/No`);
      })
      .catch((error) => {
        // Maneja el error aquí
        agent.add(
          `No se encontró el correo electronico del cliente ingresado ${servicioId}, un asesor se pondrá en contacto con usted`
        );
        console.error("Error:", error);
      });
  }

  function getClientRed(agent) {
    console.log(`ENTRANDO EN GETCLIENT EMAIL`);
    const red = agent.parameters.ssid;
    // URL del endpoint
    const url = `https://api.wisphub.net/api/clientes/?ssid_router_wifi=${red}`;

    // Realiza la solicitud GET
    return axios
      .get(url, { headers })
      .then((response) => {
        const nombre = response.data.results[0].nombre;
        agent.add(`Nombre del cliente: *${nombre}*`);
        agent.add(`¿Los datos son correctos? Si/No`);
      })
      .catch((error) => {
        // Maneja el error aquí
        agent.add(
          `No se encontró el nombre de red del cliente ingresado ${servicioId}, un asesor se pondrá en contacto con usted`
        );
        console.error("Error:", error);
      });
  }

  function linkPago(agent) {
    let cel = agent.parameters.cel;
    // URL del endpoint

    const url = `https://api.wisphub.net/api/clientes/?telefono=${cel}`;

    // Realiza la solicitud GET
    return axios
      .get(url, { headers })
      .then((response) => {
        const clienteId = response.data.results[0].id_servicio;
        const urlSaldo = `https://api.wisphub.net/api/clientes/${clienteId}/saldo/`;

        // Realiza la solicitud GET
        return axios
          .get(urlSaldo, { headers })
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
      })
      .catch((error) => {
        // Maneja el error aquí
        agent.add(
          `No se encontró el numero celular del cliente ingresado, un asesor se pondrá en contacto con usted`
        );
        console.error("Error:", error);
      });
  }

  function linkPagoRed(agent) {
    const ssid = agent.parameters.ssid;
    // URL del endpoint

    const url = `https://api.wisphub.net/api/clientes/?ssid_router_wifi=${ssid}`;

    // Realiza la solicitud GET
    return axios
      .get(url, { headers })
      .then((response) => {
        const clienteId = response.data.results[0].id_servicio;
        const urlSaldo = `https://api.wisphub.net/api/clientes/${clienteId}/saldo/`;

        // Realiza la solicitud GET
        return axios
          .get(urlSaldo, { headers })
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
      })
      .catch((error) => {
        // Maneja el error aquí
        agent.add(
          `No se encontró el nombre de red del cliente ingresado, un asesor se pondrá en contacto con usted`
        );
        console.error("Error:", error);
      });
  }

  function linkPagoEmail(agent) {
    const email = agent.parameters.email;
    // URL del endpoint

    const url = `https://api.wisphub.net/api/clientes/?email=${email}`;

    // Realiza la solicitud GET
    return axios
      .get(url, { headers })
      .then((response) => {
        const clienteId = response.data.results[0].id_servicio;
        const urlSaldo = `https://api.wisphub.net/api/clientes/${clienteId}/saldo/`;

        // Realiza la solicitud GET
        return axios
          .get(urlSaldo, { headers })
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
      })
      .catch((error) => {
        // Maneja el error aquí
        agent.add(
          `No se encontró el nombre de red del cliente ingresado, un asesor se pondrá en contacto con usted`
        );
        console.error("Error:", error);
      });
  }

  function autoAuth(agent) {
    console.log(`ENTRANDO EN LA FUNCION DE AUTO AUTENTICADO`);
    const numero = request.body.originalDetectIntentRequest.payload.contact.cId;
    const cel = numero.substr(3, 10);
    const url = `https://api.wisphub.net/api/clientes/?telefono=${cel}`;

    // Realiza la solicitud GET
    return axios
      .get(url, { headers })
      .then((response) => {
        const nombre = response.data.results[0].nombre;
        const clienteId = response.data.results[0].id_servicio;
        const saldo = response.data.results[0].saldo;
        let saldotype = typeof saldo;
        console.log(`Esto es el tipo de saldo: ${saldotype}`);
        const num = parseInt(saldo);
        console.log(`Esto es Num: ${num}`);
        if (num > 0) {
          const urlSaldo = `https://api.wisphub.net/api/clientes/${clienteId}/saldo/`;

          // Realiza la solicitud GET
          return axios
            .get(urlSaldo, { headers })
            .then((response) => {
              // Accede a la respuesta y busca el cliente por su ID de servicio
              const data = response.data;
              console.log(data);
              const urlPago = response.data.url_pago;
              agent.add(`Nombre de cliente: ${nombre}
Este es su link de pago: ${urlPago}`);
            })
            .catch((error) => {
              // Maneja el error aquí
              console.error("Error:", error);
            });
        } else {
          const urlSaldo = `https://api.wisphub.net/api/clientes/${clienteId}/saldo/`;

          // Realiza la solicitud GET
          return axios
            .get(urlSaldo, { headers })
            .then((response) => {
              // Accede a la respuesta y busca el cliente por su ID de servicio
              const data = response.data;
              console.log(data);
              const urlPago = response.data.url_pago;
              agent.add(
                `*${nombre}* Su cuenta se encuentra al corriente, Muchas gracias.`
              );
              agent.add(
                `Si desea consultar su estado de cuenta puede hacerlo atravéz del siguiente link ${urlPago}`
              );
            })
            .catch((error) => {
              // Maneja el error aquí
              console.error("Error:", error);
            });
        }
      })
      .catch((error) => {
        // Maneja el error aquí
        agent.add(
          `No se encontró el numero celular del cliente ingresado ${servicioId}, un asesor se pondrá en contacto con usted`
        );
        console.error("Error:", error);
      });
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("Default Welcome Intent - consulta de saldo - cel", getClient);
  intentMap.set(
    "Default Welcome Intent - consulta de saldo - cel - yes",
    linkPago
  );
  intentMap.set(
    "Default Welcome Intent - consulta de saldo - red",
    getClientRed
  );
  intentMap.set(
    "Default Welcome Intent - consulta de saldo - mail - yes",
    linkPagoEmail
  );
  intentMap.set(
    "Default Welcome Intent - consulta de saldo - mail",
    getClientEmail
  );
  intentMap.set(
    "Default Welcome Intent - consulta de saldo - red - yes",
    linkPagoRed
  );
  intentMap.set("test", autoAuth);

  agent.handleRequest(intentMap);
};
