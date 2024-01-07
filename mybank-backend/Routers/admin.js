const {getAuth} = require("firebase-admin/auth");
const {admin} = require("../config/firebase-admin-config");

const {Router} = require("express");
const router = Router();

const {
    accountCollection,
    adminLoginCollection,
    balanceCollection,
    transactionCollection,
    deleteAccountCollection,
    queriesCollection,
    loanRequestCollection,
    accountOpenRequests
} = require("../config/mongodb");


async function verifyToken(adminToken) {
    try {
        const auth = getAuth(admin);
        const decodeToken = await auth.verifyIdToken(adminToken);
        const uid = decodeToken.uid;
        const user = await auth.getUser(uid);
        return user.email.toLowerCase().includes("admin");
    } catch (error) {
        return false;
    }
}

router.post("/getCustomers", async function (req, res) {
    const adminToken = req.body.adminToken;
    const isAdmin = await verifyToken(adminToken);
    if (isAdmin) {
        const users = await accountCollection.find({});
        return res.send({body: users});
    } else {
        return res.send(false);
    }
});

router.post("/getForms", async function (req, res) {
    const adminToken = req.body.adminToken;
    const isAdmin = await verifyToken(adminToken);
    if (isAdmin) {
        const users = await accountOpenRequests.find({});
        return res.send({body: users});
    } else {
        return res.send(false);
    }
});

router.post("/getQueries", async function (req, res) {
    const adminToken = req.body.adminToken;
    const isAdmin = await verifyToken(adminToken);
    if (isAdmin) {
        const queries = await queriesCollection.find({status: "Pending"});
        return res.send({body: queries});
    } else {
        return res.send(false);
    }
});

router.post("/resolveQuery", async function (req, res) {
    const adminToken = req.body.adminToken;
    const queryId = req.body.queryId;
    const isAdmin = await verifyToken(adminToken);
    if (isAdmin) {
        await queriesCollection.updateOne({_id: queryId}, {$set: {status: "Resolved"}});
        return res.send(true);
    } else {
        return res.send(false);
    }
});

module.exports = router;