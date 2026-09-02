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
export const socialProofCount = "+360";

/**
 * Fotos de perfil del pill de prueba social (las 3 caritas de la izquierda).
 *
 * Vacío ([]) = se dibujan círculos rojos, que es lo que se ve hoy.
 * Para poner fotos reales: sube los archivos a la carpeta `public/` del repo y
 * escríbelos aquí. Se recortan en círculo solas, así que da igual el tamaño,
 * pero cuadradas quedan mejor.
 *
 *   export const socialProofAvatars: Resource[] = [
 *     { src: "/avatars/1.jpg", alt: "" },
 *     { src: "/avatars/2.jpg", alt: "" },
 *     { src: "/avatars/3.jpg", alt: "" },
 *   ];
 */
export const socialProofAvatars: Resource[] = [
  { src: "/avatars/1.jpg", alt: "" },
  { src: "/avatars/2.avif", alt: "" },
  { src: "/avatars/3.jpg", alt: "" },
];

/**
 * El pill de arriba ("+360 recursos entregados") sube solo mientras la
 * persona está en la página, para dar sensación de actividad en tiempo real.
 * Sube de `socialProofCountStep` en `socialProofCountStep` cada
 * `socialProofCountIntervalMs` milisegundos, empezando en `socialProofCount`.
 * Los bullets del final no se mueven: se quedan fijos en `socialProofCount`.
 */
export const socialProofCountStep = 3;
export const socialProofCountIntervalMs = 2000;

/** Reemplaza {count} por socialProofCount (o por `countOverride` si se pasa). */
export function withCount(text: string, countOverride?: string): string {
  return text.replace(/{count}/g, countOverride ?? socialProofCount);
}

export const copy = {
  /** Pill de prueba social arriba del todo. {count} = socialProofCount */
  socialProof: "{count} recursos entregados",

  /** Titular en 3 líneas. La tercera va en rojo. */
  headline: {
    line1: "Recibe gratis el sistema",
    line2: "de canales faceless de Nextube",
    accent: "con el que se han monetizado +300 canales de YouTube",
  },

  /** Bullets con check al pie de la página. {count} = socialProofCount */
  closingBullets: [
    "Acceso inmediato, sin coste",
    "{count} personas ya lo tienen",
    "Recursos que usan alumnos de Nextube",
    "Empieza con YouTube Faceless",
  ],

  /** Texto legal en letra pequeña al pie. */
  legal:
    "Al dejar tus datos aceptas que NextCreator SLU se ponga en contacto contigo por teléfono, mensaje o email usando la información introducida. No vendemos tu información personal. Al enviar el formulario aceptas nuestra Política de Privacidad y nuestros Términos de Servicio.",

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
  cards: [
    "Recurso Guiones virales",
    "Nichos rentables",
    "Dashboard",
    "Plan de 30 días para monetizar un canal de YouTube",
    "Prompts IA",
  ],

  /** Subtítulo opcional de una tarjeta lateral (la clave es su etiqueta). */
  side: {
    "Nichos rentables": "Base de 40",
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
    title: "¿Cuántas horas al día puedes dedicarle a YouTube?",
    options: [
      { id: "menos_1", label: "Menos de 1 hora" },
      { id: "1_2", label: "Entre 1 y 2 horas" },
      { id: "2_4", label: "Entre 2 y 4 horas" },
      { id: "mas_4", label: "Más de 4 horas" },
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
        label: "1000-2000+€",
        ghlValue: "1000-2000+€",
      },
      {
        id: "1000_2000",
        label: "500-1000€",
        ghlValue: "500-1000€",
      },
      {
        id: "300_500",
        label: "300-500€",
        ghlValue: "300-500€",
      },
      {
        id: "menos_250",
        label: "Dispongo de menos de 250€",
        ghlValue:
          "Dispongo de menos de 250€ para invertir ahora mismo y me es imposible conseguirlos",
      },
    ],
  },
  {
    id: "q8_compromiso",
    title: "¿Eres una persona comprometida?",
    options: [
      { id: "si", label: "Sí, me comprometo al 100%", ghlValue: "Si, me comprometo al 100%" },
      {
        id: "no",
        label: "No soy una persona comprometida",
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
 * Peso bajo:  q1, q2                          → hasta 8 pts
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
    menos_1: 0,
    "1_2": 15,
    "2_4": 25,
    mas_4: 30,
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
  q8_compromiso: {
    si: 10,
    no: 0,
  },
};

/**
 * Filtros duros: respuestas que marcan al lead como problemático. Solo
 * cortan el paso (pantalla de rechazo, sin WhatsApp) si llevan
 * `reject: true`; el resto quedan solo como dato (`reason`), sin efecto en
 * el flujo — hoy no hay ninguno así, pero queda listo por si hace falta.
 */
export const hardFilters: {
  questionId: string;
  optionId: string;
  reason: string;
  /** true = se le muestra la pantalla de rechazo y NO se le da acceso a WhatsApp. */
  reject?: boolean;
}[] = [
  {
    questionId: "q4_tecnica",
    optionId: "nada",
    reason: "Sin manejo de ordenador",
  },
  {
    questionId: "q8_compromiso",
    optionId: "no",
    reason: "No se compromete a asistir",
    reject: true,
  },
];

/**
 * ¿Un filtro con `reject: true` corta en el momento de responder?
 *  true  → apenas elige esa opción ve la pantalla de rechazo. No se le piden
 *          los datos ni llega a GoHighLevel.
 *  false → termina el formulario y recién ahí ve el rechazo (el contacto sí
 *          queda registrado en GoHighLevel).
 */
export const rejectImmediately = true;

/**
 * Pantalla final para quien cae en un filtro con `reject: true`.
 * No lleva botón: es un cierre, no un paso más.
 */
export const rejectionScreen = {
  eyebrow: "Gracias por tu sinceridad",
  title: "Lo lamentamos",
  subtitle:
    "Únicamente trabajamos con personas comprometidas. Si más adelante puedes comprometerte de verdad, vuelve a rellenar el formulario y lo vemos.",
} as const;

/* ------------------------------------------------ destino de todo lead --- */

/**
 * Ya no se reparte por tier: todo lead que pasa el quiz (y no cae en un
 * filtro con `reject: true`) va al mismo número. Calificáis a mano por
 * WhatsApp, así que aquí no hace falta distinguir closer/setter.
 *
 * `NEXT_PUBLIC_WA_SETTER` quedó sin usar — puedes borrarla de Vercel cuando
 * quieras, no rompe nada si se queda.
 */
export const waNumber = process.env.NEXT_PUBLIC_WA_CLOSER ?? "";

/** Nombre del recurso que se entrega. Se interpola en el mensaje de WhatsApp. */
export const resourceName = "sistema de canal faceless";

/** Pantalla de WhatsApp que ve todo lead que no fue rechazado. */
export const whatsappOutcome = {
  eyebrow: "Solo falta un paso",
  title: "Abre WhatsApp",
  subtitle: "Para enviarte el sistema de canales faceless, abre tu WhatsApp.",
  subtitleStrong: "El mensaje ya está escrito, solo tienes que darle a enviar.",
  cta: "Recibir los recursos por WhatsApp",
  countdown: "Abriendo WhatsApp en {seconds} segundos...",
  previewLabel: "Vista previa del mensaje",
  previewFootnote: "Solamente tienes que darle a enviar en WhatsApp",
  privacyNote: "🔒 Privacidad de datos",
} as const;

/**
 * Solo se ve si `waNumber` queda vacío (config incompleta en Vercel): sin
 * número no hay a dónde mandarlo por WhatsApp.
 */
export const noWhatsAppFallback = {
  title: "Gracias por tu interés",
  subtitle: "Hemos recibido tus datos. En breve nos ponemos en contacto contigo.",
  resourceUrl: "",
  resourceCta: "Descargar el sistema",
} as const;

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
 *    {q3_tiempo}."
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
  q3_tiempo: "Horas al día",
  q4_tecnica: "Manejo del ordenador",
  q5_inversion: "Inversión disponible",
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
  // "Quiz - Horas al día"
  q3_tiempo: "3rhK1zqbKhUGFMWO2JQi",
  // REUSADO — "¿Tienes experiencia con el ordenador y manejo de programas?" (RADIO)
  q4_tecnica: "gFAmaTxEPGg2o7m4RQBO",
  // REUSADO — "¿Cuánto estarías dispuesto a invertir en ti mismo...?" (RADIO)
  q5_inversion: "fIF93MWmT8pKyJeY4WO6",
  // REUSADO — "¿Eres una persona comprometida?" (RADIO)
  q8_compromiso: "xWmqNPiGd0f2Z40IHNCG",
  quiz_score: "qHcsZO6bEC5CeSEDoZ4A",
  yt_channel: "XSDRSUfE5iud1WHfjuys",
};

/** Tag que se manda a todo lead que completa el formulario. */
export const ghlBaseTag = "organic";

/**
 * Tag extra según el `?src=` del link por el que llegó el lead, para
 * diferenciar cuántos vienen de cada red. Usa dos links distintos:
 *   .../?src=youtube   → tag "LMFunnelYT"
 *   .../?src=x         → tag "LMFunnelX"
 * Si el link trae un `src` que no está en esta lista (o no trae ninguno),
 * el lead solo se queda con el tag "organic".
 */
export const ghlSourceTags: Record<string, string> = {
  youtube: "LMFunnelYT",
  yt: "LMFunnelYT",
  x: "LMFunnelX",
  twitter: "LMFunnelX",
};

/** País por defecto del selector de teléfono. */
export const defaultPhoneCountry = "ES";
