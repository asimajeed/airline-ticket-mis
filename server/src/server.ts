import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { query } from "./db-config";
import passport from "passport";
import session from "express-session";
import bcrypt from "bcryptjs";
import "./passport-config";
import { fetchAirports } from "./routes/freeQueries";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "" : "http://localhost:5173",
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
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [
      name,
      email,
      hashedPassword,
    ]);
    res.status(201).send("User registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
});

// Login user
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("Logged in");
});

app.get("/profile", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("You need to log in first");
  } else res.send(req.user);
});

app.post("/admin/sql", async (req: Request, res: Response) => {
  try {
    res.json((await query(req.body.query)));
  } catch (err) {
    res.json("Server error: " + err);
  }
});


app.get("/api/airports", async (req, res) => {
  const search = req.query.search as string;
  const limit = 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  try {
    const airports = await fetchAirports(search, limit, offset);
    const airportsArray:string[] = [];
    airports.forEach((val) => airportsArray.push(val.airport));
    res.json(airportsArray);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch airports" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
