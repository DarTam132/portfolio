//Dots

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 4 - 2;
    this.radius = 5;
    //
    this.color = `#6e6161`;
    this.life = 5;
    this.alpha = 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.01;
    this.alpha = this.life;
  }

  isConnected(particle) {
    const distance = Math.sqrt(
      (this.x - particle.x) ** 2 + (this.y - particle.y) ** 2
    );
    return distance < 150;
  }

  drawLine(particle) {
    const gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      particle.x,
      particle.y
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, particle.color);
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(particle.x, particle.y);
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }
}

const particles = [];

function spawnParticle() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const particle = new Particle(x, y);
  particles.push(particle);
}

function updateParticles() {
  particles.forEach((particle) => {
    particle.update();
    particle.draw();

    particles.forEach((otherParticle) => {
      if (particle !== otherParticle && particle.isConnected(otherParticle)) {
        particle.drawLine(otherParticle);
      }
    });
  });

  particles.filter((particle) => particle.life > 0);
}

setInterval(spawnParticle, 100);

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateParticles();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
