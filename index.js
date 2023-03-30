const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav__link");
const nav = document.querySelector("header");
const intro = document.querySelector(".intro");

navToggle.addEventListener("click", () => {
  document.body.classList.toggle("nav-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
  });
});

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  treshold: 0,
});

headerObserver.observe(intro);

// typewriter carousel

const TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    // delta defines the delay in ms between typing out text
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName("txt-rotate");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-rotate");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }

  // Inject CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};

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
    this.life = 15;
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
