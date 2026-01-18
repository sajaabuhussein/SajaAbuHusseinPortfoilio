<?php
// Replace this with your email
$receiving_email_address = "sajaabohossein@gmail.com";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
  $name = strip_tags(trim($_POST["name"]));
  $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
  $subject = strip_tags(trim($_POST["subject"]));
  $message = trim($_POST["message"]);

  // Check required fields
  if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo "Please fill in all required fields.";
    exit;
  }

  // Build email
  $email_subject = !empty($subject) ? $subject : "New Contact Form Message";
  $email_body = "You have received a new message from your contact form.\n\n".
                "Name: $name\n".
                "Email: $email\n\n".
                "Message:\n$message\n";

  $headers = "From: $name <$email>";

  // Send email
  if (mail($receiving_email_address, $email_subject, $email_body, $headers)) {
    http_response_code(200);
    echo "Your message has been sent successfully.";
  } else {
    http_response_code(500);
    echo "Oops! Something went wrong, and we couldn’t send your message.";
  }

} else {
  http_response_code(403);
  echo "There was a problem with your submission, please try again.";
}
?>
