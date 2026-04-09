/* ========================================
   MOBILE NAVIGATION TOGGLE
   ======================================== */

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navLink = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger menu
    const hamburgers = document.querySelectorAll('.hamburger');
    hamburgers[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translateY(11px)' : 'rotate(0)';
    hamburgers[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    hamburgers[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translateY(-11px)' : 'rotate(0)';
});

// Close menu when a link is clicked
navLink.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        
        // Reset hamburger menu
        const hamburgers = document.querySelectorAll('.hamburger');
        hamburgers[0].style.transform = 'rotate(0)';
        hamburgers[1].style.opacity = '1';
        hamburgers[2].style.transform = 'rotate(0)';
    });
});

// Handle dropdown menu clicks
const dropdownLinks = document.querySelectorAll('.dropdown-link');
dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.classList.remove('active');
        
        // Reset hamburger menu
        const hamburgers = document.querySelectorAll('.hamburger');
        hamburgers[0].style.transform = 'rotate(0)';
        hamburgers[1].style.opacity = '1';
        hamburgers[2].style.transform = 'rotate(0)';
        
        // Navigate to the target section
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ========================================
   INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
   ======================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and items for scroll animation
document.querySelectorAll(
    '.research-card, .publication-item, .achievement-card, .timeline-item'
).forEach(el => {
    observer.observe(el);
});

/* ========================================
   HEADER SCROLL EFFECT
   ======================================== */

let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add subtle shadow on scroll
    if (scrollTop > 50) {
        header.style.boxShadow = '0 2px 15px rgba(59, 130, 246, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

/* ========================================
   HERO SCROLL INDICATOR ANIMATION
   ======================================== */

const scrollIndicator = document.querySelector('.scroll-indicator');
const heroSection = document.querySelector('.hero');

if (scrollIndicator && heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrolled > heroHeight * 0.5) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

/* ========================================
   ACTIVE NAV LINK HIGHLIGHTING
   ======================================== */

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const sectionId = section.getAttribute('id');
            
            navLink.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = 'var(--color-accent-blue)';
                    link.style.transition = 'all 0.3s ease';
                }
            });
        }
    });
});

/* ========================================
   PARALLAX EFFECT ON HERO
   ======================================== */

const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    
    if (scrollPosition < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrollPosition / window.innerHeight) * 0.3;
    }
});

/* ========================================
   BUTTON RIPPLE EFFECT
   ======================================== */

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripples = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripples.style.width = ripples.style.height = size + 'px';
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.classList.add('ripple');
        
        // Clean up existing ripples
        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        this.appendChild(ripples);
    });
});

/* ========================================
   CONTACT FORM INTERACTION (if added)
   ======================================== */

const contactItems = document.querySelectorAll('.contact-item');

contactItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.2)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

/* ========================================
   TYPED ANIMATION FOR HERO (Optional Enhancement)
   ======================================== */

// This function can be used to create a typing effect
// Uncomment if you want to add a typing animation to the hero subtitle

/*
function typeText(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Usage: typeText(document.querySelector('.hero-subtitle'), 'Assistant Professor at IIT Patna');
*/

/* ========================================
   ACCESSIBILITY ENHANCEMENTS
   ======================================== */

// Ensure proper focus management for keyboard navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--color-accent-blue)';
        this.style.outlineOffset = '4px';
    });
    
    link.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

/* ========================================
   PERFORMANCE OPTIMIZATION: LAZY LOADING
   ======================================== */

// This can be used for images if added in the future
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ========================================
   PRINT STYLES INITIALIZATION
   ======================================== */

window.addEventListener('beforeprint', () => {
    document.body.style.backgroundColor = '#ffffff';
    document.querySelectorAll('.header, .footer, .scroll-indicator').forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', () => {
    document.body.style.backgroundColor = '';
    document.querySelectorAll('.header, .footer').forEach(el => {
        el.style.display = '';
    });
});

/* ========================================
   UTILITY FUNCTION: DEBOUNCE
   ======================================== */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ========================================
   SCROLL PERFORMANCE OPTIMIZATION
   ======================================== */

// Throttle scroll events for better performance
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll event handler logic is already implemented above
            ticking = false;
        });
        ticking = true;
    }
});

/* ========================================
   IMAGE CAROUSEL FUNCTIONALITY
   ======================================== */

class ImageCarousel {
    constructor() {
        this.track = document.getElementById('imageCarouselTrack');
        this.prevBtn = document.getElementById('imageCarouselPrev');
        this.nextBtn = document.getElementById('imageCarouselNext');
        this.indicators = document.querySelectorAll('.image-indicator');
        this.slides = document.querySelectorAll('.image-slide');
        
        if (!this.track) return; // Exit if carousel doesn't exist
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.autoSlideDuration = 3000; // 3 seconds
        this.isAutoScrolling = true;
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.startAutoSlide();
    }
    
    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.slidePrev());
        this.nextBtn.addEventListener('click', () => this.slideNext());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause auto-slide on hover
        this.track.parentElement.addEventListener('mouseenter', () => this.pauseAutoSlide());
        this.track.parentElement.addEventListener('mouseleave', () => {
            if (this.isAutoScrolling) {
                this.startAutoSlide();
            }
        });
    }
    
    slideNext() {
        // Move by one slide for continuous scrolling
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlidePosition();
        this.updateIndicators();
    }
    
    slidePrev() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlidePosition();
        this.updateIndicators();
    }
    
    goToSlide(slideIndex) {
        this.pauseAutoSlide();
        this.isAutoScrolling = false;
        
        this.currentSlide = slideIndex;
        this.updateSlidePosition();
        this.updateIndicators();
        
        this.isAutoScrolling = true;
        this.startAutoSlide();
    }
    
    updateSlidePosition() {
        // Calculate the offset based on slide width
        // Each slide takes up approximately 20% + gap spacing
        const slideWidth = 100 / this.totalSlides;
        const offset = this.currentSlide * slideWidth;
        this.track.style.transform = `translateX(-${offset}%)`;
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.slideNext();
        }, this.autoSlideDuration);
    }
    
    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    destroy() {
        this.pauseAutoSlide();
        this.isAutoScrolling = false;
        this.prevBtn.removeEventListener('click', () => this.slidePrev());
        this.nextBtn.removeEventListener('click', () => this.slideNext());
    }
}

// Initialize carousel when DOM is ready
let imageCarousel = null;

/* ========================================
   DOM READY INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize image carousel
    imageCarousel = new ImageCarousel();
    
    // Initialize all components when DOM is ready
    console.log('Website loaded successfully');
    
    // Add loading class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Log version for debugging
    console.log('Dr. Daya Sagar Gupta - Professional Portfolio v1.0');
});

/* ========================================
   CUSTOM EVENTS FOR FUTURE USE
   ======================================== */

// Create custom events for section visibility
const sectionVisibilityEvent = new CustomEvent('sectionVisible', {
    detail: { section: 'research' }
});

/* ========================================
   ERROR HANDLING
   ======================================== */

// Global error handler for script errors
window.addEventListener('error', (event) => {
    console.error('An error occurred:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

/* ========================================
   EXPORT FOR MODULAR USE (if needed)
   ======================================== */

// If this script is used as a module, export functions
// export { debounce, typeText };
