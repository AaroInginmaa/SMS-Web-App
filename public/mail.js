var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.7.1.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);

function mail()
{
    let phoneNumber = document.getElementById("phone").value;

    $.ajax({
        type : "POST",
        url : "../mail.php",
        data : { phone : phoneNumber },
        success: function(res) {
            console.log("Success");
        }
    })
}