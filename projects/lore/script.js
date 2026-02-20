document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const searchBar = document.getElementById('search-bar');
    const loreBtn = document.getElementById('lore-btn');
    const muggleBtn = document.getElementById('muggle-btn');
    const magicBtn = document.getElementById('magic-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentCategory = 'lore';
    let currentIndex = 0;
    let currentImages = [];

    function displayImages(imageArray) {
        gallery.innerHTML = '';
        currentImages = imageArray;
        imageArray.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.title;

            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = image.title;

            item.appendChild(img);
            item.appendChild(title);
            
            // Click to open lightbox
            item.addEventListener('click', () => openLightbox(index));
            
            gallery.appendChild(item);
        });
    }

    function filterByCategory() {
        const searchTerm = searchBar.value.toLowerCase();
        let filtered = images.filter(image => image.category === currentCategory);
        
        if (searchTerm) {
            filtered = filtered.filter(image => 
                image.title.toLowerCase().includes(searchTerm) || 
                image.keywords.toLowerCase().includes(searchTerm)
            );
        }
        
        displayImages(filtered);
    }

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.remove('hidden');
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
    }

    function updateLightbox() {
        if (currentImages.length > 0) {
            lightboxImg.src = currentImages[currentIndex].src;
            lightboxTitle.textContent = currentImages[currentIndex].title;
        }
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightbox();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
    }

    // Category buttons
    loreBtn.addEventListener('click', () => {
        currentCategory = 'lore';
        loreBtn.classList.add('active');
        muggleBtn.classList.remove('active');
        magicBtn.classList.remove('active');
        filterByCategory();
    });

    muggleBtn.addEventListener('click', () => {
        currentCategory = 'muggle';
        muggleBtn.classList.add('active');
        loreBtn.classList.remove('active');
        magicBtn.classList.remove('active');
        filterByCategory();
    });

    magicBtn.addEventListener('click', () => {
        currentCategory = 'magic';
        magicBtn.classList.add('active');
        loreBtn.classList.remove('active');
        muggleBtn.classList.remove('active');
        filterByCategory();
    });

    // Search
    searchBar.addEventListener('input', filterByCategory);

    // Lightbox controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNext();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            }
        }
    });

    // Click outside image to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Touch swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50; // Minimum distance for a swipe to register

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Only register horizontal swipes (where horizontal movement is greater than vertical)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe right - show previous image
                showPrev();
            } else {
                // Swipe left - show next image
                showNext();
            }
        }
    }

    // Initial display
    filterByCategory();
});
