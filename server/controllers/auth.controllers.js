const User = require('./../models/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const saltRounds = 10

const signupUser = (req, res, next) => {

    const { email, password, name } = req.body

    if (email === '' || password === '' || name === '') {
        res.status(400).json({ message: "Provide email, password and name" })
        return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide a valid email address.' })
        return
    }

    if (password.length < 3) {
        res.status(400).json({ message: 'Password too short.' })
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (user) {
                res.status(400).json({ message: "User already exists." })
                return
            }

            const salt = bcrypt.genSaltSync(saltRounds)
            const hashedPassword = bcrypt.hashSync(password, salt)

            return User.create({ username, email, password: hashedPassword })
        })
        .then(newUser => res.status(201).json(newUser))
        .catch(err => next(err))
}

const loginUser = (req, res, next) => {

    const { email, password } = req.body

    if (email === '' || password === '') {
        next(new Error("Provide email and password."))
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.status(401).json({ message: "User not found." })
                return
            }

            const isCorrectPwd = bcrypt.compareSync(password, user.password)

            if (!isCorrectPwd) {
                res.status(401).json({ message: "Unable to authenticate the user" });
                return
            }

            const { _id, email, username } = user
            const payload = { _id, email, username }

            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: "6h" }
            )

            res.json({ authToken })
        })
}

const verifyUser = (req, res, next) => {
    res.json({ loggedUserData: req.payload })
}


module.exports = {
    signupUser,
    loginUser,
    verifyUser
}