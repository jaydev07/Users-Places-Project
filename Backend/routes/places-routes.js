const express =  require('express');
const router = express.Router();
const { check } = require('express-validator');

const placeControllers = require('../controllers/places-controllers');
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

router.get("/user/:uid",placeControllers.getElementByUserId);

router.get("/:pid",placeControllers.getElementByPlaceId);

// Below routes should be authenticated by the token
router.use(checkAuth);

// To create New Places
router.post("/",
    fileUpload.single('image'),
    //Now this line of codes will be executed left to right
    //Checks the input(req.body)
    //But RESULTS are given in the function
    [
        check('title').not().isEmpty(),
        check('description').isLength({min:5}),
        check('address').not().isEmpty()
    ],
    placeControllers.createPlaces);

// Used to update Places
router.patch("/:pid",
    [
        check('title').not().isEmpty(),
        check('description').isLength({min:5})
    ],
    placeControllers.updatePlace);

router.delete("/:pid",placeControllers.deletePlace);

module.exports = router;