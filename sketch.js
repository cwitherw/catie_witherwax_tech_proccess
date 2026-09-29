const palette = ["#e23a5a", "#f0627e", "#c22747", "#f48ca5", "#a31330"];
let blobs = [];
let drips = [];

function setup() {
  const holder = document.getElementById("canvas-holder");
  const c = createCanvas(holder.clientWidth, holder.clientHeight);
  c.parent(holder);
  for (let i = 0; i < 6; i++) {
    blobs.push(makeBlob(i));
  }
}

function makeBlob(i) {
  return {
    x: random(width * 0.2, width * 0.8),
    y: random(height * 0.3, height * 0.7),
    r: random(36, 84),
    c: palette[i % palette.length],
    sp: random(0.6, 1.3),
    ph: random(TWO_PI),
  };
}

function draw() {
  background(255, 243, 238);
  const t = millis() / 1000;
  for (const b of blobs) {
    b.x += sin(t * b.sp * 0.5 + b.ph) * 0.3;
    b.y += cos(t * b.sp * 0.4 + b.ph * 2) * 0.3;
    if (mouseIsPressed) {
      b.x += (mouseX - b.x) * 0.012;
      b.y += (mouseY - b.y) * 0.012;
    }
    keepInBounds(b);
    drawBlob(b, t);
    if (random() < 0.012) {
      drips.push({
        x: b.x + random(-b.r * 0.4, b.r * 0.4),
        y: b.y + b.r * 0.6,
        vy: random(1.2, 2.6),
        r: random(4, 9),
        c: b.c,
      });
    }
  }
  drawDrips();
}

function keepInBounds(b) {
  b.x = constrain(b.x, b.r * 0.6, width - b.r * 0.6);
  b.y = constrain(b.y, b.r * 0.6, height - b.r * 0.6);
}

function drawBlob(b, t) {
  const squash = 1 + 0.2 * sin(t * b.sp * 2 + b.ph);
  push();
  translate(b.x, b.y);
  scale(1 / squash, squash);
  noStroke();
  fill(b.c);
  beginShape();
  for (let a = 0; a <= TWO_PI; a += TWO_PI / 72) {
    const n = noise(cos(a) * 0.9 + b.ph, sin(a) * 0.9 - t * 0.5 * b.sp);
    const r = b.r * (0.8 + 0.4 * n);
    vertex(r * cos(a), r * sin(a));
  }
  endShape(CLOSE);
  pop();
}

function drawDrips() {
  noStroke();
  for (let i = drips.length - 1; i >= 0; i--) {
    const d = drips[i];
    d.y += d.vy;
    fill(d.c);
    ellipse(d.x, d.y, d.r * 2, d.r * 2.6);
    ellipse(d.x, d.y - d.r * 2.2, d.r * 1.2, d.r * 1.6);
    if (d.y > height + 20) {
      drips.splice(i, 1);
    }
  }
}

function windowResized() {
  const holder = document.getElementById("canvas-holder");
  resizeCanvas(holder.clientWidth, holder.clientHeight);
  blobs.forEach((b, i) => {
    b.x = random(width * 0.2, width * 0.8);
    b.y = random(height * 0.3, height * 0.7);
  });
}
