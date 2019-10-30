export default function(
  originWidth,
  originHeight,
  displayWidth,
  displayHeight
) {
  let ratio, width, height;
  if (displayWidth) {
    ratio = originWidth / originHeight;
    width = Math.floor(displayWidth);
    height = Math.floor(width / ratio);
    return { width, height };
  }
  if (displayHeight) {
    ratio = originHeight / originWidth;
    height = Math.floor(displayHeight);
    width = Math.floor(height / ratio);
    return { width, height };
  }
  return { width: originWidth, height: originHeight };
}
