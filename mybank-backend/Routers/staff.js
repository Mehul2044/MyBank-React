const {Router} = require("express");
const router = Router();

const {
    staffLoginCollection,
    queriesCollection,
    balanceCollection,
    transactionCollection, accountOpenRequests, accountCollection
} = require("../config/mongodb");

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

router.post("/getNumberQueries", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        try {
            const count = await queriesCollection.countDocuments({status: "Pending"});
            return res.send({count: count});
        } catch (error) {
            console.error('Error counting documents:', error);
            return res.status(500).send({error: 'Internal Server Error'});
        }
    }
});

router.post("/depositMoney", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send({message: "Error Occurred"});
    } else {
        const accountNumber = req.body.accountNumber;
        const amount = req.body.amount;
        // const method = req.body.method;
        // const comment = req.body.comment;
        await balanceCollection.updateOne({accountNumber: accountNumber}, {$inc: {balance: amount}});
        await transactionCollection.create({
            sender_acc_no: accountNumber,
            amount: amount,
            recipient: accountNumber,
            date: new Date().toLocaleString().slice(0, 9).replace('T', ' '),
            time: new Date().toLocaleString().slice(11, 19).replace('T', ' '),
        });
        return res.send({message: "Transaction Complete"});
    }
});

router.post("/getForms", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        const users = await accountOpenRequests.find({status: "Pending"});
        return res.send({body: users});
    }
});

router.post("/formAccept", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        const form = await accountOpenRequests.findOneAndUpdate(
            {_id: req.body.formId},
            {$set: {status: "Accepted"}},
            {new: true}
        );
        const user = await accountCollection.create({
            eMail: form.email,
            firstName: form.first_name,
            lastName: form.last_name,
            password: "NewAccount@123",
            phone: form.phone,
        });
        await balanceCollection.create({
            accountNumber: user._id,
            balance: 0
        });
        return res.send(true);
    }
});

router.post("/formReject", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        await accountOpenRequests.deleteOne({_id: req.body.formId});
        return res.send(true);
    }
});

router.post("/getQueries", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        const queries = await queriesCollection.find({status: "Pending"});
        return res.send({body: queries});
    }
});

router.post("/sendMessage", async function (req, res) {
    const staffId = req.body.id;
    const queryId = req.body.queryId;
    const response = req.body.response;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        await queriesCollection.updateOne({_id: queryId}, {$set: {response: response}});
        return res.send(true);
    }
});

router.post("/resolveQuery", async function (req, res) {
    const staffId = req.body.id;
    const queryId = req.body.queryId;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        await queriesCollection.updateOne({_id: queryId}, {$set: {status: "Resolved"}});
        return res.send(true);
    }
});

module.exports = router;