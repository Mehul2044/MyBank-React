const {Router} = require("express");
const {
    accountCollection,
    accountOpenRequests,
    balanceCollection,
    transactionCollection,
    loanRequestCollection, deleteAccountCollection, queriesCollection, activityTrackCollection
} = require("../config/mongodb");
const router = Router();
const {admin} = require("../config/firebase-admin-config");
const {getAuth} = require("firebase-admin/auth");

async function getAccountNumber(userToken) {
    try {
        const auth = getAuth(admin);
        const decodeToken = await auth.verifyIdToken(userToken);
        const uid = decodeToken.uid;
        const user = await auth.getUser(uid);
        const phoneNumber = user.phoneNumber.slice(3);
        const mainUser = await accountCollection.findOne({
            phone: phoneNumber
        });
        return mainUser._id;
    } catch (error) {
        console.log(error);
        return false;
    }
}

router.post("/trackLogin", async function(req, res) {
   await activityTrackCollection.create({
       accountNumber: req.body.accountNumber,
       date: new Date().toLocaleString().slice(0, 9).replace('T', ' '),
       time: new Date().toLocaleString().slice(11, 19).replace('T', ' ')
   });
   return res.send(true);
});

router.post("/getName", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const accountNumber = await getAccountNumber(userToken);
        const user = await accountCollection.findOne({
            _id: accountNumber
        });
        return res.send({name: user.firstName});
    } catch (error) {
        return res.sendStatus(404);
    }

});

router.post("/login", async function (req, res) {
    const accountNumber = req.body.accountNumber;
    const password = req.body.password;
    const user = await accountCollection.findOne({
        _id: accountNumber
    });
    if (!user) return res.send(false);
    else {
        if (password === user.password) {
            return res.send(user.phone);
        } else {
            return res.send(false);
        }
    }
});

router.post("/register", async function (req, res) {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const fileUrl = req.body.fileUrl;
        let user = await accountCollection.findOne({
            phone: phoneNumber
        });
        if (user) return res.send(false);
        const newRequest = new accountOpenRequests({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phoneNumber,
            formPath: fileUrl,
            status: "Pending",
            password: "NewAccount@123",
        });
        const savedRequest = await newRequest.save();
        res.send(savedRequest._id);
    } catch (error) {
        res.send(false);
    }
});

router.post("/trackRequest", async function (req, res) {
    try {
        const trackingId = req.body.trackingId;
        let request = await accountOpenRequests.findOne({_id: trackingId});
        if (request) {
            return res.send({status: `Your account status is: ${request.status}`});
        }
        return res.send({status: "Tracking Id doesn't match with any account!"});
    } catch (error) {
        return res.send({status: "Error Occurred"});
    }
});

router.post("/accountInfo", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const accountNumber = await getAccountNumber(userToken);
        let user = await accountCollection.findOne({
            _id: accountNumber
        });
        const balanceDoc = await balanceCollection.findOne({accountNumber: accountNumber});
        const balance = balanceDoc.balance;
        const transactions = await transactionCollection.find({
            $or: [{sender_acc_no: accountNumber}, {recipient: accountNumber}],
        });
        let transactions_length = transactions.length;
        let amount = [];
        let to_from = [];
        let date = [];
        let time = [];
        for (let i = 0; i < transactions_length; i++) {
            if (accountNumber.toString() === transactions[i].sender_acc_no.toString() && accountNumber.toString() === transactions[i].recipient){
                amount.push("+" + transactions[i].amount.toString());
                to_from.push("Self Credit");
            }
            else if (accountNumber.toString() === transactions[i].sender_acc_no.toString()) {
                amount.push("-" + transactions[i].amount.toString());
                to_from.push(transactions[i].recipient.toString());
            } else if (accountNumber.toString() === transactions[i].recipient) {
                amount.push("+" + transactions[i].amount.toString());
                to_from.push(transactions[i].sender_acc_no.toString());
            }
            date.push(transactions[i].date);
            time.push(transactions[i].time);
        }
        return res.send({
            accountNumber: accountNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            balance: balance,
            transactions_length: transactions_length,
            amount: amount,
            toFrom: to_from,
            date: date,
            time: time,
        });
    } catch (error) {
        console.log(error);
        return false;
    }
});

router.post("/submitQuery", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const title = req.body.title;
        const message = req.body.message;
        const accountNumber = await getAccountNumber(userToken);
        let user = await accountCollection.findOne({_id: accountNumber});
        const response = await queriesCollection.create({
            name: user.firstName + " " + user.lastName,
            phone: Number(user.phone),
            acc_no: accountNumber,
            title: title,
            message: message,
            status: "Pending",
            response: "Pending"
        });
        return res.send(response._id);
    } catch (error) {
        console.log(error);
        return res.send(false);
    }
});

router.post("/getQueryStatus", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const queryId = req.body.queryId;
        const accountNumber = await getAccountNumber(userToken);
        if (accountNumber) {
            const query = await queriesCollection.findOne({_id: queryId});
            if (query) {
                return res.send({body: `Your query status is: ${query.status}. Additional message from the staff: ${query.response}`});
            } else {
                return res.send({body: "No query found!"});
            }
        } else {
            return res.send({body: "You are not logged in!"});
        }
    } catch (error) {

    }
});

router.post("/profileDetails", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const accountNumber = await getAccountNumber(userToken);
        let user = await accountCollection.findOne({
            _id: accountNumber
        });
        return res.send({firstName: user.firstName, lastName: user.lastName, email: user.eMail, phone: user.phone});
    } catch (error) {
        return false;
    }
});

router.post("/changePassword", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const accountNumber = await getAccountNumber(userToken);
        let user = await accountCollection.findOne({
            _id: accountNumber
        });
        if (oldPassword !== user.password) return res.send({message: "Old password is incorrect!"});
        await accountCollection.updateOne({_id: accountNumber}, {password: newPassword});
        res.send({message: "Password updated successfully!"});
    } catch (error) {
        return res.send({message: "Error Occurred!"});
    }
});

router.post("/transfer", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const accountNumber = req.body.accountNumber;
        const password = req.body.password;
        const amount = Number(req.body.amount);
        const senderAccount = await getAccountNumber(userToken);
        let user = await accountCollection.findOne({
            _id: senderAccount
        });
        if (user.password !== password) return res.send({message: "Password Incorrect!"});
        const sender_balance_doc = await balanceCollection.findOne({
            accountNumber: user._id
        });
        const senderBalance = sender_balance_doc.balance;
        if (senderBalance < amount) {
            return res.send({message: "Balance Insufficient"});
        } else {
            await balanceCollection.updateOne({accountNumber: accountNumber}, {$inc: {balance: amount}});
            await balanceCollection.updateOne({accountNumber: user._id}, {$inc: {balance: -amount}});
            await transactionCollection.create({
                sender_acc_no: user._id,
                amount: amount,
                recipient: accountNumber,
                date: new Date().toLocaleString().slice(0, 9).replace('T', ' '),
                time: new Date().toLocaleString().slice(11, 19).replace('T', ' ')
            });
        }
        return res.send({message: "Transaction Complete"});
    } catch (error) {
        return res.send({message: "Error Occurred!"});
    }
});

router.post("/getLoanDetails", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const accountNumber = await getAccountNumber(userToken);
        const loans = await loanRequestCollection.find({
            acc_no: accountNumber
        });
        let amount = [];
        let status = [];
        let loan_type = [];
        let loan_length = loans.length;
        for (let i = 0; i < loan_length; i++) {
            amount.push(loans[i].loan_amount.toString());
            status.push(loans[i].status.toString());
            loan_type.push(loans[i].loan_type.toString());
        }
        return res.send({loanType: loan_type, amount: amount, loanStatus: status});
    } catch (error) {
        console.log(error);
    }
});

router.post("/applyLoan", async function (req, res) {
    try {
        let userToken = req.body.userToken;
        let loanAmount = req.body.loanAmount;
        let loanType = req.body.loanType;
        let reason = req.body.reason;
        const accountNumber = await getAccountNumber(userToken);
        await loanRequestCollection.create({
            acc_no: accountNumber,
            loan_amount: loanAmount,
            loan_type: loanType,
            reason: reason,
            status: "Pending",
        });
        return res.send({message: "Request Sent Successfully!"});
    } catch (error) {
        console.log(error);
        return res.send({message: "Some Error Occurred!"});
    }
});

module.exports = router;