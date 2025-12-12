let currentSlide = 0;
let showControls = true;
let hideTimeout;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderWrapper = document.getElementById('sliderWrapper');
const slidesContainer = document.getElementById('slidesContainer');

function updateSlide() {
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateButtons();
}

function updateButtons() {
    // 첫 번째 슬라이드에서는 이전 버튼 숨김
    if (currentSlide === 0) {
        prevBtn.classList.remove('show');
    } else {
        if (showControls) {
            prevBtn.classList.add('show');
        }
    }

    // 마지막 슬라이드에서는 다음 버튼 숨김
    if (currentSlide === totalSlides - 1) {
        nextBtn.classList.remove('show');
    } else {
        if (showControls) {
            nextBtn.classList.add('show');
        }
    }
}

function showButtons() {
    showControls = true;
    updateButtons();
    resetHideTimer();
}

function hideButtons() {
    showControls = false;
    prevBtn.classList.remove('show');
    nextBtn.classList.remove('show');
}

function resetHideTimer() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        hideButtons();
    }, 1000); // 1초 후 자동 숨김
}

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
        showButtons();
    }
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlide();
        showButtons();
    }
});

prevBtn.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
        showButtons();
    }
});

nextBtn.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlide();
        showButtons();
    }
});

// 마우스 움직임 감지
sliderWrapper.addEventListener('mousemove', () => {
    showButtons();
});

// 터치 감지
sliderWrapper.addEventListener('touchstart', () => {
    showButtons();
}, { passive: true });

sliderWrapper.addEventListener('click', (e) => {
    // 화살표 버튼이 아닌 경우에만 타이머 리셋
    if (e.target === sliderWrapper || e.target.closest('.slide')) {
        showButtons();
    }
});

// 드래그/스와이프 기능
let startX = 0;
let currentX = 0;
let isDragging = false;
let startTransform = 0;

sliderWrapper.addEventListener('mousedown', handleDragStart);
sliderWrapper.addEventListener('touchstart', handleDragStart, { passive: true });

sliderWrapper.addEventListener('mousemove', handleDragMove);
sliderWrapper.addEventListener('touchmove', handleDragMove, { passive: false });

sliderWrapper.addEventListener('mouseup', handleDragEnd);
sliderWrapper.addEventListener('touchend', handleDragEnd);
sliderWrapper.addEventListener('mouseleave', handleDragEnd);

function handleDragStart(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    startTransform = currentSlide * 100;
    slidesContainer.style.transition = 'none';
}

function handleDragMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const diff = currentX - startX;
    const percentMove = (diff / sliderWrapper.offsetWidth) * 100;
    
    slidesContainer.style.transform = `translateX(-${startTransform - percentMove}%)`;
}

function handleDragEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    slidesContainer.style.transition = 'transform 0.5s ease-in-out';
    
    const diff = currentX - startX;
    const threshold = sliderWrapper.offsetWidth * 0.2; // 20% 이동 시 슬라이드 변경
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentSlide > 0) {
            // 오른쪽으로 드래그 (이전 슬라이드)
            currentSlide--;
        } else if (diff < 0 && currentSlide < totalSlides - 1) {
            // 왼쪽으로 드래그 (다음 슬라이드)
            currentSlide++;
        }
    }
    
    updateSlide();
    startX = 0;
    currentX = 0;
}

// 키보드 화살표 키 지원
document.addEventListener('keydown', (e) => {
    if (!showControls) return;
    
    if (e.key === 'ArrowLeft' && currentSlide > 0) {
        currentSlide--;
        updateSlide();
    } else if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlide();
    }
});

// 초기 상태 설정
updateSlide();
resetHideTimer(); // 1초 후 화살표 자동 숨김 시작