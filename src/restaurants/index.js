import express from "express";
import RestaurantModel from "./model.js";

const restaurantRouter = express.Router();

restaurantRouter.post("/", async (req, res, next) => {
  try {
    const newRestaurant = new RestaurantModel(req.body);
    const { _id } = await newRestaurant.save();
    res.send(`Restaurant with id ${_id} was created successfully`);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
restaurantRouter.get("/", async (req, res, next) => {
  try {
    const restaurants = await RestaurantModel.find();
    res.send(restaurants);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
restaurantRouter.get("/:restaurantId", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});
restaurantRouter.put("/:restaurantId", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});
restaurantRouter.delete("/:restaurantId", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default restaurantRouter;
