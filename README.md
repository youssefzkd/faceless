# Quiz de cualificación — Canal Faceless

Landing de una sola página con quiz de 8 preguntas que califica al lead en el
servidor y lo enruta a WhatsApp (closer o setter) o a una pantalla de
agradecimiento. Los leads se envían a **GoHighLevel**. No hay base de datos.

- Next.js 14 (App Router) + TypeScript + Tailwind
- Deploy en Vercel
- **Todo el contenido editable vive en un solo archivo: [`config/quiz.ts`](config/quiz.ts)**

> **¿Vas a entregarle el proyecto al cliente?** Está todo en
> [ENTREGA.md](ENTREGA.md).

---

## Cómo correr el proyecto en tu computadora

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
cp .env.example .env.local   # y rellena los valores
npm run dev
```

Abre http://localhost:3000

Con `GHL_ENABLED=false` (el valor por defecto) el formulario funciona completo,
pero en vez de enviar nada a GoHighLevel imprime en la terminal el payload que
habría mandado. Así se puede desarrollar sin credenciales.

Para probar el enrutamiento por tier necesitas al menos los dos números de
WhatsApp en `.env.local`:

```
NEXT_PUBLIC_WA_CLOSER=5215512345678
NEXT_PUBLIC_WA_SETTER=5215587654321
```

(formato internacional, sin `+`, sin espacios, sin guiones)

---

## Variables de entorno

| Variable | Qué es | Ejemplo |
| --- | --- | --- |
| `GHL_PIT` | Private Integration Token de GoHighLevel. **Secreto.** | `pit-xxxx...` |
| `GHL_LOCATION_ID` | ID de la sub-cuenta (location) de GHL | `abc123...` |
| `GHL_ENABLED` | `true` para enviar de verdad, `false` para solo loguear | `false` |
| `NEXT_PUBLIC_WA_CLOSER` | WhatsApp del closer (leads tier **alto**) | `522213454952` |
| `NEXT_PUBLIC_WA_SETTER` | WhatsApp del setter (tier **medio** y **bajo**) | `522213454952` |

> Hoy las dos apuntan al mismo número (el del setter), porque todavía no hay
> uno de closer. Cuando lo haya, se cambia `NEXT_PUBLIC_WA_CLOSER` en Vercel y
> los leads tier alto empiezan a caer ahí solos. No hay que tocar código.

> El token **nunca** lleva el prefijo `NEXT_PUBLIC_`. Todo lo que lleva ese
> prefijo queda visible en el navegador de cualquier visitante.

### Ponerlas en Vercel

1. Entra a tu proyecto en [vercel.com](https://vercel.com)
2. **Settings → Environment Variables**
3. Agrega una por una las 5 variables de la tabla, marcando los entornos
   **Production**, **Preview** y **Development**
4. **Deployments → ⋯ → Redeploy** (las variables solo aplican en deploys nuevos)

Recomendación: lanza primero con `GHL_ENABLED=false`, revisa los logs en
**Vercel → Logs** para confirmar que el payload sale bien armado, y recién
después ponlo en `true`.

---

## Script de setup de GoHighLevel

Crea automáticamente los custom fields que el quiz necesita y te imprime el mapa
de IDs para pegar en la config.

```bash
# 1. Pon GHL_PIT y GHL_LOCATION_ID en tu archivo .env.local
# 2. Corre:
npm run ghl:setup
```

Lo que hace:

1. Valida el token con una llamada de lectura a tu location
2. Lista los custom fields que ya existen
3. Crea los que falten (uno por cada pregunta + puntaje + tier + canal)
4. Imprime un bloque `ghlCustomFieldIds` listo para copiar

Copia ese bloque y reemplaza con él el `ghlCustomFieldIds` que está al final de
[`config/quiz.ts`](config/quiz.ts). Los campos que quedan con id vacío
simplemente no se envían, así que nada se rompe si lo dejas a medias.

Solo hace falta correrlo una vez, o cuando agregues preguntas nuevas. **Ya está
corrido** contra la cuenta "Mario YT": los 11 ids están puestos en la config.

### Campos reusados de la cuenta

Tres preguntas del quiz coinciden exactamente con campos que la cuenta ya tenía,
así que se reusan en vez de duplicarlos y las automatizaciones que ya los leen
siguen funcionando:

| Pregunta del quiz | Campo en GoHighLevel | Tipo |
| --- | --- | --- |
| Q4 · manejo del ordenador | *¿Tienes experiencia con el ordenador y manejo de programas?* | RADIO |
| Q5 · inversión | *¿Cuánto estarías dispuesto a invertir en ti mismo...?* | RADIO |
| Q8 · compromiso | *Solo trabajamos con personas comprometidas...* | RADIO |

Los campos RADIO de GoHighLevel **solo aceptan sus propias opciones, escritas
tal cual** (con sus tildes y sus rarezas). Por eso esas tres preguntas tienen un
`ghlValue` en cada opción dentro de [`config/quiz.ts`](config/quiz.ts):

```ts
{ id: "si", label: "Sí, me comprometo al 100%", ghlValue: "Si, me comprometo al 100%" },
        ↑ lo que ve el visitante          ↑ lo que espera el CRM (sin tilde)
```

> El `label` se puede cambiar libremente. El `ghlValue` **no**, salvo que
> cambies también la opción dentro de GoHighLevel. Si no coinciden, GHL
> descarta el dato en silencio.

Las otras 8 preguntas usan campos nuevos con el prefijo `Quiz - `.

---

## Cómo editar las preguntas desde GitHub (sin saber programar)

No necesitas instalar nada ni abrir la terminal. Todo se hace desde el navegador.

### Paso a paso

1. Entra al repositorio en GitHub.
2. Abre la carpeta **`config`** y haz clic en el archivo **`quiz.ts`**.
3. Arriba a la derecha del archivo, haz clic en el **ícono del lápiz** (✏️
   *Edit this file*).
4. Busca lo que quieras cambiar (Ctrl+F / Cmd+F te ayuda) y edítalo.
5. Baja al final de la página y haz clic en el botón verde **Commit changes**.
6. En el cuadro que aparece, escribe qué cambiaste (ej: *"cambio pregunta 3"*)
   y confirma con **Commit changes**.
7. Listo. Vercel publica el cambio solo en 1 o 2 minutos.

### Qué se puede cambiar

**Cambiar el texto de una pregunta** — busca `title:` dentro de la pregunta y
cambia lo que está entre comillas:

```ts
{
  id: "q3_tiempo",
  title: "¿Cuánto tiempo puedes dedicarle a la semana?",   ← esto sí se cambia
  ...
}
```

**Cambiar el texto de una opción** — busca `label:` y cambia lo de las comillas:

```ts
{ id: "menos_5", label: "Menos de 5 horas" },   ← solo el label
```

**Agregar una opción nueva** — copia una línea completa, pégala debajo, y
cámbiale el `id` (a algo corto, sin espacios ni acentos) y el `label`. Después
agrega su puntaje en `scoreWeights` (ver abajo).

**Cambiar la nota gris de abajo** — busca `note:` en esa pregunta.

**Cambiar el número de prueba social (`+2.400`)** — busca `socialProofCount`
cerca del principio del archivo. Se cambia **una sola vez** y se actualiza en
los dos lugares donde aparece (el pill de arriba y el bullet del final):

```ts
export const socialProofCount = "+2.400";   ← solo esta línea
```

**Cambiar la cifra grande del dashboard del hero** — busca `metric:` dentro de
`heroFallback`:

```ts
metric: { label: "Ingresos del mes", value: "$6.240" },
```

> Consejo: que sea ambiciosa pero creíble. Una cifra demasiado alta
> (`$80.000/mes`) le dice al visitante "esto es humo" y la conversión cae. Un
> número intermedio y específico funciona mejor que uno redondo y enorme.

**Cambiar el titular, el pill de arriba, los bullets o el texto legal** — están
todos en el bloque `copy`, cerca del principio del archivo.

**Cambiar los puntajes** — en el bloque `scoreWeights`. Cada opción tiene un
número: más alto = lead más calificado. Y en `tierThresholds` decides desde qué
puntaje alguien es `alto` o `medio`.

**Cambiar los números de WhatsApp** — esos NO están en este archivo, están en
las variables de entorno de Vercel (ver la sección de arriba).

### Reglas para no romper nada

- ✅ Todo texto va **entre comillas**: `"así"`.
- ✅ Cada línea termina con **coma**.
- ❌ **Nunca cambies un `id`.** Los `id` conectan las preguntas con los puntajes
  y con GoHighLevel. Si cambias uno, deja de contar el puntaje de esa opción.
- ❌ No borres llaves `{ }` ni corchetes `[ ]`.
- Si un texto lleva comillas dobles adentro, usa comillas simples: `'dijo "hola"'`.

> Si algo sale mal, GitHub guarda todo el historial: entra a la pestaña
> **Commits** del archivo y puedes volver a cualquier versión anterior.

---

## Cómo funciona por dentro

| Archivo | Qué hace |
| --- | --- |
| [`config/quiz.ts`](config/quiz.ts) | **Todo el contenido editable.** Preguntas, textos, colores, puntajes, umbrales, plantilla de WhatsApp, IDs de GHL |
| [`components/Funnel.tsx`](components/Funnel.tsx) | Orquesta los pasos: preguntas → datos → resultado |
| [`components/HeroStack.tsx`](components/HeroStack.tsx) | Abanico de 5 tarjetas del hero |
| [`app/api/lead/route.ts`](app/api/lead/route.ts) | Recibe las respuestas, **calcula el scoring en el servidor** y decide el destino |
| [`lib/scoring.ts`](lib/scoring.ts) | Puntaje, filtros duros y tier |
| [`lib/ghl.ts`](lib/ghl.ts) | **Único** punto de contacto con GoHighLevel |
| [`lib/whatsapp.ts`](lib/whatsapp.ts) | Arma el mensaje y el link de WhatsApp en runtime |
| [`scripts/ghl-setup.ts`](scripts/ghl-setup.ts) | Crea los custom fields en GHL |

Notas de diseño:

- **El scoring nunca corre en el cliente.** El navegador manda solo respuestas
  crudas; el tier y el número de WhatsApp los decide el servidor.
- **El link de WhatsApp se arma en runtime**, no hay links pre-hechos.
- Si el envío a GHL falla, el lead **igual** ve su pantalla de resultado (el
  error queda en los logs). Se prioriza no perder la conversación.
- El progreso del quiz vive en estado de React, no en `localStorage`.
- El parámetro `?src=` (ej: `?src=youtube`) se captura al montar y viaja como
  tag a GoHighLevel.

### Sobre los links de WhatsApp

No hace falta ningún servicio externo (ni Walink, ni acortadores). El link se
construye solo, en el servidor, cada vez que alguien termina el quiz:

```
https://wa.me/NUMERO?text=<mensaje con las respuestas ya escritas>
```

- El número sale de `NEXT_PUBLIC_WA_CLOSER` / `NEXT_PUBLIC_WA_SETTER` según el
  tier, así que se cambia desde Vercel sin tocar código.
- El texto sale de `whatsappTemplate` en [`config/quiz.ts`](config/quiz.ts).
- `wa.me` y `api.whatsapp.com/send` hacen exactamente lo mismo (el primero
  redirige al segundo). Si algún navegador te da problemas, cambia
  `whatsappLinkStyle` a `"api"` en la config.
- El mensaje se recorta a 1.500 caracteres: WhatsApp trunca los mensajes muy
  largos pasados por URL. Si agregas muchas preguntas, acorta la plantilla.

Un acortador tipo Walink **no sirve acá**, porque el mensaje es distinto para
cada persona: un link fijo no puede llevar las respuestas del quiz. La única
alternativa real sería mandar el mensaje vos mismo desde la API de WhatsApp
Business / GoHighLevel, pero eso requiere que el contacto ya te haya escrito o
tener plantillas aprobadas por Meta. El flujo actual (el lead aprieta enviar) es
más simple y además abre la ventana de 24h de conversación.

### Cambiar el abanico del hero por imágenes reales

Hoy el hero se dibuja 100% en CSS porque los assets del cliente aún no existen.
Cuando existan: súbelas a la carpeta `public/` y llena `heroResources` en
[`config/quiz.ts`](config/quiz.ts) con 5 entradas. Se renderizan en las mismas
posiciones y rotaciones, sin tocar nada más.

### Si más adelante hay que cambiar de API a webhook

Toda la comunicación con GoHighLevel está aislada en
[`lib/ghl.ts`](lib/ghl.ts), que expone una sola función `sendLead()`. Cambiar a
un inbound webhook es editar ese archivo únicamente.
