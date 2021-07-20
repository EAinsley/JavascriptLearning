function drawTrapezoid(
  contex,
  top_length,
  bottom_length,
  height,
  leftmost,
  topmost,
  fill
) {
  contex.beginPath();
  contex.moveTo(
    Math.max((bottom_length - top_length) / 2, 0) + leftmost,
    topmost
  );
  contex.lineTo(
    Math.max((bottom_length - top_length) / 2, 0) + top_length + leftmost,
    topmost
  );
  contex.lineTo(
    Math.max((top_length - bottom_length) / 2, 0) + bottom_length + leftmost,
    topmost + height
  );
  contex.lineTo(
    Math.max((top_length - bottom_length) / 2, 0) + leftmost,
    topmost + height
  );
  if (fill) {
    contex.fillStyle = fill;
    contex.fill();
  } else {
    contex.closePath();
    contex.stroke();
  }
}

function drawDiamond(contex, side_length, centerX, centerY, fill) {
  contex.save();
  contex.translate(centerX, centerY);
  contex.rotate((45 / 180) * Math.PI);
  if (fill) {
    contex.fillStyle = fill;
    contex.fillRect(
      -0.5 * side_length,
      -0.5 * side_length,
      side_length,
      side_length
    );
  } else {
    contex.strokeRect(
      -0.5 * side_length,
      -0.5 * side_length,
      side_length,
      side_length
    );
  }
  contex.restore();
}

function drawZigzag(contex, length, height, degree, leftmost, topmost) {
  contex.beginPath();
  contex.moveTo(leftmost, topmost);
  let height_step = Math.tan(degree / 180) * length;
  let total_height = height_step;
  let is_left = true;
  while (total_height < height) {
    contex.lineTo(
      is_left ? leftmost + length : leftmost,
      topmost + total_height
    );
    total_height += height_step;
    is_left = !is_left;
  }
  contex.stroke();
}

function drawSpiral(contex, centerX, centerY, numsegements) {
  contex.beginPath();
  let total_angle = 0;
  let total_radius = 0;
  for (let i = 0; i < numsegements; i++) {
    contex.arc(centerX, centerY, total_radius, total_angle, total_angle + 0.2);
    total_radius += 0.6;
    total_angle += 0.2;
  }
  contex.stroke();
}

function drawStar(
  contex,
  centerX,
  centerY,
  radius,
  numpoints,
  fill = "orange"
) {
  const sliceangle = (2 * Math.PI) / numpoints;
  contex.beginPath();
  contex.moveTo(centerX + radius, centerY);
  for (
    let i = 0, currentangle = 0;
    i <= numpoints;
    i++, currentangle += sliceangle
  ) {
    contex.quadraticCurveTo(
      centerX,
      centerY,
      centerX + Math.cos(currentangle) * radius,
      centerY + Math.sin(currentangle) * radius
    );
  }
  contex.fillStyle = fill;
  contex.fill();
}
