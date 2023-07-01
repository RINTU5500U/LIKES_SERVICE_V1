const express = require("express")
const router = express.Router()

const {createUser, login, updateUser} = require('../controllers/userController')
const {createContent, updateContent, deleteContent, likeContent} = require('../controllers/contentController')
const {authentication, authorization} = require('../middlewares/auth')
const {userValidation, loginValidation, updateUserValidation, contentValidation} = require('../middlewares/validatorMware')

router.post('/createUser', userValidation, createUser)
router.post('/login', loginValidation, login)
router.put('/updateUser/:userId', updateUserValidation, authentication, authorization, updateUser)

router.post('/createContent/:userId', authentication, contentValidation, createContent)
router.put('/user/:userId/updateContent/:contentId', authentication, authorization, updateContent)
router.delete('/user/:userId/deleteContent/:contentId', authentication, authorization, deleteContent)
router.post('/user/:userId/likeContent/:contentId', authentication, likeContent)


router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router