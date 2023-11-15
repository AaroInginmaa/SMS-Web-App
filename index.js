const express = require('express');
const fs = require('fs');

const app = express();
const port = 8000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('/index.html')
})

app.listen(port, () => {
  console.log(`Server up on port ${port}`)
})

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

function sendsms() {
  let filepath = "/var/spool/sms/outgoing/"
  let filename = makeid(8);
  let filecontents = "To: 0443642653\nFlash: yes\nAlphabet: ISO\n Test message";
  
  console.log(filename);
  
  fs.writeFile(filepath + filename, filecontents);
}
