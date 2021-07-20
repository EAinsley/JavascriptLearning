function DrawPieChartWithCaption(
  contex,
  centerX,
  centerY,
  radius,
  results,
  wordsize = 15,
  font = "Helvetica"
) {
  const total = results.reduce((sum, { count }) => sum + count, 0);
  let currentAngle = -0.5 * Math.PI;
  contex.font = wordsize + "px " + font;
  for (const { name, count, color } of results) {
    const sliceAngle = (count / total) * 2 * Math.PI;
    const textAngle = currentAngle + sliceAngle / 2;
    contex.beginPath();
    contex.arc(
      centerX,
      centerY,
      radius,
      currentAngle,
      currentAngle + sliceAngle
    );
    contex.lineTo(centerX, centerY);
    contex.fillStyle = color;
    contex.fill();
    contex.fillStyle = "black";
    contex.fillText(
      name,
      centerX +
        Math.cos(textAngle) * radius +
        (Math.cos(textAngle) > 0 ? 0 : -contex.measureText(name).width),
      centerY +
        Math.sin(textAngle) * radius +
        (Math.sin(textAngle) > 0 ? wordsize : 0)
    );
    currentAngle += sliceAngle;
  }
}
