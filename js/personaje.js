document.addEventListener("DOMContentLoaded", () => {

  const CLASES = {
    guerrero: {
      nombre: "Guerrero",
      emoji: "⚔️",
      descripcion: "Tanque resistente con alta fuerza.",
      color: "#e05252",
      base: { vida: 18, fuerza: 16, magia: 4, velocidad: 8, defensa: 14 }
    },
    mago: {
      nombre: "Mago",
      emoji: "🔮",
      descripcion: "Gran poder mágico pero frágil.",
      color: "#7b52e0",
      base: { vida: 10, fuerza: 4, magia: 20, velocidad: 10, defensa: 6 }
    },
    arquero: {
      nombre: "Arquero",
      emoji: "🏹",
      descripcion: "Veloz y preciso a distancia.",
      color: "#52b052",
      base: { vida: 12, fuerza: 10, magia: 6, velocidad: 18, defensa: 8 }
    },
    asesino: {
      nombre: "Asesino",
      emoji: "🗡️",
      descripcion: "Extremadamente rápido y letal.",
      color: "#a0a0a0",
      base: { vida: 10, fuerza: 14, magia: 6, velocidad: 20, defensa: 6 }
    },
    paladin: {
      nombre: "Paladín",
      emoji: "🛡️",
      descripcion: "Equilibrado entre fuerza y magia.",
      color: "#e0c052",
      base: { vida: 14, fuerza: 12, magia: 12, velocidad: 8, defensa: 14 }
    }
  };

  const STATS_INFO = {
    vida:      { label: "Vida",      icon: "❤️" },
    fuerza:    { label: "Fuerza",    icon: "💪" },
    magia:     { label: "Magia",     icon: "✨" },
    velocidad: { label: "Velocidad", icon: "⚡" },
    defensa:   { label: "Defensa",   icon: "🛡️" }
  };

  const PUNTOS_EXTRA = 10;
  const MAX_STAT = 25;

  let claseActual = null;
  let statsActuales = {};
  let puntosRestantes = PUNTOS_EXTRA;

  const pantallaClase    = document.getElementById("pantalla-clase");
  const pantallaStats    = document.getElementById("pantalla-stats");
  const pantallaGuardado = document.getElementById("pantalla-guardado");
  const clasesGrid       = document.getElementById("clases-grid");
  const statsEditor      = document.getElementById("stats-editor");
  const puntosDisplay    = document.getElementById("puntos-display");
  const nombreInput      = document.getElementById("nombre-personaje");
  const btnGuardar       = document.getElementById("btn-guardar");
  const btnVolverClase   = document.getElementById("btn-volver-clase");
  const btnNuevo         = document.getElementById("btn-nuevo");
  const claseEmojiHeader = document.getElementById("clase-emoji-header");
  const claseNombreHeader= document.getElementById("clase-nombre-header");

  function mostrar(seccion) {
    [pantallaClase, pantallaStats, pantallaGuardado].forEach(s => s.classList.add("hidden"));
    seccion.classList.remove("hidden");
  }

  function renderClases() {
    clasesGrid.innerHTML = "";
    Object.entries(CLASES).forEach(([key, clase]) => {
      const card = document.createElement("div");
      card.className = "clase-card";
      card.style.setProperty("--clase-color", clase.color);
      card.innerHTML = `
        <div class="clase-emoji">${clase.emoji}</div>
        <div class="clase-nombre">${clase.nombre}</div>
        <div class="clase-desc">${clase.descripcion}</div>
        <div class="clase-stats-preview">
          ${Object.entries(clase.base).map(([stat, val]) =>
            `<div class="preview-stat">
              <span>${STATS_INFO[stat].icon}</span>
              <div class="preview-barra"><div class="preview-fill" style="width:${(val/25)*100}%"></div></div>
            </div>`
          ).join("")}
        </div>
      `;
      card.addEventListener("click", () => seleccionarClase(key));
      clasesGrid.appendChild(card);
    });
  }

  function seleccionarClase(key) {
    claseActual = key;
    const clase = CLASES[key];

    statsActuales = {};
    Object.entries(clase.base).forEach(([stat, val]) => {
      const variacion = Math.floor(Math.random() * 5) - 2; 
      statsActuales[stat] = Math.max(1, Math.min(MAX_STAT - 5, val + variacion));
    });

    puntosRestantes = PUNTOS_EXTRA;
    claseEmojiHeader.textContent = clase.emoji;
    claseNombreHeader.textContent = clase.nombre;

    renderStatsEditor();
    mostrar(pantallaStats);
  }

  function renderStatsEditor() {
    statsEditor.innerHTML = "";
    puntosDisplay.textContent = puntosRestantes;

    Object.entries(statsActuales).forEach(([stat, val]) => {
      const info = STATS_INFO[stat];
      const row = document.createElement("div");
      row.className = "stat-row";
      row.innerHTML = `
        <div class="stat-label-col">
          <span class="stat-icon">${info.icon}</span>
          <span class="stat-nombre">${info.label}</span>
        </div>
        <div class="stat-control">
          <button class="stat-btn menos" data-stat="${stat}">−</button>
          <div class="stat-barra-wrap">
            <div class="stat-barra">
              <div class="stat-fill" id="fill-${stat}" style="width:${(val/MAX_STAT)*100}%"></div>
            </div>
            <span class="stat-valor" id="val-${stat}">${val}</span>
          </div>
          <button class="stat-btn mas" data-stat="${stat}">+</button>
        </div>
      `;
      statsEditor.appendChild(row);
    });

    statsEditor.querySelectorAll(".stat-btn.mas").forEach(btn => {
      btn.addEventListener("click", () => ajustarStat(btn.dataset.stat, 1));
    });
    statsEditor.querySelectorAll(".stat-btn.menos").forEach(btn => {
      btn.addEventListener("click", () => ajustarStat(btn.dataset.stat, -1));
    });
  }

  function ajustarStat(stat, delta) {
    const base = CLASES[claseActual].base[stat];
    const actual = statsActuales[stat];
    const nuevo = actual + delta;

    if (delta > 0) {
      if (puntosRestantes <= 0 || nuevo > MAX_STAT) return;
      puntosRestantes--;
    } else {
      if (nuevo < 1 || nuevo < base - 3) return; 
      if (actual > CLASES[claseActual].base[stat] - 3) puntosRestantes++;
    }

    statsActuales[stat] = nuevo;
    document.getElementById(`val-${stat}`).textContent = nuevo;
    document.getElementById(`fill-${stat}`).style.width = `${(nuevo / MAX_STAT) * 100}%`;
    puntosDisplay.textContent = puntosRestantes;
  }

  btnGuardar.addEventListener("click", () => {
    const nombre = nombreInput.value.trim();
    if (!nombre) {
      nombreInput.focus();
      nombreInput.style.borderColor = "#ff4444";
      setTimeout(() => nombreInput.style.borderColor = "", 1500);
      return;
    }

    const personaje = {
      nombre,
      clase: claseActual,
      claseNombre: CLASES[claseActual].nombre,
      claseEmoji: CLASES[claseActual].emoji,
      stats: { ...statsActuales },
      nivel: 1,
      creadoEn: new Date().toLocaleDateString("es-ES")
    };

    localStorage.setItem("personajeIRB", JSON.stringify(personaje));
    mostrarPersonajeGuardado(personaje);
  });

  function mostrarPersonajeGuardado(p) {
    document.getElementById("guardado-emoji").textContent = p.claseEmoji;
    document.getElementById("guardado-nombre").textContent = p.nombre;
    document.getElementById("guardado-clase").textContent = `${p.claseNombre} · Nivel ${p.nivel}`;

    const statsGuardado = document.getElementById("stats-guardado");
    statsGuardado.innerHTML = Object.entries(p.stats).map(([stat, val]) => `
      <div class="stat-guardado-row">
        <span>${STATS_INFO[stat].icon} ${STATS_INFO[stat].label}</span>
        <div class="stat-barra mini">
          <div class="stat-fill" style="width:${(val/MAX_STAT)*100}%"></div>
        </div>
        <span class="stat-num">${val}</span>
      </div>
    `).join("");

    mostrar(pantallaGuardado);
  }

  btnVolverClase.addEventListener("click", () => mostrar(pantallaClase));

  btnNuevo.addEventListener("click", () => {
    nombreInput.value = "";
    mostrar(pantallaClase);
  });

  renderClases();
  const guardado = localStorage.getItem("personajeIRB");
  if (guardado) {
    mostrarPersonajeGuardado(JSON.parse(guardado));
  }
});
