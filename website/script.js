document.addEventListener('DOMContentLoaded', function() {
    const icons = document.querySelectorAll('.icons img');
    const dock = document.querySelector('.dock');

    // Angepasste Einstellungen für die Vergrößerung, um dem Beispiel näher zu kommen
    // Die Basisgröße der Icons wird nun hauptsächlich über CSS gesteuert,
    // hier definieren wir die Skalierungsfaktoren.
    const normalScale = 1;
    const hoverScale = 1.3; // Größere Skalierung für das gehoverte Icon
    const neighborScale = 1.1; // Kleinere Skalierung für Nachbarn
    const transitionDuration = '0.2s';

    // Initialisiere Icons mit grundlegenden Stilen
    icons.forEach(icon => {
        icon.style.transition = `transform ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`;
        icon.style.transformOrigin = 'center bottom'; // Wichtig für den Wachstumseffekt
        icon.style.cursor = 'pointer';
        icon.style.willChange = 'transform'; // Performance-Optimierung
    });

    // Event Listener für jedes Icon
    icons.forEach((icon, index) => {
        icon.addEventListener('mouseenter', () => {
            magnifyIcons(index);
        });

        icon.addEventListener('click', () => {
            // Eine kleine "Wackler"-Animation beim Klicken
            icon.style.transform += ' translateY(-10px) scale(0.9)'; // Hoch und kleiner
            setTimeout(() => {
                // Setze auf den Zustand vor dem Klick zurück (behält die Vergrößerung bei)
                magnifyIcons(index);
            }, 150);
        });
    });

    // Event Listener für das Dock selbst
    dock.addEventListener('mouseleave', () => {
        resetIcons();
    });

    // Funktion zur Vergrößerung der Icons
    function magnifyIcons(hoveredIndex) {
        icons.forEach((icon, index) => {
            const distance = Math.abs(index - hoveredIndex);
            let scale = normalScale;
            let translateY = 0;

            if (distance === 0) {
                // Gehoverter Icon
                scale = hoverScale;
                // Der translateY-Wert muss möglicherweise angepasst werden,
                // um das Icon "aus dem Dock ragen" zu lassen.
                // Dies hängt stark von der Größe der Icons und dem Padding des Docks ab.
                // Im Beispiel nutzen sie eine feste Höhe und der Skalierungsursprung lässt sie wachsen.
                // Hier versuchen wir, ein ähnliches Gefühl zu vermitteln.
                translateY = - (icon.offsetHeight * (hoverScale - 1) / 2); // Hebt das Icon an, damit es nicht vom unteren Rand abgeschnitten wird
            } else if (distance === 1) {
                // Benachbarte Icons
                scale = neighborScale;
                translateY = - (icon.offsetHeight * (neighborScale - 1) / 2) * 0.5; // Weniger anheben für Nachbarn
            }

            icon.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        });

        // Optional: Passe das Padding des Docks an, um den Icons Platz zu geben, wenn sie wachsen
        // Dies ist ein Trick, um den "Ausdehnen"-Effekt des Docks zu simulieren.
        // Die genauen Werte hängen von der Icon-Größe ab.
        const maxIconHeight = icons[hoveredIndex].offsetHeight * hoverScale;
        const currentDockHeight = dock.clientHeight; // Aktuelle Höhe des Docks

        // Nur anpassen, wenn die gewünschte Höhe größer ist
        if (desiredDockHeight > currentDockHeight) {
            dock.style.paddingTop = `${(desiredDockHeight - normalScale * icons[0].offsetHeight) / 2}px`;
            dock.style.paddingBottom = `${(desiredDockHeight - normalScale * icons[0].offsetHeight) / 2}px`;
        }
    }

    // Setzt alle Icons auf ihre normale Größe zurück
    function resetIcons() {
        icons.forEach(icon => {
            icon.style.transform = `scale(${normalScale}) translateY(0px)`;
        });
        // Setze das Padding des Docks zurück, wenn die Maus das Dock verlässt
        dock.style.paddingTop = ''; // Setzt es auf den CSS-Standardwert zurück
        dock.style.paddingBottom = '';
    }

    // Der Initialisierungs- und Floating-Animations-Teil ist für die Animation der Icons selbst nicht kritisch,
    // aber ich lasse ihn hier drin, da er Teil deines ursprünglichen Skripts war.
    function initializeDock() {
        dock.style.transform = 'translateY(100px) scale(0.8)';
        dock.style.opacity = '0';

        setTimeout(() => {
            dock.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            dock.style.transform = 'translateY(0) scale(1)';
            dock.style.opacity = '1';
        }, 100);
    }

    function addFloatingAnimation() {
        setInterval(() => {
            if (!dock.matches(':hover')) {
                // Nur die transform-Eigenschaft animieren, die für das Floating zuständig ist
                dock.style.transition = 'transform 2s ease-in-out';
                dock.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    if (!dock.matches(':hover')) {
                        dock.style.transform = 'translateY(0)';
                    }
                }, 2000);
            }
        }, 4000);
    }

    initializeDock();
    addFloatingAnimation();

    // Tastatur-Navigation (unverändert vom letzten Mal, da es die Icon-Animation nicht direkt stört)
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
            if (Array.from(icons).includes(currentFocus)) {
                currentFocus.click();
            }
        }
    });

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