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
  //console.log(buyer.username, "fddf") //per obtenir el nom

  const info = {};
  const costsGroup = group.costs;
  for (let i = 0; i < costsGroup.length; i++) {
    //console.log(costsGroup.length)
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
  console.log(info)

  try {
    async function splitPayments(payments) {
      const people = Object.keys(payments);
      const valuesPaid = Object.values(payments);
      const sum = valuesPaid.reduce((acc, curr) => curr + acc);
      const mean = sum / people.length;
      const sortedPeople = people.sort(
        (personA, personB) => payments[personA] - payments[personB]
      );
      console.log(sortedPeople);
      const sortedValuesPaid = sortedPeople.map(
        (person) => payments[person] - mean
      );
      console.log(sortedValuesPaid);

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
        console.log(debt);
        sortedValuesPaid[i] += debt;
        sortedValuesPaid[j] -= debt;
        console.log(`${sortedPeople[i]} owes ${sortedPeople[j]} $${debt}`);
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

module.exports = router;
