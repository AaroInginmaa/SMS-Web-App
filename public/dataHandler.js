var sendBtn = document.getElementById('submit');

window.onload = function() {
    sendBtn = document.getElementById('submit');
    sendBtn.addEventListener("click", send);
}

function send() {
    timeout(sendBtn, 5000);
    createElement();

    if (!validatePhone(document.getElementById('phone').value)) { return; }

    let data = {
        phone: document.getElementById('phone').value,
        msg: document.getElementById('msg').value
    };
    

    // Send the data to server via POST request
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    // Handle the results
    .then(response => response.json())
    .then(result => {
        console.log(result);

        handleResponse(result);

    })
    .catch(error => {
        console.error(error);
    });
}

function timeout(obj, interval) {
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