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

const removeUser = (id) => {
    const old_length = users["users_list"].length
    users["users_list"] = users["users_list"].filter(user => user["id"] != id);
    if (users["users_list"].length < old_length) {
        return id;
    }
    else {
        return undefined;
    }
};

app.delete("/users/:id", (req,res) => {
    const id = req.params["id"];
    let result = removeUser(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    }
    else {
        res.status(204).send();
    }
})