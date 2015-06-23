<?php
$email_to = "test-feed@googlegroups.com";
$message = $_POST['message'];
$from = 'Alert: New Post';
$body = "\n message";
@mail($email_to, $body, $message);
?>
