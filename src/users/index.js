import express from "express";
import UsersModel from "./model.js";
import passport from "passport";
import { adminOnlyMiddleware } from "../lib/middlewares/adminOnly.js";
import { createAccessToken } from "../lib/auth/authTools.js";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../lib/auth/jwtAuth.js";

// ..........................................Creating CRUD operations...............................
const usersRouter = express.Router(); //declaring the Router that connects our operations to the server

// /me ENDPOINTS................................................................

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndUpdate(req.user._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

//.......................................... Google Login................................

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// The purpose of this endpoint is to redirect users to Google Consent Screen

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { session: false }),
  async (req, res, next) => {
    console.log(req.user);
    res.redirect(`${process.env.FE_URL}?accessToken=${req.user.accessToken}`);
  }
);

// 1. Create

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(`User with ID ${_id} was created successfully`);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

// 2. Read
usersRouter.get(
  "/",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UsersModel.find({});
      res.send(users); //sending the JSON body
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 3. Read individual user
usersRouter.get(
  "/:id",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const searchedUser = await UsersModel.findById(userId);
      if (searchedUser) {
        res.send(searchedUser);
      } else {
        next(NotFound(`User with id ${userId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 4. Update
usersRouter.put(
  "/:id",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const updatedUser = await UsersModel.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      });
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(NotFound(`User with id ${userId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// 5.DELETE
usersRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const deletedUser = await UsersModel.findByIdAndDelete(userId);
      if (deletedUser) {
        res.status(204).send();
      } else {
        next(NotFound(`User with id ${userId} not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default usersRouter;
