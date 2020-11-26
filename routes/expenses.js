const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Cost = require("../models/Cost");
const User = require("../models/User");
const Expense = require("../models/Expense");
const Group = require("../models/Group");

const withAuth = require("../helpers/middleware");

router.get("/expenses/add/:id", withAuth, async (req, res, next) => {
  const user = await User.findOne({ email: req.email });
  const group = await Group.findById(req.params.id).populate("costs");

  const buyer = await User.findById(group.costs[0].buyer);

  const info = {};
  const costsGroup = group.costs;
  for (let i = 0; i < costsGroup.length; i++) {
    if (costsGroup[i].buyer in info) {
      info[costsGroup[i].buyer] += costsGroup[i].costImport;
    } else {
      info[costsGroup[i].buyer] = costsGroup[i].costImport;
    }
  }

  for (let i = 0; i < group.members.length; i++){
    if(!(group.members[i] in info)){
      info[group.members[i]] = 0;
    }
  }

  try {
    async function splitPayments(payments) {
      const people = Object.keys(payments);
      const valuesPaid = Object.values(payments);
      const sum = valuesPaid.reduce((acc, curr) => curr + acc);
      const mean = sum / people.length;
      const sortedPeople = people.sort(
        (personA, personB) => payments[personA] - payments[personB]
      );
      const sortedValuesPaid = sortedPeople.map(
        (person) => payments[person] - mean
      );

      let i = 0;
      let j = sortedPeople.length - 1;
      let debt;
      const totalExpenses = []
      while (i < j) {
        const newExpense = {
          expenseImport: sortedValuesPaid[i] * -1,
          payed: req.body.payed,
          group: group._id,
          payer: sortedPeople[i],
          beneficiary: sortedPeople[j],
        };

        debt = Math.min(-sortedValuesPaid[i], sortedValuesPaid[j]);
        sortedValuesPaid[i] += debt;
        sortedValuesPaid[j] -= debt;
        if (sortedValuesPaid[i] === 0) {
          i++;
        }
        if (sortedValuesPaid[j] === 0) {
          j--;
        }

        const theExpense = await Expense.create(newExpense);
        totalExpenses.push(theExpense)
      }
      
      res.json(totalExpenses);
    }

    splitPayments(info);
  } catch (error) {
    res.json(error);
  }
});

router.patch("/expenses/edit/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const theEditedExpense = await Expense.findByIdAndUpdate(req.params.id, {payed:req.body.payed});
    res.json(theEditedExpense);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/expenses/delete/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const theRemovedExpense = await Expense.findByIdAndRemove(req.params.id);
    res.json("The cost was deleted");
  } catch (error) {
    res.json(error);
  }
});

router.get("/expenses/all/:id", withAuth, async (req, res, next) => {
  
  try {
    const theGroup = await Group.findById(req.params.id)
    const allExpenses = await Expense.find({group: theGroup});
    res.json(allExpenses);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
