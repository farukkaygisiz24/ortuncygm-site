<?php
/**
 * Natro paylaşımlı hosting — cron olmadan detay önbelleği.
 *
 * Tek kayıt:  /mevzuat-detail.php?slug=sirkuler-26-0374
 * Batch (dış web-cron): /mevzuat-detail.php?key=GIZLI&batch=15
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$secret = getenv('MEVZUAT_SYNC_KEY') ?: '';
$providedKey = $_GET['key'] ?? '';
$slug = $_GET['slug'] ?? '';
$batch = isset($_GET['batch']) ? (int) $_GET['batch'] : 0;

$dataDir = __DIR__ . '/data/mevzuat-guncellemeleri';
$detailsDir = $dataDir . '/details';
$indexPath = $dataDir . '/index.json';

function decode_html(string $text): string {
    return trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($text), ENT_QUOTES | ENT_HTML5, 'UTF-8')));
}

function fetch_detail(string $slug, array $summary, string $detailsDir): ?array {
    $file = $detailsDir . '/' . $slug . '.json';
    if (is_file($file)) {
        return json_decode(file_get_contents($file), true);
    }

    $url = 'https://ugm.com.tr/gumruk-sirkulerleri/' . rawurlencode($slug);
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: ORTUNC-Site/1.0\r\n",
            'timeout' => 45,
        ],
    ]);

    $html = @file_get_contents($url, false, $context);
    if ($html === false) return null;

    $title = $summary['title'] ?? '';
    $bodyHtml = '';

    if (preg_match('/Kısa Konu[\s\S]*?<b[^>]*>([\s\S]*?)<\/b>/i', $html, $m)) {
        $title = decode_html($m[1]);
    }
    if (preg_match('/<div class="p-4" style="min-height: 340px">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i', $html, $m)) {
        $bodyHtml = trim($m[1]);
    }

    $detail = array_merge($summary, ['title' => $title, 'bodyHtml' => $bodyHtml]);

    if (!is_dir($detailsDir)) {
        mkdir($detailsDir, 0755, true);
    }
    file_put_contents($file, json_encode($detail, JSON_UNESCAPED_UNICODE) . "\n");

    return $detail;
}

if ($batch > 0) {
    if ($secret === '' || $providedKey !== $secret) {
        http_response_code(403);
        echo json_encode(['error' => 'Yetkisiz']);
        exit;
    }
    if (!is_file($indexPath)) {
        http_response_code(503);
        echo json_encode(['error' => 'Index yok']);
        exit;
    }

    $index = json_decode(file_get_contents($indexPath), true);
    $max = min(max($batch, 1), 25);
    $synced = 0;

    foreach ($index['items'] ?? [] as $item) {
        if ($synced >= $max) break;
        $s = $item['slug'] ?? '';
        if ($s === '') continue;
        if (is_file($detailsDir . '/' . $s . '.json')) continue;
        if (fetch_detail($s, $item, $detailsDir)) $synced++;
        usleep(200_000);
    }

    echo json_encode(['synced' => $synced], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($slug === '' || !preg_match('/^[a-z0-9-]+$/i', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Geçersiz slug']);
    exit;
}

$file = $detailsDir . '/' . $slug . '.json';
if (is_file($file)) {
    readfile($file);
    exit;
}

if (!is_file($indexPath)) {
    http_response_code(503);
    echo json_encode(['error' => 'Index bulunamadı']);
    exit;
}

$index = json_decode(file_get_contents($indexPath), true);
$summary = null;
foreach ($index['items'] ?? [] as $item) {
    if (($item['slug'] ?? '') === $slug) {
        $summary = $item;
        break;
    }
}

if (!$summary) {
    http_response_code(404);
    echo json_encode(['error' => 'Kayıt bulunamadı']);
    exit;
}

$detail = fetch_detail($slug, $summary, $detailsDir);
if (!$detail) {
    http_response_code(502);
    echo json_encode(['error' => 'UGM yanıt vermedi']);
    exit;
}

echo json_encode($detail, JSON_UNESCAPED_UNICODE);
