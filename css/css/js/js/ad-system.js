// Advertising System
const AdSystem = {
    // Initialize Google AdSense
    init() {
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
        
        // Set up fallback ads
        this.setupFallbackAds();
        
        // Track ad performance
        this.trackAdPerformance();
    },
    
    setupFallbackAds() {
        // Check if AdSense ads loaded, otherwise show fallback
        setTimeout(() => {
            const adContainers = document.querySelectorAll('.adsbygoogle');
            adContainers.forEach(container => {
                if (container.offsetHeight === 0) {
                    const fallback = container.parentElement.querySelector('.ad-fallback');
                    if (fallback) {
                        fallback.style.display = 'block';
                    }
                }
            });
        }, 2000);
    },
    
    trackAdPerformance() {
        // Track ad clicks and impressions
        document.querySelectorAll('.ad-container').forEach(ad => {
            ad.addEventListener('click', (e) => {
                if (e.target.closest('.ad-fallback')) {
                    console.log('Fallback ad clicked');
                }
            });
        });
    },
    
    submitAdRequest() {
        const companyName = document.getElementById('companyName')?.value;
        const companyEmail = document.getElementById('companyEmail')?.value;
        const companyPhone = document.getElementById('companyPhone')?.value;
        const adPackage = document.getElementById('adPackage')?.value;
        
        if (!companyName || !companyEmail || !companyPhone || !adPackage) {
            ZewedJobs.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Show loading
        const button = document.querySelector('#modalBody .btn-primary');
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading"></div>';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            ZewedJobs.hideModal();
            ZewedJobs.showNotification('✅ Advertising request submitted! We will contact you within 24 hours.', 'success');
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    }
};

// Initialize ad system
document.addEventListener('DOMContentLoaded', () => {
    AdSystem.init();
});

window.AdSystem = AdSystem;
