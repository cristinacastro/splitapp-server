const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Cost = require("../models/Cost");
const User = require("../models/User");
const Expense = require("../models/Expense");

const withAuth = require("../helpers/middleware");



//ARREGLAR POR DIOS. POPULATE A COSTOS DEL MODELO GROUP. CADA EXPENSE NO CALDRIA QUE ANÉS RELACIONADA EN UN COST EN CONCRET, SINÓ QUE ANÉS RELACIONADA AMB EL GOST GLOBAL DEL GRUP
router.post("/expenses/add", withAuth, async (req, res, next) => {
  const user = await User.findOne({email: req.email});
  const cost = await Cost.findOne({cost: req.params.id})
   
    const newExpense = {
        import: req.body.import,
        payed: req.body.payed,
        cost: cost._id,
        user: user._id,
    };

    try {
        const theExpense = await Expense.create(newExpense);
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