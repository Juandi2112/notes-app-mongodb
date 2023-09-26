const usersCtrl = {}

const passport = require("passport")

const User = require("../models/User")

usersCtrl.renderSignUpForm = (req, res) => {
    res.render("users/signup")
}

usersCtrl.signup = async (req, res) => {
    const errors = []
    const { name, email, password, confirm_password } = req.body
    if (password != confirm_password) {
        errors.push({ text: "Passwords do not match" })
    }
    if (password.length < 4) {
        errors.push({ text: "Password must be at least 4 characters" })
    }
    if (errors.length > 0) {
        res.render("users/signup", {
            errors,
            name,
            email
        })
    } else {
        const emailUser = await User.findOne({ email: email })
        if (emailUser) {
            req.flash("error_msg", "Email already in use")
            res.redirect("/users/signup")
        } else {
            const newUser = new User({ name, email, password })
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
            req.flash("success_msg", "You've registered successfully")
            res.redirect("/users/signin")
        }
    }
}

usersCtrl.renderSignInForm = (req, res) => {
    res.render("users/signin")
}

usersCtrl.signin = passport.authenticate("local", {
    failureRedirect: "/users/signin",
    successRedirect: "/notes",
    failureFlash: true
})

usersCtrl.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err) }
        req.flash("success_msg", "You'are logged out successfully")
        res.redirect("/users/signin")
    })
   

}

module.exports = usersCtrl