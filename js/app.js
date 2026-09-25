function mod(val) {
    return Math.floor((val - 10) / 2);
}

function init() {
    verificarNivelYResetearHP();
    renderInfo();
    renderStats();
    renderSaves();
    renderCombat();
    renderRecursos();
    renderSkills();
    renderCompetencias();
    initDreamsSubclass();
    renderConjuros();
    renderExtras();
}

/* DETECTAR CAMBIO DE NIVEL Y LIMPIAR CACHÉ DE HP/RECURSOS */
function verificarNivelYResetearHP() {
    let storedLvl = localStorage.getItem("personaje_nivel");
    if (storedLvl !== String(personaje.nivel)) {
        localStorage.setItem("personaje_nivel", personaje.nivel);
        localStorage.setItem("hp_max", personaje.combate.hp_max);
        localStorage.setItem("hp_actual", personaje.combate.hp_max);
        resetRecursos();
    }
}

/* INFO */
function renderInfo() {
    document.getElementById("nombre").innerText = personaje.nombre;
    document.getElementById("info").innerText =
        `${personaje.clase} (${personaje.subclase}) Nvl ${personaje.nivel} - ${personaje.Raza} | ${personaje.trasfondo} | ${personaje.alineamiento}`;
}

/* STATS */
function renderStats() {
    let container = document.getElementById("stats");
    container.innerHTML = "";

    Object.entries(personaje.stats).forEach(([key, val]) => {
        let m = mod(val);

        container.innerHTML += `
            <div class="box">
                <b>${key.toUpperCase()}</b>
                <div>${val}</div>
                <div style="font-weight: bold; color: #8d2b24;">${m >= 0 ? "+" : ""}${m}</div>
            </div>
        `;
    });
}

/* SALVACIONES */
function renderSaves() {
    let container = document.getElementById("saves");
    if (!container) return;
    container.innerHTML = "";

    Object.entries(personaje.salvaciones).forEach(([key, s]) => {
        let isProf = s.prof;
        let sign = s.total >= 0 ? "+" : "";

        container.innerHTML += `
            <div class="save-box ${isProf ? "prof" : ""}">
                <b>${isProf ? "● " : "○ "}${key.toUpperCase()}</b>
                <div class="save-bonus">${sign}${s.total}</div>
            </div>
        `;
    });
}

/* COMBATE */
function renderCombat() {
    const c = personaje.combate;

    document.getElementById("combate").innerHTML = `
        <div class="hp-box">
            <div style="display: flex; justify-content: space-around; width: 100%; font-size: 1.15em; font-weight: bold; color: #3e2723; flex-wrap: wrap; gap: 8px;">
                <span>🛡️ CA: ${c.ca}</span>
                <span>⚡ Iniciativa: ${c.iniciativa}</span>
                <span>🏃 Velocidad: ${c.velocidad}</span>
            </div>
            <div style="display: flex; justify-content: space-around; width: 100%; font-size: 1.05em; color: #8d2b24; font-weight: bold; border-top: 1px dashed #8d5c46; padding-top: 5px;">
                <span>🔮 CD Conjuros: ${c.cd_conjuros}</span>
                <span>🎯 Ataque Truco: ${c.ataque_conjuros}</span>
            </div>

            <div class="hp-inputs" style="margin-top: 4px;">
                ❤️ 
                <input type="number" id="hpActual" value="${localStorage.getItem("hp_actual") || c.hp_actual}">
                /
                <input type="number" id="hpMax" value="${localStorage.getItem("hp_max") || c.hp_max}">
            </div>

            <div class="hp-bar-container">
                <div class="hp-bar" id="hpBar"></div>
                <div class="hp-temp" id="hpTemp"></div>
            </div>
        </div>
    `;

    bindHPEvents();
    actualizarHP();
}

/* HP LOGIC */
function actualizarHP() {
    let actualInput = document.getElementById("hpActual");
    let maxInput = document.getElementById("hpMax");
    if (!actualInput || !maxInput) return;

    let actual = parseInt(actualInput.value);
    let max = parseInt(maxInput.value);

    if (max <= 0) max = 1;
    if (actual < 0) actual = 0;

    const hpBar = document.getElementById("hpBar");
    const hpTemp = document.getElementById("hpTemp");

    let normal = Math.min(actual, max);
    let temp = Math.max(actual - max, 0);

    let normalPercent = (normal / max) * 100;
    let tempPercent = (temp / max) * 100;

    /* VIDA NORMAL */
    hpBar.style.width = normalPercent + "%";

    if (normalPercent > 60) hpBar.style.background = "#4caf50";
    else if (normalPercent > 30) hpBar.style.background = "#ffc107";
    else hpBar.style.background = "#f44336";

    /* VIDA TEMPORAL */
    hpTemp.style.width = tempPercent + "%";
    localStorage.setItem("hp_actual", actual);
    localStorage.setItem("hp_max", max);
}

function bindHPEvents() {
    document.getElementById("hpActual").addEventListener("input", actualizarHP);
    document.getElementById("hpMax").addEventListener("input", actualizarHP);
}

/* RECURSOS INTERACTIVOS */
function renderRecursos() {
    let container = document.getElementById("recursos");
    if (!container) return;

    container.innerHTML = `
        <div class="recursos-wrapper">
            <div class="recurso-group">
                <div class="recurso-header">
                    <span> 😮‍💨 Segundo aliento </span>
                    <span class="recurso-count" id="count-forma_salvaje"></span>
                </div>
                <div class="slots-container" id="slots-forma_salvaje"></div>
            </div>
            
            <div class="recurso-group">
                <div class="recurso-header">
                    <span> 💥 puntos de brutalidad </span>
                    <span class="recurso-count" id="count-balsamo_fey"></span>
                </div>
                <div class="slots-container" id="slots-balsamo_fey"></div>
            </div>

            <div class="recurso-group">
                <div class="recurso-header">
                    <span>💀 puntos de Muerte </span>
                    <span class="recurso-count" id="count-conjuros_l1"></span>
                </div>
                <div class="slots-container" id="slots-conjuros_l1"></div>
            </div>

            <div class="recurso-group">
                <div class="recurso-header">
                    <span> 🏃  Subidón de adrenalina </span>
                    <span class="recurso-count" id="count-conjuros_l2"></span>
                </div>
                <div class="slots-container" id="slots-conjuros_l2"></div>
            </div>

            /////

            <div class="rest-buttons">
                <button class="rest-btn short-rest" id="btnShortRest">🔋 Descanso Corto</button>
                <button class="rest-btn long-rest" id="btnLongRest">🏕️ Descanso Largo</button>
            </div>
        </div>
    `;

    renderSlotsGroup("forma_salvaje", personaje.recursos.forma_salvaje.max, "celeste");
    renderSlotsGroup("balsamo_fey", personaje.recursos.balsamo_fey.max, "rosa");
    renderSlotsGroup("conjuros_l1", personaje.recursos.conjuros_l1.max, "azul");
    renderSlotsGroup("conjuros_l2", personaje.recursos.conjuros_l2.max, "azul");
    renderSlotsGroup("conjuros_l3", personaje.recursos.conjuros_l3.max, "violeta");
    renderSlotsGroup("detectar_magia", personaje.recursos.detectar_magia.max, "oro");

    document.getElementById("btnShortRest").addEventListener("click", realizarDescansoCorto);
    document.getElementById("btnLongRest").addEventListener("click", realizarDescansoLargo);
}

function renderSlotsGroup(key, max, colorClass) {
    let states = getRecursoEstado(key, max);
    let slotsContainer = document.getElementById(`slots-${key}`);
    let countLabel = document.getElementById(`count-${key}`);
    
    if (!slotsContainer || !countLabel) return;
    
    slotsContainer.innerHTML = "";
    let activeCount = states.filter(Boolean).length;
    countLabel.innerText = `${activeCount} / ${max}`;

    states.forEach((isActive, idx) => {
        let slot = document.createElement("div");
        slot.className = `resource-slot ${colorClass} ${isActive ? "active" : "spent"}`;
        slot.setAttribute("role", "checkbox");
        slot.setAttribute("aria-checked", isActive);
        slot.title = `Slot ${idx + 1} de ${max} (${isActive ? "Disponible" : "Gastado"})`;
        
        slot.addEventListener("click", () => {
            states[idx] = !states[idx];
            setRecursoEstado(key, states);
            renderSlotsGroup(key, max, colorClass);
            if (key === "balsamo_fey") {
                actualizarDisplayBalsamo();
            }
        });

        slotsContainer.appendChild(slot);
    });
}

function getRecursoEstado(key, max) {
    let val = localStorage.getItem("recurso_" + key);
    if (val) {
        try {
            let arr = JSON.parse(val);
            if (arr.length === max) return arr;
        } catch(e) {}
    }
    return Array(max).fill(true);
}

function setRecursoEstado(key, arr) {
    localStorage.setItem("recurso_" + key, JSON.stringify(arr));
}

function resetRecurso(key, max) {
    let arr = Array(max).fill(true);
    setRecursoEstado(key, arr);
}

function realizarDescansoCorto() {
    resetRecurso("forma_salvaje", personaje.recursos.forma_salvaje.max);
    resetRecurso("balsamo_fey", personaje.recursos.balsamo_fey.max);
    resetRecurso("conjuros_l2", personaje.recursos.conjuros_l2.max);
    resetRecurso("conjuros_l3", personaje.recursos.conjuros_l3.max);
    resetRecurso("detectar_magia", personaje.recursos.detectar_magia.max);

    let maxHP = parseInt(document.getElementById("hpMax").value) || personaje.combate.hp_max;
    document.getElementById("hpActual").value = maxHP;
    actualizarHP();

    renderSlotsGroup("forma_salvaje", personaje.recursos.forma_salvaje.max, "celeste");
    renderSlotsGroup("balsamo_fey", personaje.recursos.balsamo_fey.max, "rosa");
    renderSlotsGroup("conjuros_l2", personaje.recursos.conjuros_l2.max, "azul");
    renderSlotsGroup("conjuros_l3", personaje.recursos.conjuros_l3.max, "violeta");
    renderSlotsGroup("detectar_magia", personaje.recursos.detectar_magia.max, "oro");
}

function realizarDescansoLargo() {
    resetRecurso("forma_salvaje", personaje.recursos.forma_salvaje.max);
    resetRecurso("balsamo_fey", personaje.recursos.balsamo_fey.max);
    resetRecurso("conjuros_l1", personaje.recursos.conjuros_l1.max);
    resetRecurso("conjuros_l2", personaje.recursos.conjuros_l2.max);
    resetRecurso("conjuros_l3", personaje.recursos.conjuros_l3.max);
    resetRecurso("detectar_magia", personaje.recursos.detectar_magia.max);

    let maxHP = parseInt(document.getElementById("hpMax").value) || personaje.combate.hp_max;
    document.getElementById("hpActual").value = maxHP;
    actualizarHP();

    renderSlotsGroup("forma_salvaje", personaje.recursos.forma_salvaje.max, "celeste");
    renderSlotsGroup("balsamo_fey", personaje.recursos.balsamo_fey.max, "rosa");
    renderSlotsGroup("conjuros_l1", personaje.recursos.conjuros_l1.max, "azul");
    renderSlotsGroup("conjuros_l2", personaje.recursos.conjuros_l2.max, "azul");
    renderSlotsGroup("conjuros_l3", personaje.recursos.conjuros_l3.max, "violeta");
    renderSlotsGroup("detectar_magia", personaje.recursos.detectar_magia.max, "oro");
    
    actualizarDisplayBalsamo();
    alert("🏕️ ¡Descanso largo realizado! Se restauró tu salud (48 PV), todos tus espacios de conjuro y tus 5d6 de Bálsamo Fey.");
}

function resetRecursos() {
    resetRecurso("forma_salvaje", personaje.recursos.forma_salvaje.max);
    resetRecurso("balsamo_fey", personaje.recursos.balsamo_fey.max);
    resetRecurso("conjuros_l1", personaje.recursos.conjuros_l1.max);
    resetRecurso("conjuros_l2", personaje.recursos.conjuros_l2.max);
    resetRecurso("conjuros_l3", personaje.recursos.conjuros_l3.max);
    resetRecurso("detectar_magia", personaje.recursos.detectar_magia.max);
}

/* SKILLS */
function renderSkills() {
    let container = document.getElementById("skills");
    container.innerHTML = "";

    Object.entries(personaje.skills).forEach(([name, data]) => {
        let baseMod = mod(personaje.stats[data.stat]);
        let total = baseMod + (data.prof ? personaje.proficiency : 0);
        let displayName = formatSkillName(name);

        container.innerHTML += `
            <div class="skill">
                <span>${data.prof ? "●" : "○"} ${displayName}</span>
                <span style="font-weight: ${data.prof ? "bold" : "normal"}; color: ${data.prof ? "#8d2b24" : "inherit"}">${total >= 0 ? "+" : ""}${total}</span>
            </div>
        `;
    });
}

function formatSkillName(name) {
    let formatted = name.replace(/_/g, " ");
    
    const traducciones = {
        "acrobacias": "Acrobacias",
        "atletismo": "Atletismo",
        "arcano": "Arcano",
        "engaño": "Engaño",
        "historia": "Historia",
        "interpretacion": "Interpretación",
        "intimidacion": "Intimidación",
        "investigacion": "Investigación",
        "juego manos": "Juego de manos",
        "medicina": "Medicina",
        "naturaleza": "Naturaleza",
        "percepcion": "Percepción",
        "perspicacia": "Perspicacia",
        "persuasion": "Persuasión",
        "religion": "Religión",
        "sigilo": "Sigilo",
        "supervivencia": "Supervivencia",
        "trato animales": "Trato con animales"
    };

    if (traducciones[name]) return traducciones[name];
    if (traducciones[formatted]) return traducciones[formatted];
    
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/* COMPETENCIAS E IDIOMAS */
function renderCompetencias() {
    let container = document.getElementById("competencias");
    if (!container) return;
    const comp = personaje.competencias;
    container.innerHTML = `
        <div>🛡️ <strong>Armaduras:</strong> ${comp.armaduras}</div>
        <div>⚔️ <strong>Armas:</strong> ${comp.armas}</div>
        <div>🌿 <strong>Herramientas:</strong> ${comp.herramientas}</div>
        <div>🗣️ <strong>Idiomas:</strong> ${comp.idiomas}</div>
    `;
}

/* SUBCLASE: CÍRCULO DE LOS SUEÑOS */
function initDreamsSubclass() {
    actualizarDisplayBalsamo();

    const btn1 = document.getElementById("btn-balsamo-1");
    const btn2 = document.getElementById("btn-balsamo-2");

    if (btn1) {
        btn1.onclick = () => usarBalsamoDeVerano(1);
    }
    if (btn2) {
        btn2.onclick = () => usarBalsamoDeVerano(2);
    }
}

function actualizarDisplayBalsamo() {
    let key = "balsamo_fey";
    let max = personaje.recursos.balsamo_fey.max;
    let states = getRecursoEstado(key, max);
    let disponibles = states.filter(Boolean).length;

    let display = document.getElementById("balsamo-pool-display");
    if (display) {
        display.innerText = `${disponibles} / ${max} d6 disponibles`;
    }
}

function usarBalsamoDeVerano(cantidadDados) {
    let key = "balsamo_fey";
    let max = personaje.recursos.balsamo_fey.max;
    let states = getRecursoEstado(key, max);
    let disponibles = states.filter(Boolean).length;

    if (disponibles < cantidadDados) {
        alert(`❌ No tienes suficientes dados feéricos disponibles (tienes ${disponibles}, necesitas ${cantidadDados}). ¡Realiza un descanso largo para recargarlos!`);
        return;
    }

    let dadosGastados = 0;
    let tiradas = [];
    let sumaCuracion = 0;

    for (let i = 0; i < states.length && dadosGastados < cantidadDados; i++) {
        if (states[i]) {
            states[i] = false;
            dadosGastados++;
            let roll = Math.floor(Math.random() * 6) + 1;
            tiradas.push(roll);
            sumaCuracion += roll;
        }
    }

    setRecursoEstado(key, states);
    renderSlotsGroup(key, max, "rosa");
    actualizarDisplayBalsamo();

    let tempHP = cantidadDados;
    let detalleTirada = tiradas.length > 1 ? ` (${tiradas.join(" + ")})` : "";

    alert(`🌸 ¡BÁLSAMO DE LA CORTE DE VERANO!
Acción Adicional | Alcance: 120 pies

Has canalizado ${cantidadDados} dado(s) d6 de energía fey:
• 💖 Curación restaurada: ${sumaCuracion} HP${detalleTirada}
• 🛡️ Puntos de Golpe Temporales: +${tempHP} PV temp
• Reserva restante: ${disponibles - cantidadDados} / ${max} d6

¡Recuerda: NO es un conjuro, tu Acción principal queda libre para atacar o conjurar!`);
}

/* CONJUROS */
function renderConjuros() {
    let container = document.getElementById("Conjuros");
    if (!container) return;

    let html = "";
    const niveles = [
        { lvl: 1, titulo: "Nivel 1 (4 Espacios de Conjuro)", badge: "4 preparados" },
        { lvl: 2, titulo: "Nivel 2 (3 Espacios de Conjuro)", badge: "3 preparados" },
        { lvl: 3, titulo: "Nivel 3 (2 Espacios de Conjuro)", badge: "2 preparados" }
    ];

    niveles.forEach(n => {
        let spellsOfLevel = personaje.Conjuros.filter(c => c.nivel === n.lvl);
        if (spellsOfLevel.length > 0) {
            html += `
                <div class="spell-category-header">
                    <span>📖 ${n.titulo}</span>
                    <span style="font-size: 0.9em; opacity: 0.85;">${n.badge}</span>
                </div>
            `;
            spellsOfLevel.forEach(c => {
                html += `
                    <div class="spell-item">
                        <b>${c.nombre}</b> <span class="spell-bono">(${c.bono})</span>: 
                        <span class="spell-dmg">${c.daño}</span>
                    </div>
                `;
            });
        }
    });

    container.innerHTML = html;

    // Renderizar conjuros alternativos
    let altContainer = document.getElementById("conjuros-alternativos");
    if (altContainer && personaje.conjurosAlternativos) {
        let altHtml = "";
        personaje.conjurosAlternativos.forEach(c => {
            altHtml += `
                <div class="spell-item" style="opacity: 0.85; border-left-color: #78909c;">
                    <b>${c.nombre}</b> <span class="spell-bono">(Nivel ${c.nivel} | ${c.bono})</span>: 
                    <span class="spell-dmg">${c.daño}</span>
                </div>
            `;
        });
        altContainer.innerHTML = altHtml;
    }
}

/* EXTRAS */
function renderExtras() {
    // Trucos
    document.getElementById("Trucos").innerHTML = personaje.Trucos.map(t => 
        `<div class="spell-item" style="border-left-color: #5c6bc0; margin-bottom: 5px;">✨ <b>${t}</b></div>`
    ).join("");

    // Equipo
    document.getElementById("equipo").innerHTML =
        "<ul>" + personaje.equipo.map(e => {
            if (e.toLowerCase().includes("oro")) {
                return `<li>💰 <strong>${e}</strong></li>`;
            }
            return `<li>${e}</li>`;
        }).join("") + "</ul>";
    
    // Notas y Rasgos
    let notasHtml = "<ul>" + personaje.notas.map(n => `<li>${n.trim()}</li>`).join("") + "</ul>";
    document.getElementById("notas").innerHTML = notasHtml;
}

/* INIT ON LOAD */
document.addEventListener("DOMContentLoaded", init);