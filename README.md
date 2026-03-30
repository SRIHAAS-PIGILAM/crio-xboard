# XBoard - High-Performance News Aggregator 📰

XBoard is a dynamic News Feed platform designed to deliver real-time global headlines across various categories like Technology, Sports, and Health. Built as part of the Crio.do Micro-experience, this project focuses on seamless API integration, responsive design, and robust front-end logic.

🚀 **Live Demo:** [https://crio-xboard-zeta.vercel.app/](https://crio-xboard-zeta.vercel.app/)

---

## ✨ Features

- **Real-time Data:** Fetches live news content from Flipboard's RSS feeds via REST API.
- **Interactive UI:** Utilizes Accordions to organize news categories and Image Carousels for a fluid browsing experience.
- **Smart Image Handling:** Implemented custom logic to extract unique article images from inconsistent RSS descriptions and provided category-specific fallbacks.
- **Responsive Design:** Optimized for both Desktop and Mobile views based on high-fidelity Figma specifications.
- **Performance Optimized:** Uses "Vibe Coding" / AI-augmented workflows to ensure rapid iteration and clean CSS architecture.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, jQuery
- **API:** RSS2JSON (to parse Flipboard RSS XML feeds)
- **Deployment:** Vercel (CI/CD)
- **Design:** Figma

---

## 🧩 Challenges & Solutions

### 1. The Repeating Image Bug
**Problem:** Certain static assessment feeds provided the same generic logo URL for every article, leading to a redundant UI.
**Solution:** I developed a regex-based image scraper to pull unique `<img>` tags from the article descriptions and implemented a seeded random fallback system using Unsplash to ensure visual variety.

### 2. UI/UX Refinement
**Problem:** Default Bootstrap margins created large gaps that didn't align with the Figma design.
**Solution:** Applied strict CSS overrides on `header.mb-5` and `.container.my-5` to create a tight, professional "Crio News Feed" branding flow.

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/SRIHAAS-PIGILAM/crio-xboard.git](https://github.com/SRIHAAS-PIGILAM/crio-xboard.git)
