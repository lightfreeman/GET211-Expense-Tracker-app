<?php
header('Content-Type: application/json'); // ensure JSON output
include "../config/db.php";
session_start();

$data = json_decode(file_get_contents("php://input"), true);

// Safely get email and password
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Validate DB connection
if (!$conn) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

// Validate input
if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Email and password required"]);
    exit;
}

// Query the user
$result = $conn->query("SELECT * FROM users WHERE email='$email'");
$user = $result->fetch_assoc();

// Check password and login
if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
}
?>
