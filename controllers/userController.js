const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)

        const token = createToken(user._id)
        
        res.set('Access-Control-Allow-Origin', '*')
        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//signup user
const signupUser = async (req, res) => {
    const { email, password } = req.body

    let errorFields = []

    try {
        const user = await User.signup(email, password)

        //create a token
        const token = createToken(user._id)

        res.set('Access-Control-Allow-Origin', '*')
        res.status(200).json({ email, token })
    } catch (error) {
        if (error.message.includes('All')) errorFields.push('email', 'password')
        if (error.message.includes('Email')) errorFields.push('email')
        if (error.message.includes('Password')) errorFields.push('password')
        res.status(400).json({ error: error.message, errorFields })
    }
}

module.exports = { signupUser, loginUser }