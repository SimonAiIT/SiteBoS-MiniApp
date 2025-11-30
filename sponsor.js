/**
 * SPONSOR MANAGER (v4.0 - VISUAL EDITION)
 * Converte meglio grazie ai loghi reali dei brand.
 */

const SPONSORS = [
    {
        id: "trinai_pro",
        name: "TrinAI Premium",
        badge: "SUPPORTO VIP",
        text: "Assistenza prioritaria WhatsApp.",
        // Uso un placeholder colorato per il tuo brand, o metti il tuo logo
        logo: "https://via.placeholder.com/150x50/000000/FFD700?text=TrinAI+PRO",
        color: "#FFD700", 
        link: "https://t.me/TrinAi_TecSupport_bot"
    },
    {
        id: "sumup",
        name: "SumUp",
        badge: "POS MOBILE",
        text: "Zero canone. Paghi solo se lo usi.",
        // Logo SumUp ufficiale (White version per dark mode)
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/SumUp_Logo.svg/1200px-SumUp_Logo.svg.png", 
        color: "#307fff",
        link: "https://sumup.it/r/TUO_CODICE",
        bg: "#ffffff" // Sfondo bianco per il logo se necessario
    },
    {
        id: "fattureincloud",
        name: "Fatture in Cloud",
        badge: "GESTIONALE",
        text: "Fattura elettronica in 1 click.",
        // Logo Fatture in Cloud
        logo: "https://www.fattureincloud.it/images/logo-fic-blu.svg",
        color: "#1abc9c",
        link: "https://www.fattureincloud.it/ref/TUO_CODICE",
        bg: "#ffffff"
    },
    {
        id: "nordvpn",
        name: "NordVPN",
        badge: "SICUREZZA",
        text: "Proteggi i dati dei tuoi clienti.",
        // Logo NordVPN
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/NordVPN_Horizontal_Logo_White.svg/2560px-NordVPN_Horizontal_Logo_White.svg.png",
        color: "#4a90e2",
        link: "https://nordvpn.com/ref/TUO_CODICE",
        bg: "transparent"
    },
    {
        id: "revolut",
        name: "Revolut",
        badge: "CONTO BUSINESS",
        text: "La banca globale per le aziende.",
        // Logo Revolut
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Revolut_logo_2020.svg/1200px-Revolut_logo_2020.svg.png",
        color: "#fff",
        link: "https://revolut.com/referral/TUO_CODICE",
        bg: "transparent"
    }
];

class SponsorEngine {
    constructor() {
        this.currentIndex = 0;
        this.shuffle(SPONSORS);
        this.injectStyles(); // Inietta il CSS specifico per le immagini
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
        // CSS per rendere i loghi belli
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
        `;
        document.head.appendChild(style);
    }

    renderBannerHTML(sponsor, type) {
        // Logica per gestire sfondi dei loghi (alcuni sono neri su sfondo nero, serve bianco)
        const imgBg = sponsor.bg || 'transparent'; 
        
        if (type === 'loader') {
            // BANNER GRANDE (Loader)
            return `
            <div class="ad-banner fade-in" onclick="window.open('${sponsor.link}', '_blank')" 
                 style="border-color:${sponsor.color}; padding: 10px; height: auto; min-height: 70px;">
                
                <span class="ad-badge" style="background:${sponsor.color}; color:${sponsor.color==='#fff'?'#000':'#fff'}; font-weight:800;">${sponsor.badge}</span>
                
                <div class="ad-layout">
                    <div class="ad-img-box" style="background:${imgBg}; width: 80px; height: 50px;">
                        <img src="${sponsor.logo}" alt="${sponsor.name}">
                    </div>
                    <div class="ad-content-box">
                        <div style="font-weight:bold; font-size:14px; color:${sponsor.color}; margin-bottom:2px;">${sponsor.name}</div>
                        <div style="font-size:11px; opacity:0.8; line-height:1.2;">${sponsor.text}</div>
                    </div>
                </div>
            </div>`;
        } else {
            // BANNER PICCOLO (Gioco Footer)
            return `
            <div class="ad-banner fade-in" onclick="window.open('${sponsor.link}', '_blank')" 
                 style="border-top: 3px solid ${sponsor.color}; background: #0f172a; padding: 0 10px; height: 100%;">
                
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
        const interval = setInterval(updateAd, 15000); 
        window.adIntervals.push(interval);
    }
}

// Inizializza
window.SponsorManager = new SponsorEngine();
