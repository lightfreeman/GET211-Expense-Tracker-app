<?php
session_start();
include "../config/db.php";
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "NOT_LOGGED_IN"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(["error" => "INVALID_INPUT"]);
    exit;
}

$stmt = $conn->prepare(
    "DELETE FROM expenses WHERE id = ? AND user_id = ?"
);
$stmt->bind_param("ii", $id, $_SESSION['user_id']);
$stmt->execute();

echo json_encode(["status" => "DELETED"]);
?>
