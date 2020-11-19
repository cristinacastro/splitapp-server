const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Cost = require("../models/Cost");
const User = require("../models/User");
const Expense = require("../models/Expense");

const withAuth = require("../helpers/middleware");



router.post("/expenses/add", withAuth, async (req, res, next) => {
  const user = await User.findOne({email: req.email});
  const cost = await Cost.findOne({cost: req.params.id})

  //calcul necessitem del model group --> array costs
  //necessitem popular al model group el model cost --> id buyer
   
    const newExpense = {
        expenseImport: req.body.expenseImport,
        payed: req.body.payed,
        costs: [], //totlobjecte de cost
        user: user._id,
    };

    //obtenim un objecte amb els membrs del grup i els costos
    const payments = {
        costs: costs,
        members: members
    }

    // costs = array sobre la que iterarem (en el ejemplo payments)

    try {
        const theExpense = await Expense.create(newExpense).populate("Group") //accedim al modelo group per poder exportar la array de costos genereals, i dsde els costos ja podrem accedir al buyer de cada un
        res.json(theExpense)
    } catch(error) {
        res.json(error)
    }
}); 


router.delete('/expenses/delete/:id', async (req, res, next)=>{

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
   
    try {
        const theRemovedExpense = await Expense.findByIdAndRemove(req.params.id)
        res.json('The cost was deleted')
    } catch(error){
        res.json(error)
    }
});



module.exports = router;