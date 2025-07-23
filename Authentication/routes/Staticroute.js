const express = require('express');
const router = express.Router();
const { getUser } = require('../services/auth');
const { renderHomepageWithAttendance } = require('../controller/user');

router.get('/', async (req, res) => {
    let email = null;
    if (req.cookies && req.cookies.token) {
        try {
            const user = getUser(req.cookies.token);
            email = user.email;
        } catch (e) {
            // Invalid token, ignore
        }
    }
    if (email) {
        await renderHomepageWithAttendance(req, res, email);
    } else {
        res.render('signup.ejs');
    }
});

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

module.exports = router;