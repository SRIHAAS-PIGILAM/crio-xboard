async function fetchNews(url) {
    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${url}`);
        return await res.json();
    } catch (e) { return null; }
}

function createCarousel(items, carouselId) {
    const slides = items.map((item, i) => {
        let img = item.enclosure?.link || item.thumbnail;
        if (!img && item.description) {
            const m = item.description.match(/<img[^>]+src="([^">]+)"/);
            img = m ? m[1] : null;
        }
        const finalImg = img || "https://via.placeholder.com/800x500?text=News+Image";

        return `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                <a href="${item.link}" target="_blank" class="text-decoration-none text-dark">
                    <img src="${finalImg}" class="d-block w-100">
                    <div class="py-3">
                        <h3 class="fw-bold">${item.title}</h3>
                        <p class="text-muted">${item.author || 'News'} • ${new Date(item.pubDate).toLocaleDateString()}</p>
                        <p class="text-secondary">${item.description}</p>
                    </div>
                </a>
            </div>`;
    }).join("");

    return `
        <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">${slides}</div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
        </div>`;
}

async function init() {
    const section = document.getElementById("accordionSection");
    let fullHTML = ""; // Accumulate all HTML here first

    for (let i = 0; i < magazines.length; i++) {
        const data = await fetchNews(magazines[i]);
        if (!data || data.status !== "ok") continue;

        let displayTitle = data.feed.title;
        if (!displayTitle || displayTitle.trim() === "") {
            const titles = ["Latest News", "India Tech", "Sportstar"];
            displayTitle = titles[i] || "News Feed";
        }

        const accId = `collapse${i}`;
        const carId = `carousel${i}`;
        
        fullHTML += `
            <div class="accordion-item border-0 border-bottom">
                <h2 class="accordion-header">
                    <button class="accordion-button ${i === 0 ? '' : 'collapsed'}" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#${accId}">
                        ${displayTitle}
                    </button>
                </h2>
                <div id="${accId}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" data-bs-parent="#accordionSection">
                    <div class="accordion-body px-0">${createCarousel(data.items, carId)}</div>
                </div>
            </div>`;
    }
    
    // Inject EVERYTHING at once so the DOM stays stable for Cypress
    section.innerHTML = fullHTML;
}

init();