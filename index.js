// Required modules 
const express = require("express");
const app = express();
const dblib = require("./dblib.js");

const multer = require("multer");
const upload = multer();

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));

// Setup EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Application folders
app.use(express.static("public"));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
    //res.send("Root resource - Up and running!")
    res.render("index");
});

app.get("/customer", async (req, res) => {
    // Omitted validation check
    const totRecs = await dblib.getTotalRecords();
    //Create an empty product object (To populate form with values)
    const cust = {
        cust_id: "",
        cust_fname: "",
        cust_state: "",
        cust_salesytd: "",
        cust_salesprev: ""
    };
    res.render("customer", {
        type: "get",
        totRecs: totRecs.totRecords,
        cust: cust
    });
});


app.post("/customer", async (req, res) => {
    // Omitted validation check
    //  Can get this from the page rather than using another DB call.
    //  Add it as a hidden form value.
    const totRecs = await dblib.getTotalRecords();
    
    console.log("POST Customer, req.body is:", req.body);

    dblib.findProducts(req.body)
        .then(result => {
            console.log("result from findProducts is:", result);
            res.render("customer", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: result,
                cust: req.body
            })
        })
        .catch(err => {
            res.render("customer", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: `Unexpected Error: ${err.message}`,
                cust: req.body
            });
        });
});

// app.get("/searchajax", async (req, res) => {
//     // Omitted validation check
//     const totRecs = await dblib.getTotalRecords();
//     res.render("searchajax", {
//         totRecs: totRecs.totRecords,
//     });
// });

// app.post("/searchajax", upload.array(), async (req, res) => {
//     dblib.findProducts(req.body)
//         .then(result => res.send(result))
//         .catch(err => res.send({trans: "Error", result: err.message}));

// });