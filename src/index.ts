import express = require("express");
import cors = require("cors");
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

import { addUserToNSCollection, removeUserFromNSCollection } from "./firebase";

const stripe = new Stripe(
  "sk_test_51IJJPcIzkBXCvUW1usTx6HMp1Rh2bjoWM1TOyoA05BlP9qySrnUrQ8wjq1CCIEIJie6XjLvEJsYxZEbxP5Uo7GmD00EojT4de0",
  {
    apiVersion: "2020-08-27",
    typescript: true,
  }
);

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.static("."));
app.use(express.json());

const calculateOrderAmount = (items: any[]) => {
  if(typeof items === "undefined"){
    console.log(`⚠ La prop items non è array ma undefined, rompo il calcolo del prezzo.`)
    return;
  }
  else {
    let accumulatedTotal = 0;
    items.forEach((item: any) => {
      accumulatedTotal += item.price;
    });

    return accumulatedTotal * 100;
  }
};

app.get("/", async (req, res) => {
  console.log(`🤔 Nuova GET Request, chi ha scovato la API?, 📅 ${new Date()}`);
  console.log(`🔎 IP Della GET: ${req.ip}, User Agent: ${(req.headers["user-agent"])}`);
  res.send({
    message: "Ti piacciono i biscotti?",
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { ingredients } = req.body;

  // logging
  console.log(`⚡ Nuova richiesta ${new Date()}`);

  if (typeof ingredients === "object" && ingredients.length > 0) {

    console.log(`✅ Richiesta accettata`);
    console.log(`💸 Totale Previsto: €${calculateOrderAmount(ingredients)! / 100}`);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(ingredients)!,
        currency: "eur",
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
        paymentMethodTypes: paymentIntent.payment_method_types,
      });
    } catch (error) {
      throw new Error(`🤯 Errore nel paymentIntent!`)
    }
  } else {
    console.log(`❌ Nessun Ingrediente, Richiesta chiusa.`)
  }
});

app.post("/ns-sub", async (req, res) => {
  const { email, userName } = req.body;
  console.log(`⚡ Nuova richiesta di Aggiunta nella Newsletter per conto di ${userName} | ${new Date()}`);
  await addUserToNSCollection(email).then(() => {
    res.send({
      message: "successful"
    });
  }).catch((error) => {
    res.send({
      error
    })
  })
});

app.post("/ns-remove", async (req, res) => {
  const { email } = req.body;
  console.log(`⚡ Nuova richiesta di Rimozione dalla Newsletter ${new Date()}`);
  await removeUserFromNSCollection(email).then(() => {
    res.send({
      message: "successful"
    })
  }).catch((error) => {
    res.send({
      error
    })
  })
})

app.listen(process.env.PORT || 5000, () =>
  console.log(
    `🗻 API Pronta sulla porta ${process.env.PORT ? process.env.PORT : "5000"}`
  )
);