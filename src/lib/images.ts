/** Client-side image compression to Data URL for quick storage/preview.
 * For production-grade storage, integrate a blob/R2/S3 uploader and store URLs.
 */
export async function compressImageFile(
  file: File,
  opts: { maxWidth?: number; maxHeight?: number; quality?: number } = {},
): Promise<string> {
  const maxWidth = opts.maxWidth ?? 1200;
  const maxHeight = opts.maxHeight ?? 800;
  const quality = opts.quality ?? 0.8;
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  await new Promise((res, rej) => {
    img.onload = () => res(null);
    img.onerror = rej;
  });
  let { width, height } = img;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}
