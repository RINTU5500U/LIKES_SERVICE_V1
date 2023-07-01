const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

module.exports = {
    createUser : async (req, res) => {
        try {
            let {phone, email} = req.body
            let uniquePhone = await userModel.findOne({phone: phone })
            if (uniquePhone) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            let uniqueEmail = await userModel.findOne({email: email })
            if (uniqueEmail) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }
            let saveData = await userModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    login : async (req, res) => {
        try {
            let { email, password } = req.body
            let findUser = await userModel.findOne({ email: email, password: password });
            if (!findUser) {
                return res.status(404).send({ status: false, message: "emailId or password is incorrect" })
            }
            let token = jwt.sign({ userId: findUser._id }, "Secret-key")        
            res.setHeader("token", token)
            return res.status(200).send({ Message: "LoggedIn successfully", Token: token })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    updateUser : async (req, res) => {
        try {
            let userId = req.params.userId
            let data = req.body
            let {phone, email} = data
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            let uniquePhone = await userModel.findOne({phone: phone })
            if (uniquePhone) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            let uniqueEmail = await userModel.findOne({email: email })
            if (uniqueEmail) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }
     
            data['updatedAt'] = new Date().toLocaleString()
            let updateData = await userModel.findByIdAndUpdate(userId,data,{new: true})
            if (!updateData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(200).send({ status: false, Data: updateData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}