const app = require('express')
const { UserInfo, Login ,SignUp } = require('./controller')
const router = app.Router()


router.get('/', UserInfo)
router.post('/login',Login)
router.post('/signup',SignUp)

module.exports=router