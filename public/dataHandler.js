var sendBtn = document.getElementById('submit');

window.onload = function() {
    sendBtn = document.getElementById('submit');
    sendBtn.addEventListener("click", send);
}

function send() {
    objTimeout(sendBtn, 5000);

    if (!validatePhone(document.getElementById('phone').value)) { return; }

    let data = {
        phone: document.getElementById('phone').value,
        msg: document.getElementById('msg').value
    };
    
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);

        handleResponse(result);

    })
    .catch(error => {
        console.error(error);
    });
}

function objTimeout(obj, interval) {
    obj.disabled = true;
    setTimeout(function() {
        obj.disabled = false;
    }, interval);
}

function validatePhone(phone) {
    let phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (phone.match(phoneno)) {
        return true;
    }
    else {
        alert("Invalid phone number!");
        return false;
    }
}