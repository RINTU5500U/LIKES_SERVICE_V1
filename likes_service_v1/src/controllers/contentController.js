const contentModel = require('../models/contentModel')
const likeModel = require('../models/likeModel')
const smsController = require('./smsController')


module.exports = {
    createContent : async (req, res) => {
        try {
            req.body['userId'] = req.params.userId
            let saveData = await contentModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Content created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },
    updateContent : async (req, res) => {
        try {
            let {userId, contentId} = req.params
            let data = req.body
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            req.body['updatedAt'] = new Date().toLocaleString()
            let saveData = await contentModel.findOneAndUpdate({userId: userId, _id: contentId, isDeleted: false},req.body,{new: true})
            if (!saveData) {
                return res.status(404).send({ status: false, msg: 'Content not found' })
            }
            return res.status(200).send({ status: true, msg: "Content updated successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },
    deleteContent : async (req, res) => {
        try {
            let {userId, contentId} = req.params
            let deleteData = await contentModel.findOneAndUpdate({userId: userId, _id: contentId, isDeleted: false}, {isDeleted: true, deletedAt: new Date().toLocaleString()})
            if (!deleteData) {
                return res.status(404).send({ status: false, msg: 'Content not found' })
            }
            return res.status(200).send({ status: true, msg: "Content deleted successfully" })    // use softdelete here
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },
    likeContent : async (req, res) => {
        try {
            let {userId, contentId} = req.params
            let findContent = await contentModel.findOne({_id: contentId, isDeleted: false}).populate('userId')
            if (!findContent) {
                return res.status(404).send({ status: false, msg: 'Content not found' })
            }
            await likeModel.findOneAndUpdate({userId: userId, contentId: contentId}, req.body, {upsert: true})
            console.log(findContent.userId.phone)
            if (req.body.isLike == true) {
                let likeCount =  await contentModel.findByIdAndUpdate(contentId, { $inc: { likes: +1 } }, {new: true})
                console.log(likeCount.likes)
                if (likeCount.likes == 100) {
                    smsController.sendSMS(findContent.userId.phone)
                    .then(() => {
                        return res.status(200).send({ status: true,  msg : 'completed 100 likes'})
                    }).catch((err) => {
                        return res.status(400).send({ status: false,  error : err})
                    })
                } else {
                    return res.status(200).send({ status: true, msg: 'liked' })
                }
            } else if (req.body.isLike == false) {
                await contentModel.findByIdAndUpdate(contentId, { $inc: { likes: -1 } })
                return res.status(200).send({ status: true, msg: 'disliked' })
            }
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }
}