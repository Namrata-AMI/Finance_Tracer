const Transaction = require("../models/transaction.js");
const Budget = require("../models/budget.js");

// home 
module.exports.getTransaction = async(req,res)=>{
    try{
        const transactions = await Transaction.find();
        const budget = await Budget.find();
        res.render("index.ejs",{transactions,budget});
    }
    catch(e){
        console.log(e);
        req.flash("error",e.message);
        return res.redirect("/");
    }
}


// add
module.exports.createTransaction = async(req,res)=>{
    const categories =  ['food', 'entertainment', 'utilities', 'shopping', 'other'];
    return res.render("add.ejs",{categories});
}


// add 

module.exports.addTransaction = async(req,res)=>{
    try{
        const {amount,date,description,category} = req.body;
        const newtransaction = new Transaction({amount,date,description,category});
        await newtransaction.save();
        console.log(newtransaction);
        req.flash("success","Your data saved");
        return res.redirect("/");
    }
    catch(e){
        console.log(e);
        req.flash("error",e.message);
        return res.redirect("/add");
    }
};


//show 

module.exports.showTransaction = async(req,res)=>{
    try{
        const allTransactions = await Transaction.find();
        const transactions = await Transaction.aggregate([
            {
                $group:{
                    _id : { $month : "$date"},
                    total : { $sum : "$amount"}
                }
            },
            {
                $sort : {_id : 1} // sort by month
            }
        ]);

        const labels = transactions.map(t=>`Month ${t._id}`);
        const data = transactions.map(t=>t.total);
        return res.render("show.ejs",{allTransactions,labels,data});
    }
    catch(e){
        console.log(e);
        req.flash("error",e.message);
        return res.redirect("/show");
    }
}


// edit form //

module.exports.renderEditForm = async(req,res)=>{
    const transactionId = req.params.id;
    const transaction = await Transaction.findById(transactionId);
    console.log(transaction);
    return res.render("edit.ejs",{transaction});
}

// edit //

module.exports.editTransaction = async (req, res) => {
    const transactionId = req.params.id;
    const updatedData = {
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date
    };

    await Transaction.findByIdAndUpdate(transactionId, updatedData);
    res.redirect('/show'); 
};

// delete //

module.exports.deleteTransaction = async(req,res)=>{
    try{
        const transactionId = req.params.id;
        await Transaction.findByIdAndDelete(transactionId);
        req.flash("success","Transaction deleted successfully!");
        return res.redirect("/show");
    }
    catch(e){
        console.log(e);
        req.flash("error",e.message);
       return res.redirect("/show");
    }
}



// expenses module wise chart 
module.exports.categoryExp = async(req,res)=>{
    try{
        const transactions = await Transaction.aggregate([
            {
                $group:{
                    _id : "$category",
                    total : { $sum : "$amount"}
                }
            },
            {
                $sort : {total : -1} 
            }
        ]);

        const labels = transactions.map(t=>t._id);
        const data = transactions.map(t=>t.total);

        return res.render("chart.ejs",{labels,data});
    }
    catch(e){
        console.log(e);
        req.flash("error",e.message);
        return res.redirect("/show");
    }
}