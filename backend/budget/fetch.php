<?php
session_start();
include "../config/db.php";
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "NOT_LOGGED_IN"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$result = $conn->query("SELECT amount FROM budgets WHERE user_id = $user_id LIMIT 1");

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(["amount" => floatval($row['amount'])]);
} else {
    echo json_encode(["amount" => 0]);
}
?>
