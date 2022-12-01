import request from "supertest";
import mongoose from "mongoose";
import { MONGO_URI } from "../config.js";
import express from "express";
import morgan from "morgan";
import router from "../routes/index.routes.js";

describe("Products", () => {
  let app;
  let review_id;
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
  //CREATES REVIEW
  test("/reviews", async () => {
    token = await request(app).post("/v1/auth/login").send({
      email: "test-daniel@corre.com",
      password: "123",
    });
    const response = await request(app)
      .post("/v1/reviews")
      .send({
        title: "Review del producto xy",
        description: "Uno de los mejores productos que existen!",
        product: "63880849f2a28b5d1c4cffb2",
      })
      .set("Authorization", "Bearer " + token.body.token);
    expect(response.statusCode).toBe(201);
    review_id = response.body._id;
  });

  // GETS ALL REVIEW
  test("/reviews", async () => {
    const response = await request(app).get("/v1/reviews");
    expect(response.statusCode).toBe(200);
  });
  //GET REVIEW BY ID
  test("/reviews/:id", async () => {
    const response = await request(app).get(`/v1/reviews/${review_id}`);
    expect(response.statusCode).toBe(200);
  });


  //DELETES REVIEW
  test("/reviews/:id", async () => {
    token = await request(app).post("/v1/auth/login").send({
      email: "test-daniel@corre.com",
      password: "123",
    });
    const response = await request(app)
      .delete(`/v1/reviews/${review_id}`)
      .set("Authorization", "Bearer " + token.body.token);
    expect(response.statusCode).toBe(200);
  });
});
