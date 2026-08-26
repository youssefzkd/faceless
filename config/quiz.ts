/**
 * ============================================================================
 *  ARCHIVO ÚNICO DE CONFIGURACIÓN
 * ============================================================================
 *  Todo el contenido editable del embudo vive aquí: textos, preguntas,
 *  opciones, puntajes, umbrales, colores, números de WhatsApp e IDs de
 *  GoHighLevel.
 *
 *  NO hace falta saber programar para editarlo. Ver la sección
 *  "Cómo editar las preguntas desde GitHub" en el README.
 *
 *  Reglas simples para no romper nada:
 *   - Todo texto va entre comillas: "así".
 *   - Cada línea termina en coma.
 *   - Nunca cambies un `id`. Los ids conectan preguntas, puntajes y GHL.
 * ============================================================================
 */

/* ---------------------------------------------------------------- tipos --- */

export type Tier = "alto" | "medio" | "bajo";

export type QuestionOption = {
  /** No cambiar nunca. Se usa en puntajes y en GoHighLevel. */
  id: string;
  /** Texto visible para el usuario. Editable libremente. */
  label: string;
  /**
   * Valor EXACTO que espera GoHighLevel, cuando el campo reusado es de tipo
   * RADIO / SINGLE_OPTIONS. Esos campos solo aceptan sus opciones tal cual
   * están escritas allá (con sus tildes y sus rarezas), si no descartan el
   * dato. Si se omite, se manda el `label`.
   *
   * ⚠️ No lo toques salvo que cambies la opción en GoHighLevel también.
   */
  ghlValue?: string;
};

export type Question = {
  /** No cambiar nunca. */
  id: string;
  title: string;
  /** Nota gris opcional debajo de las opciones. */
  note?: string;
  options: QuestionOption[];
};

export type Resource = { src: string; alt: string };

/* ------------------------------------------------------------- branding --- */

export const brand = {
  colors: {
    primary: "#A32D2D",
    primaryHover: "#801F1F",
    primarySoft: "#FCEBEB",
    primaryDeep: "#501313",
    background: "#FFFFFF",
    text: "#0A0A0A",
    textMuted: "#5A5A5A",
    border: "#E0E0E0",
  },
} as const;

/* ------------------------------------------------------ textos de la UI --- */

/**
 * ⭐ NÚMERO DE PRUEBA SOCIAL
 * Cámbialo aquí UNA sola vez y se actualiza en todos los lugares donde
 * aparece (el pill de arriba y los bullets del final).
 */
export const socialProofCount = "+2.400";

/** Reemplaza {count} por socialProofCount en cualquier texto. */
export function withCount(text: string): string {
  return text.replace(/{count}/g, socialProofCount);
}

export const copy = {
  /** Pill de prueba social arriba del todo. {count} = socialProofCount */
  socialProof: "{count} canales lanzados",

  /** Titular en 3 líneas. La tercera va en rojo. */
  headline: {
    line1: "Recibe gratis el sistema",
    line2: "de canal faceless",
    accent: "en menos de 60 segundos",
  },

  /** Bullets con check al pie de la página. {count} = socialProofCount */
  closingBullets: ["Acceso inmediato, sin costo", "{count} personas ya lo tienen"],

  /** Texto legal en letra pequeña al pie. */
  legal:
    "Al dejar tus datos aceptás que Arcadia se ponga en contacto con vos por teléfono, mensaje o email usando la información ingresada. No vendemos tu información personal. Al enviar el formulario aceptás nuestra Política de Privacidad y nuestros Términos de Servicio.",

  /** Pantalla de datos de contacto (después de la pregunta 8). */
  contact: {
    title: "¿A dónde te enviamos el sistema?",
    subtitle: "Último paso. Revisamos cada solicitud a mano.",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Correo",
    emailPlaceholder: "tu@correo.com",
    phoneLabel: "Teléfono (WhatsApp)",
    channelLabel: "Enlace de tu canal de YouTube (opcional)",
    channelPlaceholder: "https://youtube.com/@tucanal",
    submit: "Recibir el sistema",
    submitting: "Enviando...",
    errors: {
      name: "Escribe tu nombre.",
      email: "Escribe un correo válido.",
      phone: "Escribe un número de teléfono válido.",
      generic: "No pudimos enviar tus datos. Intenta de nuevo.",
    },
  },

  /** Botón de volver a la pregunta anterior. */
  back: "Atrás",
} as const;

/**
 * Imágenes del abanico del hero.
 * Déjalo vacío ([]) para usar el abanico dibujado por CSS (lo que se ve hoy).
 * Para usar imágenes reales: súbelas a /public y agrégalas aquí en orden,
 * de izquierda a derecha. Exactamente 5 entradas.
 *
 * Ejemplo:
 *   export const heroResources: Resource[] = [
 *     { src: "/hero/1.png", alt: "Guion viral" },
 *     ...
 *   ];
 */
export const heroResources: Resource[] = [];

/**
 * Etiquetas de las tarjetas del abanico CSS (fallback sin imágenes).
 * Orden: izquierda → derecha. La central es la del dashboard.
 */
export const heroFallback = {
  /** Etiquetas de las 5 tarjetas, de izquierda a derecha. */
  cards: ["Guion viral", "Nichos rentables", "Dashboard", "Plan 30 días", "Prompts IA"],

  /** Subtítulo opcional de una tarjeta lateral (la clave es su etiqueta). */
  side: {
    "Nichos rentables": "Base de 40",
    "Plan 30 días": "4 semanas",
  } as Record<string, string>,

  /** Tarjeta central (la más grande). */
  center: {
    title: "Dashboard",
    subtitle: "Últimos 30 días",
    /**
     * ⭐ LA CIFRA GRANDE. Es lo primero que mira el visitante.
     * Que sea ambiciosa pero creíble: si es demasiado alta, el visitante
     * asume que es humo y la conversión cae.
     */
    metric: { label: "Ingresos del mes", value: "$6.240" },
    /** Dos métricas chicas. `accent: true` la pinta en rojo de marca. */
    small: [
      { label: "RPM", value: "$14.20", accent: false },
      { label: "Subs", value: "8.9K", accent: true },
    ],
  },
} as const;

/* ------------------------------------------------------------ preguntas --- */

export const questions: Question[] = [
  {
    id: "q1_estado",
    title: "¿En qué punto estás con YouTube?",
    options: [
      { id: "nunca", label: "Nunca lo he intentado" },
      { id: "abandone", label: "Lo intenté y lo dejé" },
      { id: "canal_sin_resultados", label: "Tengo canal pero sin resultados" },
      { id: "canal_sin_monetizar", label: "Tengo canal con views pero no monetiza" },
    ],
  },
  {
    id: "q2_ocupacion",
    title: "¿A qué te dedicas actualmente?",
    options: [
      { id: "empleado", label: "Empleado tiempo completo" },
      { id: "empleado_proyecto", label: "Empleado + proyecto propio" },
      { id: "freelance", label: "Freelance o negocio propio" },
      { id: "estudiante", label: "Estudiante" },
      { id: "sin_trabajo", label: "Sin trabajo ahora mismo" },
    ],
  },
  {
    id: "q3_tiempo",
    title: "¿Cuánto tiempo puedes dedicarle a la semana?",
    options: [
      { id: "menos_5", label: "Menos de 5 horas" },
      { id: "5_10", label: "Entre 5 y 10 horas" },
      { id: "10_20", label: "Entre 10 y 20 horas" },
      { id: "mas_20", label: "Más de 20 horas" },
    ],
  },
  {
    id: "q4_tecnica",
    title: "¿Tienes experiencia con el ordenador y manejo de programas?",
    note: "Ojo, esto es muy importante para nosotros (hablamos de experiencia con el ordenador, no con YouTube)",
    options: [
      { id: "bastante", label: "Bastante", ghlValue: "Bastante" },
      {
        id: "algo",
        label: "Algo de soltura (aunque nunca haya hecho esto)",
        ghlValue: "Algo de soltura (aunque nunca haya hecho esto)",
      },
      { id: "nada", label: "No, no sé hacer nada", ghlValue: "No, no se hacer nada" },
    ],
  },
  {
    id: "q5_inversion",
    title: "¿Cuánto estarías dispuesto a invertir en ti mismo para conseguir resultados?",
    note: "Esto no es el precio final de nuestros servicios.",
    options: [
      {
        id: "2000_3000",
        label: "Dispongo entre 2000€-3000€",
        ghlValue: "Dispongo entre 2000€-3000€ para invertir",
      },
      {
        id: "1000_2000",
        label: "Dispongo entre 1000€-2000€",
        ghlValue: "Dispongo entre 1000-2000€ para invertir",
      },
      {
        id: "300_500",
        label: "Dispongo entre +300-500€",
        ghlValue: "Dispongo entre +300-500€ para invertir",
      },
      {
        id: "menos_250",
        label: "Dispongo de menos de 250€ y me es imposible conseguirlos",
        ghlValue:
          "Dispongo de menos de 250€ para invertir ahora mismo y me es imposible conseguirlos",
      },
    ],
  },
  {
    id: "q6_ingreso",
    title: "¿De dónde viene tu ingreso principal hoy?",
    options: [
      { id: "sueldo_fijo", label: "Sueldo fijo" },
      { id: "variable", label: "Ingresos variables o comisiones" },
      { id: "negocio", label: "Negocio propio" },
      { id: "sin_ingreso", label: "Sin ingreso estable ahora" },
    ],
  },
  {
    id: "q7_urgencia",
    title: "¿Para cuándo quieres tener tu canal generando ingresos?",
    options: [
      { id: "30_dias", label: "En los próximos 30 días" },
      { id: "3_meses", label: "En 3 meses" },
      { id: "este_ano", label: "Este año" },
      { id: "sin_prisa", label: "No tengo prisa" },
    ],
  },
  {
    id: "q8_compromiso",
    title:
      "Solo trabajamos con personas comprometidas. ¿Puedes garantizar que asistirás a la llamada en la fecha y hora que elijas, en un sitio adecuado? (ni en el coche, ni en la calle)",
    options: [
      { id: "si", label: "Sí, me comprometo al 100%", ghlValue: "Si, me comprometo al 100%" },
      {
        id: "no",
        label: "No puedo comprometerme a asistir",
        ghlValue: "No puedo comprometerme a asistir",
      },
    ],
  },
];

/**
 * Si el usuario responde alguna de estas opciones en Q1, se le muestra el
 * campo opcional del canal de YouTube en la pantalla de datos.
 */
export const showChannelFieldWhen = {
  questionId: "q1_estado",
  optionIds: ["canal_sin_resultados", "canal_sin_monetizar"],
} as const;

/* -------------------------------------------------------------- puntajes --- */

/**
 * Puntos por respuesta: pregunta → opción → puntos.
 * Sube o baja los números para cambiar a quién califica el embudo.
 *
 * Peso alto:  q5 (presupuesto) y q3 (tiempo)  → hasta 30 pts
 * Peso medio: q7 (urgencia)                   → hasta 15 pts
 * Peso bajo:  q1, q2, q6                      → hasta 8 pts
 */
export const scoreWeights: Record<string, Record<string, number>> = {
  q1_estado: {
    nunca: 2,
    abandone: 3,
    canal_sin_resultados: 6,
    canal_sin_monetizar: 8,
  },
  q2_ocupacion: {
    empleado: 6,
    empleado_proyecto: 8,
    freelance: 7,
    estudiante: 2,
    sin_trabajo: 1,
  },
  q3_tiempo: {
    menos_5: 0,
    "5_10": 15,
    "10_20": 25,
    mas_20: 30,
  },
  q4_tecnica: {
    bastante: 10,
    algo: 6,
    nada: 0,
  },
  q5_inversion: {
    "2000_3000": 30,
    "1000_2000": 24,
    "300_500": 10,
    menos_250: 0,
  },
  q6_ingreso: {
    sueldo_fijo: 8,
    variable: 6,
    negocio: 7,
    sin_ingreso: 1,
  },
  q7_urgencia: {
    "30_dias": 15,
    "3_meses": 11,
    este_ano: 5,
    sin_prisa: 0,
  },
  q8_compromiso: {
    si: 10,
    no: 0,
  },
};

/**
 * Filtros duros: si el usuario elige una de estas opciones, el tier baja a
 * "bajo" sin importar el puntaje total.
 */
export const hardFilters: { questionId: string; optionId: string; reason: string }[] = [
  {
    questionId: "q4_tecnica",
    optionId: "nada",
    reason: "Sin manejo de ordenador",
  },
  {
    questionId: "q8_compromiso",
    optionId: "no",
    reason: "No se compromete a asistir",
  },
];

/**
 * Umbrales de puntaje. Puntaje máximo posible: 119.
 *  >= alto  → tier alto
 *  >= medio → tier medio
 *  resto    → tier bajo
 */
export const tierThresholds = {
  alto: 88,
  medio: 55,
} as const;

/* --------------------------------------------------- destino según tier --- */

export const waNumbers = {
  closer: process.env.NEXT_PUBLIC_WA_CLOSER ?? "",
  setter: process.env.NEXT_PUBLIC_WA_SETTER ?? "",
} as const;

/** Nombre del recurso que se entrega. Se interpola en el mensaje de WhatsApp. */
export const resourceName = "sistema de canal faceless";

export const outcomes: Record<
  Tier,
  {
    kind: "whatsapp" | "thankyou";
    /** Solo para kind "whatsapp". */
    number?: string;
    /** Línea pequeña en mayúsculas arriba del titular. */
    eyebrow?: string;
    title: string;
    subtitle: string;
    /** Segunda frase del subtítulo, en negrita. */
    subtitleStrong?: string;
    cta?: string;
    /** Texto del contador. {seconds} se reemplaza por el número. */
    countdown?: string;
    previewLabel?: string;
    /** Nota gris debajo de la burbuja del mensaje. */
    previewFootnote?: string;
    /** Nota final con candado. */
    privacyNote?: string;
    /** Solo para kind "thankyou". */
    resourceUrl?: string;
    resourceCta?: string;
  }
> = {
  alto: {
    kind: "whatsapp",
    number: waNumbers.closer,
    eyebrow: "Solo falta un paso",
    title: "Abrí WhatsApp",
    subtitle: "Para enviarte el sistema de canal faceless, abrí tu WhatsApp.",
    subtitleStrong: "El mensaje ya está escrito, solo hacé clic en enviar.",
    cta: "Recibir mi sistema por WhatsApp",
    countdown: "Abriendo WhatsApp en {seconds} segundos...",
    previewLabel: "Vista previa del mensaje",
    previewFootnote: "Solamente hacé clic en enviar en WhatsApp",
    privacyNote: "🔒 Privacidad de datos",
  },
  medio: {
    kind: "whatsapp",
    number: waNumbers.setter,
    eyebrow: "Solo falta un paso",
    title: "Abrí WhatsApp",
    subtitle: "Para enviarte el sistema de canal faceless, abrí tu WhatsApp.",
    subtitleStrong: "El mensaje ya está escrito, solo hacé clic en enviar.",
    cta: "Recibir mi sistema por WhatsApp",
    countdown: "Abriendo WhatsApp en {seconds} segundos...",
    previewLabel: "Vista previa del mensaje",
    previewFootnote: "Solamente hacé clic en enviar en WhatsApp",
    privacyNote: "🔒 Privacidad de datos",
  },
  bajo: {
    kind: "thankyou",
    title: "Gracias. Aquí está tu acceso.",
    subtitle:
      "Por ahora este es el mejor punto de partida para ti. Descárgalo y empieza hoy mismo.",
    resourceUrl: "https://example.com/recurso",
    resourceCta: "Descargar el sistema",
  },
};

/** Segundos del contador antes de abrir WhatsApp solo. */
export const whatsappAutoOpenSeconds = 10;

/**
 * Base del link de WhatsApp.
 *  - "wa.me"  → https://wa.me/NUMERO?text=...          (recomendado)
 *  - "api"    → https://api.whatsapp.com/send/?phone=...&text=...
 * Los dos hacen exactamente lo mismo; wa.me redirige al segundo. Cambia a
 * "api" solo si algún navegador te da problemas con el acortador.
 */
export const whatsappLinkStyle: "wa.me" | "api" = "wa.me";

/**
 * Plantilla del mensaje de WhatsApp.
 *
 * Ojo: WhatsApp corta los mensajes muy largos al pasarlos por URL. Mantén la
 * plantilla por debajo de ~1.500 caracteres ya interpolada.
 *
 * Alternativa en párrafo (más natural, más corta) en vez de {resumen}:
 *   "Hola, quiero el {recurso}. Soy {nombre}. Hoy {q1_estado}, puedo dedicarle
 *    {q3_tiempo} y quiero resultados {q7_urgencia}."
 * Variables disponibles:
 *   {recurso}   nombre del recurso
 *   {nombre}    nombre del lead
 *   {resumen}   lista de respuestas (una por línea)
 *   {q1_estado} ... {q8_compromiso}  el texto de cada respuesta elegida
 */
export const whatsappTemplate = `Hola, quiero el {recurso}.
Soy {nombre}.

{resumen}`;

/** Cómo se ve cada línea del resumen. */
export const summaryLineTemplate = "• {pregunta}: {respuesta}";

/**
 * Etiqueta corta de cada pregunta para el resumen de WhatsApp
 * (el título completo sería demasiado largo en el chat).
 */
export const summaryLabels: Record<string, string> = {
  q1_estado: "Punto de partida",
  q2_ocupacion: "Ocupación",
  q3_tiempo: "Tiempo semanal",
  q4_tecnica: "Manejo del ordenador",
  q5_inversion: "Inversión disponible",
  q6_ingreso: "Ingreso principal",
  q7_urgencia: "Plazo",
  q8_compromiso: "Compromiso",
};

/* ---------------------------------------------------------- GoHighLevel --- */

/**
 * IDs de los custom fields de GoHighLevel.
 * Se rellenan corriendo `npm run ghl:setup` y pegando aquí lo que imprime.
 * Los campos con id vacío simplemente no se envían.
 */
/**
 * IDs de los custom fields de GoHighLevel.
 *
 * Ya están todos mapeados contra la cuenta "Mario YT". Si agregas preguntas
 * nuevas, corre `npm run ghl:setup` y pega aquí lo que imprime.
 *
 * Los marcados como REUSADO son campos que YA EXISTÍAN en la cuenta y hacen
 * exactamente la misma pregunta, así que se reusan en vez de duplicarlos: las
 * automatizaciones que ya los leen siguen funcionando. Como son de tipo RADIO,
 * sus opciones se mandan con el `ghlValue` de cada respuesta.
 *
 * Un campo con id vacío ("") simplemente no se envía; la app sigue igual.
 */
export const ghlCustomFieldIds: Record<string, string> = {
  q1_estado: "6f6JApE17f9MsWLMGLIy",
  q2_ocupacion: "O8PNgudsSLxvallFHn2Y",
  q3_tiempo: "3rhK1zqbKhUGFMWO2JQi",
  // REUSADO — "¿Tienes experiencia con el ordenador y manejo de programas?" (RADIO)
  q4_tecnica: "gFAmaTxEPGg2o7m4RQBO",
  // REUSADO — "¿Cuánto estarías dispuesto a invertir en ti mismo...?" (RADIO)
  q5_inversion: "fIF93MWmT8pKyJeY4WO6",
  q6_ingreso: "wdIcswyNflXj5MJca0ar",
  q7_urgencia: "kBeC26GaWJWiYsCws6jZ",
  // REUSADO — "Solo trabajamos con personas comprometidas..." (RADIO)
  q8_compromiso: "xWmqNPiGd0f2Z40IHNCG",
  quiz_score: "qHcsZO6bEC5CeSEDoZ4A",
  quiz_tier: "XAbjrV47eUfuo5QA2TbQ",
  yt_channel: "XSDRSUfE5iud1WHfjuys",
};

/** Prefijo de los tags que se mandan a GHL. */
export const ghlTags = {
  tierPrefix: "tier-",
  sourcePrefix: "src-",
  blockerPrefix: "bloqueo-",
  base: "quiz-faceless",
} as const;

/** País por defecto del selector de teléfono. */
export const defaultPhoneCountry = "MX";
