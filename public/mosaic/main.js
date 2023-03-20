const input = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const sizeSlider = document.getElementById('size-slider');
const sizeSlider2 = document.getElementById('size-slider2');
const downloadBtn = document.getElementById('download-btn');

let img;
let originalImageData; // 元の画像データ
let lastOperation = ''; // 最後に実行した処理の名前を記録する変数

// 画像を読み込む
input.addEventListener('change', () => {
  const file = input.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    img = new Image();
    img.src = reader.result;
    img.onload = () => {
      const w = Math.min(img.width, 1024);
      const h = Math.floor(img.height * w / img.width);
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
      originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
  };
});

// モザイク化する
function mosaic() {
  lastOperation = 'mosaic'; // 最後に実行した処理を記録する

  ctx.putImageData(originalImageData, 0, 0);
  const blockSize = sizeSlider.value / 1000;
  if (blockSize == 0) {
    return;
  }

  const w = canvas.width;
  const h = canvas.height;
  const blockWidth = Math.ceil(w * blockSize); // ceilで切り上げる
  const blockHeight = Math.ceil(w * blockSize); // ceilで切り上げる
  const xCount = Math.ceil(w / blockWidth); // x軸方向のブロック数を計算する
  const yCount = Math.ceil(h / blockHeight); // y軸方向のブロック数を計算する

  // 1回のgetImageData()でピクセルの平均色を計算する
  const imageData = ctx.getImageData(0, 0, w, h);
  const pixels = new Uint32Array(imageData.data.buffer); // TypedArrayを使用する
  const rgbaArray = new Uint32Array(xCount * yCount); // 平均色の配列

  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      const sx = x * blockWidth; // ブロックの開始x座標
      const sy = y * blockHeight; // ブロックの開始y座標
      const sw = Math.min(blockWidth, w - sx); // ブロックの幅を計算する（はみ出した部分は切り捨てる）
      const sh = Math.min(blockHeight, h - sy); // ブロックの高さを計算する（はみ出した部分は切り捨てる）

      let r = 0, g = 0, b = 0, a = 0;
      const len = sw * sh; // ブロック内のピクセル数
      for (let i = 0; i < len; i++) {
        const pixel = pixels[(sy + Math.floor(i / sw)) * w + (sx + (i % sw))]; // ピクセルの値を取得
        r += pixel & 0xff;
        g += (pixel >> 8) & 0xff;
        b += (pixel >> 16) & 0xff;
        a += (pixel >> 24) & 0xff;
      }
      const rgba = {
        r: Math.round(r / len),
        g: Math.round(g / len),
        b: Math.round(b / len),
        a: Math.round(a / len)
      };
      rgbaArray[y * xCount + x] = (rgba.a << 24) | (rgba.b << 16) | (rgba.g << 8) | rgba.r;
    }
  }

  // 平均色をcanvasに描画する
  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      const rgba = rgbaArray[y * xCount + x];
      ctx.fillStyle = `rgba(${rgba & 0xff}, ${(rgba >> 8) & 0xff}, ${(rgba >> 16) & 0xff}, ${(rgba >> 24) & 0xff})`;
      const sx = x * blockWidth; // ブロックの開始x座標
      const sy = y * blockHeight; // ブロックの開始y座標
      const sw = Math.min(blockWidth, w - sx); // ブロックの幅を計算する（はみ出した部分は切り捨てる）
      const sh = Math.min(blockHeight, h - sy); // ブロックの高さを計算する（はみ出した部分は切り捨てる）
      ctx.fillRect(sx, sy, sw, sh);
    }
  }
}

function blur() {
  lastOperation = 'blur'; // 最後に実行した処理を記録する

  const radius = sizeSlider2.value * Math.min(canvas.width, canvas.height) / 1000;
  ctx.putImageData(originalImageData, 0, 0);
  if (radius == 0) {
    return;
  }
  const blurCanvas = document.createElement('canvas');
  blurCanvas.width = canvas.width;
  blurCanvas.height = canvas.height;
  const blurCtx = blurCanvas.getContext('2d');
  blurCtx.imageSmoothingEnabled = false; // ここを追加
  blurCtx.drawImage(canvas, 0, 0);
  ctx.fillStyle = "#ffffff"; // 背景色を白に設定する
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(blurCanvas, 0, 0);
  ctx.filter = 'none';
}

// ピクセルの平均色を求める
function getAverageRGBA(pixels) {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  const len = pixels.length;

  for (let i = 0; i < len; i += 4) {
    r += pixels[i];
    g += pixels[i + 1];
    b += pixels[i + 2];
    a += pixels[i + 3];
  }

  return {
    r: Math.round(r / (len / 4)),
    g: Math.round(g / (len / 4)),
    b: Math.round(b / (len / 4)),
    a: Math.round(a / (len / 4))
  };
}

// スライダーの値をblockSizeに反映する
sizeSlider.addEventListener('input', () => {
  blockSize = sizeSlider.value / 1000;
  mosaic();
});

sizeSlider2.addEventListener('input', () => {
  blur();
});

downloadBtn.addEventListener('click', () => {
  const filename = 'output.' + (lastOperation === 'mosaic' ? 'png' : 'jpeg'); // 最後に実行した処理に応じて拡張子を変える
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL(`image/${filename.split('.')[1]}`); // 保存形式に応じたMIMEタイプを設定する
  link.click();
});