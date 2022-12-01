import request from "supertest";
import mongoose from "mongoose";
import { MONGO_URI } from "../config.js";
import express from "express";
import morgan from "morgan";
import router from "../routes/index.routes.js";

describe("Products", () => {
  let app;
  let product_id;
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

  //CREATES PRODUCT
  test("/products", async () => {
    token = await request(app).post("/v1/auth/login").send({
      email: "test-daniel@corre.com",
      password: "123",
    });
    const response = await request(app)
      .post("/v1/products")
      .send({
        stock: 1,
        name: "PC Gamer Victus HP 16.1 ",
        description:
          "Alimentado por la nueva generación de gráficos NVIDIA GeForce GTX",
        price: 800,
        category: "Tech",
      })
      .set("Authorization", "Bearer " + token.body.token);
    console.log("LOg:----", response);
    expect(response.statusCode).toBe(201);
    product_id = response.body._id;
  });

  // GETS ALL PRODUCTS
  test("/products", async () => {
    const response = await request(app).get("/v1/products");
    expect(response.statusCode).toBe(200);
  });
  //GET PRODUCT BY ID
  test("/products/:id", async () => {
    const response = await request(app).get(
      `/v1/products/${product_id}`
    );
    expect(response.statusCode).toBe(200);
  });

  //UPDATES PRODUCT
  test("/products/:id", async () => {
    token = await request(app).post("/v1/auth/login").send({
      email: "test-daniel@corre.com",
      password: "123",
    });
    const response = await request(app)
      .put(`/v1/products/${product_id}`)
      .send({
        name: "PC Gamer Victus HP 16.1 Updata ",
        description:
          "Alimentado por la nueva generación de gráficos NVIDIA GeForce GTX Update",
      })
      .set("Authorization", "Bearer " + token.body.token);
    expect(response.statusCode).toBe(200);
  });
  // GET ALL REVIEWS FOR A PRODUCT
  test("/products/:id/reviews", async () => {
    const response = await request(app).get(
      `/v1/products/${product_id}/reviews`
    );
    expect(response.statusCode).toBe(200);
  });
  //DELETES PRODUCT
  test("/products/:id", async () => {
    token = await request(app).post("/v1/auth/login").send({
      email: "test-daniel@corre.com",
      password: "123",
    });
    const response = await request(app)
      .delete(`/v1/products/${product_id}`)
      .set("Authorization", "Bearer " + token.body.token);
    expect(response.statusCode).toBe(200);
  });

  // GET ALL REVIEWS FOR A PRODUCT
  test("/products/:id/reviews/:id", async () => {
    const response = await request(app).get(
      `/v1/products/63841d0e864f966b3d0eb84d/reviews/638819561c2649574c926f87`
    );
    expect(response.statusCode).toBe(200);
  });
});
