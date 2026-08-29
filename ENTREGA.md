# Entrega del proyecto

Qué hay que traspasar para que el cliente sea dueño de todo. El código por sí
solo **no basta**: dentro del repo no hay ninguna credencial (eso es a
propósito), así que hay tres piezas que viven fuera de GitHub.

---

## 1. El repositorio de GitHub

Es el código. Dos opciones:

- **Transferir** (lo normal en una entrega): repo → **Settings** → abajo del
  todo, **Transfer ownership** → poner el usuario de GitHub del cliente. El
  repo pasa a ser suyo y tú dejas de aparecer como dueño.
- **Compartir**: repo → **Settings** → **Collaborators** → **Add people**. Los
  dos podéis editar y tú sigues siendo el dueño.

> Si transfieres el repo, avisa antes en Vercel (paso 2): la conexión se
> rehace sola, pero conviene revisarla después.

## 2. El proyecto de Vercel

Es el hosting. En Vercel → proyecto **faceless** → **Settings** → **Transfer**
→ elegir la cuenta del cliente.

Si prefieres empezar limpio, también vale: que el cliente entre a
[vercel.com/new](https://vercel.com/new), importe el repo desde su cuenta y
cargue las variables del paso 3. Tarda lo mismo.

Ojo: **las variables de entorno no viajan solas** en algunos traspasos. Después
de transferir, entrar a **Settings → Environment Variables** y comprobar que
las cuatro están y con valor. Si están vacías, la web carga pero los leads no
llegan a ningún lado.

## 3. Las credenciales

No están en el repo y no deben estarlo nunca. Son cuatro:

| Variable | Qué es | De dónde sale |
| --- | --- | --- |
| `GHL_PIT` | Token privado de GoHighLevel | Lo genera el cliente en su cuenta (ver abajo) |
| `GHL_LOCATION_ID` | ID de la sub-cuenta de GHL | Está en la URL de su GoHighLevel |
| `NEXT_PUBLIC_WA_CLOSER` | WhatsApp de los leads tier alto | Suyo |
| `NEXT_PUBLIC_WA_SETTER` | WhatsApp de los leads tier medio y bajo | Suyo |

**Lo más limpio: que el cliente genere su propio `GHL_PIT`** en vez de heredar
el actual. En GoHighLevel: **Settings → Private Integrations → Create new
integration**, con permisos de lectura y escritura de contactos y de custom
fields. Luego pega ese token en Vercel y redeploy.

Así el token viejo se puede borrar y nadie más que él tiene acceso.

> La cuenta de GoHighLevel (**Mario YT**) y los custom fields del quiz ya son
> suyos: no hay nada que traspasar ahí.

---

## Comprobación final (2 minutos)

Después del traspaso, abrir la web y hacer el quiz entero una vez:

1. Responder **"No puedo comprometerme"** en la última pregunta → tiene que
   salir la pantalla **"Lo lamentamos"**, sin pedir datos.
2. Volver a empezar, responder **"Sí, me comprometo al 100%"** y rellenar el
   formulario → tiene que salir **"Abre WhatsApp"** con el mensaje ya escrito.
3. Entrar a GoHighLevel → **Contactos → Todo** → tiene que estar ese contacto
   nuevo, con los tags `quiz-faceless` y `tier-...`.
4. Borrar ese contacto de prueba.

Si el paso 2 no muestra el botón de WhatsApp, es que falta un número en las
variables de entorno. Si el 3 falla, es el `GHL_PIT` o `GHL_ENABLED`.

---

## Lo que el cliente puede cambiar solo

Todo el contenido está en un único archivo, [`config/quiz.ts`](config/quiz.ts),
pensado para editarse desde la web de GitHub sin instalar nada. El README tiene
el paso a paso escrito para alguien que no programa: preguntas, textos,
puntajes, la cifra del hero, el número de prueba social y las fotos.

Los números de WhatsApp son la excepción: esos van en Vercel, no en GitHub.
