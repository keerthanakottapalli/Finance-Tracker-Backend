import Budget from "../models/budgetModel.js";

// ➕ Add a new budget
export const addBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const userId = req.user._id; // assuming you use JWT authentication

    // Prevent duplicate category for same user
    const existing = await Budget.findOne({ userId, category });
    if (existing) {
      return res.status(400).json({ message: "Budget for this category already exists" });
    }

    const newBudget = await Budget.create({ userId, category, limit });
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧾 Get all budgets for logged-in user
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update budget
export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.body;
    const budget = await Budget.findByIdAndUpdate(id, { limit }, { new: true });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete budget
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    await Budget.findByIdAndDelete(id);
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
