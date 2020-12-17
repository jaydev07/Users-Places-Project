const express = require('express');
const router = express.Router();
const {check} = require('express-validator');

const userControllers = require('../controllers/user-controllers');

router.get('/',userControllers.getUsers);

router.post('/signup',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min:5})
    ],
    userControllers.signUp);

router.post('/login',userControllers.logIn);

module.exports = router;