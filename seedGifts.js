const mongoose = require("mongoose");
const Gift = require("./models/Gift");
require("dotenv").config();

const MONGODB_URI = process.env.DATABASE_URL;
// MongoDB connection string
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const gifts = [
  { name: "Teddy Bear", price: 100, image: "https://as1.ftcdn.net/jpg/13/88/70/76/1000_F_1388707699_xgAtGl9NjYuibhGjTGgKcAKUVa3of26t.jpg" },
  { name: "Roses", price: 50, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Rose_flower.jpg/1200px-Rose_flower.jpg?20130228001944" },
  { name: "Chocolate Box", price: 75, image: "https://www.shutterstock.com/shutterstock/photos/2420286489/display_1500/stock-vector-hand-drawn-vector-illustration-of-a-heart-shaped-chocolate-candy-gift-box-sweet-valentine-s-day-2420286489.jpg" },
];

async function seed() {
  try {
    await Gift.deleteMany(); // clear old gifts
    await Gift.insertMany(gifts);
    console.log("Gifts seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding gifts:", err);
  }
}

seed();
