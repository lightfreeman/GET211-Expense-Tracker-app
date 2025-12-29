<?php
session_start();
include "../config/db.php";
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "NOT_LOGGED_IN"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$amount = isset($data['amount']) ? floatval($data['amount']) : 0;

if ($amount <= 0) {
    echo json_encode(["error" => "INVALID_AMOUNT"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Check if budget exists
$result = $conn->query("SELECT id FROM budgets WHERE user_id = $user_id");

if ($result->num_rows > 0) {
    // Update existing budget
    $stmt = $conn->prepare("UPDATE budgets SET amount = ? WHERE user_id = ?");
    $stmt->bind_param("di", $amount, $user_id);
} else {
    // Insert new budget
    $stmt = $conn->prepare("INSERT INTO budgets (user_id, amount) VALUES (?, ?)");
    $stmt->bind_param("id", $user_id, $amount);
}

if ($stmt->execute()) {
    echo json_encode(["status" => "OK", "amount" => $amount]);
} else {
    echo json_encode(["error" => $stmt->error]);
}
?>
