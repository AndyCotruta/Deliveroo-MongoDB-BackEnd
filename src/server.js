import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";
import restaurantRouter from "./restaurants/index.js";
import createHttpError from "http-errors";
import bodyParser from "body-parser";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
import dishesRouter from "./dishes/index.js";
import categoriesRouter from "./categories/index.js";
import featuredCategoriesRouter from "./featuredCategories/index.js";

const server = express();
const port = process.env.PORT;

server.use(cors());

server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

server.use(express.json());

server.use("/restaurants", restaurantRouter);
server.use("/restaurants", dishesRouter);
server.use("/categories", categoriesRouter);
server.use("/featuredCategories", featuredCategoriesRouter);

// ..................ERROR HANDLERS............

server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500

mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB server");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is listening on Port:  ${port}`);
  });
});