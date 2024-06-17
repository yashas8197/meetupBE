const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const Event = require("./models/event.model");

app.use(express.json());
const corsOption = {
  origin: "*", // Allow all origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOption));

const { initializeDatabase } = require("./db/db.connect");

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello");
});

async function getAllEvents() {
  try {
    const allEvents = await Event.find();
    return allEvents;
  } catch (error) {
    throw error;
  }
}

app.get("/events", async (req, res) => {
  try {
    const events = await getAllEvents();
    if (events.length !== 0) {
      res
        .status(200)
        .json({ message: "fetched all products successfully", event: events });
    } else {
      res.status(404).json({ error: "event not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch" });
  }
});

async function getEventById(id) {
  try {
    const eventById = await Event.findById(id);
    return eventById;
  } catch (error) {
    throw error;
  }
}

app.get("/events/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await getEventById(eventId);
    if (event) {
      res
        .status(200)
        .json({ message: "fetched event Successfully", event: event });
    } else {
      res.status(404).json({ error: "event not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}/`);
});
