const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

router.get("/login", (req, res) => {
    res.render("login.hbs");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) return res.send("Please fill all the fields");

    const user  = await User.findOne({ email });
    if(!user) return res.send("Invalid Username or Password");

    //user type
    const userType = user.role;

    //check bcrypt password
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) return res.send("Invalid Username or Password");

    //create and assign a token
    const token = jsonwebtoken.sign({ _id: user._id }, "someSecretKey");
    //send in cookie
    res.cookie("authToken", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }).redirect("/");
});

router.get("/register", (req, res) => {
    res.render("register.hbs");
});

router.post("/register", (req, res) => {
    const { name, email, password, phone } = req.body;

    if(!name || !email || !password || !phone) return res.send("Please fill all the fields");

    //bcrypt password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
        name,
        email,
        phone,
        "password": hashedPassword,
    });

    user.save( (err, user) => {
        if(err) {
            console.log(err);
            return res.send("Something went wrong");
        }
        res.send("User registered successfully");
    });
});

router.get("/logout", (req, res) => {
    res.clearCookie("authToken").redirect("/");
});

module.exports = router;
