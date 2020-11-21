const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const costSchema = new Schema(
    {
        concept: {type: String, required: true},
        costImport: {type: Number, required: true},
        ticket: {type: String},
        group: {type: Schema.Types.ObjectId, ref: "Group"},
        buyer: {type: Schema.Types.ObjectId, ref: "User"},
        date: { type:Date, default: Date.now },
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );
  
const Cost = mongoose.model("Cost", costSchema);

module.exports = Cost;
