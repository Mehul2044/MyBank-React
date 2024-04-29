const {getAuth} = require("firebase-admin/auth");
const {admin} = require("../config/firebase-admin-config");
const {redisClient} = require("../app");

const {Router} = require("express");
const router = Router();

const {
    accountCollection,
    transactionCollection,
    loanRequestCollection,
    accountOpenRequests, activityTrackCollection
} = require("../config/mongodb");


async function verifyToken(req, res, next) {
    try {
        const userToken = req.header("adminToken");
        const isVerified = redisClient.get(userToken.toString());
        if (isVerified) {
            return next();
        } else {
            const auth = getAuth(admin);
            await auth.verifyIdToken(userToken);
            await redisClient.set(userToken.toString(), "true");
            next();
        }
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }
}

router.use(verifyToken);

router.get("/getTransactions", async function (req, res) {
    const transactions = await transactionCollection.find({});
    return res.send({body: transactions});
});

router.get("/getCustomerList", async function (req, res) {
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
});

router.get("/getLogs", async function (req, res) {
    const records = await activityTrackCollection.find({});
    return res.send({body: records});
});

router.get("/viewLoan", async function (req, res) {
    const records = await loanRequestCollection.find({status: "Accepted"});
    return res.send({body: records});
});

module.exports = router;