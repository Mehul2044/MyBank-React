const {Router} = require("express");
const router = Router();

const {staffLoginCollection} = require("../config/mongodb");

router.post("/login", async function (req, res) {
    const id = req.body.id;
    const password = req.body.password;
    const user = await staffLoginCollection.findOne({UID: id});
    if (!user) return res.send(false);
    else {
        if (password === user.password) {
            return res.send(user.UID);
        }else {
            return res.send(false);
        }
    }
});

module.exports = router;