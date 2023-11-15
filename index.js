const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

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
    console.log('Phone:', phone);
    console.log('Message:', msg);

    // Process the data as needed
    res.json({ status: 'Data received successfully' });

    sendsms(phone, msg);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
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
  const filepath = "/var/spool/sms/outgoing/";
  const filename = makeid(8);
  const fullname = filepath + filename;
  const filecontents = "To: " + phone + "\nFlash: yes\nAlphabet: ISO\n" + msg;

  console.log(fullname);

  try {
    //fs.mkdirSync(filepath, { recursive: true });
    fs.writeFileSync(fullname, filecontents);
    console.log('File written successfully.');
  } catch (error) {
    console.error('Error writing file:', error);
  }
}
