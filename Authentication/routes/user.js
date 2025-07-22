const express = require('express');
const router = express.Router();
const {handleUserSignup, handleUserLogin} = require('../controller/user')

router.post('/', handleUserSignup)
router.post('/login',handleUserLogin )
router.get('/demo', (req, res) =>{
    return res.send("This is a demo route for user signup and login");
})

module.exports = router;