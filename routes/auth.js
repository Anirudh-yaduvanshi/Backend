const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchsuer');

//Route 1: createing user using : POST "/api/auth/createuser" doesnt require login

router.post('/createuser', [
    body('name', "Enter a valid Name").isLength({ min: 3 }),
    body('email', "Enter a valid E-mail").isEmail(),
    body('password', "password must be atleast 6 characters").isLength({ min: 6 })
], async (req, res) => {
    let success = false;

    //error handling if user entere wrong details
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }


    try {

        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ success ,errors: [{ msg: 'User already exists' }] });  // user already exists, return error message 400
        }
        const salt = await bcrypt.genSalt(10); // salt must be atleast 10 characters  long
        const secpass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secpass
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const JWT_SECRET = process.env.JWT_SECRET || '711690fe833af9af90b4484070ce4f11792dd9c7478eb4dde938e1fdf09f7763fd4b492ead3e4749f80e619abcc142390b0f1618b960372319f743451ce3cb2574401379b2fae0406550971554ccf67a5a0d226be26c96301c3ab8554e6f6c54df6803a06326041d8cd2fb7d6f629cb72fc884526ddc353ddec6952d893e65f25730cb4e7b2ce16630d9ed8d284104d75c7098769b3f8bde14de961bd03231fa3db14589fc48d893851c71ce519e727bb015bd73f34a92597cab18d11fa07fa78c42b9a9feb7ad7f1a2079d042b7e6c2f225ea468f8f38d0afedd6c8501e54fa91318801acfdb7b4f78a0a0130af4596c11bc108407c7306d8c47e3cdaccabaa';

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({
            success: true,
            authtoken: authtoken,
            msg: 'User created successfully'
        });  // user created successfully, return success message 200




    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error occur please after some time');  // server error, return error message 500
    }
});



// Route 2:  authecating  user using : POST"/api/auth/login"  doesnt require login

router.post('/login', [
    body('email', "Enter a valid E-mail").isEmail(),
    body('password', "password can't be blankk").exists(),


], async (req, res) => {
    let success = false; 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({success, errors: [{ msg: 'please try again with valid details ' }] })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({success, errors: [{ msg: 'please try again with valid details ' }] })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const JWT_SECRET = process.env.JWT_SECRET || '711690fe833af9af90b4484070ce4f11792dd9c7478eb4dde938e1fdf09f7763fd4b492ead3e4749f80e619abcc142390b0f1618b960372319f743451ce3cb2574401379b2fae0406550971554ccf67a5a0d226be26c96301c3ab8554e6f6c54df6803a06326041d8cd2fb7d6f629cb72fc884526ddc353ddec6952d893e65f25730cb4e7b2ce16630d9ed8d284104d75c7098769b3f8bde14de961bd03231fa3db14589fc48d893851c71ce519e727bb015bd73f34a92597cab18d11fa07fa78c42b9a9feb7ad7f1a2079d042b7e6c2f225ea468f8f38d0afedd6c8501e54fa91318801acfdb7b4f78a0a0130af4596c11bc108407c7306d8c47e3cdaccabaa';

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({
            success: true,
            authtoken: authtoken,
            msg: 'User logged in successfully'
        });  // user logged in successfully, return success message 200
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error occur please after some time');  // server error, return error message 500
    }



})
// Route 3: getting logged in use details  POST:"/api/auth/getuser"      login required
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error occurred. Please try again later.');
    }
});
module.exports = router;