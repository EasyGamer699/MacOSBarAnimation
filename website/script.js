// macOS Dock Animation Script
document.addEventListener('DOMContentLoaded', function() {
    const icons = document.querySelectorAll('.icons img');
    const dock = document.querySelector('.dock');
    
    // Magnification settings
    const normalSize = 150;
    const hoverSize = 200;
    const neighborSize = 175;
    const transitionDuration = '0.1s';
    
    // Set initial icon sizes
    icons.forEach(icon => {
        icon.style.width = normalSize + 'px';
        icon.style.height = normalSize + 'px';
        icon.style.transition = `all ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`;
        icon.style.transformOrigin = 'center bottom';
        icon.style.cursor = 'pointer';
    });
    
    // Add hover effect to each icon
    icons.forEach((icon, index) => {
        icon.addEventListener('mouseenter', () => {
            magnifyIcons(index);
        });
        
        icon.addEventListener('mouseleave', () => {
            resetIcons();
        });
        
        // Add click animation
        icon.addEventListener('click', () => {
            icon.style.transform = 'scale(0.9) translateY(-5px)';
            setTimeout(() => {
                icon.style.transform = icon.style.transform.replace('scale(0.9)', 'scale(1)');
            }, 150);
        });
    });
    
    // Add dock hover effect
    dock.addEventListener('mouseenter', () => {
        dock.style.transform = 'translateY(-5px)';
        dock.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.6)';
    });
    
    dock.addEventListener('mouseleave', () => {
        dock.style.transform = 'translateY(0)';
        dock.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
        resetIcons();
    });
    
    // Magnification function
    function magnifyIcons(hoveredIndex) {
        icons.forEach((icon, index) => {
            const distance = Math.abs(index - hoveredIndex);
            let size = normalSize;
            let translateY = 0;
            
            if (distance === 0) {
                // Hovered icon
                size = hoverSize;
                translateY = -10;
            } else if (distance === 1) {
                // Adjacent icons
                size = neighborSize;
                translateY = -5;
            }
            
            icon.style.width = size + 'px';
            icon.style.height = size + 'px';
            icon.style.transform = `translateY(${translateY}px)`;
        });
    }
    
    // Reset all icons to normal size
    function resetIcons() {
        icons.forEach(icon => {
            icon.style.width = normalSize + 'px';
            icon.style.height = normalSize + 'px';
            icon.style.transform = 'translateY(0)';
        });
    }
    
    // Add bounce animation for dock appearance
    function initializeDock() {
        dock.style.transform = 'translateY(100px) scale(0.8)';
        dock.style.opacity = '0';
        
        setTimeout(() => {
            dock.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            dock.style.transform = 'translateY(0) scale(1)';
            dock.style.opacity = '1';
        }, 100);
    }
    
    // Add floating animation
    function addFloatingAnimation() {
        setInterval(() => {
            if (!dock.matches(':hover')) {
                dock.style.transform = 'translateY(-2px)';
                setTimeout(() => {
                    if (!dock.matches(':hover')) {
                        dock.style.transform = 'translateY(0)';
                    }
                }, 2000);
            }
        }, 4000);
    }
    
    // Initialize animations
    initializeDock();
    addFloatingAnimation();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const currentFocus = document.activeElement;
            const iconArray = Array.from(icons);
            const currentIndex = iconArray.indexOf(currentFocus);
            
            let nextIndex;
            if (e.shiftKey) {
                nextIndex = currentIndex <= 0 ? iconArray.length - 1 : currentIndex - 1;
            } else {
                nextIndex = currentIndex >= iconArray.length - 1 ? 0 : currentIndex + 1;
            }
            
            iconArray[nextIndex].focus();
            magnifyIcons(nextIndex);
        }
        
        if (e.key === 'Enter' || e.key === ' ') {
            const currentFocus = document.activeElement;
            if (icons.includes(currentFocus)) {
                currentFocus.click();
            }
        }
    });
    
    // Make icons focusable
    icons.forEach(icon => {
        icon.setAttribute('tabindex', '0');
        icon.addEventListener('focus', (e) => {
            const index = Array.from(icons).indexOf(e.target);
            magnifyIcons(index);
        });
        
        icon.addEventListener('blur', () => {
            setTimeout(() => {
                if (!dock.matches(':hover') && !document.activeElement.closest('.dock')) {
                    resetIcons();
                }
            }, 100);
        });
    });
});