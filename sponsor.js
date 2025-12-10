terprice/**
 * SPONSOR MANAGER (v5.3 - CREDIT BUNDLES WITH ANIMATED GIFs)
 * Bundle crediti con GIF animate reali + IVA inclusa
 */

const SPONSORS = [
    {
        id: "bundle_mini",
        name: "Mini Pack",
        badge: "10.000 CREDITI",
        text: "Inizia subito! Solo 22€ (2.20€/1K)",
        logo: "images/MiniPack.gif",
        color: "#22c55e", 
        link: "#recharge",
        bg: "transparent",
        credits: "10K",
        price: "22€"
    },
    {
        id: "bundle_starter",
        name: "Starter Pack",
        badge: "50.000 CREDITI",
        text: "Il più richiesto! 95€ (1.90€/1K)",
        logo: "images/StarterPack.gif",
        color: "#10b981",
        link: "#recharge",
        bg: "transparent",
        credits: "50K",
        price: "95€"
    },
    {
        id: "bundle_pro",
        name: "Pro Bundle",
        badge: "100.000 CREDITI",
        text: "Best seller! 170€ (1.70€/1K)",
        logo: "images/ProBundle.gif",
        color: "#3b82f6",
        link: "#recharge",
        bg: "transparent",
        credits: "100K",
        price: "170€"
    },
    {
        id: "bundle_business",
        name: "Business Pack",
        badge: "250.000 CREDITI",
        text: "Per aziende. 350€ (1.40€/1K)",
        logo: "images/BusinessPack.gif",
        color: "#8b5cf6",
        link: "#recharge",
        bg: "transparent",
        credits: "250K",
        price: "350€"
    },
    {
        id: "bundle_enterprise",
        name: "Enterprise",
        badge: "500.000 CREDITI",
        text: "Grande volume. 550€ (1.10€/1K)",
        logo: "images/Enterprice.gif",
        color: "#f59e0b",
        link: "#recharge",
        bg: "transparent",
        credits: "500K",
        price: "550€"
    },
    {
        id: "bundle_unlimited",
        name: "Mega Pack",
        badge: "1.000.000 CREDITI",
        text: "Massimo sconto! 700€ (0.70€/1K)",
        logo: "images/MegaPack.gif",
        color: "#ef4444",
        link: "#recharge",
        bg: "transparent",
        credits: "1M",
        price: "700€"
    }
];

class SponsorEngine {
    constructor() {
        this.currentIndex = 0;
        this.shuffle(SPONSORS);
        this.injectStyles();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getNextSponsor() {
        const sponsor = SPONSORS[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % SPONSORS.length;
        return sponsor;
    }

    // Rileva lingua da URL params
    getLanguage() {
        const params = new URLSearchParams(window.location.search);
        const lang = params.get('lang') || 'it';
        return lang.toLowerCase().slice(0, 2);
    }

    // Traduzione "IVA inclusa" / "Tax included"
    getTaxLabel() {
        const lang = this.getLanguage();
        const labels = {
            'it': 'IVA inclusa',
            'en': 'Tax included',
            'fr': 'TVA incluse',
            'de': 'MwSt. inkl.',
            'es': 'IVA incluido',
            'pt': 'IVA incluído'
        };
        return labels[lang] || labels['en'];
    }

    injectStyles() {
        if(document.getElementById('sponsor-css')) return;
        const style = document.createElement('style');
        style.id = 'sponsor-css';
        style.innerHTML = `
            .ad-layout { display: flex; align-items: center; width: 100%; height: 100%; }
            .ad-img-box { 
                width: 70px; height: 50px; 
                display: flex; align-items: center; justify-content: center;
                margin-right: 12px; border-radius: 6px; padding: 5px;
                background: transparent;
            }
            .ad-img-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
            .ad-content-box { flex: 1; text-align: left; display: flex; flex-direction: column; justify-content: center; }
            .fade-in { animation: fadeInAd 0.5s ease-in-out; }
            @keyframes fadeInAd { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            
            /* Stile specifico per banner ricarica */
            .recharge-banner {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
                border: 2px solid;
                border-radius: 12px;
                padding: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                position: relative;
            }
            .recharge-banner:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            .price-badge {
                position: absolute;
                top: -10px;
                right: 10px;
                background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
                color: #fff;
                font-weight: 800;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 13px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                letter-spacing: 0.5px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
            }
            .price-main {
                font-size: 16px;
                font-weight: 900;
                line-height: 1;
            }
            .tax-label {
                font-size: 8px;
                font-weight: 600;
                text-transform: uppercase;
                opacity: 0.9;
                letter-spacing: 0.5px;
                background: rgba(0,0,0,0.2);
                padding: 2px 6px;
                border-radius: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    renderBannerHTML(sponsor, type) {
        const imgBg = sponsor.bg || 'transparent';
        const taxLabel = this.getTaxLabel();
        
        if (type === 'loader') {
            // BANNER GRANDE (Dashboard)
            return `
            <div class="recharge-banner fade-in" style="border-color:${sponsor.color};">
                
                <div class="price-badge">
                    <div class="price-main">${sponsor.price}</div>
                    <div class="tax-label">${taxLabel}</div>
                </div>
                
                <div class="ad-layout">
                    <div class="ad-img-box" style="background:${imgBg}; width: 80px; height: 50px;">
                        <img src="${sponsor.logo}" alt="${sponsor.name}">
                    </div>
                    <div class="ad-content-box">
                        <div style="font-weight:700; font-size:13px; color:${sponsor.color}; margin-bottom:3px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ⚡ ${sponsor.badge}
                        </div>
                        <div style="font-size:12px; opacity:0.9; line-height:1.3; color: #fff; font-weight: 500;">${sponsor.text}</div>
                    </div>
                    <div style="margin-left: auto; padding-left: 10px;">
                        <i class="fas fa-arrow-right" style="color:${sponsor.color}; font-size:20px;"></i>
                    </div>
                </div>
            </div>`;
        } else {
            // BANNER PICCOLO (Footer giochi, etc)
            return `
            <div class="ad-banner fade-in" style="border-top: 3px solid ${sponsor.color}; background: #0f172a; padding: 0 10px; height: 100%;">
                
                <div class="ad-layout">
                    <div class="ad-img-box" style="background:${imgBg}; width: 60px; height: 40px; margin-right: 10px;">
                        <img src="${sponsor.logo}" alt="${sponsor.name}">
                    </div>
                    <div class="ad-content-box">
                        <div style="font-size:10px; color:${sponsor.color}; font-weight:800; text-transform:uppercase;">${sponsor.credits}</div>
                        <div style="font-size:11px; font-weight:600; color:#fff;">${sponsor.price} <span style="font-size:8px; opacity:0.7;">${taxLabel}</span></div>
                    </div>
                    <i class="fas fa-chevron-right" style="color:${sponsor.color}; opacity:0.7; font-size:12px;"></i>
                </div>
            </div>`;
        }
    }

    inject(containerSelector, type = 'loader') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const updateAd = () => {
            const sponsor = this.getNextSponsor();
            container.innerHTML = this.renderBannerHTML(sponsor, type);
        };

        updateAd(); 
        
        if (!window.adIntervals) window.adIntervals = [];
        const interval = setInterval(updateAd, 8000); // Cambia ogni 8 secondi
        window.adIntervals.push(interval);
    }
}

// Inizializza
window.SponsorManager = new SponsorEngine();
