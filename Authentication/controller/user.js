const User = require('../model/user')
const {setUser} = require('../services/auth')
async function handleUserSignup(req, res){

    const body = req.body;

    await User.create({
        name: body.name,
        email: body.email,
        password: body.password
    });
    return res.render("homepage.ejs")
}

async function handleUserLogin(req, res){

     const {email, password} = req.body;
     const user = await User.findOne({email,password})
     if(!user){
         return res.render("login.ejs", {error: "Invalid email or password"} )
     }
     const token = setUser(user);
     res.cookie( "token", token);
     return res.redirect('/')
}
 

module.exports = {
    handleUserSignup,
    handleUserLogin
}