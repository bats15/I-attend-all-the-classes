const User = require('../model/user')
const {setUser} = require('../services/auth')
const {getUserBranchYearAndFile} = require('../services/userInfo')
const path = require('path')
const fs = require('fs')
const Attendance = require('../model/attendance')
const { getUser } = require('../services/auth')

function getTodaysClasses(email) {
    const userInfo = getUserBranchYearAndFile(email);
    if (!userInfo) return { branch: null, year: null, todaysClasses: [] };
    const schedulePath = path.resolve(__dirname, '../../data', userInfo.jsonFile);
    if (!fs.existsSync(schedulePath)) return { branch: userInfo.branch, year: userInfo.year, todaysClasses: [] };
    const schedule = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'));
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[today.getDay()];
    const todaysClasses = schedule[todayName] || [];
    return { branch: userInfo.branch, year: userInfo.year, todaysClasses };
}

async function renderHomepageWithAttendance(req, res, email) {
    const { branch, year, todaysClasses } = getTodaysClasses(email);
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let classStatus = [];
    for (const className of todaysClasses) {
        const alreadyFilled = await Attendance.exists({
            studentEmail: email,
            className,
            date: dateOnly
        });
        classStatus.push({ className, alreadyFilled });
    }
    res.render('homepage.ejs', { branch, year, classStatus });
}

async function handleUserSignup(req, res){
    const body = req.body;
    await User.create({
        name: body.name,
        email: body.email,
        password: body.password
    });
    return res.render('login.ejs');
}

async function handleUserLogin(req, res){
     const {email, password} = req.body;
     const user = await User.findOne({email,password})
     if(!user){
         return res.render("login.ejs", {error: "Invalid email or password"} )
     }
     const token = setUser(user);
     res.cookie( "token", token);
     await renderHomepageWithAttendance(req, res, email);
}

async function handleAttendance(req, res) {
    const { classNames, attended } = req.body;
    console.log('Attendance submission:', { classNames, attended });
    // Defensive: if nothing to process, just redirect
    if (!classNames || !attended) {
        return res.redirect('/');
    }
    // Get user email from JWT token in cookies
    let studentEmail = null;
    if (req.cookies && req.cookies.token) {
        try {
            const user = getUser(req.cookies.token);
            studentEmail = user.email;
        } catch (e) {
            return res.status(401).send('Invalid or expired token. Please log in again.');
        }
    } else {
        return res.status(401).send('Not authenticated. Please log in.');
    }
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // Ensure classNames is always an array
    const classList = Array.isArray(classNames) ? classNames : [classNames];
    for (const className of classList) {
        // Only process if not already filled
        const alreadyFilled = await Attendance.exists({
            studentEmail,
            className,
            date: dateOnly
        });
        if (alreadyFilled) {
            continue;
        }
        const status = attended[className];
        await Attendance.create({
            studentEmail,
            className,
            date: dateOnly,
            attended: status === 'yes'
        });
    }
    res.redirect('/');
}

async function handleAnalytics(req, res) {
    // Get user email from JWT token in cookies
    let studentEmail = null;
    if (req.cookies && req.cookies.token) {
        try {
            const user = getUser(req.cookies.token);
            studentEmail = user.email;
        } catch (e) {
            return res.status(401).send('Invalid or expired token. Please log in again.');
        }
    } else {
        return res.status(401).send('Not authenticated. Please log in.');
    }
    // Get user branch/year and schedule
    const { branch, year, jsonFile } = getUserBranchYearAndFile(studentEmail) || {};
    if (!jsonFile) return res.send('Could not determine your branch/year.');
    const schedulePath = path.resolve(__dirname, '../../data', jsonFile);
    if (!fs.existsSync(schedulePath)) return res.send('No schedule found for your branch/year.');
    // Get attendance records for this user
    const attendanceRecords = await Attendance.find({ studentEmail });
    // For each subject, count total days asked (attendance records), attended days, and percentage
    let subjectStats = {};
    for (const record of attendanceRecords) {
        const subj = record.className;
        if (!subjectStats[subj]) subjectStats[subj] = { total: 0, attended: 0 };
        subjectStats[subj].total++;
        if (record.attended) subjectStats[subj].attended++;
    }
    // Calculate percentage
    for (const subj in subjectStats) {
        const s = subjectStats[subj];
        s.percentage = s.total > 0 ? ((s.attended / s.total) * 100).toFixed(1) : 'N/A';
    }
    res.render('analytics.ejs', { branch, year, subjectStats });
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleAttendance,
    handleAnalytics,
    renderHomepageWithAttendance
}