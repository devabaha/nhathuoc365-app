export default function(originWidth, originHeight, displayWidth) {
  const ratio = originWidth / originHeight;
  const width = Math.floor(displayWidth);
  const height = Math.floor(width / ratio);
  return { width, height };
}
