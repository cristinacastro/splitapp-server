const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Expense = require("../models/Expense");

const withAuth = require("../helpers/middleware");

router.get("/arrangements", withAuth, async (req, res, next) => {
    try {
      const allExpenses = await Expense.find().populate("payer").populate("beneficiary").populate("group");

      res.json(allExpenses);
    } catch (error) {
      res.json(error);
    }
});



module.exports = router;