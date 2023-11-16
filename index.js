const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 80;
const host = "localhost";

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
	// Handle the root path (send your HTML file or whatever is appropriate)
	res.sendFile(__dirname + '/public/index.html');
});


app.post('/', (req, res) => {
	const receivedData = req.body;
	console.log(receivedData);
	const { phone, msg } = req.body;
	
	// Process the data as needed
	res.json({status: 'Data received successfully'});

	sendsms(phone, msg);
});

app.listen(port, () => {
		console.log(`Server listening at http://${host}:${port}`);
});

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

function sendsms(phone, msg) {
	const outpath = "/var/spool/sms/outgoing/";
	const filename = makeid(10);
	const filepath = outpath + filename;
	const filecontents = "To: " + phone + "\nAlphabet: ISO\n\n" + msg;

	console.log(`File directory: ${outpath}`);
	console.log(`File name: ${filename}`);
	console.log(`Path: ${filepath}`);
	
	if (!fs.existsSync(outpath)) { console.log(`ERROR: directory ${outpath} does not exist`); return 1;}

	try {
		fs.writeFileSync(filepath, filecontents);
		console.log('File written successfully.');
	} catch (error) {
		console.error('Error writing file:', error);
		return 1;
	}

	return 0;
}
