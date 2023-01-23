import express from "express";
import httpErrors from "http-errors";
import RestaurantModel from "../restaurants/model.js";

const dishesRouter = express.Router();

const { NotFound, Unauthorized, BadRequest } = httpErrors;

dishesRouter.post("/:restaurantId/dishes", async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;
    const newDish = req.body;
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      { $push: { dishes: newDish } },
      { new: true, runValidators: true, timestamps: true }
    );
    if (updatedRestaurant) {
      res.status(201).send(updatedRestaurant);
    } else {
      next(NotFound(`Restaurant with id ${restaurantId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

dishesRouter.get("/:restaurantId/dishes", async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (restaurant) {
      res.send(restaurant.dishes);
    } else {
      next(NotFound(`Restaurant with id ${restaurantId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

dishesRouter.get("/:restaurantId/dishes/:dishId", async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;
    const dishId = req.params.dishId;
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (restaurant) {
      const dish = restaurant.dishes.find(
        (dish) => dish._id.toString() === dishId
      );
      if (dish) {
        res.send(dish);
      } else {
        next(NotFound(`Dish with id ${dishId} was not found`));
      }
    } else {
      next(NotFound(`Restaurant with id ${restaurantId} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

dishesRouter.put("/:restaurantId/dishes/:dishId", async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;
    const dishId = req.params.dishId;
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (restaurant) {
      const index = restaurant.dishes.findIndex(
        (dish) => dish._id.toString() === dishId
      );
      if (index !== -1) {
        restaurant.dishes[index] = {
          ...restaurant.dishes[index].toObject(),
          ...req.body,
        };
        await restaurant.save();
        res.status(201).send(restaurant);
      } else {
        next(NotFound(`Dish with id ${dishId} was not found`));
      }
    } else {
      next(NotFound(`Restaurant with id ${restaurantId} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

dishesRouter.delete("/:restaurantId/dishes/:dishId", async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;
    const dishId = req.params.dishId;

    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      { $pull: { dishes: { _id: dishId } } },
      { new: true }
    );
    if (updatedRestaurant) {
      res.status(204).send();
    } else {
      next(NotFound(`Restaurant with id ${restaurantId} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default dishesRouter;
