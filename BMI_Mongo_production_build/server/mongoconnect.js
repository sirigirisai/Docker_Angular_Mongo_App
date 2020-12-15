var mongoClient = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

//configure middleware

var app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With , Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

//create API requests
var url = "mongodb://127.0.0.1:27017/restapi";
app.get('/getdata', (req, res)=>{
    mongoClient.connect(url, (err, db)=>{
        if(!err){
            var dbo = db.db("restapi");
            dbo.collection("persons").find({}).toArray((err, documents)=>{
                if(!err){
                    res.send(documents)
                }
                else{
                    res.send(err)
                }
            })
        }
    });
})


//insert 
app.post("/addperson", (req, res)=>{
    mongoClient.connect(url, (err, db)=>{
        if(!err){
            var dbo = db.db("restapi");
            var data = {
                NAME: req.body.NAME,
                AGE: req.body.AGE,
                HEIGHT: req.body.HEIGHT,
                WEIGHT: req.body.WEIGHT
            };
            dbo.collection("persons").insertOne(data, ()=>{
                if(!err){
                    console.log("inserted")
                }
                else{
                    console.log(err)
                }
            })
        }
    })
})

//delete
app.delete('/getdata/:id', function (req, res) {
    mongoClient.connect(url, (err, db)=>{
        if(!err){
            var dbo = db.db("restapi");
            var id = req.params.id;
            dbo.collection("persons").deleteOne({ _id: new mongoClient.ObjectId(id) }, function (err, results) {
                if(!err){
                    console.log(`Person has been deleted`)
                }
                else{
                    console.log(err)
                }
            });
            }
  })
});




app.listen(3000);
console.log(`server started at http://localhost:3000/getdata`)
