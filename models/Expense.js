const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
    {
        import: {type: Number},
        payed: {type: Boolean, default: false},
        cost: {type: Schema.Types.ObjectId, ref: "Cost"},
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
