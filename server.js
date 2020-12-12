const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/";


const port  = 3000;
const app = express();

app.use(bodyParser.urlencoded({entended: false}));
app.use(bodyParser.json());
app.use(serveStatic(path.join(__dirname, '')))

// static content serving
app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname + 'index.html'));
});

// rest api to get users list

app.get('/users', (req, resp) => {
    console.log('get users');
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("springlabs");
        dbo.collection("users").find().toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          resp.json(result);
          db.close();
        });
    });
});

app.post('/user/:id', (req, resp) => {
    console.log('update user', req.body, req.params.id);
    const id = req.params.id;
    const payloadUser = req.body;
    if(id){
        const user = {
                id: parseInt(id),
                ...payloadUser
        }
        MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db("springlabs");
            var myquery = { id: parseInt(id) };
            var newvalues = { $set: user };
            dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                resp.json({
                status: {statusCode: 200, message: "USER DETAILS UPDATED SUCCESSFULLY"},
                id
                })
                db.close();
            });
        });
    } else {
        return resp.json({
            status: {statusCode: 500, message: "USER ID NOT PASSED"}
        })
    }
});

app.delete('/user/:id', (req, resp) => {
    const id = req.params.id;
    if(id){
        MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db("springlabs");
            var myquery = { id: parseInt(id) };
            dbo.collection("users").deleteOne(myquery, function(err, obj) {
              if (err) throw err;
              console.log("1 document deleted");
              resp.json({
                status: {statusCode: 200, message: "USER DELETED"}
                });
              db.close();
            });
        });
        
    } else {
        return resp.json({
            status: {statusCode: 500, message: "USER ID NOT PASSED"}
        })
    }
});

app.post('/user', (req, resp) => {
    const user = req.body;
    console.log('add', user);
    if(user){
        const userId = Date.now();
        const newUser = {
            id: userId,
            ...user
        }
        MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db("springlabs");
            dbo.collection("users").insertOne(newUser, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
            });
        });
        
        return resp.json({
            status: {statusCode: 200, message: "NEW USER ADDED SUCCESSFULLY"},
            id: userId
        });
    } else {
        return resp.json({
            status: {statusCode: 500, message: "ERROR: NO USER DATA PASSED"},
            id: userId
        });
    }
    
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
