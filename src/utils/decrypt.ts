import CryptoJS from 'crypto-js';

function getDecryptionKey(): CryptoJS.lib.WordArray {
  return CryptoJS.enc.Utf8.parse('V4@.Tx+uXZn)AiH>');
}

// 解密图片buffer
export function decryptImageCryptoJS(buffer: ArrayBuffer): ArrayBuffer {
  const key = getDecryptionKey();
  const bytes = new Uint8Array(buffer);

  // 提取 IV 和密文
  const ivArray = bytes.slice(0, 16);
  const encryptedArray = bytes.slice(16);

  // 创建 WordArray - 注意这里的参数
  const iv = CryptoJS.lib.WordArray.create(ivArray);
  const ciphertext = CryptoJS.lib.WordArray.create(encryptedArray);

  // 使用 CipherParams（你的第一个例子）
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // 转换回字节数组
  const words = decrypted.words;
  const sigBytes = decrypted.sigBytes;
  const decryptedBytes = new Uint8Array(sigBytes);

  for (let i = 0; i < sigBytes; i++) {
    decryptedBytes[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  return decryptedBytes.buffer;
}

// 获取MIME类型
export function getMimeTypeFromUrl(url: string): string {
  const ext = url.toLowerCase();
  if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) return 'image/jpeg';
  if (ext.endsWith('.png')) return 'image/png';
  if (ext.endsWith('.gif')) return 'image/gif';
  if (ext.endsWith('.webp')) return 'image/webp';
  if (ext.endsWith('.svg')) return 'image/svg+xml';
  if (ext.endsWith('.bmp')) return 'image/bmp';
  if (ext.endsWith('.ico')) return 'image/x-icon';
  return 'application/octet-stream';
}

// 处理单张加密图片
export async function processEncryptedImage(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      referrerPolicy: 'no-referrer',
    });
    const buffer = await response.arrayBuffer();
    const decryptedBuffer = decryptImageCryptoJS(buffer);
    const mimeType = getMimeTypeFromUrl(url);
    const blob = new Blob([decryptedBuffer], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error('解密图片失败', url, e);
    throw e;
  }
}
