require("dotenv").config()
const path = require('path');
const fs = require("fs");

const redis = require("redis");
let redisClient;
(async () => {
    redisClient = redis.createClient({url: process.env.REDIS_URL});
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    redisClient.on("connect", () => console.log("Redis connected"));
    await redisClient.connect();
})();
module.exports = {redisClient};

const relativePath = 'mybank-react-firebase-adminsdk-3ctvu-0629e6443c.json';
const absolutePath = path.resolve(__dirname, relativePath);
process.env.GOOGLE_APPLICATION_CREDENTIALS = absolutePath;

const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./Routers/user");
const adminRoutes = require("./Routers/admin");
const staffRoutes = require("./Routers/staff");

const mongooseModule = require("./config/mongodb");

const PORT = process.env.PORT || 3001;

const logDirectory = path.join(__dirname, "log");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(path.join(logDirectory, "logfile.log"), {flags: "a"});
app.use(morgan("combined", {stream: accessLogStream}));

app.use(cors({origin: ["http://localhost:3000", "https://my-bank-react.vercel.app"]}));
app.use(express.json());

app.get("/", function (req, res) {
    res.send({message: "Welcome to MyBank!"});
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/staff", staffRoutes);

app.get("*", function (req, res) {
    res.send({message: "No valid request point!"});
});

app.listen(PORT, function () {
    mongooseModule.connect();
    console.log(`Server is running on port ${PORT}`);
});
