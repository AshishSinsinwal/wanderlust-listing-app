require('dotenv').config();
const mongoose = require("mongoose");
const Listing = require("../models/listings");
const initdata = require("./data");

// 🚫 SAFEGUARD: Prevent running in production
if (process.env.NODE_ENV === "production") {
  throw new Error("🚫 Cannot run seed script in production!");
}

// ✅ Choose Atlas or Local DB
const MONGOOSE_URL = process.env.ATLAS_DB ;
main()
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    })

async function main() {
  await mongoose.connect(MONGOOSE_URL);

}

async function initDB() {
  try {
    await mongoose.connect(MONGOOSE_URL);
    console.log("✅ Connected to DB");

    await Listing.deleteMany({});
    console.log("🧹 Listings collection cleared");

    const seededData = initdata.data.map(obj => ({
      ...obj,
      owner: "685faee16b653eb4035f85f0", // 🔐 use real user ID
    }));

    await Listing.insertMany(seededData);
    console.log("🌱 Seed data inserted");

    mongoose.connection.close();
    console.log("🔌 DB connection closed");
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
}

initDB();
