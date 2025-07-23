const express = require('express');
const router = express.Router();
const {handleUserSignup, handleUserLogin, handleAttendance, handleAnalytics} = require('../controller/user')

router.post('/signup', handleUserSignup)
router.post('/login',handleUserLogin )
router.post('/attendance', handleAttendance)
router.get('/analytics', handleAnalytics)


module.exports = router;