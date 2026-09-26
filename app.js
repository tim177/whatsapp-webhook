const express = require('express');
const app = express();

//middleware to parse json bodies
app.use(express.json())


const port = process.env.PORT || 8000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
    const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

    if(verifyToken && mode === 'subscribe' && token === verifyToken){
        console.log(' WEBHOOK VERIFIED ');
        res.status(200).send(challenge)
    }else{
        res.status(401).end()
    }
})

// Route for POST requests
app.post('/', (req, res) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    console.log(`\n\nWebhook received ${timestamp}\n`);
    console.log(JSON.stringify(req.body, null, 2))
    res.status(200).end();
})


app.listen(port, () => {
    console.log(`Listening at port ${port}`)
    if(!verifyToken){
        console.warn('VERIFY_TOKEN is not set - webhook verification will be rejected')
    }
})