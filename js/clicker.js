document.addEventListener("DOMContentLoaded", () => {
  const mando = document.getElementById("mando");
  const cpsDisplay = document.getElementById("cps");

  let clicks = 0;
  let startTime = null;
  let running = false;

  function update() {
    if (running) {
      const elapsed = (Date.now() - startTime) / 1000;
      const cps = (clicks / elapsed).toFixed(2);
      cpsDisplay.textContent = cps;
      requestAnimationFrame(update);
    }
  }

  mando.addEventListener("click", () => {
    if (!running) {
      startTime = Date.now();
      running = true;
      requestAnimationFrame(update);
    }
    clicks++;
  });
});
