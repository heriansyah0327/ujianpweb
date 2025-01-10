<?php
header(header: "Content-Type: application/json");
header(header: "Access-Control-Allow-Origin: *");
header(header: "Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header(header: "Access-Control-Allow-Headers: Content-Type");

$dataFile = "users.json";

function getJsonData($file): mixed {
  if (file_exists(filename: $file)) {
      $content = file_get_contents(filename: $file);
      return json_decode(json: $content, associative: true) ?: [];
  }
  return [];
}

function saveJsonData($file, $data): void {
  file_put_contents(filename: $file, data: json_encode(value: $data, flags: JSON_PRETTY_PRINT));
}


$requestMethod = $_SERVER["REQUEST_METHOD"];
$inputData = json_decode(json: file_get_contents(filename: "php://input"), associative: true);

switch ($requestMethod) {
    case "GET":
        if (isset($_GET["id"])) {
            $id = intval(value: $_GET["id"]);
            $users = getJsonData(file: $dataFile);
            $user = array_filter(array: $users, callback: fn($u): bool => $u["id"] === $id);
            echo json_encode(value: array_values(array: $user));
        } else {
            echo file_get_contents(filename: $dataFile);
        }
        break;

    case "POST":
        $users = getJsonData(file: $dataFile);
        $newUser = [
            "id" => end(array: $users)["id"] + 1,
            "name" => $inputData["name"],
            "email" => $inputData["email"],
            "contact" => $inputData["contact"]
        ];
        $users[] = $newUser;
        saveJsonData(file: $dataFile, data: $users);
        echo json_encode(value: ["message" => "User added successfully"]);
        break;

    case "PUT":
        $id = intval(value: $_GET["id"]);
        $users = getJsonData(file: $dataFile);
        foreach ($users as &$user) {
            if ($user["id"] === $id) {
                $user["name"] = $inputData["name"];
                $user["email"] = $inputData["email"];
                $user["contact"] = $inputData["contact"];
            }
        }
        saveJsonData(file: $dataFile, data: $users);
        echo json_encode(value: ["message" => "User updated successfully"]);
        break;

    case "DELETE":
        $id = intval(value: $_GET["id"]);
        $users = getJsonData(file: $dataFile);
        $users = array_filter(array: $users, callback: fn($u): bool => $u["id"] !== $id);
        saveJsonData(file: $dataFile, data: array_values(array: $users));
        echo json_encode(value: ["message" => "User deleted successfully"]);
        break;

    default:
        echo json_encode(value: ["message" => "Invalid request method"]);
        break;
}
?>
