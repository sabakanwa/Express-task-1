require('dotenv').config()
const user = require('./model')
const { connect } = require('mongoose')
const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')

const UserInfo = (req, res) => {
    res.send('Welcome')
}

const Login = async (req, res) => {
    const { email, password } = req.body

    try {
        await connect(process.env.MONGO_URL)
        const CheckExistUser = await user.findOne({ email: email })
        if (!CheckExistUser) {
            res.status(404).json({
                message: "User not found!"
            })
        }
        else {
            const decryptPassword = await compare(password, CheckExistUser.password)
            if (email == CheckExistUser.email && decryptPassword) {
                const token = sign(
                    {
                        id: CheckExistUser._id,
                        username: CheckExistUser.username,
                        email: CheckExistUser.email
                    }
                    ,
                    process.env.JWT_SECRET
                )

                res.json({
                    message: "Successfully Login",
                    token: token
                })
            }

            else {
                res.json({
                    message: "invalid Credentials"
                })
            }
        }

    }
    catch (error) {
        res.json({
            message: "Error Alert"
        })
    }
}

const SignUp = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        await connect(process.env.MONGO_URL)
        // console.log("DB connected")

        const CheckExist = await user.exists({ email: email })
        if (CheckExist) {
            res.json({
                message: "User already exist"
            })
        }

        else {
            await user.create({ username, password: await hash(password, 12), email })
            res.status(201).json({
                message: "All Set"
            })
        }


    }
    catch (error) {
        res.json({
            message: "error"
        })
    }

}


module.exports = { UserInfo, Login, SignUp }