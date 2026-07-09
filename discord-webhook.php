<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$discordWebhookUrl = 'REEMPLAZA_ESTA_URL_POR_TU_WEBHOOK_DE_DISCORD';

if ($discordWebhookUrl === 'REEMPLAZA_ESTA_URL_POR_TU_WEBHOOK_DE_DISCORD') {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'No se configuró la URL del webhook de Discord.'
    ]);
    exit;
}

$input = file_get_contents('php://input');
$payload = json_decode($input, true);
$message = isset($payload['message']) ? $payload['message'] : '';

$discordPayload = [
    'content' => $message
];

$ch = curl_init($discordWebhookUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($discordPayload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true, 'message' => 'Datos enviados al webhook de Discord.']);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo enviar al webhook de Discord.',
        'discord_http_code' => $httpCode,
        'discord_response' => $response
    ]);
}
