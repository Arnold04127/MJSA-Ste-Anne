// script.js pour le site MJSA

document.addEventListener('DOMContentLoaded', function() {
    // ==================== VARIABLES GLOBALES ====================
    const body = document.body;
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // ==================== SLIDER ====================
    const initSlider = () => {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const totalSlides = slides.length;
        let slideInterval;

        const showSlide = (index) => {
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;

            document.querySelector('.slider').style.transform = `translateX(-${currentSlide * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        const startAutoSlide = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(slideInterval);
        };

        // Événements
        document.querySelector('.next-btn')?.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        document.querySelector('.prev-btn')?.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showSlide(i);
                stopAutoSlide();
                startAutoSlide();
            });
        });

        // Démarrer le slider
        if (slides.length > 0) {
            startAutoSlide();
            const sliderContainer = document.querySelector('.slider-container');
            sliderContainer?.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer?.addEventListener('mouseleave', startAutoSlide);
        }
    };

    // ==================== FORMULAIRE D'INSCRIPTION ====================
    const initForm = () => {
        const registrationForm = document.getElementById('registration-form');
        if (!registrationForm) return;

        const birthDateInput = document.getElementById('date-naissance');
        const ageInput = document.getElementById('age');

        // Calcul automatique de l'âge
        birthDateInput?.addEventListener('change', function() {
            if (!this.value) return;

            const birthDate = new Date(this.value);
            const today = new Date();
            
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (ageInput) ageInput.value = age;
        });

        // Validation du formulaire
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--danger)';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) {
                showAlert('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            simulateFormSubmission(this);
        });
    };

    const simulateFormSubmission = (form) => {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Affichage du chargement
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.style.opacity = '0.7';
        
        // Simulation d'un délai d'envoi
        setTimeout(() => {
            // Réinitialisation du formulaire
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            
            // Message de succès
            showAlert('Inscription réussie!', 'Merci pour votre inscription au MJSA. Nous vous contacterons bientôt.', 'success');
        }, 1500);
    };

    // ==================== GALERIE MÉDIA ====================
    const initMediaGallery = () => {
        // Lightbox simplifiée
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const mediaItem = this.closest('.media-item');
                const title = mediaItem.querySelector('h3').textContent;
                const mediaType = mediaItem.querySelector('.media-type').textContent;
                
                showAlert(
                    title, 
                    `Ceci est une simulation. En production, cela ouvrirait la ${mediaType.toLowerCase()} en plein écran.`,
                    'info'
                );
            });
        });

        // Animation au scroll
        const mediaItems = document.querySelectorAll('.media-item');
        if (mediaItems.length === 0) return;

        const animateOnScroll = () => {
            mediaItems.forEach(item => {
                const itemPosition = item.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (itemPosition < screenPosition) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }
            });
        };

        // Initialisation des styles pour l'animation
        mediaItems.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        // Déclenchement initial
        animateOnScroll();
        window.addEventListener('scroll', animateOnScroll);
    };

    // ==================== MENU MOBILE ====================
    const initMobileMenu = () => {
        const mobileMenuToggle = document.createElement('div');
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.innerHTML = '☰';
        document.querySelector('.header-container')?.prepend(mobileMenuToggle);

        const nav = document.querySelector('nav');
        if (!nav) return;

        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Fermer le menu lors du clic sur un lien
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
                document.body.style.overflow = '';
            });
        });
    };

    // ==================== ANIMATIONS ====================
    const initAnimations = () => {
        // Animation des éléments au scroll
        const animateElements = document.querySelectorAll('.category-card, .resource-card, .event-card, .section-title');
        
        if (animateElements.length === 0) return;

        const animateOnScroll = () => {
            animateElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.classList.add('animated');
                }
            });
        };

        // Initialisation
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Déclenchement initial
    };

    // ==================== FONCTIONS UTILITAIRES ====================
    const showAlert = (title, text, icon) => {
        // Vous pouvez remplacer cela par SweetAlert2 si vous l'incluez
        alert(`${title}\n\n${text}`);
    };

    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ==================== DÉTECTION DU THÈME ====================
    const initThemeDetection = () => {
        if (prefersDarkMode) {
            body.classList.add('dark-mode');
        }
    };

    // ==================== INITIALISATION ====================
    const init = () => {
        initThemeDetection();
        initSlider();
        initForm();
        initMediaGallery();
        initMobileMenu();
        initAnimations();
        initSmoothScrolling();
    };

    // Démarrer l'application
    init();
});

// Fonction pour afficher des notifications
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}
