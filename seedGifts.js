const mongoose = require("mongoose");
const Gift = require("./models/Gift");

// MongoDB connection string
mongoose.connect("mongodb://localhost:27017/yourdbname", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const gifts = [
  { name: "Teddy Bear", price: 100, image: "https://example.com/teddy.png" },
  { name: "Roses", price: 50, image: "https://example.com/roses.png" },
  { name: "Chocolate Box", price: 75, image: "https://example.com/chocolate.png" },
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
