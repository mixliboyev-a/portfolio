document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-link');
    const overlay = document.querySelector('.overlay');

    const toggleMenu = () => {
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
    };

    hamburger.addEventListener('click', toggleMenu);
    mobileNavClose.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const formStatus = form.querySelector('.form-status');
        const originalButtonText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        if (formStatus) formStatus.textContent = '';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();

            if (response.ok) {
                if (formStatus) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = '#28a745';
                }
                form.reset();
            } else {
                throw new Error(result.message || 'An error occurred.');
            }
        } catch (error) {
            if (formStatus) {
                formStatus.textContent = 'Error sending message. Please try again.';
                formStatus.style.color = '#dc3545';
            }
            console.error('Form submission error:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            if (formStatus) {
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }
        }
    };
    
    document.getElementById('main-contact-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('footer-contact-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('mobile-contact-form').addEventListener('submit', handleFormSubmit);
});
