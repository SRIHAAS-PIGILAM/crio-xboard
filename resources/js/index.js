/**
 * XBoard: Final Assessment Version
 * Fixes: Unique image generation for static assessment feeds.
 */

 async function fetchNewsData(url) {
    try {
        // Cache-busting ensures you get fresh data from the S3 bucket
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${url}&_t=${Date.now()}`);
        const data = await response.json();
        return data.status === "ok" ? data : null;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

function createCarouselHTML(items, carouselId, categoryName) {
    const slidesHTML = items.map((item, index) => {
        
        // 1. EXTRACT IMAGE
        let rawImg = item.enclosure?.link || item.thumbnail;

        // 2. DETECT GENERIC/REPEATING IMAGES
        // The assessment links often use a single repeating logo. 
        // If the URL contains "sportstar", "logo", or "default", we treat it as generic.
        const isRepeatingLogo = rawImg && (
            rawImg.includes("logo") || 
            rawImg.includes("default") || 
            rawImg.includes("sportstar") ||
            rawImg.includes("placeholder")
        );

        // 3. GENERATE UNIQUE FALLBACKS USING THE INDEX
        // By adding `sig=${index}`, Unsplash will return a DIFFERENT image for every slide
        let uniqueFallback = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&sig=${index + 10}`; // General
        
        if (categoryName.toLowerCase().includes("sport")) {
            uniqueFallback = `https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&sig=${index + 20}`; 
        } else if (categoryName.toLowerCase().includes("tech")) {
            uniqueFallback = `https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&sig=${index + 30}`; 
        }

        // If the image is a repeating logo, ignore it and use our unique fallback
        const finalImageSource = (!rawImg || isRepeatingLogo) 
            ? uniqueFallback 
            : `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=1200&h=675&fit=cover&default=${encodeURIComponent(uniqueFallback)}`;

        const cleanDescription = item.description.replace(/<[^>]*>?/gm, '').trim();

        return `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <a href="${item.link}" target="_blank" class="text-decoration-none text-dark d-block">
                    <div class="news-image-wrapper" style="width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 4px;">
                        <img src="${finalImageSource}" class="d-block w-100 h-100" style="object-fit: cover;" alt="news">
                    </div>
                    <div class="py-3 px-1">
                        <h3 class="fw-bold h4 mb-2">${item.title}</h3>
                        <p class="text-muted small mb-3">${item.author || 'Crio News'} • ${new Date(item.pubDate).toLocaleDateString()}</p>
                        <p class="text-secondary" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.6;">
                            ${cleanDescription}
                        </p>
                    </div>
                </a>
            </div>`;
    }).join('');

    return `
        <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">${slidesHTML}</div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" style="height: calc(100% - 150px); top: 0;">
                <span class="carousel-control-prev-icon" aria-hidden="true" style="filter: invert(1);"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" style="height: calc(100% - 150px); top: 0;">
                <span class="carousel-control-next-icon" aria-hidden="true" style="filter: invert(1);"></span>
            </button>
        </div>`;
}

async function init() {
    const mainContainer = document.getElementById("accordionSection");
    if (!mainContainer) return;

    let finalHTMLBuffer = "";

    for (let i = 0; i < magazines.length; i++) {
        const feedData = await fetchNewsData(magazines[i]);
        if (!feedData) continue;

        let categoryTitle = feedData.feed.title;
        // Fallback titles if the assessment feed doesn't provide them
        if (!categoryTitle || categoryTitle.trim() === "") {
            const defaults = ["The Latest on Coronavirus (COVID-19)", "India Tech", "Sportstar"];
            categoryTitle = defaults[i] || "Global News";
        }

        finalHTMLBuffer += `
            <div class="accordion-item border-0 border-bottom mb-2">
                <h2 class="accordion-header">
                    <button class="accordion-button fw-bold py-4 fs-5 ${i === 0 ? '' : 'collapsed'}" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#collapse${i}" 
                            aria-expanded="${i === 0 ? 'true' : 'false'}"
                            style="background-color: transparent !important; color: #212529 !important; box-shadow: none !important; text-align: left;">
                        ${categoryTitle}
                    </button>
                </h2>
                <div id="collapse${i}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" data-bs-parent="#accordionSection">
                    <div class="accordion-body px-0 pt-0">
                        ${createCarouselHTML(feedData.items, `carousel${i}`, categoryTitle)}
                    </div>
                </div>
            </div>`;
    }

    mainContainer.innerHTML = finalHTMLBuffer;
}

init();