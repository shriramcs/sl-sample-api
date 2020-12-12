const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const port  = 3000;
const app = express();

app.use(bodyParser.urlencoded({entended: false}));
app.use(bodyParser.json());
app.use(serveStatic(path.join(__dirname, '')))

const users = [
    {id: 1, name:"Spandana", email:'', status: 'Active'},
    {id: 2, name:"Kiran", email:'', status: 'Active'},
    {id: 3, name:"Kiran2", email:'', status: 'Active'},
    {id: 4, name:"Sharath", email:'', status: 'Active'},
    {id: 5, name:"Bhaskar", email:'', status: 'Active'}
];

// static content serving
app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname + 'index.html'));
});

// rest api to get users list
app.get('/users', (req, resp) => {
    console.log('get users');
    return resp.json(users);
});

app.post('/user/:id', (req, resp) => {
    console.log('update user', req.body, req.params.id);
    const id = req.params.id;
    const payloadUser = req.body;
    if(id){
        let userIndex = users.findIndex(u => u.id == id);
        if(userIndex > -1){
            const user = {
                id: id,
                ...payloadUser
            }
            users.splice(userIndex, 1);
            users.push(user);
            return resp.json({
                status: {statusCode: 200, message: "USER DETAILS UPDATED SUCCESSFULLY"},
                id
            })
        } else {
            return resp.json({
                status: {statusCode: 500, message: "USER NOT FOUND"}
            })
        }
    } else {
        return resp.json({
            status: {statusCode: 500, message: "USER ID NOT PASSED"}
        })
    }
});

app.delete('/user/:id', (req, resp) => {
    const id = req.params.id;
    if(id){
        const userIndex = users.findIndex(u => u.id == id);
        if(userIndex > -1){
            users.splice(userIndex, 1);
            return resp.json({
                status: {statusCode: 200, message: "USER DELETED SUCCESSFULLY"},
                id
            })
        } else {
            return resp.json({
                status: {statusCode: 500, message: "USER NOT FOUND"}
            })
        }
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
        users.push(newUser);
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