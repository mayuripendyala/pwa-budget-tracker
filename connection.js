require('dotenv').config();
const mongoose = require('mongoose');

const url =   'mongodb://localhost/budget' || process.env.MONGODB_URI ;
  // process.env.MONGODB_URI ||

const db = mongoose.connection;

db.once('open', () => {
  console.log('Database connected');
});

const connectDB = async () => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
