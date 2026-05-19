// ==============================================
// FAQ PAGE FUNCTIONALITY  
// ==============================================

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run if we're on a page with FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) {
        return;
    }

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
    
    console.log(`FAQ initialized with ${faqItems.length} items`);
});