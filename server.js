const bodyParser = require('body-parser');
const config = require('./config');
const express = require('express');
const send = require('./send.js')

const app = express();
const port = config.server.port;
const host = config.server.host;

app.use(bodyParser.json());
app.use(express.static('public'));

const line = '---------------------------------------------------------\n';

app.route('/')
    .get((req, res) => {
        console.log(`${line}${req.method} request received.`);
        res.sendFile(__dirname + '/public/index.html');
    })
    .post((req, res) => {
        console.log(`${line}${req.method} request received`);
        handlePost(req, res);
    })
    .put((req, res) => {
        console.log(`${line}${req.method} request received.`);
        res.sendStatus(405)
    })
    .delete((req, res) => {
        console.log(`${line}${req.method} request received.`);
        res.sendStatus(405)
    })
    .all((req, res) => {
        console.log(`${line}${req.method} request received.`);
        res.sendStatus(403);
    })

// Start the server
app.listen(port, () => {
    console.log(`${line}Server listening at http://${host}:${port}`);
});

app.once('error', function(err) {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} already in use`);
        process.exit();
    }
  });

function handlePost(req, res) {

    const receivedData = req.body;
    const { phone, msg } = req.body;

    console.log("Received data:", receivedData);

    send.sendsms(phone, msg)
    .then(result => {
        console.log("Message sent successfully:", result);
        res.json({ result });
    })
    .catch((error) => {
        console.error('Sending message failed');
        res.status(500).json({ error: `Viestin lähettämisessä numeroon ${phone} tapahtui virhe` });
    });
}