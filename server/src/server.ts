import dotenv from "dotenv";
dotenv.config();

import express, { Request, response, Response } from "express";
import cors from "cors";
import { query } from "./db-config";
import passport from "passport";
import session from "express-session";
import bcrypt from "bcryptjs";
import "./passport-config";
import { fetchAirports } from "./queryFunctions/publicQueries";

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? "" : "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Register user
app.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if ((await query("SELECT 1 FROM users WHERE email = $1", [email])).rows[0])
      res.status(400).send("User already exists");
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
        [firstName, lastName, email, hashedPassword]
      );
      res.status(201).send("User registered");
    }
  } catch (err) {
    res.status(500).send("Error registering user");
    console.error(err);
  }
});

// Login user
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json(req.user);
});

app.delete("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid").send({ message: "Logged out successfully" });
  });
});

app.get("/profile", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("You need to log in first");
  } else {
    res.send(req.user);
  }
});

app.post("/admin/sql", async (req: Request, res: Response) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    try {
      res.json(await query(req.body.query));
    } catch (err) {
      res.json({ message: "Server error: " + err });
    }
  } else res.status(401).json({ message: "Unauthorized request" });
});

app.get("/api/airports", async (req, res) => {
  const search = req.query.search as string;
  const limit = 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  try {
    const airports = await fetchAirports(search, limit, offset);
    res.json(airports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch airports" });
  }
});

app.get("/api/flights", async (req: Request, res: Response) => {
  try {
    const { departure_date, departure_airport_id, arrival_airport_id, page } =
      req.query;

    if (!departure_date || !departure_airport_id || !arrival_airport_id) {
      res.status(400).json({
        message:
          "Missing required query parameters: departure_date, departure_airport_id, arrival_airport_id",
      });
      return;
    }

    const queryStr = `
      SELECT 
        flight_id, 
        flight_number, 
        departure_airport_id, 
        arrival_airport_id, 
        departure_date, 
        arrival_date, 
        total_seats, 
        status, 
        base_price
      FROM flights
      WHERE departure_date::date = $1::date
        AND departure_airport_id = $2
        AND arrival_airport_id = $3
      LIMIT 10
      OFFSET $4
    `;
    const values = [
      departure_date,
      departure_airport_id,
      arrival_airport_id,
      parseInt(page as string) * 10,
    ];

    const result = await query(queryStr, values);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/flight", async (req, res) => {
  const { searchId } = req.query;

  // Validate `searchId`
  if (!searchId) {
    res.status(400).json({ error: "Flight ID is required." });
    return;
  }

  try {
    // Execute query
    const result = await query("SELECT * FROM flights WHERE flight_id = $1", [
      searchId,
    ]);

    // Check if flight exists
    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: "No flight corresponds to the provided Flight ID." });
      return;
    }

    // Return the flight details
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching flight details:", err);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

app.put("/api/flight/:flightId", async (req, res) => {
  const { flightId } = req.params;
  const {
    flight_number,
    departure_airport_id,
    arrival_airport_id,
    departure_date,
    arrival_date,
    total_seats,
    status,
    base_price,
  } = req.body;

  // Validate input
  if (!flightId) {
    res.status(400).json({ error: "Flight ID is required." });
    return;
  }

  try {
    // Check if the flight exists
    const flightCheck = await query(
      "SELECT * FROM flights WHERE flight_id = $1",
      [flightId]
    );
    if (flightCheck.rows.length === 0) {
      res.status(404).json({ error: "Flight not found." });
      return;
    }

    // Update the flight details
    const updateQuery = `
      UPDATE flights
      SET
        flight_number = $1,
        departure_airport_id = $2,
        arrival_airport_id = $3,
        departure_date = $4,
        arrival_date = $5,
        total_seats = $6,
        status = $7,
        base_price = $8
      WHERE flight_id = $9
    `;
    await query(updateQuery, [
      flight_number,
      departure_airport_id,
      arrival_airport_id,
      departure_date,
      arrival_date,
      total_seats,
      status,
      base_price,
      flightId,
    ]);

    res.status(200).json({ message: "Flight updated successfully." });
  } catch (err) {
    console.error("Error updating flight:", err);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
