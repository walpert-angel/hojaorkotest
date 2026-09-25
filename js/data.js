const personaje = {
    nombre: "Ghazghkull",
    clase: "Fighter",
    subclase: "Gladiador",
    rol: "Tank / Fighter",
    nivel: 5,
    Raza: "Orko",
    trasfondo: "Duro",
    alineamiento: "Caotico neutral",
    xp: 6500,

    proficiency: 3,

    stats: {
        str: 13,   // +1
        dex: 10,  // 0 
        con: 16,  // +3 
        int: 9,  // -1 
        wis: 9,  // -1 
        cha: 19   // +4
    },

    salvaciones: {
        str: { nombre: "Fuerza", stat: "str", prof: true, total: 2 },
        dex: { nombre: "Destreza", stat: "dex", prof: false, total: 0 },
        con: { nombre: "Constitución", stat: "con", prof: true, total: 6 },
        int: { nombre: "Inteligencia", stat: "int", prof: false, total: -1 },
        wis: { nombre: "Sabiduría", stat: "wis", prof: true, total: -1 },
        cha: { nombre: "Carisma", stat: "cha", prof: false, total: 4 }
    },

    combate: {
        ca: 19,
        iniciativa: "0",
        velocidad: "30 ft",
        hp_max: 55,
        hp_actual: 55,
        hp_temp: 0,
        cd_conjuros: 15,
        ataque_conjuros: "+7"
    },

    recursos: {
        forma_salvaje: { actual: 3, max: 3, desc: "Recupera 1 en Descanso Corto, todos en Descanso Largo" },// segundo aliento
        balsamo_fey: { actual: 4, max: 4, desc: "5d6 dados de energía fey. Gasta hasta 2 dados/uso (Acción Adicional, 120 ft). Recarga en Descanso Largo." },//brutalidad
        conjuros_l1: { actual: 3, max: 3, desc: "Espacios de Nivel 1" },//Muerte
        conjuros_l2: { actual: 3, max: 3, desc: "Espacios de Nivel 2" },//adrenalina
        conjuros_l3: { actual: 2, max: 2, desc: "Espacios de Nivel 3" },//
        detectar_magia: { actual: 1, max: 1, desc: "1 lanzamiento gratuito por día (Linaje Alto Elfo)" }//
    },

    skills: {
        acrobacias: { stat: "cha", prof: true },
        atletismo: { stat: "cha", prof: true },
        arcano: { stat: "int", prof: false },
        engaño: { stat: "cha", prof: false },
        historia: { stat: "int", prof: false },
        interpretacion: { stat: "cha", prof: false },
        intimidacion: { stat: "cha", prof: true },
        investigacion: { stat: "int", prof: false },
        juego_manos: { stat: "dex", prof: false },
        medicina: { stat: "wis", prof: false },
        naturaleza: { stat: "int", prof: false },
        percepcion: { stat: "wis", prof: false },
        perspicacia: { stat: "wis", prof: false },
        persuasion: { stat: "cha", prof: false },
        religion: { stat: "int", prof: false },
        sigilo: { stat: "dex", prof: false },
        supervivencia: { stat: "wis", prof: false },
        trato_animales: { stat: "wis", prof: false }
    },

    Conjuros: [
        // Nivel 1 (-1 puntos de muerte)
        { 
            nivel: 1,
            nombre: "Golpe furioso (wrathful-smite)", 
            bono: "Acción Adicional | Personal | Duración: 1 minuto. | con desventaja", 
            daño: "+ 1d6 necrótico y debe superar una tirada de salvación de Sabiduría o quedará aterrorizado hasta que termine el conjuro. Al final de cada uno de sus turnos, el objetivo aterrorizado repite la tirada de salvación, terminando el conjuro sobre sí mismo si tiene éxito" 
        },
    ],

    Trucos: [
        "Golpe certero (true-strike) [Acción - +7,  +1d6 + 4 radiante o el tipo de daño normal del arma (a tu elección).]",
        "Rocío venenoso (blade-ward) [Concentración, 1 minuto, el atacante resta 1d4 a la tirada de ataque]",     
    ],

    equipo: [
        "Armadura de férula",
        "Escudo",
        "Espada larga",
        "Espada corta",
    ],

    competencias: {
        armaduras: "Armaduras ligeras, medianas y pesadas, y escudos",
        armas: "Armas simples y marciales",
        herramientas: " ",
        idiomas: "Común, y orko"
    },

    notas: [
        "Racial Visión nocturna. Tienes visión nocturna con un alcance de 120 pies.",
        "Resistencia implacable. Cuando tus puntos de golpe se reducen a 0, pero no mueres instantáneamente, puedes quedarte con 1 punto de golpe. Una vez que uses esta habilidad, no podrás volver a usarla hasta que completes un descanso prolongado.",
        "Subidón de adrenalina. Puedes realizar la acción de Correr como acción adicional. Al hacerlo, obtienes una cantidad de Puntos de Golpe Temporales igual a tu Bonificador de Competencia. Puedes usar este rasgo un número de veces igual a tu Bonificador de Competencia, y recuperas todos los usos gastados cuando finalizas un Descanso Corto o Largo.",
        "Nivel 2: Oleada de acción",
        "Nivel 2: Mente táctica. Cuando fallas una tirada de habilidad, puedes usar tu Segundo Aliento para intentar superarla. En lugar de recuperar Puntos de Golpe, tiras 1d10 y sumas el resultado a la tirada , pudiendo convertirla en un éxito. Si la tirada sigue fallando, no se consume este uso de Segundo Aliento.",
        "Nivel 5: Ataque extra",
        "Nivel 5: Cambio táctico. Siempre que actives tu Segundo Aliento con una Acción Adicional, puedes moverte hasta la mitad de tu Velocidad sin provocar Ataques de Oportunidad.",
    ],

    conjurosAlternativos: [
        {
            nivel: 1,
            nombre: "Buenas bayas (Goodberry)", 
            bono: "Acción | Al tocar", 
            daño: "Crea 10 bayas mágicas. Cada una cura 1 HP y nutre por 1 día (duran 24h)" 
        },
        {
            nivel: 3,
            nombre: "Disipar magia (Dispel Magic)", 
            bono: "Acción | 120 ft", 
            daño: "Disipa conjuros de Nivel 3 o menor automáticamente; o tirada de Sabiduría (+7) vs CD 10 + nivel" 
        },
        {
            nivel: 3,
            nombre: "Invocar a feérico (Summon Fey)", 
            bono: "1 Acción | 90 ft", 
            daño: "Concentración (1 hora). Invoca un espíritu feérico que lucha por ti." 
        }
    ]
};


