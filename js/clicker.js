document.addEventListener("DOMContentLoaded", () => {
  const mando = document.getElementById("mando");
  const cpsDisplay = document.getElementById("cps");
  const recordDisplay = document.getElementById("record-display");
  const clicksTotalesDisplay = document.getElementById("clics-totales");
  const mensajeRecord = document.getElementById("mensaje-record");

  let clickTimes = [];       
  let todosLosClicks = [];   
  let clicksTotales = 0;
  let sessionActiva = false;
  let timeout = null;
  let intervalo = null;

  let record = parseFloat(localStorage.getItem("recordClicker")) || 0;
  recordDisplay.textContent = record;

  function actualizarCPS() {
    const ahora = Date.now();
    clickTimes = clickTimes.filter(t => ahora - t <= 1000);
    const cps = clickTimes.length;
    cpsDisplay.textContent = cps;
  }

  function terminarSesion() {
    sessionActiva = false;
    clearInterval(intervalo);

    let maxCPS = 0;
    for (let i = 0; i < todosLosClicks.length; i++) {
      const ventana = todosLosClicks.filter(t => t >= todosLosClicks[i] && t <= todosLosClicks[i] + 1000).length;
      if (ventana > maxCPS) maxCPS = ventana;
    }

    if (maxCPS > record) {
      record = maxCPS;
      localStorage.setItem("recordClicker", record.toString());
      recordDisplay.textContent = record;
      mostrarMensajeRecord();
    }

    clickTimes = [];
    todosLosClicks = [];
    cpsDisplay.textContent = "0";
  }

  function mostrarMensajeRecord() {
    mensajeRecord.classList.remove("hidden");
    mensajeRecord.classList.add("show");
    setTimeout(() => {
      mensajeRecord.classList.remove("show");
      mensajeRecord.classList.add("hidden");
    }, 2500);
  }

  function animarMando() {
    mando.classList.remove("click-anim");
    void mando.offsetWidth; 
    mando.classList.add("click-anim");
  }

  function crearParticula(x, y) {
    const particle = document.createElement("div");
    particle.classList.add("particula");
    particle.textContent = "+1";

    const offsetX = (Math.random() - 0.5) * 60;
    particle.style.left = `${x + offsetX}px`;
    particle.style.top = `${y}px`;

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 800);
  }

  mando.addEventListener("click", (e) => {
    const ahora = Date.now();

    if (!sessionActiva) {
      sessionActiva = true;
      clicksTotales = 0;
      todosLosClicks = [];
      intervalo = setInterval(actualizarCPS, 100);
    }

    clickTimes.push(ahora);
    todosLosClicks.push(ahora);
    clicksTotales++;
    if (clicksTotalesDisplay) clicksTotalesDisplay.textContent = clicksTotales;

    actualizarCPS();
    animarMando();

    const rect = mando.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top;
    crearParticula(cx, cy);

    clearTimeout(timeout);
    timeout = setTimeout(terminarSesion, 1500);
  });
});
