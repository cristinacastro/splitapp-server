const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
    {
        expenseImport: {type: Number},
        payed: {type: Boolean, default: false},
        group: {type: Schema.Types.ObjectId, ref: "Group"},
        user: {type: Schema.Types.ObjectId, ref: "User"},
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );
  
const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
