function getValues() {
    let phone = document.getElementById('phone').value;
    let msg = document.getElementById('msg').value;    
}

function sendsms() {
    const path = require('path');
    
    const getRootDir = () => path.parse(process.cwd()).root;
    console.log(getRootDir());
    
    
    let filepath = getRootDir() + "/var/spool/sms/outgoing/"
    let filename = makeid(8);
    let filecontents = "To: ${phone}\nFlash: yes\nAlphabet: ISO\n ${msg}";
    
    console.log(filename);
    
    fs.writeFile(filepath + filename, filecontents);
  }
  