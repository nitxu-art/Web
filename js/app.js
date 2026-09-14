/* =========================================================
   CONFIGURACIÓN DE GITHUB PAGES
   Configura estos valores cuando subas tu web a GitHub.
   ========================================================= */
const GITHUB_USER = "tu-usuario";    // EJ: "nitxuart"
const GITHUB_REPO = "tu-repo";       // EJ: "portafolio"
const GITHUB_BRANCH = "main";
const SECTIONS_PATH = "secciones";

// Si la web se abre de forma local o aún no se configura GitHub, usaremos datos de prueba.
// Esto garantiza que la web nunca se vea vacía.
const mockData = [
    { category: "Anime", subcategory: "Color", url: "secciones/anime/color/anime__Pareja.jpeg" },
    { category: "Realismo", subcategory: "Color", url: "assets/hero.jpg" } // Imagen de relleno provisional
];

let galleryImages = [];
let currentLightboxIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    initGallery();
    initLightbox();
});

/* =========================================================
   SISTEMA DE GALERÍA DINÁMICA
   ========================================================= */
async function initGallery() {
    const grid = document.getElementById("gallery-grid");
    
    // Verificamos si estamos configurados para GitHub
    if (GITHUB_USER !== "tu-usuario" && window.location.protocol !== "file:") {
        try {
            galleryImages = await fetchGitHubStructure();
        } catch (e) {
            console.error("Error cargando desde GitHub, usando datos locales:", e);
            galleryImages = mockData;
        }
    } else {
        galleryImages = mockData;
    }

    if (galleryImages.length === 0) {
        grid.innerHTML = "<p>Aún no hay obras publicadas.</p>";
        return;
    }

    renderFilters();
    renderGallery("all");
}

async function fetchGitHubStructure() {
    const images = [];
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    const baseUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/`;

    // 1. Obtener carpetas principales (Ej: anime, realismo)
    const rootRes = await fetch(`${baseUrl}${SECTIONS_PATH}?ref=${GITHUB_BRANCH}`, { headers });
    if (!rootRes.ok) throw new Error("No se pudo leer la carpeta principal.");
    const categories = await rootRes.json();

    for (let cat of categories) {
        if (cat.type !== "dir") continue;
        
        // 2. Obtener subcarpetas (Ej: color, byn)
        const subRes = await fetch(cat.url, { headers });
        const subcategories = await subRes.json();

        for (let sub of subcategories) {
            if (sub.type !== "dir") continue;
            
            // 3. Obtener imágenes
            const imgRes = await fetch(sub.url, { headers });
            const files = await imgRes.json();

            for (let file of files) {
                if (file.type === "file" && file.name.match(/\.(jpe?g|png|webp)$/i)) {
                    images.push({
                        category: capitalize(cat.name),
                        subcategory: capitalize(sub.name),
                        url: file.download_url // URL directa a la imagen en GitHub
                    });
                }
            }
        }
    }
    return images;
}

function renderFilters() {
    const filterContainer = document.getElementById("gallery-filters");
    // Extraer categorías únicas que sí tienen imágenes
    const uniqueCategories = [...new Set(galleryImages.map(img => img.category))];
    
    let html = `<button class="filter-btn active" data-filter="all">Todas</button>`;
    uniqueCategories.forEach(cat => {
        html += `<button class="filter-btn" data-filter="${cat}">${cat}</button>`;
    });
    
    filterContainer.innerHTML = html;

    // Lógica de botones de filtro
    const btns = filterContainer.querySelectorAll(".filter-btn");
    btns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            btns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            renderGallery(e.target.dataset.filter);
        });
    });
}

function renderGallery(filter) {
    const grid = document.getElementById("gallery-grid");
    grid.innerHTML = "";

    const filteredImages = filter === "all" 
        ? galleryImages 
        : galleryImages.filter(img => img.category === filter);

    filteredImages.forEach((img, index) => {
        // Encontramos su índice real en el array original para el lightbox
        const globalIndex = galleryImages.findIndex(gImg => gImg.url === img.url);
        
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.innerHTML = `
            <img src="${img.url}" alt="Obra ${img.category}" loading="lazy">
            <div class="gallery-info">
                <span>${img.category} · ${img.subcategory}</span>
            </div>
        `;
        div.addEventListener("click", () => openLightbox(globalIndex));
        grid.appendChild(div);
    });
}

/* =========================================================
   LIGHTBOX
   ========================================================= */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

function initLightbox() {
    document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    document.querySelector(".lightbox-next").addEventListener("click", () => changeImage(1));
    document.querySelector(".lightbox-prev").addEventListener("click", () => changeImage(-1));
    
    // Cerrar al clickear afuera de la imagen
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navegación con teclado
    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "block") {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") changeImage(1);
            if (e.key === "ArrowLeft") changeImage(-1);
        }
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.style.display = "block";
    document.body.style.overflow = "hidden"; // Evita el scroll del fondo
}

function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
}

function changeImage(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;
    if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
    updateLightboxImage();
}

function updateLightboxImage() {
    const imgData = galleryImages[currentLightboxIndex];
    lightboxImg.src = imgData.url;
    lightboxCaption.textContent = `${imgData.category} — ${imgData.subcategory}`;
}

// Utilidad
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}