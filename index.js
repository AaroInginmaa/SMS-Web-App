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

window.onload = function() {
  btn = document.getElementById('btnSend');
  btn.addEventListener("click", sendsms);
}

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
  let phone = document.getElementById('phone').value;
  let msg = document.getElementById('msg').value;

  let filepath = "/var/spool/sms/outgoing/"
  let filename = makeid(8);
  let filecontents = "To: "+phone+"\nFlash: yes\nAlphabet: ISO\n"+msg;

  console.log(filename);

  fs.writeFile(filepath + filename, filecontents);
}