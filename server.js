require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.port;
const connectDB = require("./db/db");
const Register = require("./db/register.data");
const path = require("path")
const staticpath = path.join(__dirname, "./public");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static(staticpath));
app.use(express.urlencoded({
    extended: false
}));


app.get("/", (req, res) => {
    res.status(201).render("index");
})

app.get("/register", (req, res) => {
    res.status(201).render("register");
})

app.post("/register", async (req, res) => {
    try {
        const email = req.body.email;
        const userFind = await Register.findOne({ email: email });
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        // console.log(password, " = ", cpassword)


        if (password === cpassword) {
            if (!userFind) {
                const newEmployee = new Register({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    cpassword: req.body.cpassword
                })
                const response = await newEmployee.save();
                console.log(response);
                res.status(201).render("employer", { tasks: [] });
            } else {
                res.status(201).json({ msg: "Invalid Details." });
            }
        } else {
            res.status(201).json({ msg: "Invalid Details" });
        }

    } catch (error) {
        console.log(error);
    }
})

app.get("/login", (req, res) => {
    res.status(201).render("login");
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userFind = await Register.findOne({ email: email });

        if (userFind) {
            if (userFind.isAdmin === true) {
                const adminData = await Register.find({});

                res.render("admin", {
                    employers: adminData
                });
            } else {

                res.status(201).render("employer", {
                    tasks: userFind.tasks || []
                });
            }
        } else {
            res.status(201).json({ msg: "Invalid Details" });
        }
    } catch (error) {
        console.log(error);
    }
})

app.post("/", async (req, res) => {
    try {
        const email = req.body.email;
        const task = req.body.task;

        const user = await Register.findOne({ email: email });
        if (user) {
            user.tasks.push(task);
            const response = await user.save();
            console.log(response);
            res.status(201).render("index");
        }
        else {
            res.status(404).json({ msg: "User not found." });
        }
    } catch (error) {
        console.log(error);
    }
})


app.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const editData = await Register.findById({ _id: id });
    // console.log(editData);
    if (editData == null) {
        res.status(201).json({ msg: "Task is not found" });
    } else {
        res.render("edit", {
            employer: editData
        })
    }
})

app.post("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { task, email } = req.body; // Corrected typo here
        const updateData = await Register.findByIdAndUpdate(
            { _id: id },
            { tasks: task, email: email },
            { new: true }
        );
        res.render("admin", { employers: await Register.find({}) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

app.get("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteData = await Register.findByIdAndDelete({ _id: id });
        res.render("admin",{employers: await Register.find({})});
    } catch (error) {
        res.status(500).json({msg:"Internal server error"});
    }
})

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })
})
