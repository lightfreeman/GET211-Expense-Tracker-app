<?php
session_start();
include "../config/db.php";
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];

$result = $conn->query(
    "SELECT id, description, amount
     FROM expenses
     WHERE user_id = $user_id
     ORDER BY id DESC"
);

$expenses = [];

while ($row = $result->fetch_assoc()) {
    $expenses[] = [
        "id" => $row["id"],
        "title" => $row["description"], // frontend expects 'title'
        "amount" => floatval($row["amount"])
    ];
}

echo json_encode($expenses);
?>
