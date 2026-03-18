// Gallery page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery filtering
    initGalleryFiltering();
    
    // Initialize gallery modal
    initGalleryModal();
    
    // Initialize masonry layout
    initMasonryLayout();
    
    // Initialize video cards
    initVideoCards();
});

// Gallery filtering functionality
function initGalleryFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
            
            // Re-initialize masonry layout after filtering
            setTimeout(() => {
                initMasonryLayout();
            }, 500);
        });
    });
}

// Gallery modal functionality
function initGalleryModal() {
    const galleryModal = document.getElementById('galleryModal');
    
    if (galleryModal) {
        galleryModal.addEventListener('show.bs.modal', function(event) {
            const trigger = event.relatedTarget;
            
            // Extract data from the trigger element
            const title = trigger.getAttribute('data-title');
            const artist = trigger.getAttribute('data-artist');
            const year = trigger.getAttribute('data-year');
            const medium = trigger.getAttribute('data-medium');
            const description = trigger.getAttribute('data-description');
            const image = trigger.getAttribute('data-image');
            
            // Update modal content
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalArtist').textContent = artist;
            document.getElementById('modalYear').textContent = year;
            document.getElementById('modalMedium').textContent = medium;
            document.getElementById('modalDescription').textContent = description;
            document.getElementById('modalImage').src = image;
            document.getElementById('modalImage').alt = title;
        });
    }
}

// Masonry layout for gallery items
function initMasonryLayout() {
    const container = document.getElementById('galleryContainer');
    const items = container.querySelectorAll('.gallery-item:not(.hidden)');
    
    // Reset any existing transforms
    items.forEach(item => {
        item.style.transform = '';
        item.style.position = '';
    });
    
    // Simple grid layout for responsiveness
    // This could be enhanced with a proper masonry library for production
    const columns = getColumnCount();
    const columnHeights = new Array(columns).fill(0);
    
    items.forEach((item, index) => {
        if (window.innerWidth > 768) {
            const columnIndex = index % columns;
            const x = columnIndex * (100 / columns);
            const y = columnHeights[columnIndex];
            
            item.style.position = 'absolute';
            item.style.left = `${x}%`;
            item.style.top = `${y}px`;
            item.style.width = `${100 / columns}%`;
            
            // Update column height
            columnHeights[columnIndex] += item.offsetHeight + 24; // 24px gap
        }
    });
    
    // Set container height
    if (window.innerWidth > 768) {
        const maxHeight = Math.max(...columnHeights);
        container.style.height = `${maxHeight}px`;
        container.style.position = 'relative';
    } else {
        container.style.height = 'auto';
        container.style.position = 'static';
    }
}

function getColumnCount() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

// Video cards interaction
function initVideoCards() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoTitle = this.querySelector('h4').textContent;
            showNotification(`Opening "${videoTitle}" video...`, 'info');
            
            // In a real application, this would open a video player
            // For demo purposes, we'll just show a notification
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            const playButton = this.querySelector('.play-button');
            playButton.style.transform = 'translate(-50%, -50%) scale(1.2)';
            playButton.style.background = 'var(--accent-color)';
        });
        
        card.addEventListener('mouseleave', function() {
            const playButton = this.querySelector('.play-button');
            playButton.style.transform = 'translate(-50%, -50%) scale(1)';
            playButton.style.background = 'rgba(107, 70, 193, 0.9)';
        });
    });
}

// Gallery image lazy loading
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-card img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                
                const tempImg = new Image();
                tempImg.onload = function() {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                };
                tempImg.src = img.src;
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Resize handler for masonry layout
window.addEventListener('resize', function() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
        initMasonryLayout();
    }, 250);
});

// Search functionality (could be enhanced further)
function initGallerySearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search artworks...';
    searchInput.className = 'form-control mb-4';
    
    const filterSection = document.querySelector('.filter-section .container .row .col-lg-8');
    if (filterSection) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                const title = item.querySelector('h4').textContent.toLowerCase();
                const artist = item.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
        
        // Add search input to the page
        // filterSection.appendChild(searchInput);
    }
}

// Gallery item hover effects enhancement
document.addEventListener('DOMContentLoaded', function() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    galleryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle rotation effect
            this.style.transform = 'translateY(-8px) rotateY(5deg)';
            
            // Enhance image brightness
            const img = this.querySelector('img');
            img.style.filter = 'brightness(1.1) contrast(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
            
            const img = this.querySelector('img');
            img.style.filter = 'brightness(1) contrast(1)';
        });
    });
});

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);