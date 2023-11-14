<?php

$number = $_POST["phone"];
$rcpt = "$number+smsd@bot01.pa.datasafe.fi";

$to = "$rcpt";
$subject = "Test!";
$txt = "Hello world!";
$headers = "From: test";

mail($to,$subject,$txt,$headers);

?>