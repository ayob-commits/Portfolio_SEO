document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------------
       PRELOADER / INTRO SCREEN
    ------------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Laisser l'animation d'intro jouer pendant au moins 2.5s
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 2500);
        });
        
        // Sécurité si l'événement load tarde trop à se déclencher
        setTimeout(() => {
            if (!preloader.classList.contains('fade-out')) {
                preloader.classList.add('fade-out');
            }
        }, 4000);
    }

    /* -------------------------------------------------------------
       THEME TOGGLE (DARK/LIGHT MODE)
    ------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage for preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    /* -------------------------------------------------------------
       MOBILE MENU DRAWER
    ------------------------------------------------------------- */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('open');
        
        // Animate hamburger lines
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (mobileMenuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('open');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    /* -------------------------------------------------------------
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    ------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* -------------------------------------------------------------
       ACTIVE NAV LINK ON SCROLL
    ------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* -------------------------------------------------------------
       HERO CAROUSEL (IMAGE SLIDER)
    ------------------------------------------------------------- */
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlideIndex = 0;
    const slideInterval = 5000; // 5 seconds

    if (slides.length > 0) {
        setInterval(() => {
            // Remove active class from current slide
            slides[currentSlideIndex].classList.remove('active');
            
            // Move to next slide index
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            
            // Add active class to new slide
            slides[currentSlideIndex].classList.add('active');
        }, slideInterval);
    }

    /* -------------------------------------------------------------
       PROJECTS DYNAMIC FILTER
    ------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid modal triggers
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectItems.forEach(item => {
                // Get item category
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || itemCategory === filterValue) {
                    // Show item
                    item.style.display = 'block';
                    // Animation trigger
                    setTimeout(() => {
                        item.style.opacity = '1';
                        if (window.innerWidth > 1024) {
                            // Re-apply asymmetrical offsets
                            const index = Array.from(item.parentNode.children).indexOf(item);
                            if (index === 1 || index === 3) {
                                item.style.transform = 'translateY(40px)';
                            } else {
                                item.style.transform = 'translateY(0)';
                            }
                        } else {
                            item.style.transform = 'translateY(0)';
                        }
                    }, 50);
                } else {
                    // Hide item with smooth fade out
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* -------------------------------------------------------------
       INTERACTIVE PROJECT MODAL (POPUP)
    ------------------------------------------------------------- */
    const projectModal = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClient = document.getElementById('modal-client');
    const modalYear = document.getElementById('modal-year');
    const modalTools = document.getElementById('modal-tools');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Open Modal
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get project data from attributes
            const title = item.getAttribute('data-title');
            const category = item.getAttribute('data-category');
            const client = item.getAttribute('data-client');
            const year = item.getAttribute('data-year');
            const tools = item.getAttribute('data-tools');
            const desc = item.getAttribute('data-desc');
            const img = item.getAttribute('data-img');

            // Inject into modal elements
            modalTitle.textContent = title;
            modalTag.textContent = category;
            modalClient.textContent = client;
            modalYear.textContent = year;
            modalTools.textContent = tools;
            modalDesc.textContent = desc;
            modalImg.src = img;
            modalImg.alt = title;

            // Show modal
            projectModal.classList.add('open');
            projectModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
    });

    // Close Modal Function
    const closeModal = () => {
        projectModal.classList.remove('open');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock scroll
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('open')) {
            closeModal();
        }
    });

    /* -------------------------------------------------------------
       CONTACT FORM SUBMISSION
    ------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Visual loading feedback
        btnText.textContent = 'Envoi en cours...';
        btnIcon.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Get form values
        const nameVal = document.getElementById('name').value.trim();
        const emailVal = document.getElementById('email').value.trim();
        const subjectVal = document.getElementById('subject').value.trim();
        const messageVal = document.getElementById('message').value.trim();

        // Submit form data using FormSubmit AJAX API
        fetch("https://formsubmit.co/ajax/ayobab72@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: nameVal,
                email: emailVal,
                subject: subjectVal,
                message: messageVal
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.success === "true" || data.success === true) {
                // Show Success Message
                formFeedback.textContent = `Merci ${nameVal}, votre message a bien été envoyé ! Je vous répondrai dans les plus brefs délais.`;
                formFeedback.className = 'form-feedback success';
                contactForm.reset();
            } else {
                formFeedback.textContent = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
                formFeedback.className = 'form-feedback error';
            }
        })
        .catch(error => {
            console.error("FormSubmit Error:", error);
            formFeedback.textContent = "Une erreur réseau est survenue. Veuillez vérifier votre connexion.";
            formFeedback.className = 'form-feedback error';
        })
        .finally(() => {
            // Restore button
            btnText.textContent = 'Envoyer le message';
            btnIcon.innerHTML = '<i class="fa-solid fa-arrow-right-long"></i>';
            submitBtn.disabled = false;

            // Clear feedback after 8 seconds
            setTimeout(() => {
                formFeedback.textContent = '';
                formFeedback.className = 'form-feedback';
            }, 8000);
        });
    });
});
