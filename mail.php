<?php

if (isset($_POST['phone']) && isset($_POST['msg'])) {
    
    header('Content-Type: text/html; charset=utf-8');
    
    $headers = 'Content-Type: text/plain; charset=utf8' . "\r\n";
    $headers .= 'Content-Transfer-Encoding: base64';
    
    $phone = $_POST['phone'];
    $recipient = $phone + "+smsd@bot01.pa.datasafe.fi";
    $subject = "Web2SMS Message";
    $message = base64_encode($_POST['msg']);
    
    if (mail($recipient, $subject, $message, $headers)) {
        echo 'Mail sent!';
    }
    else {
        echo 'Something went wrong!';
    }
}

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mail</title>
    </head>
    <body>
        <form action="" method="POST">
            <label for="phone">Phone number:</label>
            <br>
            <input type="number" name="phone" id="phone">
            <label for="msg">Message:</label>
            <br>
            <input type="text" name="msg" id="msg">
            <br>
            <input type="submit">
        </form>
    </body>
</html>