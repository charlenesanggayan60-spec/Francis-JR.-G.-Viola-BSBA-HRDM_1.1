<?php
/**
 * Simple contact form handler (no extra library needed).
 * Works only on a web host that runs PHP and allows mail().
 * On static hosting (GitHub Pages, Netlify, etc.) this file is ignored
 * and the form falls back to opening the visitor's email app.
 */
header('Content-Type: application/json; charset=utf-8');

// Change this to the email that should receive messages
$receiving_email_address = 'franciscoviola2025@gmail.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Invalid request.']);
  exit;
}

function clean($v) {
  // strip line breaks (prevents email header injection) and tags
  return trim(strip_tags(str_replace(["\r", "\n"], ' ', (string)$v)));
}

$name    = clean($_POST['name'] ?? '');
$email   = clean($_POST['email'] ?? '');
$phone   = clean($_POST['phone'] ?? '');
$subject = clean($_POST['subject'] ?? '');
$message = trim(strip_tags((string)($_POST['message'] ?? '')));

if ($name === '' || $subject === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'Please fill in all required fields with a valid email.']);
  exit;
}

$body  = "From: $name\nEmail: $email\n";
if ($phone !== '') { $body .= "Phone: $phone\n"; }
$body .= "\nMessage:\n$message\n";

$headers  = "From: Website <no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'localhost') . ">\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

if (mail($receiving_email_address, "Portfolio contact: $subject", $body, $headers)) {
  echo json_encode(['ok' => true]);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Message could not be sent. Please email me directly.']);
}
