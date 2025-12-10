/**
 * SPONSOR MANAGER (v5.0 - CREDIT BUNDLES EDITION)
 * Mostra i bundle di ricarica crediti come sponsor rotating
 */

const SPONSORS = [
    {
        id: "bundle_starter",
        name: "Starter Pack",
        badge: "100K CREDITI",
        text: "Perfetto per iniziare. Solo 9.99€",
        logo: "https://via.placeholder.com/150x50/10b981/ffffff?text=100K",
        color: "#10b981", 
        link: "#recharge",
        bg: "#ffffff"
    },
    {
        id: "bundle_pro",
        name: "Pro Bundle",
        badge: "500K CREDITI",
        text: "Il più venduto! Solo 39.99€",
        logo: "https://via.placeholder.com/150x50/3b82f6/ffffff?text=500K",
        color: "#3b82f6",
        link: "#recharge",
        bg: "#ffffff"
    },
    {
        id: "bundle_business",
        name: "Business Pack",
        badge: "1M CREDITI",
        text: "Massima convenienza. Solo 69.99€",
        logo: "https://via.placeholder.com/150x50/8b5cf6/ffffff?text=1M",
        color: "#8b5cf6",
        link: "#recharge",
        bg: "#ffffff"
    },
    {
        id: "bundle_enterprise",
        name: "Enterprise",
        badge: "5M CREDITI",
        text: "Per aziende che fanno sul serio. 299.99€",
        logo: "https://via.placeholder.com/150x50/f59e0b/ffffff?text=5M",
        color: "#f59e0b",
        link: "#recharge",
        bg: "#ffffff"
    },
    {
        id: "bundle_unlimited",
        name: "Unlimited",
        badge: "10M CREDITI",
        text: "Illimitato per 1 anno. 499.99€",
        logo: "https://via.placeholder.com/150x50/ef4444/ffffff?text=10M",
        color: "#ef4444",
        link: "#recharge",
        bg: "#ffffff"
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
                background: rgba(255,255,255,0.05);
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
            }
            .recharge-banner:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);
    }

    renderBannerHTML(sponsor, type) {
        const imgBg = sponsor.bg || 'transparent'; 
        
        if (type === 'loader') {
            // BANNER GRANDE (Dashboard)
            return `
            <div class="recharge-banner fade-in" style="border-color:${sponsor.color};">
                
                <span class="ad-badge" style="background:${sponsor.color}; color:#fff; font-weight:800; position: absolute; top: -8px; right: 10px; padding: 4px 10px; border-radius: 8px; font-size: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${sponsor.badge}</span>
                
                <div class="ad-layout">
                    <div class="ad-img-box" style="background:${imgBg}; width: 80px; height: 50px;">
                        <img src="${sponsor.logo}" alt="${sponsor.name}">
                    </div>
                    <div class="ad-content-box">
                        <div style="font-weight:bold; font-size:15px; color:${sponsor.color}; margin-bottom:4px;">⚡ ${sponsor.name}</div>
                        <div style="font-size:12px; opacity:0.9; line-height:1.3; color: #fff;">${sponsor.text}</div>
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
                        <div style="font-size:10px; color:${sponsor.color}; font-weight:800; text-transform:uppercase;">${sponsor.badge}</div>
                        <div style="font-size:11px; font-weight:600; color:#fff;">${sponsor.text}</div>
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
