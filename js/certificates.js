// carousel.js – Lightweight carousel logic
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const pagination = document.querySelector('.carousel-pagination');

    if (!track || !nextButton || !prevButton || !pagination) return;

    let currentIndex = 0;

    // Determine how many slides to show based on screen width
    const getSlidesToShow = () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    let slidesToShow = getSlidesToShow();

    // Create pagination dots
    const createPagination = () => {
        pagination.innerHTML = '';
        const dotsCount = Math.ceil(slides.length / slidesToShow);
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('pagination-dot');
            dot.setAttribute('aria-label', `Go to slide group ${i + 1}`);
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            pagination.appendChild(dot);
        }
    };

    const updateCarousel = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const amountToMove = currentIndex * slideWidth * slidesToShow;
        track.style.transform = `translateX(-${amountToMove}px)`;

        // Update dots
        const dots = Array.from(pagination.children);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Update button states (optional: disable/enable or loop)
        // Here we'll just keep them active for looping
    };

    nextButton.addEventListener('click', () => {
        const totalGroups = Math.ceil(slides.length / slidesToShow);
        if (currentIndex < totalGroups - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to start
        }
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        const totalGroups = Math.ceil(slides.length / slidesToShow);
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalGroups - 1; // Loop to end
        }
        updateCarousel();
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const oldSlidesToShow = slidesToShow;
            slidesToShow = getSlidesToShow();

            if (oldSlidesToShow !== slidesToShow) {
                currentIndex = 0;
                createPagination();
                updateCarousel();
            } else {
                // Just update track position if width changed but slides per view didn't
                updateCarousel();
            }
        }, 100);
    });

    // Touch support for mobile swipe
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) { // Swipe threshold
            if (diff > 0) {
                nextButton.click();
            } else {
                prevButton.click();
            }
        }
        isDragging = false;
    }, { passive: true });

    // Initial setup
    createPagination();
    updateCarousel();
});
