require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");
const transactionRoutes = require("./routes/transaction");
const budgetRoutes = require("./routes/budget.js");

const dburl = process.env.DB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "ourSecret",
    resave: false,
    saveUninitialized: true, 
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        collectionName: "sessions",
        ttl: 7 * 24 * 60 * 60, // 7 days
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
    }
};


app.set("trust proxy", 1);


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


main()
.then((res)=>{
    console.log(res);
    console.log("working db");
})
.catch((e)=>{
    console.log(e);
    console.log("db error");
})

async function main() {
    await mongoose.connect(dburl);
}

main();



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});