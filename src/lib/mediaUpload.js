/** @param {string} name */
export function sanitizeBasename(name) {
  const base = name.replace(/^.*[/\\]/, "").replace(/\0/g, "");
  if (base === "." || base === ".." || !base) return "upload.bin";
  return base;
}

/** @param {File} file */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** @param {string | undefined} url */
export function isProbablyVideoUrl(url) {
  if (!url) return false;
  if (/^data:video\//i.test(url)) return true;
  return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url);
}
