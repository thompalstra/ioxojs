<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
$data["total"]="hello";

$data = [
    'herp' => 'derp'
];

echo 'data: ' . json_encode($data) . "\n\n";
flush();
?>
