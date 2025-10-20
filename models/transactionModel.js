// models/transactionModel.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },         // title in UI
    amount: { type: Number, required: true },       // positive for income, negative for expense
    type: { type: String, enum: ["income", "expense"], required: true },
    date: { type: Date, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },                 // optional: Food, Rent, Salary, etc.
    repeatMonthly: { type: Boolean, default: false }, // ✅ new field
    nextRepeatDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
