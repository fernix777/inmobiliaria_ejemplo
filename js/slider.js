document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    let currentSlide = 0;
    let slideInterval;

    // Initialize slider
    function initSlider() {
        // Ensure Tailwind classes reflect the initial state
        updateSlides(0);
        updateDots(0);

        // Start automatic slideshow
        startSlideshow();
    }

    // Show a specific slide
    function showSlide(index) {
        updateSlides(index);
        updateDots(index);

        // Update current slide index
        currentSlide = index;
    }

    function updateSlides(activeIndex){
        slides.forEach((slide, i) => {
            slide.classList.remove('opacity-100','z-20');
            slide.classList.add('opacity-0','z-10');
            if(i === activeIndex){
                slide.classList.remove('opacity-0','z-10');
                slide.classList.add('opacity-100','z-20');
            }
        });
    }

    function updateDots(activeIndex){
        dots.forEach((dot, i) => {
            dot.classList.remove('bg-white/90');
            dot.classList.add('bg-white/50');
            if(i === activeIndex){
                dot.classList.remove('bg-white/50');
                dot.classList.add('bg-white/90');
            }
        });
    }

    // Show next slide
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }

    // Show previous slide
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        showSlide(prevIndex);
    }

    // Start automatic slideshow
    function startSlideshow() {
        // Clear any existing interval
        if (slideInterval) {
            clearInterval(slideInterval);
        }

        // Set new interval
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Pause slideshow on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', function() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        });

        sliderContainer.addEventListener('mouseleave', function() {
            startSlideshow();
        });
    }

    // Event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            // Restart slideshow after manual navigation
            startSlideshow();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            // Restart slideshow after manual navigation
            startSlideshow();
        });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            // Restart slideshow after manual navigation
            startSlideshow();
        });
    });

    // Initialize slider
    if (slides.length > 0) {
        initSlider();
    }

    // Add touch swipe functionality for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        sliderContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }

    function handleSwipe() {
        // Detect swipe direction
        if (touchEndX < touchStartX) {
            // Swipe left - show next slide
            nextSlide();
        } else if (touchEndX > touchStartX) {
            // Swipe right - show previous slide
            prevSlide();
        }
        // Restart slideshow after swipe
        startSlideshow();
    }
});