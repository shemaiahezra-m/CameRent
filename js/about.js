// Draggable card shuffle for The vibe section (no external libraries)
(function() {
	const root = document.getElementById('cardShuffle');
	if (!root) return;
	const list = root.querySelector('ul');
	const getCards = () => Array.from(list.querySelectorAll('.shuffle-card'));
	const vibeSection = document.querySelector('.vibe-section');
	const chips = Array.from(document.querySelectorAll('.chip'));
		const orbits = document.querySelector('.orbits');
			// Create extra orbs dynamically for richness
			function spawnOrbs(count = 8) {
				if (!orbits) return;
				for (let i = 0; i < count; i++) {
					const o = document.createElement('div');
					o.className = 'orbit';
					const span = document.createElement('span');
					span.className = 'orb';
					// randomize orbit size and speed
					const w = 480 + Math.floor(Math.random() * 220); // 480-700
					const h = 260 + Math.floor(Math.random() * 220); // 260-480
					o.style.width = w + 'px';
					o.style.height = h + 'px';
					const dur = 14 + Math.floor(Math.random() * 18); // 14-32s
					o.style.animationDuration = dur + 's';
					const phi = Math.floor(Math.random() * 360);
					o.style.setProperty('--phi', phi + 'deg');
					o.appendChild(span);
					orbits.appendChild(o);
				}
			}

					let clickToggleDown = false;

					const cycleTopToBack = (mode = 'right') => {
				const cards = getCards();
				if (cards.length < 2) return;
				const top = cards[0];
					// visible slide right or down to suggest moving behind
					if (mode === 'down') {
						top.classList.add('shuffling-down');
					} else {
						top.classList.add('shuffling-right');
					}
						// keep chips floating in place; no special chip orbit during shuffle
				// After animation, move to back and clean up
				setTimeout(() => {
						top.classList.remove('shuffling-right');
						top.classList.remove('shuffling-down');
					list.appendChild(top);
							// chip pulse feedback
							chips.forEach(ch => {
								ch.classList.remove('pulse');
								// force reflow for restart
								// eslint-disable-next-line no-unused-expressions
								ch.offsetWidth;
								ch.classList.add('pulse');
								setTimeout(() => ch.classList.remove('pulse'), 500);
							});
								// orbit burst feedback
								if (orbits) {
									orbits.classList.remove('burst');
									// eslint-disable-next-line no-unused-expressions
									orbits.offsetWidth;
									orbits.classList.add('burst');
									setTimeout(() => orbits.classList.remove('burst'), 500);
								}
				}, 340);
			};

	// Basic drag handling for the top card only
	const attachDrag = (card) => {
			let startX = 0;
			let startY = 0;
		let dragging = false;
		let dx = 0;
			let dy = 0;

		const onDown = (e) => {
			if (card !== getCards()[0]) return; // only when card is top
			dragging = true;
				const t = (e.touches ? e.touches[0] : e);
				startX = t.clientX;
				startY = t.clientY;
			card.style.transition = 'transform 0s';
		};
		const onMove = (e) => {
			if (!dragging) return;
				const t = (e.touches ? e.touches[0] : e);
				const x = t.clientX;
				const y = t.clientY;
				dx = x - startX;
				dy = y - startY;
				const clampX = Math.max(-120, Math.min(120, dx));
				const clampY = Math.max(-120, Math.min(120, dy));
				// show both axes but bias to the dominant direction
				if (Math.abs(dx) >= Math.abs(dy)) {
					card.style.transform = `translateX(${clampX}px)`;
				} else {
					card.style.transform = `translateY(${clampY}px)`;
				}
		};
		const onUp = () => {
			if (!dragging) return;
			dragging = false;
			card.style.transition = 'transform 280ms cubic-bezier(.2,.8,.2,1)';
			card.style.transform = '';
				// Shuffle thresholds: left swipe or downward flick
				if (dx < -140 && Math.abs(dx) >= Math.abs(dy)) {
					setTimeout(() => cycleTopToBack('right'), 80);
				} else if (dy > 140 && Math.abs(dy) > Math.abs(dx)) {
					setTimeout(() => cycleTopToBack('down'), 80);
			}
				dx = 0; dy = 0;
		};

		// Mouse
		card.addEventListener('mousedown', onDown);
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
		// Touch
		card.addEventListener('touchstart', onDown, { passive: true });
		window.addEventListener('touchmove', onMove, { passive: true });
		window.addEventListener('touchend', onUp, { passive: true });
	};

	const bindTopCard = () => {
		const cards = getCards();
		if (!cards[0]) return;
		const top = cards[0];
		// keyboard/click support
		top.tabIndex = 0;
			const clickHandler = () => { 
				if (top === getCards()[0]) {
					// alternate between right and down on click
					clickToggleDown = !clickToggleDown;
					cycleTopToBack(clickToggleDown ? 'down' : 'right');
				}
			};
		const keyHandler = (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				if (top === getCards()[0]) cycleTopToBack();
			}
		};
		top.addEventListener('click', clickHandler);
		top.addEventListener('keydown', keyHandler);
	};

	const init = () => {
		getCards().forEach(attachDrag);
		bindTopCard();
		const mo = new MutationObserver(() => {
			// on reorder, rebind new top for click/keyboard
			bindTopCard();
		});
		mo.observe(list, { childList: true });

			// In-view observer to trigger text/chips animations
			if (vibeSection) {
				const io = new IntersectionObserver((entries) => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							vibeSection.classList.add('in-view');
						}
					});
				}, { threshold: 0.2 });
						io.observe(vibeSection);
			}

					// spawn extra orbiting dots (lighter, since layout is scattered)
					spawnOrbs(6);
	};

	init();
})();

	/* Contact form interactions (moved from about.html) */
	(function(){
		// Elements
		const cameraBtns = document.querySelectorAll('.camera-type-btn');
		const cameraInput = document.getElementById('cameraTypeInput');
		const rentalRange = document.getElementById('rentalRange');
		const rentalValue = document.getElementById('rentalValue');
		const attachmentInput = document.getElementById('attachment');
		const contactForm = document.getElementById('contactForm');

		// Camera selection (toggle behavior)
		if (cameraBtns && cameraBtns.length) {
			cameraBtns.forEach(btn => {
				btn.addEventListener('click', function(){
					cameraBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
					this.classList.add('active');
					this.setAttribute('aria-pressed','true');
					if (cameraInput) cameraInput.value = this.dataset.value || '';
				});
			});
		}

		// Range binding
		if (rentalRange && rentalValue) {
			rentalValue.textContent = rentalRange.value;
			rentalRange.addEventListener('input', function(){ rentalValue.textContent = this.value; });
		}

		// Note: we use the browser's native file input with no custom UI.
		// Attachment input exists as-is; no extra filename display handlers.

		// Demo submit handler: show thank-you, reset UI
		if (contactForm) {
			contactForm.addEventListener('submit', function(e){
				e.preventDefault();
				// Collect form values for demo logging
				const fd = new FormData(contactForm);
				const obj = {};
				fd.forEach((v,k) => obj[k] = v);
				console.log('Contact form submit (demo):', obj, fd.get('attachment'));

				// Create thank-you element
				const thank = document.createElement('div');
				thank.className = 'thankyou-message';
				thank.tabIndex = -1;
				thank.innerHTML = '<div class="thank-ico"><i class="fas fa-check-circle" aria-hidden="true"></i></div>' +
								  '<div class="thank-text"><h4>Thank you!</h4><p>We received your message. We\'ll get back to you shortly.</p></div>';

				contactForm.style.display = 'none';
				contactForm.parentNode.insertBefore(thank, contactForm.nextSibling);
				setTimeout(() => thank.focus(), 50);

				setTimeout(() => {
					thank.classList.add('fade-out');
					setTimeout(() => {
						if (thank && thank.parentNode) thank.parentNode.removeChild(thank);
						contactForm.reset();
						contactForm.style.display = '';
						// reset UI bits
						if (cameraBtns && cameraBtns.length) cameraBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
						if (rentalValue && rentalRange) rentalValue.textContent = rentalRange.value;
						if (cameraInput) cameraInput.value = '';
						if (attachmentInput) attachmentInput.value = '';
					}, 380);
				}, 2400);
			});
		}

	})();

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtonsContainer = document.querySelector('.tab-buttons');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update data-active attribute for sliding indicator
            if (tabButtonsContainer) {
                tabButtonsContainer.setAttribute('data-active', targetTab);
            }
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});
