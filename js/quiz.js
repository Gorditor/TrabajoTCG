document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DEL DOM ---
  const pantallaInicio = document.getElementById("pantalla-inicio");
  const pantallaQuiz = document.getElementById("pantalla-quiz");
  const pantallaResultado = document.getElementById("pantalla-resultado");
  const pantallaCarga = document.getElementById("pantalla-carga");
  const pantallaError = document.getElementById("pantalla-error");

  const btnIniciar = document.getElementById("btn-iniciar");
  const btnReintentar = document.getElementById("btn-reintentar");
  const btnReintentarError = document.getElementById("btn-reintentar-error");
  const numPreguntasSelect = document.getElementById("num-preguntas");

  const progresoEl = document.getElementById("progreso");
  const puntuacionLiveEl = document.getElementById("puntuacion-live");
  const barraFill = document.getElementById("barra-fill");
  const preguntaTextoEl = document.getElementById("pregunta-texto");
  const respuestasEl = document.getElementById("respuestas");

  const resultadoTitulo = document.getElementById("resultado-titulo");
  const resultadoTexto = document.getElementById("resultado-texto");
  const resultadoScore = document.getElementById("resultado-score");

  // --- ESTADO ---
  let preguntas = [];
  let indiceActual = 0;
  let puntuacion = 0;
  let respondido = false;

  // --- FUNCIONES DE PANTALLA ---
  function mostrar(seccion) {
    [pantallaInicio, pantallaQuiz, pantallaResultado, pantallaCarga, pantallaError]
      .forEach(s => s.classList.add("hidden"));
    seccion.classList.remove("hidden");
  }

  // --- DECODIFICAR HTML ENTITIES (la API devuelve &amp; etc) ---
  function decode(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  // --- OBTENER PREGUNTAS DE LA API ---
  async function cargarPreguntas(cantidad) {
    mostrar(pantallaCarga);
    // Categoría 15 = Video Games en OpenTriviaDB
    const url = `https://opentdb.com/api.php?amount=${cantidad}&category=15&type=multiple`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error de red");
      const data = await res.json();
      if (data.response_code !== 0 || data.results.length === 0) {
        throw new Error("Sin preguntas");
      }
      preguntas = data.results;
      indiceActual = 0;
      puntuacion = 0;
      mostrar(pantallaQuiz);
      mostrarPregunta();
    } catch (err) {
      mostrar(pantallaError);
    }
  }

  // --- MOSTRAR PREGUNTA ACTUAL ---
  function mostrarPregunta() {
    respondido = false;
    const p = preguntas[indiceActual];
    const total = preguntas.length;

    // Progreso
    progresoEl.textContent = `Pregunta ${indiceActual + 1} de ${total}`;
    puntuacionLiveEl.textContent = `✅ ${puntuacion}`;
    barraFill.style.width = `${((indiceActual) / total) * 100}%`;

    // Pregunta
    preguntaTextoEl.textContent = decode(p.question);

    // Mezclar respuestas
    const respuestas = [...p.incorrect_answers, p.correct_answer]
      .map(decode)
      .sort(() => Math.random() - 0.5);

    respuestasEl.innerHTML = "";
    respuestas.forEach(resp => {
      const btn = document.createElement("button");
      btn.textContent = resp;
      btn.classList.add("resp-btn");
      btn.addEventListener("click", () => seleccionarRespuesta(btn, resp, decode(p.correct_answer)));
      respuestasEl.appendChild(btn);
    });
  }

  // --- SELECCIONAR RESPUESTA ---
  function seleccionarRespuesta(btnSeleccionado, respuesta, correcta) {
    if (respondido) return;
    respondido = true;

    const botones = respuestasEl.querySelectorAll(".resp-btn");

    botones.forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === correcta) {
        btn.classList.add("correcta");
      }
    });

    if (respuesta === correcta) {
      puntuacion++;
      btnSeleccionado.classList.add("correcta");
    } else {
      btnSeleccionado.classList.add("incorrecta");
    }

    // Pasar a la siguiente después de 1.2s
    setTimeout(() => {
      indiceActual++;
      if (indiceActual < preguntas.length) {
        mostrarPregunta();
      } else {
        mostrarResultado();
      }
    }, 1200);
  }

  // --- MOSTRAR RESULTADO ---
  function mostrarResultado() {
    const total = preguntas.length;
    const porcentaje = Math.round((puntuacion / total) * 100);

    barraFill.style.width = "100%";

    // Guardar récord en localStorage
    const recordAnterior = parseInt(localStorage.getItem("recordQuiz") || "0");
    if (puntuacion > recordAnterior) {
      localStorage.setItem("recordQuiz", puntuacion.toString());
    }

    // Mensaje según resultado
    let titulo, texto;
    if (porcentaje >= 80) {
      titulo = "🏆 ¡Excelente!";
      texto = "Eres un verdadero experto en videojuegos.";
    } else if (porcentaje >= 50) {
      titulo = "👍 ¡Bien hecho!";
      texto = "Tienes buenos conocimientos, pero puedes mejorar.";
    } else {
      titulo = "😅 Sigue intentándolo";
      texto = "Practica más y vuelve a intentarlo.";
    }

    resultadoTitulo.textContent = titulo;
    resultadoTexto.textContent = texto;
    resultadoScore.textContent = `${puntuacion} / ${total} (${porcentaje}%)`;

    mostrar(pantallaResultado);
  }

  // --- EVENTOS ---
  btnIniciar.addEventListener("click", () => {
    const cantidad = parseInt(numPreguntasSelect.value);
    cargarPreguntas(cantidad);
  });

  btnReintentar.addEventListener("click", () => {
    mostrar(pantallaInicio);
  });

  btnReintentarError.addEventListener("click", () => {
    mostrar(pantallaInicio);
  });
});
