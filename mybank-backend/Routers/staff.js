const {Router} = require("express");
const router = Router();

const {staffLoginCollection} = require("../config/mongodb");

const getStaff = async (userId) => {
    const staff = await staffLoginCollection.findOne({UID: userId});
    if (!staff) return false;
    return staff.name;
}

router.post("/login", async function (req, res) {
    const id = req.body.id;
    const password = req.body.password;
    const user = await staffLoginCollection.findOne({UID: id});
    if (!user) return res.send(false);
    else {
        if (password === user.password) {
            return res.send(user.UID);
        } else {
            return res.send(false);
        }
    }
});

router.post("/getName", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        return res.send({name: name});
    }
});

module.exports = router;