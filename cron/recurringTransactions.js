// cron/recurringTransactions.js
import cron from "node-cron";
import Transaction from "../models/transactionModel.js";

export const startRecurringJob = () => {
  cron.schedule("0 0 * * *", async () => {
    // Runs daily at midnight
    console.log("Checking for recurring transactions...");

    const today = new Date();
    const recurring = await Transaction.find({
      repeatMonthly: true,
      nextRepeatDate: { $lte: today },
    });

    for (const t of recurring) {
      const newTx = new Transaction({
        userId: t.userId,
        name: t.name,
        amount: t.amount,
        type: t.type,
        category: t.category,
        repeatMonthly: true,
        nextRepeatDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ),
      });
      await newTx.save();

      // Update old transaction's nextRepeatDate
      t.nextRepeatDate = newTx.nextRepeatDate;
      await t.save();
    }

    console.log(`✅ Recurring check done: ${recurring.length} processed`);
  });
};
