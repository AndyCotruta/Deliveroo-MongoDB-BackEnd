import mongoose from "mongoose";

const { Schema, model } = mongoose;

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  short_description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, max: 5, default: 1, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  dishes: [],
});

export default model("Restaurant", restaurantSchema);
