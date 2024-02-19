const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./Routers/user");
const adminRoutes = require("./Routers/admin");
const staffRoutes = require("./Routers/staff");

const mongooseModule = require("./config/mongodb");

const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/staff", staffRoutes);

app.get("*", function (req, res) {
   res.send({message: "No valid request point!"});
});

app.listen(PORT, function () {
    mongooseModule.connect();
    console.log(`Server is running on port ${PORT}\nUse http://localhost:${PORT} to access the server.`);
});