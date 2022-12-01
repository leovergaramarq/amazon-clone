import request from "supertest";
import mongoose from "mongoose";
import { MONGO_URI } from "../config.js";
import express from "express";
import morgan from "morgan";
import router from "../routes/index.routes.js";

describe("Cart", () => {
  let app;
  let cart_id;
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
  //CREATES CART
  test("/cart", async () => {
    token = await request(app).post("/v1/auth/login").send({
      email: "test-daniel@corre.com",
      password: "123",
    });
    const response = await request(app)
      .post("/v1/cart")
      .send({
        product: "63881a6ca9e98677a03c38ab",
        quantity: 5,
      })
      .set("Authorization", "Bearer " + token.body.token);
    expect(response.statusCode).toBe(200);
    cart_id = response.body._id;
  });
  // GETS SHOPPING CART
  test("/cart", async () => {
    token = await request(app).post("/v1/auth/login").send({
      email: "test-daniel@corre.com",
      password: "123",
    });
    const response = await request(app)
      .get("/v1/cart")
      .set("Authorization", "Bearer " + token.body.token);
    expect(response.statusCode).toBe(200);
  });

  //DELETE PRODUCT FROM CART
  test("/cart/:id", async () => {
    token = await request(app).post("/v1/auth/login").send({
      email: "test-daniel@corre.com",
      password: "123",
    });
    const response = await request(app)
      .delete(`/v1/cart/63881a6ca9e98677a03c38ab`)
      .set("Authorization", "Bearer " + token.body.token);
    expect(response.statusCode).toBe(200);
  });
});
