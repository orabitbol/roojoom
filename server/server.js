const express = require('express');
const app = express();
const cors = require("cors")

app.use(cors())
app.use(express.json())

const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "usersql",
    password: "password",
    database: "roojoom",
});


app.post('/responsestatus', (req, res) => {
    console.log(req.body)
    const serialNumber = req.body.serialNumber
    const indicator1 = req.body.indicator1
    const indicator2 = req.body.indicator2
    const indicator3 = req.body.indicator3

    let status;
    let isAllNumber = true;
    let indicators = [indicator1, indicator2, indicator3]
    const serial = serialNumber.split("-");

    for (let i in serial) {
        if (!isNaN(serial[i]))
            isAllNumber = false;
    }

    const countIndicators = (indicators) => {
        const counts = {};
        indicators.forEach(function (indicator) { counts[indicator] = (counts[indicator] || 0) + 1; });
        return counts;
    }

    const { blinking, off, on } = countIndicators(indicators);

    // If serial number starts with 24-X
    if (serial[0] == "24" && serial[1] == "X") {
        status = "please upgrade your device";
    }
    // 	If serial number stats with 36-X
    else if (serial[0] == "36" && serial[1] == "X") {
        if (off == 3) {
            status = "turn on the device";
        }
        else if (blinking == 2) {
            status = "Please wait";
        }
        else if (on == 3) {
            status = "All is ok";
        }
        else{
            status = "Unknown device";
        }
    }
    // If serial number starts with 51-B
    else if (serial[0] == "51" && serial[1] == "B") {
        if (off == 3) {
            status = "turn on the device";
        }
        else if (blinking >= 1) {
            status = "Please wait";
        }
        else if (on > 1) {
            status = "ALL is ok";
        }
        else{
            status = "Unknown device";
        }
    }
    // 	If serial number is a number  
    else if (!isAllNumber && !serialNumber.includes('.')) {
        status = "Bad serial number";
    }
    else {
        status = "Unknown device";
    }
    res.send(status);
})

app.post("/create", (req, res) => {
    console.log(req.body)
    const userId = req.body.userId
    const serialNumber = req.body.serialNumber
    const problemDes = req.body.problemDes
    const date = req.body.date
    const indicator1 = req.body.indicator1
    const indicator2 = req.body.indicator2
    const indicator3 = req.body.indicator3
    const status = req.body.status;

    db.query('INSERT INTO report (userId, serialNumber, problemDes, date, indicator1, indicator2, indicator3,status ) VALUES (?,?,?,?,?,?,?,?)',
        [userId, serialNumber, problemDes, date, indicator1, indicator2, indicator3, status],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                res.send("Success DB");
            }
        })
})


app.listen(5000, () => {
    console.log("Server running on port 5000")
})
