const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izmpmp5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    const productCollection = client.db(process.env.DB_NAME).collection("products");
    const orderCollection = client.db(process.env.DB_NAME).collection("orders");
    console.log("database connected");

    app.get("/products", (req, res) => {
        productCollection.find({}).toArray((err, products) => {
            products ? res.send(products) : res.send(err);
        });
    });
    app.get("/orders", (req, res) => {
        console.log(req.query.email);
        orderCollection.find({ email: req.query.email }).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.post("/addProduct", function (req, res) {
        const newProduct = req.body;
        productCollection.insertOne(newProduct).then((result) => res.send(result.insertedCount > 0));
    });

    app.post("/addOrder", (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder).then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    app.delete("/delete/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        productCollection.deleteOne({ _id: id }).then((result) => res.send(result.deletedCount > 0));
    });

    // client.close();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
});
