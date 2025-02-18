const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const transactionRoutes = require("./routes/transaction");
const budgetRoutes = require("./routes/budget.js");

const dburl = "mongodb://localhost:27017/finace_tracer";

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: "ourSecret",     
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());                            

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.newUser = req.user; // Storing the current user session
    console.log(res.locals.newUser);
    next();
});


// routers
app.use('/', transactionRoutes);

app.use("/add",transactionRoutes);

app.use("/show",transactionRoutes);

app.use("/edit/:id",transactionRoutes);

app.use("/delete/:id",transactionRoutes);

app.use("/",budgetRoutes);


main()
.then(() => {
    console.log("Connected to db");
})
.catch((err) => {
    console.log(err);
})


async function main() {
    await mongoose.connect(dburl);
}




app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});
