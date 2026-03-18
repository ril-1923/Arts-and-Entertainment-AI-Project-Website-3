// Home page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    initCountdownTimer();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize hero animations
    initHeroAnimations();
});

// Countdown timer for upcoming event
function initCountdownTimer() {
    const eventDate = new Date('2025-03-15T20:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const timeDifference = eventDate - now;
        
        if (timeDifference > 0) {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        } else {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
        }
    }
    
    // Update countdown immediately and then every minute
    updateCountdown();
    setInterval(updateCountdown, 60000);
}

// Parallax effects for hero section
function initParallaxEffects() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// Hero animations on load
function initHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
    
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Feature card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Media carousel auto-play control
document.addEventListener('DOMContentLoaded', function() {
    const mediaCarousel = document.getElementById('mediaCarousel');
    
    if (mediaCarousel) {
        // Pause auto-play on hover
        mediaCarousel.addEventListener('mouseenter', function() {
            bootstrap.Carousel.getInstance(this).pause();
        });
        
        // Resume auto-play when mouse leaves
        mediaCarousel.addEventListener('mouseleave', function() {
            bootstrap.Carousel.getInstance(this).cycle();
        });
    }
});

// Smooth reveal animations for sections
function initSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Animate children elements
                const children = entry.target.querySelectorAll('.feature-card, .testimonial-card, .event-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize section animations
document.addEventListener('DOMContentLoaded', initSectionAnimations);

// Newsletter form enhancement
document.addEventListener('DOMContentLoaded', function() {
    const newsletterInput = document.querySelector('.newsletter-form input[type="email"]');
    
    if (newsletterInput) {
        newsletterInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        newsletterInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    }
});

// Event teaser interaction
document.addEventListener('DOMContentLoaded', function() {
    const eventImage = document.querySelector('.event-teaser-section img');
    
    if (eventImage) {
        eventImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'brightness(1.1)';
        });
        
        eventImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });
    }
});