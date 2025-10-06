const mongoose = require("mongoose");
const Gift = require("./models/Gift");
require("dotenv").config();

const MONGODB_URI = process.env.DATABASE_URL;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const gifts = [
  { name: "Teddy Bear", price: 100, image: "https://as1.ftcdn.net/jpg/13/88/70/76/1000_F_1388707699_xgAtGl9NjYuibhGjTGgKcAKUVa3of26t.jpg" },
  { name: "Roses", price: 50, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Rose_flower.jpg/1200px-Rose_flower.jpg?20130228001944" },
  { name: "Chocolate Box", price: 75, image: "https://www.shutterstock.com/shutterstock/photos/2420286489/display_1500/stock-vector-hand-drawn-vector-illustration-of-a-heart-shaped-chocolate-candy-gift-box-sweet-valentine-s-day-2420286489.jpg" },
  { name: "Perfume", price: 150, image: "https://cdn.pixabay.com/photo/2017/06/12/20/45/perfume-2397723_1280.jpg" },
  { name: "Gift Card", price: 200, image: "https://cdn.pixabay.com/photo/2017/06/26/22/04/gift-card-2448892_1280.jpg" },
  { name: "Candle Set", price: 60, image: "https://cdn.pixabay.com/photo/2016/03/05/22/21/candles-1238333_1280.jpg" },
  { name: "Plush Toy", price: 80, image: "https://cdn.pixabay.com/photo/2017/05/05/22/25/stuffed-animal-2287406_1280.jpg" },
  { name: "Flower Bouquet", price: 120, image: "https://cdn.pixabay.com/photo/2017/07/06/14/05/flowers-2483423_1280.jpg" },
  { name: "Jewelry Box", price: 300, image: "https://cdn.pixabay.com/photo/2018/03/05/20/17/jewelry-3201156_1280.jpg" },
  { name: "Sunglasses", price: 90, image: "https://cdn.pixabay.com/photo/2016/03/27/22/22/sunglasses-1284415_1280.jpg" },
  { name: "Notebook", price: 25, image: "https://cdn.pixabay.com/photo/2015/01/08/18/29/notebook-593309_1280.jpg" },
  { name: "Coffee Mug", price: 40, image: "https://cdn.pixabay.com/photo/2016/11/29/02/35/coffee-1869561_1280.jpg" },
  { name: "Hat", price: 70, image: "https://cdn.pixabay.com/photo/2016/11/29/09/32/hat-1866710_1280.jpg" },
  { name: "Scarf", price: 55, image: "https://cdn.pixabay.com/photo/2016/10/21/22/46/scarf-1750653_1280.jpg" },
  { name: "Keychain", price: 15, image: "https://cdn.pixabay.com/photo/2017/07/16/11/39/keychain-2506713_1280.jpg" },
  { name: "Photo Frame", price: 35, image: "https://cdn.pixabay.com/photo/2016/11/29/12/54/photo-frame-1867896_1280.jpg" },
  { name: "Wallet", price: 120, image: "https://cdn.pixabay.com/photo/2014/03/24/17/55/wallet-293950_1280.jpg" },
  { name: "Bracelet", price: 85, image: "https://cdn.pixabay.com/photo/2016/03/27/21/48/bracelet-1284426_1280.jpg" },
  { name: "Bottle of Wine", price: 180, image: "https://cdn.pixabay.com/photo/2014/12/16/22/25/wine-570045_1280.jpg" },
  { name: "Chocolate Cake", price: 90, image: "https://cdn.pixabay.com/photo/2017/05/07/08/56/cake-2290430_1280.jpg" },
  { name: "Stuffed Animal", price: 70, image: "https://cdn.pixabay.com/photo/2016/12/06/18/27/bear-1883673_1280.jpg" },
  { name: "Travel Bag", price: 250, image: "https://cdn.pixabay.com/photo/2017/07/31/11/21/bag-2554386_1280.jpg" },
  { name: "Umbrella", price: 35, image: "https://cdn.pixabay.com/photo/2017/08/06/23/29/umbrella-2596533_1280.jpg" },
  { name: "Watch", price: 350, image: "https://cdn.pixabay.com/photo/2015/03/26/09/41/wristwatch-690084_1280.jpg" },
  { name: "Birthday Card - Cake", price: 20, image: "https://cdn.pixabay.com/photo/2016/03/31/18/18/birthday-1297803_1280.jpg" },
  { name: "Birthday Card - Balloons", price: 25, image: "https://cdn.pixabay.com/photo/2014/04/02/11/02/birthday-306456_1280.jpg" },
  { name: "Birthday Card - Gifts", price: 30, image: "https://cdn.pixabay.com/photo/2017/09/10/18/40/birthday-2732931_1280.jpg" }
];

async function seed() {
  try {
    await Gift.deleteMany(); // clear old gifts
    await Gift.insertMany(gifts);
    console.log("Gifts seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding gifts:", err);
    mongoose.connection.close();
  }
}

seed();
