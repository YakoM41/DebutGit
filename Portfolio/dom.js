document.addEventListener("DOMContentLoaded", function() {

    /* =========================================
       1. ANIMATION AU SCROLL (Reveal)
       ========================================= */
    const observerOptions = {
        root: null,
        threshold: 0.1, // Déclenche quand 10% de l'élément est visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // On arrête d'observer une fois animé
            }
        });
    }, observerOptions);

    // On observe tous les éléments avec la classe .reveal
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


    /* =========================================
       2. WIDGET HEURE (Temps réel)
       ========================================= */
    function updateTime() {
        const timeDisplay = document.getElementById('time-display');
        if(!timeDisplay) return; // Sécurité si l'élément n'existe pas

        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Paris'
        });
        timeDisplay.textContent = timeString;
    }

    // Lancement immédiat + Intervalle
    updateTime();
    setInterval(updateTime, 1000);

    // Petit bonus : Mise à jour automatique de l'année dans le footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }


    /* =========================================
       3. NAVBAR SCROLL EFFECT
       ========================================= */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }


    /* =========================================
       4. EFFET TILT & SPOTLIGHT (3D + Lumière)
       ========================================= */

    // Fonction générique pour l'effet 3D
    function handleTilt(e, element, intensity = 15) {
        const rect = element.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Position de la souris en pourcentage (-0.5 à 0.5)
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        // Calcul de la rotation inverse pour effet de profondeur
        const xRotation = yPct * -intensity;
        const yRotation = xPct * intensity;

        element.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
    }

    function resetTilt(element) {
        element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    }

    // Fonction pour l'effet de lumière (Spotlight)
    function handleSpotlight(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // On applique un dégradé radial qui suit la souris
        // Note: On utilise background-image pour ne pas casser la couleur de fond
        card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 40%), var(--card-bg)`;

        // Cas particulier : Si c'est une skill-card avec un dégradé existant, on adapte
        if(card.classList.contains('skill-card')) {
            card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))`;
        }
    }

    // A. Application sur le Téléphone (Intensité forte)
    const phoneContainers = document.querySelectorAll('.project-image-container');
    phoneContainers.forEach(container => {
        const phone = container.querySelector('.phone-mockup');
        if (phone) {
            container.addEventListener('mousemove', (e) => handleTilt(e, phone, 25));
            container.addEventListener('mouseleave', () => resetTilt(phone));
        }
    });

    // B. Application sur les Cartes Bento (Intensité légère + Spotlight)
    const cards = document.querySelectorAll('.card, .skill-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            handleTilt(e, card, 5);
            handleSpotlight(e, card);
        });

        card.addEventListener('mouseleave', () => {
            resetTilt(card);
            // IMPORTANT : On vide le style inline pour que le CSS original reprenne le dessus
            card.style.background = '';
        });
    });


    /* =========================================
       5. LOGIQUE FILTRES (Page Galerie uniquement)
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-card');

    // On ne lance ce code que si les boutons existent (donc si on est sur gallery.html)
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. Gestion de la classe active
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 2. Récupération du filtre
                const filterValue = btn.getAttribute('data-filter');

                // 3. Tri des projets
                projectItems.forEach(item => {
                    const category = item.getAttribute('data-category');

                    if (filterValue === 'all' || filterValue === category) {
                        // On affiche
                        item.style.display = 'block';
                        // Petite astuce pour l'animation (fade in)
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        // On cache
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        // On attend la fin de la transition pour masquer display
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            });
        });
    }

});