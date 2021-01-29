var express = require("express");
var app = express();
app.use(express.json());
    // CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
app.use("/", express.static(__dirname + "/"));
const https = require("https");
const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://mm3299:Password123@cluster0.lkvin.mongodb.net/cw2individual?retryWrites=true&w=majority";
const client = new MongoClient(url);
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const ObjectID = require("mongodb").ObjectID;
let db;
MongoClient.connect(url, (err, client) => {
  db = client.db("cw2individual");
});
app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  return next();
});
let arrayOfClasses = [];
app.get("/collection/:collectionName", (request, response) => {
  request.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.send(results);
  });
});
app.put("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.updateMany(
    { _id: new ObjectID(req.params.id) },
    { $set: req.body },
    { safe: true, multi: false },
    (e, result) => {
      if (e) return next(e);
      res.send(result.result.n === 1 ? { msg: "success" } : { msg: "error" });
    }
  );
});

app.post("/collection/:collectionName", (request, response, next) => {
  request.collection.insertMany(request.body, (e, results) => {
    console.log(request.body)

    if (e) return next(e);

    response.send(results.ops);
  });

});
//start the server
app.listen(process.env.PORT || 5000); //heroku automatically assigns a port, 5000 alone will cause an timeout

console.log("Server running at: http://localhost:5000");

