import express from "express";
import cors from "cors";
import userServices from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING) // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});


app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  userServices.getUsers(name, job)
  .then(result => res.send(result))
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userServices.findUserById(id)
  .then(result => res.send(result))
  .catch(err => res.status(404).send("Resource not found."));
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices.addUser(userToAdd)
  .then(newUser => res.status(201).send({newUser} ));
});

app.delete("/users/:id", (req,res) => {
    const id = req.params["id"];
    userServices.removeUser(id)
    .then(_ => res.status(204).send())
    .catch(err => res.status(404).send("Resource not found."));
})