require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");
const transactionRoutes = require("./routes/transaction");
const budgetRoutes = require("./routes/budget.js");

const dburl = process.env.DB_URL || "mongodb://localhost:27017/finace_tracer";

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "ourSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: dburl,
        collectionName: "sessions",
        ttl: 7 * 24 * 60 * 60, 
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
};

app.use(session(sessionOptions));
app.use(flash());                            

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.newUser = req.user; 
    console.log(res.locals.newUser);
    next();
});


// routers
app.use('/', transactionRoutes);

app.use("/",budgetRoutes);


async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("connected to db");
    } catch (err) {
        console.error("Db error:", err);
        setTimeout(main, 5000); 
    }
}

main();




app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});
