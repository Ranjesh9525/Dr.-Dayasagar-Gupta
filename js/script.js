/* =================================================
   DR. DAYA SAGAR GUPTA — COMPLETE JS
   Three.js 3D • Scroll Animations • Interactions
   ================================================= */

/* -----------------------------------------------
   THREE.JS — 3D NETWORK PARTICLE BACKGROUND
   ----------------------------------------------- */

(function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 600;

    // ---- PARTICLES ----
    const PARTICLE_COUNT = 700;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors    = new Float32Array(PARTICLE_COUNT * 3);
    const sizes     = new Float32Array(PARTICLE_COUNT);

    const palette = [
        new THREE.Color(0x2563eb), // blue
        new THREE.Color(0x06b6d4), // cyan
        new THREE.Color(0x3b82f6), // blue-light
        new THREE.Color(0x0ea5e9), // sky
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        // Sphere distribution
        const r     = 300 + Math.random() * 500;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i3]     = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;

        sizes[i] = Math.random() * 2.5 + 0.5;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    pGeo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const pMat = new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
        depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ---- CONNECTIONS (lines between nearby particles) ----
    const linePositions = [];
    const lineColors    = [];
    const MAX_DIST = 120;
    const MAX_LINES = 400;
    let lineCount = 0;

    for (let i = 0; i < PARTICLE_COUNT && lineCount < MAX_LINES; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && lineCount < MAX_LINES; j++) {
            const ax = positions[i * 3], ay = positions[i * 3 + 1], az = positions[i * 3 + 2];
            const bx = positions[j * 3], by = positions[j * 3 + 1], bz = positions[j * 3 + 2];
            const d  = Math.sqrt((ax-bx)**2 + (ay-by)**2 + (az-bz)**2);
            if (d < MAX_DIST) {
                linePositions.push(ax, ay, az, bx, by, bz);
                const alpha = 1 - d / MAX_DIST;
                lineColors.push(0.15 * alpha, 0.38 * alpha, 0.94 * alpha,
                                 0.15 * alpha, 0.38 * alpha, 0.94 * alpha);
                lineCount++;
            }
        }
    }

    if (lineCount > 0) {
        const lGeo = new THREE.BufferGeometry();
        lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lGeo.setAttribute('color',    new THREE.Float32BufferAttribute(lineColors, 3));
        const lMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.25, depthWrite: false });
        scene.add(new THREE.LineSegments(lGeo, lMat));
    }

    // ---- FLOATING GLOWING SPHERES ----
    const sphereData = [
        { r: 18, x: -200, y: 100,  z: -100, c: 0x2563eb },
        { r: 12, x: 220,  y: -80,  z: -50,  c: 0x06b6d4 },
        { r:  8, x: 0,    y: 200,  z: -200, c: 0x3b82f6 },
        { r: 14, x: -120, y: -150, z: -80,  c: 0x0ea5e9 },
        { r:  6, x: 300,  y: 80,   z: -120, c: 0x06b6d4 },
    ];

    const meshes = sphereData.map(d => {
        const geo  = new THREE.SphereGeometry(d.r, 16, 16);
        const mat  = new THREE.MeshBasicMaterial({ color: d.c, transparent: true, opacity: 0.12, wireframe: false });
        const wire = new THREE.MeshBasicMaterial({ color: d.c, transparent: true, opacity: 0.5, wireframe: true });
        const solid= new THREE.Mesh(geo, mat);
        const wireM= new THREE.Mesh(geo, wire);
        const group= new THREE.Group();
        group.add(solid, wireM);
        group.position.set(d.x, d.y, d.z);
        scene.add(group);
        return group;
    });

    // ---- MOUSE PARALLAX ----
    let mouse = { x: 0, y: 0 };
    document.addEventListener('mousemove', e => {
        mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ---- SCROLL FADE ----
    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.pageYOffset; });

    // ---- RESIZE ----
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ---- ANIMATION LOOP ----
    let clock = 0;
    function animate() {
        requestAnimationFrame(animate);
        clock += 0.003;

        // Particle rotation
        particles.rotation.x = clock * 0.08 + mouse.y * 0.04;
        particles.rotation.y = clock * 0.12 + mouse.x * 0.06;

        // Floating spheres
        meshes.forEach((m, i) => {
            m.rotation.x += 0.004 + i * 0.001;
            m.rotation.y += 0.006 + i * 0.001;
            m.position.y += Math.sin(clock + i * 1.2) * 0.3;
        });

        // Camera parallax
        camera.position.x += (mouse.x * 30 - camera.position.x) * 0.03;
        camera.position.y += (-mouse.y * 20 - camera.position.y) * 0.03;

        // Fade canvas on scroll
        const fadeStart = window.innerHeight * 0.5;
        const fadeAlpha = Math.max(0, 1 - scrollY / fadeStart);
        canvas.style.opacity = fadeAlpha;

        renderer.render(scene, camera);
    }
    animate();
})();


/* -----------------------------------------------
   HEADER SCROLL BEHAVIOR
   ----------------------------------------------- */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* -----------------------------------------------
   MOBILE NAV TOGGLE
   ----------------------------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
const hamburgers= document.querySelectorAll('.hamburger');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        hamburgers[0].style.transform = open ? 'rotate(45deg) translateY(7px)'  : '';
        hamburgers[1].style.opacity   = open ? '0' : '1';
        hamburgers[2].style.transform = open ? 'rotate(-45deg) translateY(-7px)': '';
    });
}

// Close menu on link click
document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburgers[0].style.transform = '';
        hamburgers[1].style.opacity   = '';
        hamburgers[2].style.transform = '';
    });
});


/* -----------------------------------------------
   SMOOTH SCROLL
   ----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});


/* -----------------------------------------------
   ACTIVE NAV LINK HIGHLIGHTING
   ----------------------------------------------- */
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const pos = window.scrollY + 120;
    sections.forEach(sec => {
        if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
            allNavLinks.forEach(l => l.classList.remove('active-link'));
            const match = document.querySelector(`.nav-link[href="#${sec.id}"]`);
            if (match) match.classList.add('active-link');
        }
    });
}, { passive: true });


/* -----------------------------------------------
   SCROLL REVEAL (IntersectionObserver)
   ----------------------------------------------- */
function addRevealClasses() {
    const selectors = [
        '.research-card', '.pub-card', '.student-card',
        '.timeline-card', '.edu-card', '.contact-card',
        '.ach-card', '.section-header', '.carousel-container',
        '.achievements-fallback', '.pub-filter-bar', '.pub-more',
        '.table-wrapper'
    ];
    let delay = 0;
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal');
            // Stagger delay per parent group
            el.style.transitionDelay = `${(i % 6) * 0.1}s`;
        });
    });
}

addRevealClasses();

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* -----------------------------------------------
   CARD 3D TILT ON MOUSE MOVE
   ----------------------------------------------- */
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
        card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
        // Move the shine
        const shine = card.querySelector('.card-shine');
        if (shine) {
            shine.style.setProperty('--mx', `${(e.clientX - rect.left) / rect.width * 100}%`);
            shine.style.setProperty('--my', `${(e.clientY - rect.top)  / rect.height * 100}%`);
        }
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});


/* -----------------------------------------------
   PUBLICATION FILTER
   ----------------------------------------------- */
const filterBtns = document.querySelectorAll('.pub-filter');
const pubCards   = document.querySelectorAll('.pub-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        pubCards.forEach(card => {
            if (filter === 'all' || card.dataset.type === filter) {
                card.classList.remove('hidden');
                card.style.display = '';
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
    });
});


/* -----------------------------------------------
   IMAGE CAROUSEL
   ----------------------------------------------- */
(function initCarousel() {
    const track   = document.getElementById('imageCarouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const count  = slides.length;
    if (count === 0) return;

    let current = 0;
    let timer   = null;

    // Build dots
    slides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(d);
    });

    function goTo(idx) {
        current = (idx + count) % count;
        track.style.transform = `translateX(-${current * 100}%)`;
        document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() { timer = setInterval(next, 3500); }
    function stopAuto()  { clearInterval(timer); }

    prevBtn && prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    // Touch swipe support
    let touchX = null;
    track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        if (touchX === null) return;
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
        touchX = null;
    });

    startAuto();
})();


/* -----------------------------------------------
   HERO PARALLAX (subtle)
   ----------------------------------------------- */
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const y = window.scrollY;
    if (y < window.innerHeight) {
        heroContent.style.transform = `translateY(${y * 0.2}px)`;
        heroContent.style.opacity   = String(1 - y / (window.innerHeight * 0.8));
    }
}, { passive: true });


/* -----------------------------------------------
   BUTTON RIPPLE
   ----------------------------------------------- */
document.querySelectorAll('.btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function(e) {
        const circle = document.createElement('span');
        const d = Math.max(this.clientWidth, this.clientHeight);
        const rect = this.getBoundingClientRect();
        Object.assign(circle.style, {
            position: 'absolute',
            width: d + 'px', height: d + 'px',
            left: (e.clientX - rect.left - d / 2) + 'px',
            top:  (e.clientY - rect.top  - d / 2) + 'px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            transform: 'scale(0)',
            animation: 'ripple 0.55s ease-out forwards',
            pointerEvents: 'none',
        });
        // Add keyframe if not already added
        if (!document.getElementById('ripple-style')) {
            const s = document.createElement('style');
            s.id = 'ripple-style';
            s.textContent = '@keyframes ripple { to { transform: scale(3); opacity: 0; } }';
            document.head.appendChild(s);
        }
        this.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    });
});


/* -----------------------------------------------
   SCROLL INDICATOR FADE
   ----------------------------------------------- */
const scrollIndicator = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
    if (!scrollIndicator) return;
    scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '';
}, { passive: true });


/* -----------------------------------------------
   INIT LOG
   ----------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    console.log('%c Dr. Daya Sagar Gupta — Portfolio v2.0 ', 
        'background: #2563eb; color: white; font-size: 14px; padding: 6px 12px; border-radius: 6px;');
});

window.addEventListener('error', e => console.error('JS Error:', e.error));
