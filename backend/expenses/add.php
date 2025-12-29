<?php
session_start();
include "../config/db.php";
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "NOT_LOGGED_IN"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Use 'description' to match frontend
$description = trim($data['description'] ?? '');
$amount = floatval($data['amount'] ?? 0);

if ($description === '' || $amount <= 0) {
    echo json_encode(["error" => "INVALID_INPUT", "desc"=>$description, "amt"=>$amount]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO expenses (user_id, description, amount) VALUES (?, ?, ?)"
);
$stmt->bind_param("isd", $_SESSION['user_id'], $description, $amount);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "OK",
        "id" => $stmt->insert_id
    ]);
} else {
    echo json_encode(["error" => $stmt->error]);
}
?>
