import request from "supertest";
import mongoose from "mongoose";
import { MONGO_URI } from "../config.js";
import express from "express";
import morgan from "morgan";
import router from "../routes/index.routes.js";

describe("Purchases", () => {
  let app;
  let purchase_id;
  let token;
  beforeAll(async () => {
    app = express();

    app.set("json spaces", 2);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("dev"));

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.use("/v1", router);
    app.use((req, res) => {
      res.status(404).json({ message: "Not found" });
    });
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const db = await mongoose.connect(MONGO_URI, options);
    console.log(`Connection to database ${db.connection.name} successful`);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  //CREATES Purchase
  test("/purchases", async () => {
    token = await request(app).post("/v1/auth/login").send({
      email: "test-daniel@corre.com",
      password: "123",
    });
    const response = await request(app)
      .post("/v1/purchases")
      .set("Authorization", "Bearer " + token.body.token);
    expect(response.statusCode).toBe(200);
    purchase_id = response.body._id;
  });
  // GETS ALL Purchases
  test("/purchases", async () => {
    const response = await request(app).get("/v1/purchases");
    expect(response.statusCode).toBe(200);
  });
  //GET Purchase BY ID
  test("/purchases/:id", async () => {
    const response = await request(app).get(`/v1/purchases/63840fc17e631a19b7799198`);
    expect(response.statusCode).toBe(200);
  });
});
