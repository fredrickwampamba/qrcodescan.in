### <p align="center"><img width="150px" height="150px" src="https://raw.githubusercontent.com/code-kotis/qr-code-scanner/master/app/images/touch/android-chrome-192x192.png"></p>

# [QR Code Scanner](https://qrcodescan.in)

*QR Code Scanner - a simple, fast and useful progressive web application*

### [Live](https://qrcodescan.in)

## Features

  - App Shell
  - Offline
  - Secure via https
  - Responsive
  - Add to home screen & Splash screen
  - Supported Browser (Mobile & Desktop) - Google Chrome, Firefox, Safari, Opera, Microsoft Edge and now supports iOS as well.

## Installation

1. Clone this repo

  ```bash
  git clone https://github.com/code-kotis/qr-code-scanner
  ```

2. Installation

  ```bash
  npm install
  ```

3. Run

  ```bash
  npm run start
  ```

4. Build

  ```bash
  npm run build
  ```

### Contributions

If you find a bug, please file an issue. PR's are most welcome ;)

#### MIT Licensed

```php
<?php
/**
 * QR Code + Logo Generator
 *
 * http://labs.nticompassinc.com
 */
$data = isset($_GET['data']) ? $_GET['data'] : 'http://labs.nticompassinc.com';
$size = isset($_GET['size']) ? $_GET['size'] : '500x500';
$logo = isset($_GET['logo']) ? $_GET['logo'] : "log.png";

header('Content-type: image/png');
// Get QR Code image from Google Chart API
// http://code.google.com/apis/chart/infographics/docs/qr_codes.html
$QR = imagecreatefrompng('https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs='.$size.'&chl='.urlencode($data));
if($logo !== FALSE){
  $logo = imagecreatefromstring(file_get_contents($logo));

  $QR_width = imagesx($QR);
  $QR_height = imagesy($QR);
  
  $logo_width = imagesx($logo);
  $logo_height = imagesy($logo);
  
  // Scale logo to fit in the QR Code
  $logo_qr_width = $QR_width/3;
  $scale = $logo_width/$logo_qr_width;
  $logo_qr_height = $logo_height/$scale;
  
  imagecopyresampled($QR, $logo, $QR_width/3, $QR_height/3, 0, 0, $logo_qr_width, $logo_qr_height, $logo_width, $logo_height);
}
imagepng($QR);
imagedestroy($QR);
?>
```