const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Cost = require("../models/Cost");
const User = require("../models/User");
const Expense = require("../models/Expense");
const Group = require("../models/Group");

const withAuth = require("../helpers/middleware");

function splitPayments(payments) {
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
  while (i < j) {
    debt = Math.min(-sortedValuesPaid[i], sortedValuesPaid[j]);
    //console.log(debt)
    sortedValuesPaid[i] += debt;
    sortedValuesPaid[j] -= debt;
    console.log(`${sortedPeople[i]} owes ${sortedPeople[j]} $${debt}`);
    if (sortedValuesPaid[i] === 0) {
      i++;
    }
    if (sortedValuesPaid[j] === 0) {
      j--;
    }
  }
}

router.post("/expenses/add/:id", withAuth, async (req, res, next) => {
  const user = await User.findOne({ email: req.email });
  const group = await Group.findById(req.params.id).populate("costs");

  //console.log(group.costs[0].buyer, group.costs[0].import, "import del cost")
  const buyer = await User.findById(group.costs[0].buyer);

  //obtenim un objecte amb els membrs del grup i els costos

  const info = {};
  const costsGroup = group.costs;
  for (let i = 0; i < costsGroup.length; i++) {
    //console.log(costsGroup.length)
    if (costsGroup[i].buyer in info) {
      info[costsGroup[i].buyer] += costsGroup[i].import;
    } else {
      info[costsGroup[i].buyer] = costsGroup[i].import;
    }
  }
  //console.log(payments)

  splitPayments(info);

  //calcul necessitem del model group --> array costs
  //necessitem popular al model group el model cost --> id buyer

  const newExpense = {
    expenseImport: req.body.expenseImport,
    payed: req.body.payed,
    group: group._id,
    user: user._id,
  };

  // costs = array sobre la que iterarem (en el ejemplo payments)

  try {
    const theExpense = await Expense.create(newExpense).populate("Group"); //accedim al modelo group per poder exportar la array de costos genereals, i dsde els costos ja podrem accedir al buyer de cada un
    res.json(theExpense);
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
