const mongoose = require('mongoose');

var ExpenseSchema = new mongoose.Schema({
    cost: String,
    title: String,
    author: String,
    description: String,
    published_date: { type: Date },
    publisher: String,
    updated_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
