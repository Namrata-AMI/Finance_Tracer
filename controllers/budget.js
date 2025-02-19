const Budget = require("../models/budget.js");
const Transaction = require("../models/transaction.js");


module.exports.getBudget = async (req, res) => {
    try {
        const budgets = await Budget.find();
        return res.render("budget.ejs", { budgets: budgets });
    } 
    catch (e) {
        console.log(e);
        req.flash("error", e.message);
        return res.redirect("/");
    }
};


module.exports.setBudget = async(req,res)=>{
    try{
        const {category, amount, month} = req.body;

        const budget = new Budget({
            category,
            amount,
            month,
        });

        await budget.save();
        req.flash("success","Budget is Set!");
        return res.redirect("/");
    }
    catch(e){
        console.log(e);
        req.flash("error",e.message);
        return res.redirect("/");
    }
}


module.exports.getBudgetComp = async(req,res)=>{
    try{
        const budgets = await Budget.find();
        const expenses = await Transaction.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalSpent: { $sum: "$amount" }
                }
            }
        ]);

        const comparisonData = budgets.map(budget => {
            const expense = expenses.find(e => e._id === budget.category);
            return {
                category: budget.category,
                budgeted: budget.amount,
                spent: expense ? expense.totalSpent : 0
            };
        });

        return res.render("budgetComp.ejs",{comparisonData});
    }
    catch(e){
        console.log(e);
        req.flash("error",e.message);
        return res.redirect("/");
    }
}


module.exports.getSpendingInsights = async (req, res) => {
    try {
        const budgets = await Budget.find();
    
        const expenses = await Transaction.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalSpent: { $sum: "$amount" }
                }
            }
        ]);

        // chekc budget exists
        if(budgets.length === 0 || expenses.length === 0){
            req.flash("error","No budgets or Transaction find. Set Budget!");
            return res.redirect("/budget");
        }

        const topSpending = expenses
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 3);

        const underBudget = budgets
            .map(budget => {
                const expense = expenses.find(e => e._id === budget.category);
                const spent = expense ? expense.totalSpent : 0;
                return {
                    category: budget.category,
                    budgeted: budget.amount,
                    spent,
                    remaining: budget.amount - spent
                };
            })
            .filter(item => item.remaining > 0);

        const totalBudgeted = budgets.reduce((acc, b) => acc + b.amount, 0);
        const totalSpent = expenses.reduce((acc, e) => acc + e.totalSpent, 0);
        const budgetUtilization = ((totalSpent / totalBudgeted) * 100).toFixed(2);

        res.render("spend.ejs", { topSpending, underBudget, budgetUtilization });
    } 
    catch (e) {
        console.log(e);
        req.flash("error", e.message);
        return res.redirect("/");
    }
};
