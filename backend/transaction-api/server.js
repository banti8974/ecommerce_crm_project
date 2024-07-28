const express = require('express');
const connectDB = require('./db');
const cors = require("cors");
const Transaction = require('./models/Transaction');

const app = express();
connectDB();
app.use(express.json());
app.use(cors());

// Helper function to get month from date
const getMonth = (date) => new Date(date).getMonth() + 1;

// API to list all transactions with search and pagination
app.get('/api/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const monthInt = parseInt(month);
  // console.log(month, monthInt);

  if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  // Regular expression to check if the search parameter is a number
  const isNumber = !isNaN(search) && search.trim() !== '';

  // Build the search conditions
  const searchConditions = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];

  if (isNumber) {
    searchConditions.push({ price: parseFloat(search) });
  }

  const query = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] },
    $or: searchConditions
  };

  const transactions = await Transaction.find(query)
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));

  res.json(transactions);
});

// API for statistics
app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;
  const monthInt = parseInt(month);

  // Validate month
  if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  const query = {
    // dateOfSale: { $gte: new Date(`2022-${month}-01`), $lt: new Date(`2022-${month}-31`) }
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] },
  };

  const totalSales = await Transaction.aggregate([
    { $match: query },
    { $group: { _id: null, totalSales: { $sum: '$price' } } }
  ]);

  const soldItems = await Transaction.countDocuments({ ...query, sold: true });
  const notSoldItems = await Transaction.countDocuments({ ...query, sold: false });

  res.json({
    totalSales: totalSales[0]?.totalSales || 0,
    soldItems,
    notSoldItems
  });
});

// API for bar chart
app.get('/api/bar-chart', async (req, res) => {
  const { month } = req.query;
  const monthInt = parseInt(month);

  // Validate month
  if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  const query = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] },
  };

  const ranges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity }
  ];

  const barData = await Promise.all(
    ranges.map(async (range) => {
      const count = await Transaction.countDocuments({
        ...query,
        price: { $gte: range.min, $lte: range.max === Infinity ? 1e12 : range.max }
      });

      return { range: range.range, count };
    })
  );

  res.json(barData);
});

// API for pie chart
app.get('/api/pie-chart', async (req, res) => {
  const { month } = req.query;
  const monthInt = parseInt(month);

  // Validate month
  if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  const query = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] },
  };

  const pieData = await Transaction.aggregate([
    { $match: query },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { _id: 0, category: '$_id', count: 1 } }
  ]);

  res.json(pieData);
});

// API to combine all data
app.get('/api/combined', async (req, res) => {
  const { month } = req.query;

  const transactionsRes = await fetch(`${req.protocol}://${req.get('host')}/api/transactions?month=${month}`);
  const transactions = await transactionsRes.json();

  const statisticsRes = await fetch(`${req.protocol}://${req.get('host')}/api/statistics?month=${month}`);
  const statistics = await statisticsRes.json();

  const barChartRes = await fetch(`${req.protocol}://${req.get('host')}/api/bar-chart?month=${month}`);
  const barChart = await barChartRes.json();

  const pieChartRes = await fetch(`${req.protocol}://${req.get('host')}/api/pie-chart?month=${month}`);
  const pieChart = await pieChartRes.json();

  res.json({ transactions, statistics, barChart, pieChart });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
