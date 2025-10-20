import Transaction from "../models/transactionModel.js";

// GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/transactions
export const addTransaction = async (req, res) => {
  try {
    const { name, amount, type, category, repeatMonthly, date } = req.body;
    const transaction = await Transaction.create({
      name,
      amount,
      type,
      category,
      date,
      user: req.user._id,
      repeatMonthly,
      nextRepeatDate: repeatMonthly
        ? new Date(new Date().setMonth(new Date().getMonth() + 1))
        : null,
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // ✅ Ensure user owns the transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.deleteOne();
    res.json({ message: "Transaction removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params; // transaction ID
    const transaction = await Transaction.findById(id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Only allow the owner to update
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields
    const { name, amount, type, category, repeatMonthly, date } = req.body;

    transaction.name = name ?? transaction.name;
    transaction.amount = amount ?? transaction.amount;
    transaction.type = type ?? transaction.type;
    transaction.category = category ?? transaction.category;
    transaction.repeatMonthly = repeatMonthly ?? transaction.repeatMonthly;
    transaction.date = date ? new Date(date) : transaction.date;

    const updatedTransaction = await transaction.save();

    res.json(updatedTransaction);
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

