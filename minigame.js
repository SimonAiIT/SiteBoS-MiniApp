/**
 * MINIGAME.JS - Work Escape Game Engine (Modular)
 * Gioco labirinto con pathfinding AI enemies
 * Integrazione con processor.html per sistema pubblicità
 */

const MiniGame = {
    // ===== CONFIGURAZIONE =====
    canvas: null,
    ctx: null,
    active: false,
    score: 0,
    bestScore: 0,
    
    // Grid Config
    rows: 21,
    cols: 13,
    gridSize: 0,
    
    // Game State
    map: [],
    player: null,
    enemies: [],
    items: [],
    pathQueue: [],
    targetPos: null,
    
    // Speed Config (RALLENTATI)
    baseSpeed: 0.20,
    boostSpeed: 0.45,
    enemySpeedSmart: 0.08,  // Era 0.11-0.12, ora più lento
    enemySpeedDumb: 0.06,   // Era 0.08, ora più lento
    boostTimer: null,
    
    // Sprites
    sprites: {
        player: '🤖',
        enemies: ['📧', '💼', '📞'],
        items: [
            { id: 'heart', icon: '❤️' },
            { id: 'house', icon: '🏠' },
            { id: 'dance', icon: '💃' },
            { id: 'travel', icon: '✈️' }
        ]
    },
    
    // ===== PATHFINDING ALGORITMO (BFS) =====
    Pathfinder: {
        findPath: function(map, start, end) {
            const rows = map.length;
            const cols = map[0].length;
            
            const s = {x: Math.round(start.x), y: Math.round(start.y)};
            const e = {x: Math.round(end.x), y: Math.round(end.y)};
            
            if(map[e.y][e.x] === 1) return [];
            
            const queue = [s];
            const cameFrom = {};
            cameFrom[`${s.x},${s.y}`] = null;
            
            const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
            let found = false;
            let safetyCounter = 0;
            
            while(queue.length > 0 && safetyCounter < 1000) {
                safetyCounter++;
                const current = queue.shift();
                
                if(current.x === e.x && current.y === e.y) {
                    found = true;
                    break;
                }
                
                for(let d of dirs) {
                    const next = {x: current.x + d.x, y: current.y + d.y};
                    const key = `${next.x},${next.y}`;
                    
                    if(next.x >= 0 && next.x < cols && 
                       next.y >= 0 && next.y < rows && 
                       map[next.y][next.x] !== 1 && 
                       !(key in cameFrom)) {
                        queue.push(next);
                        cameFrom[key] = current;
                    }
                }
            }
            
            if(!found) return [];
            
            let curr = e;
            const path = [];
            while(curr.x !== s.x || curr.y !== s.y) {
                const prev = cameFrom[`${curr.x},${curr.y}`];
                path.push({x: curr.x - prev.x, y: curr.y - prev.y});
                curr = prev;
            }
            return path.reverse();
        }
    },
    
    // ===== MAP GENERATOR (Recursive Backtracker) =====
    MapGenerator: {
        create: function(rows, cols) {
            let map = Array(rows).fill().map(() => Array(cols).fill(1));
            
            const stack = [{x: 1, y: 1}];
            map[1][1] = 0;
            
            const dirs = [
                {x:0, y:-2}, {x:0, y:2}, {x:-2, y:0}, {x:2, y:0}
            ];
            
            while(stack.length > 0) {
                const current = stack[stack.length - 1];
                const neighbors = [];
                
                dirs.forEach(d => {
                    const nx = current.x + d.x;
                    const ny = current.y + d.y;
                    
                    if(nx > 0 && nx < cols-1 && ny > 0 && ny < rows-1 && map[ny][nx] === 1) {
                        neighbors.push({x: nx, y: ny, dx: d.x/2, dy: d.y/2});
                    }
                });
                
                if(neighbors.length > 0) {
                    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                    map[current.y + next.dy][current.x + next.dx] = 0;
                    map[next.y][next.x] = 0;
                    stack.push({x: next.x, y: next.y});
                } else {
                    stack.pop();
                }
            }
            
            // Loop removal (meno vicoli ciechi)
            for(let y=1; y<rows-1; y++) {
                for(let x=1; x<cols-1; x++) {
                    if(map[y][x] === 1 && Math.random() < 0.20) {
                        let surroundingWalls = 0;
                        if(map[y-1][x]) surroundingWalls++;
                        if(map[y+1][x]) surroundingWalls++;
                        if(map[y][x-1]) surroundingWalls++;
                        if(map[y][x+1]) surroundingWalls++;
                        
                        if(surroundingWalls >= 2) map[y][x] = 0;
                    }
                }
            }
            
            map[1][1] = 0;
            return map;
        }
    },
    
    // ===== API PUBBLICA =====
    init: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.setupInputs();
        this.loadBestScore();
    },
    
    start: function() {
        if(this.active) return;
        
        // Reset UI
        if(this.boostTimer) clearTimeout(this.boostTimer);
        
        // Reset Game State
        this.map = this.MapGenerator.create(this.rows, this.cols);
        this.spawnEntities();
        this.score = 0;
        this.pathQueue = [];
        this.targetPos = null;
        
        this.updateScoreUI();
        this.active = true;
        this.loop();
    },
    
    stop: function() {
        this.active = false;
        if(this.boostTimer) clearTimeout(this.boostTimer);
        this.saveBestScore();
        sessionStorage.setItem('last_game_score', Math.min(this.score, 500)); // CAP a 500
    },
    
    restart: function() {
        this.start();
    },
    
    // ===== GAME LOGIC =====
    spawnEntities: function() {
        let freeSpots = [];
        for(let y=0; y<this.rows; y++) {
            for(let x=0; x<this.cols; x++) {
                if(this.map[y][x] === 0) freeSpots.push({x,y});
            }
        }
        freeSpots.sort(() => Math.random() - 0.5);
        
        // Player
        let pSpot = freeSpots.find(s => s.x < 5 && s.y < 5) || freeSpots[0];
        this.player = {
            x: pSpot.x, y: pSpot.y,
            dir: {x:0, y:0},
            speed: this.baseSpeed,
            progress: 0
        };
        
        freeSpots = freeSpots.filter(s => s !== pSpot);
        freeSpots.sort((a,b) => {
            const distA = Math.abs(a.x - pSpot.x) + Math.abs(a.y - pSpot.y);
            const distB = Math.abs(b.x - pSpot.x) + Math.abs(b.y - pSpot.y);
            return distB - distA;
        });
        
        // Items
        this.items = this.sprites.items.map((item, i) => ({
            ...item,
            x: freeSpots[i].x,
            y: freeSpots[i].y,
            collected: false
        }));
        
        // Enemies (RALLENTATI)
        this.enemies = [
            { type: 'smart', icon: this.sprites.enemies[0], x: freeSpots[4].x, y: freeSpots[4].y, dir: {x:0,y:0}, progress:0, speed: this.enemySpeedSmart },
            { type: 'dumb',  icon: this.sprites.enemies[1], x: freeSpots[5].x, y: freeSpots[5].y, dir: {x:0,y:0}, progress:0, speed: this.enemySpeedDumb },
            { type: 'smart', icon: this.sprites.enemies[2], x: freeSpots[6].x, y: freeSpots[6].y, dir: {x:0,y:0}, progress:0, speed: this.enemySpeedSmart }
        ];
    },
    
    update: function() {
        // Movement
        this.moveActor(this.player, true);
        
        this.enemies.forEach(enemy => {
            if(enemy.progress === 0) {
                if(enemy.type === 'smart') {
                    const path = this.Pathfinder.findPath(this.map, enemy, this.player);
                    if(path.length > 0) enemy.dir = path[0];
                } else {
                    const possible = [{x:0,y:1},{x:0,y:-1},{x:1,y:0},{x:-1,y:0}]
                        .filter(d => {
                            const nx = Math.round(enemy.x) + d.x;
                            const ny = Math.round(enemy.y) + d.y;
                            return this.isValid(nx, ny) && this.map[ny][nx] === 0;
                        });
                    if(possible.length > 0) {
                        enemy.dir = possible[Math.floor(Math.random()*possible.length)];
                    }
                }
            }
            this.moveActor(enemy, false);
        });
        
        // Collisions
        this.checkCollisions();
    },
    
    moveActor: function(actor, isPlayer) {
        if(actor.progress > 0) {
            actor.progress += actor.speed;
            if(actor.progress >= 1) {
                actor.x += actor.dir.x;
                actor.y += actor.dir.y;
                actor.progress = 0;
                actor.dir = {x:0, y:0};
                
                if(isPlayer && this.targetPos && actor.x === this.targetPos.x && actor.y === this.targetPos.y) {
                    this.targetPos = null;
                }
            }
        } else if (isPlayer && this.pathQueue.length > 0) {
            actor.dir = this.pathQueue.shift();
            actor.progress = actor.speed;
        } else if (!isPlayer && (actor.dir.x !== 0 || actor.dir.y !== 0)) {
            actor.progress = actor.speed;
        }
    },
    
    checkCollisions: function() {
        const px = this.player.x + (this.player.dir.x * this.player.progress);
        const py = this.player.y + (this.player.dir.y * this.player.progress);
        
        // Items
        this.items.forEach(item => {
            if(!item.collected) {
                if(Math.abs(px - item.x) < 0.5 && Math.abs(py - item.y) < 0.5) {
                    item.collected = true;
                    this.score += 100;
                    
                    // CAP a 500 punti
                    if(this.score > 500) this.score = 500;
                    
                    this.updateScoreUI();
                    this.triggerBoost();
                    
                    // Win condition
                    if(this.items.every(i => i.collected)) {
                        this.endGame(true);
                    }
                }
            }
        });
        
        // Enemies
        this.enemies.forEach(enemy => {
            const ex = enemy.x + (enemy.dir.x * enemy.progress);
            const ey = enemy.y + (enemy.dir.y * enemy.progress);
            
            if(Math.abs(px - ex) < 0.6 && Math.abs(py - ey) < 0.6) {
                this.endGame(false);
            }
        });
    },
    
    triggerBoost: function() {
        if(this.boostTimer) clearTimeout(this.boostTimer);
        this.player.speed = this.boostSpeed;
        
        if(window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        
        this.boostTimer = setTimeout(() => {
            this.player.speed = this.baseSpeed;
        }, 3000);
    },
    
    endGame: function(win) {
        this.active = false;
        
        // CAP finale a 500
        if(this.score > 500) this.score = 500;
        
        if(win) {
            this.score += 100; // Bonus completamento
            if(this.score > 500) this.score = 500; // Re-check dopo bonus
        }
        
        this.saveBestScore();
        sessionStorage.setItem('last_game_score', this.score);
        
        if(window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred(win ? 'success' : 'error');
        }
        
        // Chiudi automaticamente il game layer dopo 1.5s
        setTimeout(() => {
            if(typeof closeGame === 'function') closeGame();
        }, 1500);
    },
    
    // ===== INPUT HANDLING =====
    setupInputs: function() {
        const handleInput = (e) => {
            if(!this.active) return;
            if(e.target.closest('.ad-banner')) return; // Ignora click su ads
            if(e.cancelable) e.preventDefault();
            
            const rect = this.canvas.getBoundingClientRect();
            
            let clientX, clientY;
            if(e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            const cssX = clientX - rect.left;
            const cssY = clientY - rect.top;
            
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            const canvasX = cssX * scaleX;
            const canvasY = cssY * scaleY;
            
            const gridX = Math.floor(canvasX / this.gridSize);
            const gridY = Math.floor(canvasY / this.gridSize);
            
            this.handleGridClick(gridX, gridY);
        };
        
        this.canvas.addEventListener('touchstart', handleInput, {passive: false});
        this.canvas.addEventListener('mousedown', handleInput);
    },
    
    handleGridClick: function(tx, ty) {
        if(tx < 0 || tx >= this.cols || ty < 0 || ty >= this.rows) return;
        
        // Correzione muro
        if(this.map[ty][tx] === 1) {
            const neighbors = [
                {x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}
            ];
            let foundAlt = false;
            for(let n of neighbors) {
                if(this.isValid(tx+n.x, ty+n.y) && this.map[ty+n.y][tx+n.x] === 0) {
                    tx += n.x; ty += n.y;
                    foundAlt = true;
                    break;
                }
            }
            if(!foundAlt) return;
        }
        
        this.targetPos = {x: tx, y: ty};
        
        let startNode = {
            x: Math.round(this.player.x), 
            y: Math.round(this.player.y)
        };
        
        if(this.player.progress > 0.1) {
            startNode.x += this.player.dir.x;
            startNode.y += this.player.dir.y;
        }
        
        const path = this.Pathfinder.findPath(this.map, startNode, this.targetPos);
        if(path.length > 0) {
            this.pathQueue = path;
        }
    },
    
    isValid: function(x, y) {
        return x>=0 && x<this.cols && y>=0 && y<this.rows;
    },
    
    // ===== RENDERING =====
    draw: function() {
        this.ctx.fillStyle = '#0b1120';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const gs = this.gridSize;
        
        // Mappa
        for(let y=0; y<this.rows; y++) {
            for(let x=0; x<this.cols; x++) {
                if(this.map[y][x] === 1) {
                    const posX = x * gs;
                    const posY = y * gs;
                    
                    this.ctx.fillStyle = '#1e293b';
                    this.ctx.fillRect(posX, posY, gs, gs);
                    
                    this.ctx.fillStyle = '#334155';
                    this.ctx.fillRect(posX+2, posY+2, gs-4, gs-4);
                }
            }
        }
        
        // Target marker
        if(this.targetPos) {
            const tx = this.targetPos.x * gs + gs/2;
            const ty = this.targetPos.y * gs + gs/2;
            
            this.ctx.strokeStyle = '#4cd964';
            this.ctx.lineWidth = 2;
            
            const pulse = (Math.sin(Date.now() / 150) + 1) * 3;
            this.ctx.beginPath();
            this.ctx.arc(tx, ty, (gs/4) + pulse, 0, Math.PI*2);
            this.ctx.stroke();
        }
        
        // Items
        this.ctx.font = `${gs * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.items.forEach(item => {
            if(!item.collected) {
                this.ctx.fillText(item.icon, item.x*gs + gs/2, item.y*gs + gs/2 + 2);
            }
        });
        
        // Player
        const px = (this.player.x + this.player.dir.x * this.player.progress) * gs + gs/2;
        const py = (this.player.y + this.player.dir.y * this.player.progress) * gs + gs/2;
        
        this.ctx.font = `${gs * 0.75}px Arial`;
        
        if(this.player.speed > this.baseSpeed) {
            this.ctx.shadowColor = '#facc15';
            this.ctx.shadowBlur = 15;
        }
        this.ctx.fillText(this.sprites.player, px, py + 2);
        this.ctx.shadowBlur = 0;
        
        // Enemies
        this.enemies.forEach(e => {
            const ex = (e.x + e.dir.x * e.progress) * gs + gs/2;
            const ey = (e.y + e.dir.y * e.progress) * gs + gs/2;
            this.ctx.fillText(e.icon, ex, ey + 2);
        });
    },
    
    loop: function() {
        if(!this.active) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    },
    
    // ===== UTILITIES =====
    resize: function() {
        const wrapper = this.canvas.parentElement;
        
        // Calcola spazio disponibile
        const w = wrapper.clientWidth - 10;
        
        // IMPORTANTE: Sottrai spazio per banner pubblicitario in basso
        // Banner height: 80px + instruction text: ~25px + margini: ~10px = ~115px totale
        const adFooterHeight = 115;
        const h = wrapper.clientHeight - adFooterHeight - 10;
        
        const cellW = Math.floor(w / this.cols);
        const cellH = Math.floor(h / this.rows);
        
        // Usa la dimensione più piccola per mantenere proporzioni
        this.gridSize = Math.min(cellW, cellH);
        
        // Imposta dimensioni canvas
        this.canvas.width = this.gridSize * this.cols;
        this.canvas.height = this.gridSize * this.rows;
    },
    
    updateScoreUI: function() {
        const scoreEl = document.getElementById('score');
        if(scoreEl) scoreEl.innerText = this.score;
        
        if(this.score > this.bestScore) {
            this.bestScore = this.score;
            const bestEl = document.getElementById('best-score');
            if(bestEl) bestEl.innerText = this.bestScore;
        }
    },
    
    loadBestScore: function() {
        const saved = localStorage.getItem('sitebos_highscore');
        if(saved) {
            this.bestScore = Math.min(parseInt(saved), 500); // CAP anche best score
            const bestEl = document.getElementById('best-score');
            if(bestEl) bestEl.innerText = this.bestScore;
        }
    },
    
    saveBestScore: function() {
        if(this.score > this.bestScore) {
            this.bestScore = Math.min(this.score, 500);
            localStorage.setItem('sitebos_highscore', this.bestScore);
        }
    }
};
