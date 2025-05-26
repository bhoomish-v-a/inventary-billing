const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://vabhoomish2004:Bhoomish%4012@cluster0.d7qmnmb.mongodb.net/imss?retryWrites=true&w=majority&appName=Cluster0"
);
    console.log("✅ MongoDB Atlas Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;



















// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/imss", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB Connected");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


//mongodb+srv://vabhoomish2004:Bhoomish@12@cluster0.d7qmnmb.mongodb.net/