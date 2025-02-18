const express = require("express");
const router  = express.Router();

const {setBudget,getBudget,getBudgetComp,getSpendingInsights} = require("../controllers/budget.js");

router.get("/budget",getBudget);
router.post("/budget",setBudget);
router.get("/budget/comparison",getBudgetComp);
router.get("/budget/insights", getSpendingInsights);



module.exports = router;