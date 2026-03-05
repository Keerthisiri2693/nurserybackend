const express = require("express");
const router = express.Router();

const {
createProfile,
getProfile,
updateProfile
} = require("../controllers/customerprofileController");

router.post("/create",createProfile);
router.get("/get",getProfile);
router.put("/update",updateProfile);

module.exports = router;