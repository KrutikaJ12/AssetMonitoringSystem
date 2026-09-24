const express=require('express');
const router= express.Router()
const {getSites,createSite,updateSite} = require("../controllers/siteContoller");
const authenticateToken = require("../middleware/authenticateToken")

router.get(
    '/sites',
    authenticateToken,
    getSites
)
//protected endpoint, you should keep authenticateToken before createSite.
router.post(
    "/sites",
    authenticateToken,
    createSite
)
router.put(
    "/sites/:id",
    authenticateToken,
    updateSite
)
module.exports = router;

