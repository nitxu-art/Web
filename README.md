# Nitxu.Art

Sitio web de Nitxu.Art: galería, portafolio y encargos de cuadros personalizados,
con una calculadora de precios integrada.

## 1. Configuración inicial (una sola vez)

Antes de publicar el sitio, abrí `js/gallery.js` y completá estas tres líneas
al principio del archivo:

```javascript
var GITHUB_USER = "TU-USUARIO";      // tu usuario de GitHub
var GITHUB_REPO = "TU-REPOSITORIO";  // el nombre del repositorio
var GITHUB_BRANCH = "main";          // la rama donde vas a subir las obras
```

Mientras estos valores no estén completos, la galería va a mostrar un aviso
pidiendo que se configure, en vez de romperse o quedar vacía.

El repositorio de GitHub tiene que ser **público** para que la API gratuita
de GitHub pueda leer las carpetas sin necesitar login.

## 1.1 Truco para crear carpetas nuevas desde la web de GitHub

GitHub no permite crear una carpeta vacía desde el navegador: solo se crean
carpetas subiendo un archivo adentro. Si `secciones/anime/color/` (o
cualquier otra) todavía no existe en tu repositorio, hacé esto:

```
1. En tu repositorio, click en "Add file" → "Upload files"
2. Arrastrá la imagen de la obra
3. Antes de confirmar, en el campo del nombre del archivo escribí
   la ruta completa, por ejemplo:
   secciones/anime/color/obra-01.jpg
4. Hacé commit
```

Al escribir la ruta completa en el nombre, GitHub crea las carpetas que
falten automáticamente. Repetí esto para cada carpeta que necesites
(`secciones/anime/byn/`, `secciones/realismo/color/`, etc.).

## 2. ¿Cómo agrego una obra?

No hace falta tocar el HTML ni el JavaScript. Los pasos son siempre los mismos:

```
1. Entrás a la carpeta correspondiente, por ejemplo:
   secciones/anime/color/
2. Subís tu nueva imagen (.jpg, .png, .webp, .gif o .avif)
3. Hacés commit y push en GitHub
4. La web se actualiza sola la próxima vez que alguien la visite
```

## 3. ¿Cómo agrego una obra en blanco y negro?

Igual que arriba, pero en la carpeta `byn` correspondiente:

```
secciones/anime/byn/
secciones/realismo/byn/
```

Si una carpeta no tiene ninguna imagen todavía, esa opción simplemente no
aparece en la web. En cuanto subís la primera imagen, aparece sola.

## 4. ¿Cómo agrego una categoría nueva en el futuro?

Por ejemplo, para agregar "Caricaturas":

```
1. Creá la carpeta secciones/caricaturas/
2. Adentro, creá al menos una subcarpeta (por ejemplo color/ o byn/)
3. Subí al menos una imagen dentro
4. Hacé commit y push
```

La categoría "Caricaturas" va a aparecer automáticamente en la galería, con
mayúscula inicial. Si en algún momento querés que se muestre con un nombre
distinto (por ejemplo "Caricaturas y personajes"), agregá esa etiqueta en
`js/gallery.js`, dentro del objeto `ETIQUETAS_CATEGORIA` al principio del
archivo. Esto es opcional: sin tocarlo, igual funciona.

## 5. La calculadora de precios

La calculadora vive en dos archivos:

- `js/calculadora.js` — contiene toda la configuración económica (`CONFIG`):
  costos de lienzos, costo de pintura, consumo estimado y multiplicadores.
  Para cambiar precios, es el único lugar que hay que editar.
- `css/calculadora.css` — solo define colores y tipografía para que la
  calculadora se vea integrada con el resto del sitio. No contiene lógica.

Los precios **solo se muestran dentro de la calculadora**. El resto del
sitio (galería, hero, sobre mí, personalizados) nunca muestra precios.

## 6. Reemplazar las imágenes de placeholder

Estos archivos todavía no existen y hay que agregarlos a mano en `/assets`:

```
/assets/logo.png       (o logo.svg)
/assets/hero.jpg
/assets/sobre-mi.jpg
/assets/proceso.jpg
```

Mientras no estén, el sitio muestra un recuadro beige indicando qué imagen
falta en ese lugar — el sitio no se rompe ni se ve vacío.

**No hace falta editar el HTML.** En cuanto subís el archivo con el nombre
exacto que corresponde (`assets/hero.jpg`, `assets/sobre-mi.jpg`,
`assets/proceso.jpg`, `assets/logo.png` o `assets/logo.svg`), el sitio lo
detecta solo y reemplaza el recuadro por la imagen real la próxima vez que
alguien lo visite.

## 7. Publicar en GitHub Pages

```
1. Subí toda esta carpeta a un repositorio público de GitHub
2. Andá a Settings → Pages
3. Elegí la rama (la misma que pusiste en GITHUB_BRANCH) y la carpeta raíz (/)
4. Guardá — GitHub te va a dar una URL tipo https://tu-usuario.github.io/tu-repo/
```

## 8. Estructura del proyecto

```
nitxu-art/
├── index.html
├── css/
│   ├── styles.css        → estilos generales del sitio
│   └── calculadora.css   → solo colores/tipografía de la calculadora
├── js/
│   ├── app.js             → menú móvil, año del footer, animaciones
│   ├── gallery.js          → detección dinámica de carpetas + lightbox
│   └── calculadora.js      → configuración de precios y cálculo
├── assets/                → logo y fotos institucionales (a completar)
└── secciones/
    ├── anime/
    │   ├── color/
    │   └── byn/
    └── realismo/
        ├── color/
        └── byn/
```

## 9. Límite de la API de GitHub

La galería usa la API pública de GitHub (sin necesidad de token), que
permite 60 consultas por hora por visitante. Para una web con tráfico bajo
o medio esto no es un problema. Si en el futuro la web recibe mucho
tráfico, se puede migrar a un archivo `manifest.json` pre-generado por un
script — avisá si llegás a ese punto y se puede armar esa mejora sin tocar
el resto del sitio.
