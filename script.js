// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dots = document.querySelectorAll('.dot');
const productImages = document.querySelectorAll('.product-image img');
const viewButtons = document.querySelectorAll('.view-product');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const loadingSpinner = document.getElementById('loading-spinner');

// Global Variables
let currentSlide = 0;
let slideInterval;
let currentLightboxIndex = 0;
const productImageSources = Array.from(productImages).map(img => img.src);

// Show loading spinner for demonstration
window.addEventListener('load', () => {
    loadingSpinner.style.display = 'flex';
    
    // Hide spinner after 2 seconds (simulating loading)
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
    }, 2000);
});

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Carousel Functionality
function showSlide(index) {
    // Handle index boundaries
    if (index < 0) {
        index = slides.length - 1;
    } else if (index >= slides.length) {
        index = 0;
    }
    
    // Update current slide
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentSlide = index;
}

// Initialize carousel
function startCarousel() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Carousel controls
prevBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    showSlide(currentSlide - 1);
    startCarousel();
});

nextBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    showSlide(currentSlide + 1);
    startCarousel();
});

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        startCarousel();
    });
});

// Start carousel on page load
showSlide(0);
startCarousel();

// Lightbox Functionality
function openLightbox(index) {
    currentLightboxIndex = index;
    lightboxImage.src = productImageSources[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function navigateLightbox(direction) {
    let newIndex = currentLightboxIndex + direction;
    
    // Handle index boundaries
    if (newIndex < 0) {
        newIndex = productImageSources.length - 1;
    } else if (newIndex >= productImageSources.length) {
        newIndex = 0;
    }
    
    openLightbox(newIndex);
}

// Open lightbox when clicking on product images or view buttons
productImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
});

viewButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
    });
});

// Lightbox controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
    
    // Navigate with arrow keys when lightbox is open
    if (lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    }
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Ensure accessibility for keyboard navigation
viewButtons.forEach(button => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});