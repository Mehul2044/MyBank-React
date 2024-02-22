const {getAuth} = require("firebase-admin/auth");
const {admin} = require("../config/firebase-admin-config");

const {Router} = require("express");
const router = Router();

const {
    accountCollection,
    transactionCollection,
    loanRequestCollection,
    accountOpenRequests, activityTrackCollection
} = require("../config/mongodb");


async function verifyToken(adminToken) {
    try {
        const auth = getAuth(admin);
        await auth.verifyIdToken(adminToken);
        return true;
    } catch (error) {
        return false;
    }
}

router.post("/getTransactions", async function (req, res) {
    const adminToken = req.body.adminToken;
    const isAdmin = await verifyToken(adminToken);
    if (isAdmin) {
        const transactions = await transactionCollection.find({});
        return res.send({body: transactions});
    } else {
        return res.send(false);
    }
});

router.post("/getCustomerList", async function (req, res) {
    const adminToken = req.body.adminToken;
    const isAdmin = await verifyToken(adminToken);
    if (isAdmin) {
        const users = await accountOpenRequests.find({status: "Accepted"});
        for (let user of users) {
            const account = await accountCollection.findOne({phone: user.phone});
            if (account) {
                const userObj = user.toObject();
                userObj.accountId = account._id;
                users[users.indexOf(user)] = userObj;
            }
        }
        return res.send({body: users});
    } else {
        return res.send(false);
    }
});

router.post("/getLogs", async function (req, res) {
    const adminToken = req.body.adminToken;
    const isAdmin = await verifyToken(adminToken);
    if (isAdmin) {
        const records = await activityTrackCollection.find({});
        return res.send({body: records});
    } else {
        return res.send(false);
    }
});

router.post("/viewLoan", async function (req, res) {
    const adminToken = req.body.adminToken;
    const isAdmin = await verifyToken(adminToken);
    if (isAdmin) {
        const records = await loanRequestCollection.find({status: "Accepted"});
        return res.send({body: records});
    } else {
        return res.send(false);
    }
});

module.exports = router;