// Import Firebase functions
import { db, doc, setDoc, getDoc, updateDoc, increment, collection, addDoc } from './firebase-config.js';

// Données des villes avec compteurs de votes (initialisées à 0)
let citiesData = {
    paris: { name: 'Paris', votes: 0 },
    lyon: { name: 'Lyon', votes: 0 },
    marseille: { name: 'Marseille', votes: 0 },
    toulouse: { name: 'Toulouse', votes: 0 },
    nice: { name: 'Nice', votes: 0 },
    bordeaux: { name: 'Bordeaux', votes: 0 }
};

// Variables globales
let userVotes = JSON.parse(localStorage.getItem('sampatrouille_votes') || '[]');
let emailSubscribed = localStorage.getItem('sampatrouille_email_subscribed') === 'true';

// Charger les votes depuis Firebase
async function loadVotesFromFirebase() {
    try {
        // Initialiser les villes par défaut dans Firebase si elles n'existent pas
        await initializeDefaultCities();
        
        // Charger les votes depuis Firebase
        for (const cityKey of Object.keys(citiesData)) {
            const cityRef = doc(db, 'votes', cityKey);
            const citySnap = await getDoc(cityRef);
            
            if (citySnap.exists()) {
                const data = citySnap.data();
                citiesData[cityKey].votes = data.votes || 0;
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des votes:', error);
        // En cas d'erreur, garder les valeurs par défaut (0)
    }
}

// Initialiser les villes par défaut dans Firebase
async function initializeDefaultCities() {
    try {
        for (const [cityKey, cityData] of Object.entries(citiesData)) {
            const cityRef = doc(db, 'votes', cityKey);
            const citySnap = await getDoc(cityRef);
            
            // Si la ville n'existe pas dans Firebase, la créer avec 0 votes
            if (!citySnap.exists()) {
                await setDoc(cityRef, {
                    name: cityData.name,
                    votes: 0,
                    createdAt: new Date(),
                    isDefault: true
                });
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des villes:', error);
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async function() {
    initializeHeader();
    initializeHeroAnimations();
    initializeScrollAnimations();
    await loadVotesFromFirebase();
    initializeVoteSystem();
    initializeNewsletter();
    initializeModal();
    initializeSmoothScroll();
    updateVoteDisplay();
    
    // Animation des statistiques au chargement
    animateStats();
});

// Gestion du header au scroll
function initializeHeader() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Masquer/afficher le header selon la direction du scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Animations du hero
function initializeHeroAnimations() {
    // Animation de la voiture flottante
    const carIcon = document.querySelector('.car-illustration i');
    if (carIcon) {
        setInterval(() => {
            carIcon.style.transform = `translateY(${Math.sin(Date.now() * 0.001) * 5}px)`;
        }, 16);
    }
    
    // Animation de la ligne de route
    const routeLine = document.querySelector('.route-line');
    if (routeLine) {
        setInterval(() => {
            routeLine.style.background = `linear-gradient(90deg, 
                var(--secondary-color) ${Math.sin(Date.now() * 0.002) * 20 + 50}%, 
                var(--accent-color) ${Math.cos(Date.now() * 0.002) * 20 + 50}%)`;
        }, 50);
    }
}

// Animations au scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animation spéciale pour les cartes
                if (entry.target.classList.contains('concept-card') || 
                    entry.target.classList.contains('advantage-card') ||
                    entry.target.classList.contains('city-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments à animer
    const elementsToAnimate = document.querySelectorAll('.concept-card, .advantage-card, .step, .city-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Système de vote
function initializeVoteSystem() {
    const voteButtons = document.querySelectorAll('.vote-btn');
    const newCityForm = document.querySelector('.form-group');
    
    voteButtons.forEach(button => {
        const cityCard = button.closest('.city-card');
        const cityName = cityCard.dataset.city;
        
        // Vérifier si l'utilisateur a déjà voté pour cette ville
        if (userVotes.includes(cityName)) {
            button.textContent = 'Voté ✓';
            button.disabled = true;
            cityCard.classList.add('voted');
        }
        
        button.addEventListener('click', () => {
            if (!userVotes.includes(cityName)) {
                voteForCity(cityName);
                showVoteModal();
            }
        });
    });
    
    // Gestion du formulaire pour nouvelle ville
    if (newCityForm) {
        const input = newCityForm.querySelector('input');
        const submitBtn = newCityForm.querySelector('button');
        
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cityName = input.value.trim();
            
            if (cityName && cityName.length > 2) {
                addNewCity(cityName);
                input.value = '';
                showNotification('Nouvelle ville proposée avec succès !', 'success');
            } else {
                showNotification('Veuillez entrer un nom de ville valide', 'error');
            }
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    }
}

// Voter pour une ville
async function voteForCity(cityName) {
    if (!userVotes.includes(cityName)) {
        try {
            // Mettre à jour Firebase
            const cityRef = doc(db, 'votes', cityName);
            const citySnap = await getDoc(cityRef);
            
            if (citySnap.exists()) {
                // Mettre à jour le document existant
                await updateDoc(cityRef, {
                    votes: increment(1)
                });
            } else {
                // Créer le document s'il n'existe pas
                await setDoc(cityRef, {
                    name: citiesData[cityName].name,
                    votes: 1,
                    createdAt: new Date()
                });
            }
            
            // Mettre à jour les données locales
            citiesData[cityName].votes++;
            userVotes.push(cityName);
            localStorage.setItem('sampatrouille_votes', JSON.stringify(userVotes));
            
            updateVoteDisplay();
            
            const cityCard = document.querySelector(`[data-city="${cityName}"]`);
            const button = cityCard.querySelector('.vote-btn');
            
            button.textContent = 'Voté ✓';
            button.disabled = true;
            cityCard.classList.add('voted');
            
            // Animation de succès
            cityCard.style.transform = 'scale(1.05)';
            setTimeout(() => {
                cityCard.style.transform = 'scale(1)';
            }, 200);
        } catch (error) {
            console.error('Erreur lors du vote:', error);
            showNotification('Erreur lors du vote. Veuillez réessayer.', 'error');
        }
    }
}

// Ajouter une nouvelle ville
async function addNewCity(cityName) {
    const citiesGrid = document.querySelector('.cities-grid');
    const newCityKey = cityName.toLowerCase().replace(/\s+/g, '-');
    
    // Vérifier si la ville n'existe pas déjà
    if (!citiesData[newCityKey]) {
        try {
            // Ajouter à Firebase
            const cityRef = doc(db, 'votes', newCityKey);
            await setDoc(cityRef, {
                name: cityName,
                votes: 1,
                createdAt: new Date()
            });
            
            // Mettre à jour les données locales
            citiesData[newCityKey] = { name: cityName, votes: 1 };
            userVotes.push(newCityKey);
            localStorage.setItem('sampatrouille_votes', JSON.stringify(userVotes));
            
            // Créer la nouvelle carte de ville
            const newCityCard = document.createElement('div');
            newCityCard.className = 'city-card voted';
            newCityCard.dataset.city = newCityKey;
            newCityCard.innerHTML = `
                <div class="city-image">
                    <i class="fas fa-city"></i>
                </div>
                <h3>${cityName}</h3>
                <div class="vote-count">
                    <span class="votes">1</span>
                    <span class="votes-label">vote</span>
                </div>
                <button class="vote-btn" disabled>Voté ✓</button>
            `;
            
            citiesGrid.appendChild(newCityCard);
            
            // Animation d'apparition
            newCityCard.style.opacity = '0';
            newCityCard.style.transform = 'scale(0.8)';
            setTimeout(() => {
                newCityCard.style.transition = 'all 0.3s ease-out';
                newCityCard.style.opacity = '1';
                newCityCard.style.transform = 'scale(1)';
            }, 100);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la ville:', error);
            showNotification('Erreur lors de l\'ajout de la ville. Veuillez réessayer.', 'error');
        }
    }
}

// Mettre à jour l'affichage des votes
function updateVoteDisplay() {
    Object.keys(citiesData).forEach(cityKey => {
        const cityCard = document.querySelector(`[data-city="${cityKey}"]`);
        if (cityCard) {
            const votesElement = cityCard.querySelector('.votes');
            const votesLabelElement = cityCard.querySelector('.votes-label');
            
            if (votesElement) {
                votesElement.textContent = citiesData[cityKey].votes.toLocaleString();
                votesLabelElement.textContent = citiesData[cityKey].votes > 1 ? 'votes' : 'vote';
            }
        }
    });
}

// Gestion de la newsletter
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        const input = newsletterForm.querySelector('input');
        const button = newsletterForm.querySelector('button');
        
        // Vérifier si l'utilisateur est déjà inscrit
        if (emailSubscribed) {
            button.textContent = 'Déjà inscrit ✓';
            button.disabled = true;
            input.disabled = true;
        }
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const email = input.value.trim();
            
            if (validateEmail(email)) {
                subscribeToNewsletter(email);
            } else {
                showNotification('Veuillez entrer une adresse email valide', 'error');
            }
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                button.click();
            }
        });
    }
}

// S'inscrire à la newsletter
async function subscribeToNewsletter(email) {
    const button = document.querySelector('.newsletter-form button');
    const input = document.querySelector('.newsletter-form input');
    
    button.textContent = 'Inscription...';
    button.disabled = true;
    
    try {
        // Sauvegarder l'email dans Firebase
        await addDoc(collection(db, 'newsletter'), {
            email: email,
            subscribedAt: new Date(),
            status: 'active'
        });
        
        // Sauvegarder localement
        localStorage.setItem('sampatrouille_email_subscribed', 'true');
        localStorage.setItem('sampatrouille_email', email);
        
        button.textContent = 'Inscrit ✓';
        input.disabled = true;
        
        showNotification('Merci ! Vous serez notifié du lancement.', 'success');
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        button.textContent = 'S\'inscrire';
        button.disabled = false;
        showNotification('Erreur lors de l\'inscription. Veuillez réessayer.', 'error');
    }
}

// Validation email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Gestion du modal
function initializeModal() {
    const modal = document.getElementById('vote-modal');
    const closeBtn = modal.querySelector('.close');
    const closeButton = modal.querySelector('.btn-primary');
    
    closeBtn.addEventListener('click', hideVoteModal);
    closeButton.addEventListener('click', hideVoteModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideVoteModal();
        }
    });
}

// Afficher le modal de vote
function showVoteModal() {
    const modal = document.getElementById('vote-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Masquer le modal de vote
function hideVoteModal() {
    const modal = document.getElementById('vote-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Scroll fluide
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation des statistiques
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                let currentValue = 0;
                const increment = finalValue.includes('+') ? 
                    parseInt(finalValue.replace(/[^0-9]/g, '')) / 50 : 
                    parseInt(finalValue.replace(/[^0-9]/g, '')) / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= parseInt(finalValue.replace(/[^0-9]/g, ''))) {
                        target.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(currentValue) + (finalValue.includes('+') ? '+' : '') + (finalValue.includes('%') ? '%' : '');
                    }
                }, 30);
                
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Système de notifications
function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Gestion des boutons CTA
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cta-button') || 
        (e.target.closest('.btn-primary') && e.target.closest('.hero-buttons'))) {
        e.preventDefault();
        
        // Scroll vers la section newsletter
        const newsletterSection = document.querySelector('.newsletter');
        if (newsletterSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = newsletterSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Focus sur l'input email après le scroll
            setTimeout(() => {
                const emailInput = document.querySelector('.newsletter-form input');
                if (emailInput && !emailInput.disabled) {
                    emailInput.focus();
                }
            }, 800);
        }
    }
});

// Gestion du bouton "Voir la démo"
document.querySelector('.btn-secondary')?.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('La démo sera bientôt disponible !', 'info');
});

// Effet parallax léger sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Préchargement des animations
window.addEventListener('load', () => {
    // Ajouter une classe pour indiquer que la page est chargée
    document.body.classList.add('loaded');
    
    // Démarrer les animations retardées
    setTimeout(() => {
        const delayedElements = document.querySelectorAll('.hero-stats, .hero-buttons');
        delayedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 500);
});
