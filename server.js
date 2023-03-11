const express = require("express");
const { FieldValue } = require("firebase-admin/firestore");
const app = express();
const port = 8383;
const { db } = require("./firebase.js");

app.use(express.json());

app.get("/users", async (req, res) => {
  const querySnapshot = await db.collection("users").get();

  const documents = [];

  querySnapshot.forEach((doc) => {
    documents.push(doc.data());
  });

  res.status(200).send(documents);
});

app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();

  if (!doc.exists) {
    return res.sendStatus(404);
  }

  res.status(200).send(doc.data());
});

app.post("/users", async (req, res) => {
  const docId = req.body.email;
  const data = req.body;

  try {
    const docRef = db.collection("users").doc(docId);
    await docRef.set(data);
    const doc = await docRef.get();
    res.status(201).send(doc.data());
    console.log("creado con exito");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put("/users/:docId", async (req, res) => {
  const docId = req.params.docId;
  const data = req.body;

  try {
    const docRef = db.collection("users").doc(docId);
    await docRef.update(data);
    const doc = await docRef.get();
    res.status(200).send(doc.data());
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete("/users/:docId", async (req, res) => {
  const docId = req.params.docId;

  try {
    const docRef = db.collection("users").doc(docId);
    await docRef.delete();
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

  

app.listen(port, () => console.log(`Server has started on port: ${port}`));
