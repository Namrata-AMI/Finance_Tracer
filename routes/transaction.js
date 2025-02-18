const express = require('express');
const router = express.Router();

const {getTransaction,addTransaction,editTransaction,deleteTransaction,createTransaction,showTransaction,renderEditForm, categoryExp } = require("../controllers/transaction.js");

// routes

router.get('/', getTransaction);
router.get('/add',createTransaction)
router.post('/add',addTransaction);
router.get("/show",showTransaction);
router.get("/edit/:id",renderEditForm)
router.post('/edit/:id', editTransaction);
router.delete('/delete/:id', deleteTransaction);
router.get("/chart",categoryExp);

module.exports = router;