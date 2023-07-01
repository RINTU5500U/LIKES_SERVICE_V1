const contentModel = require('../models/contentModel')
const likeModel = require('../models/likeModel')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('api_key');

// here i can't use any type of key because sendgrid only support the office like emailId..

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
            console.log(findContent.userId.email)
            if (req.body.isLike == true) {
                let like =  await contentModel.findByIdAndUpdate(contentId, { $inc: { likes: +1 } }, {new: true})
                console.log(like.likes)
                if (like.likes >= 100) {
                    const msg = {
                        to: findContent.userId.email,  // recipient's email address
                        from: 'crowdrintu1@gmail.com',  // your email address
                        subject: 'BIG ACHIEVEMENT',
                        text: 'Congrats for your 1st 100likes on this content',
                        html: '<p>Congrats for your 1st 100likes on this content</p>'
                      };
                      
                      sgMail.send(msg).then(() => {
                            return res.status(200).send({ status: true, msg: 'Msg sent successfully' })
                        }).catch((error) => {
                            return res.status(400).send({ status: false, msg: `Error is ${error}` })
                        });
                }
                return res.status(200).send({ status: false, msg: 'liked' })
            } else if (req.body.isLike == false) {
                await contentModel.findByIdAndUpdate(contentId, { $inc: { likes: -1 } })
                return res.status(200).send({ status: true, msg: 'disliked' })
            }
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }
}