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


async function VerifyToken(adminToken) {
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

router.get("/", function (req, res) {
    res.send("Hello Admin");
});

module.exports = router;