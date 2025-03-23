const express = require("express");
const mongoose = require("mongoose");
const Task = require("./Model");
const cors = require("cors");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://pentapativamsi:Vamsi2025@cluster0.yojlo.mongodb.net/myfirstdb?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected…"))
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/addtask", async (req, res) => {
  try {
    const newTask = new Task({
      todo: req.body.todo,
      date: req.body.date || Date.now(),
    });
    await newTask.save();

    const tasks = await Task.find();
    return res.status(200).json({
      message: "Task Added Successfully",
      tasks: tasks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/gettasks", async (req, res) => {
  try {
    return res.json(await Task.find());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deletetask/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    return res.json(await Task.find());
  } catch (err) {
    console.error(err);
  }
});
