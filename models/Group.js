const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
    {
        name: {type: String},
        image: {type: String, default: ""},
        members: [{type: Schema.Types.ObjectId, ref: 'User'}],
        costs: [{type: Schema.Types.ObjectId, ref: 'Cost'}],
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );
  
const Group = mongoose.model("Group", groupSchema);

module.exports = Group;