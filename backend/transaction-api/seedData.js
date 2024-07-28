const axios = require('axios');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const connectDB = require('./db');

const seedData = async () => {
  await connectDB();

  try {
    const res = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.insertMany(res.data);
    console.log('Data seeded');
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
};

seedData();
