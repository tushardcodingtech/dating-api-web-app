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
  { name: "Perfume", price: 150, image: "https://5.imimg.com/data5/SELLER/Default/2025/3/498961228/VA/YV/IV/4390697/victoria-s-secret-bombshell-perfume-for-women.jpeg" },
  { name: "Gift Card", price: 200, image: "https://img.freepik.com/free-vector/gift-card-template_23-2147503047.jpg?semt=ais_hybrid&w=740&q=80" },
  { name: "Candle Set", price: 60, image: "https://pasticheak.in/cdn/shop/files/scentedcandlegiftset_b7eabcf2-4bbf-47f4-a4a7-75d2b91afe0a_2048x.jpg?v=1712148315" },
  { name: "Plush Toy", price: 80, image: "https://teddydaddy.in/wp-content/uploads/Cute-FOX-Baby-Soft-Toy-Soft-Toy-Plush-Teddy-Daddy-jpg.webp" },
  { name: "Flower Bouquet", price: 120, image: "https://assets.oyegifts.com/flowers-n-gifts/vendordata/product/small-red-roses-bunch.jpg" },
  { name: "Jewelry Box", price: 300, image: "https://homafy.com/wp-content/uploads/2023/02/square-jewellery-box.jpeg" },
  { name: "Sunglasses", price: 90, image: "https://sunski.com/cdn/shop/files/sunski_polarized_sunglasses_baia_24_1400x1100.jpg?v=1748987571" },
  { name: "Notebook", price: 25, image: "https://www.worldone.in/cdn/shop/products/Mix_1024x1024.jpg?v=1757758613" },
  { name: "Coffee Mug", price: 40, image: "https://img.freepik.com/free-photo/latte-coffee-art-wooden-table_1232-2890.jpg?semt=ais_hybrid&w=740&q=80" },
  { name: "Hat", price: 70, image: "https://t3.ftcdn.net/jpg/14/48/84/34/360_F_1448843406_NWfa2DShcnvue2UIvml3Px8QlLY5Lbc3.jpg" },
  { name: "Scarf", price: 55, image: "https://in.benetton.com/cdn/shop/files/AW24_20Import_5C24AI_24A1002DU01E_2Z4_FS.jpg?v=1732556424" },
  { name: "Keychain", price: 15, image: "https://i.etsystatic.com/21584569/r/il/0d7d5e/6000887302/il_fullxfull.6000887302_d468.jpg" },
  { name: "Photo Frame", price: 35, image: "https://orbiz.in/cdn/shop/files/file_0003_DSC09257.jpg?v=1715057409" },
  { name: "Wallet", price: 120, image: "https://i5.walmartimages.com/seo/Sunshine-Crackers-Female-Casual-Bifold-Wallet-Gray_16fcfb56-fc2e-43ff-893d-50cd8e8c1eb8.8b71565c1d1e8d16cea2969610672a3f.jpeg" },
  { name: "Bracelet", price: 85, image: "https://www.fashioncrab.com/wp-content/uploads/2023/10/White-Heart-Anti-Tarnish-Bracelet-Rose-Gold-01.jpg" },
  { name: "Bottle of Wine", price: 180, image: "https://d3lhatfimi1ec.cloudfront.net/1E62B4AA-5FF5-4E1E-9CF2-21F6F144B9E4/Products/Medium/Hamper15.jpg?V=04102025100847" },
  { name: "Chocolate Cake", price: 90, image: "https://www.fnp.com/images/pr/l/v20221205202813/cream-drop-chocolate-cake_1.jpg" },
  { name: "Stuffed Animal", price: 70, image: "https://images-cdn.ubuy.co.in/64a733c35bdc195fe667cc42-cute-stuffed-rabbit-plush-soft-toys.jpg" },
  { name: "Travel Bag", price: 250, image: "https://img.freepik.com/free-psd/view-hawaiian-shirt-with-luggage_23-2150819302.jpg?semt=ais_hybrid&w=740&q=80" },
  { name: "Umbrella", price: 35, image: "https://img.freepik.com/free-vector/umbrella-protection-icon-vector-isolated_24911-109216.jpg?semt=ais_hybrid&w=740&q=80" },
  { name: "Watch", price: 350, image: "https://www.carlington.in/cdn/shop/files/Carliongton_premium_black_analog_mens_s_watch_6020.jpg?v=1712818158&width=2048" },
  { name: "Birthday Card - Cake", price: 20, image: "https://itsybitsy.in/cdn/shop/files/LBCA56637_1.png?v=1749735627" },
  { name: "Birthday Card - Balloons", price: 25, image: "https://i.etsystatic.com/22010221/r/il/1a17ae/4252749658/il_fullxfull.4252749658_f4ea.jpg" },
  { name: "Birthday Card - Gifts", price: 30, image: "https://www.shutterstock.com/image-vector/happy-birthday-greeting-vector-design-600nw-2479760479.jpg" }
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
