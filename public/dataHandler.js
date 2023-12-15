var sendBtn, phoneInput, msgInput;

// Initializes variables and sets up the event listener for sendBtn
window.onload(() => {
    sendBtn = document.getElementById('submit');
    phoneInput = document.getElementById('phone');
    msgInput = document.getElementById('msg');

    sendBtn.addEventListener("click", send);
})

// Makes a POST request to server root where the phone number and message is handled and sent
function send() {
    disableElementForInterval(sendBtn, 5000);

    if (!validatePhone(phoneInput.value)) { return; }

    let data = {
        phone: phoneInput.value,
        msg: msgInput.value
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
        handleResponse(result)
    })
    .catch(err =>{
        confirm.error(err);
    })
}

// Disables an element for an interval
function disableElementForInterval(element, interval) {
    element.disabled = true;
    setTimeout(function() {
        element.disabled = false;
    }, interval);
}

// Validates given phone number
function validatePhone(phone) {
    let phonenoPattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (phone.match(phonenoPattern)) {
        return true;
    }
    else {
        alert("Invalid phone number!");
        return false;
    }
}