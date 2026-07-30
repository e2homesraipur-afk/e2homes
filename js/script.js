/**
 * E2 HOMES RAIPUR - INTERACTIVE JAVASCRIPT
 * Premium Homestay Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core components
  initHeaderScroll();
  initMobileNav();
  initHeroSlider();
  initGalleryFilterAndLightbox();
  initFaqAccordion();
  initScrollAnimations();
  initContactForm();
  initBackToTop();
  initDatePickers();
  initImageManager();
  initLocalGuideFilter();
  initGuestReviewsCarousel();
  renderSiteSuites();
});

/* --------------------------------------------------------------------------
   1. HEADER SCROLL & ACTIVE LINK HIGHLIGHT
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // ScrollSpy for Active Nav Link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const drawerLinks = document.querySelectorAll('.mobile-menu-links .nav-link');

  const openDrawer = () => {
    toggleBtn?.classList.add('active');
    drawer?.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    toggleBtn?.classList.remove('active');
    drawer?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn?.addEventListener('click', () => {
    if (drawer?.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   3. HERO FULLSCREEN SLIDER
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  const sliderContainer = document.querySelector('.hero-slider');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 5500; // 5.5 seconds

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    });

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const stopAutoSlide = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    startAutoSlide();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    startAutoSlide();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoSlide();
    });
  });

  // Pause on hover
  sliderContainer?.addEventListener('mouseenter', stopAutoSlide);
  sliderContainer?.addEventListener('mouseleave', startAutoSlide);

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderContainer?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 40) {
      nextSlide(); // Swipe left -> next
      startAutoSlide();
    } else if (touchEndX - touchStartX > 40) {
      prevSlide(); // Swipe right -> prev
      startAutoSlide();
    }
  }, { passive: true });

  startAutoSlide();
}

/* --------------------------------------------------------------------------
   4. GALLERY FILTER & LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initGalleryFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let visibleItems = Array.from(galleryItems);
  let currentLightboxIndex = 0;

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      visibleItems = [];
      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterCategory === 'all' || itemCat === filterCategory) {
          item.style.display = 'block';
          visibleItems.push(item);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  const openLightbox = (index) => {
    if (!visibleItems.length || !lightbox || !lightboxImg) return;

    currentLightboxIndex = index;
    const targetItem = visibleItems[currentLightboxIndex];
    const imgEl = targetItem.querySelector('img');
    const captionEl = targetItem.querySelector('.gallery-caption');

    lightboxImg.src = imgEl?.src || '';
    lightboxImg.alt = imgEl?.alt || 'E2 Homes Gallery Image';
    if (lightboxCaption) {
      lightboxCaption.textContent = captionEl?.textContent || 'E2 Homes Raipur';
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentLightboxIndex);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
    openLightbox(currentLightboxIndex);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  });
}

/* --------------------------------------------------------------------------
   5. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM & WHATSAPP REDIRECT
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('bookingContactForm');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName')?.value.trim();
    const phone = document.getElementById('guestPhone')?.value.trim();
    const checkin = document.getElementById('guestCheckin')?.value;
    const checkout = document.getElementById('guestCheckout')?.value;
    const guests = document.getElementById('guestCount')?.value;
    const reason = document.getElementById('guestReason')?.value;
    const message = document.getElementById('guestMessage')?.value.trim();

    if (!name || !phone || !checkin || !checkout) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Format WhatsApp message
    const formattedText = `*New Stay Inquiry - E2 Homes Raipur*
----------------------------------
*Name:* ${name}
*Phone:* ${phone}
*Check-in Date:* ${checkin}
*Check-out Date:* ${checkout}
*Reason for Stay:* ${reason || 'General Stay'}
*Notes/Message:* ${message || 'None'}
----------------------------------
_Inquiry sent from E2 Homes Raipur Website_`;

    const encodedMsg = encodeURIComponent(formattedText);
    const whatsappUrl = `https://wa.me/919301154606?text=${encodedMsg}`;

    showToast('Redirecting to WhatsApp with your inquiry details...', 'success');

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      form.reset();
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   7. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   8. SCROLL INTERSECTION ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animElements = document.querySelectorAll('.animate-on-scroll:not(.animated)');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '120px 0px 120px 0px'
    });

    animElements.forEach(el => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 120 && rect.bottom > -100) {
        el.classList.add('animated');
      }
    });
  } else {
    animElements.forEach(el => el.classList.add('animated'));
  }

  // Fallback safety check to make sure visible elements reveal immediately
  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        el.classList.add('animated');
      }
    });
  }, 300);
}

/* --------------------------------------------------------------------------
   9. DATE PICKERS INITIAL MIN-DATES
   -------------------------------------------------------------------------- */
function initDatePickers() {
  const checkinInput = document.getElementById('guestCheckin');
  const checkoutInput = document.getElementById('guestCheckout');

  if (!checkinInput || !checkoutInput) return;

  const today = new Date().toISOString().split('T')[0];
  checkinInput.min = today;

  checkinInput.addEventListener('change', () => {
    if (checkinInput.value) {
      checkoutInput.min = checkinInput.value;
      if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        // Set checkout to next day by default
        const nextDay = new Date(checkinInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutInput.value = nextDay.toISOString().split('T')[0];
      }
    }
  });
}



/* --------------------------------------------------------------------------
   11. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

/* --------------------------------------------------------------------------
   12. HOST AUTHENTICATION & INTERACTIVE SITE IMAGE MANAGER
   -------------------------------------------------------------------------- */
function initImageManager() {
  const getHostPin = () => {
    return localStorage.getItem('E2_HOST_PIN') || '9301';
  };
  const triggerBtns = document.querySelectorAll('.open-image-manager');
  const modal = document.getElementById('imageManagerModal');
  const closeBtn = document.querySelector('.image-manager-close');
  const overlay = document.querySelector('.image-manager-overlay');
  const container = document.getElementById('imageManagerList');
  const saveBtn = document.getElementById('saveImagesBtn');
  const resetBtn = document.getElementById('resetImagesBtn');
  const exportBtn = document.getElementById('exportConfigBtn');
  const lockHostBtn = document.getElementById('lockHostBtn');
  const changePinBtn = document.getElementById('changePinBtn');

  // PIN Modal Elements
  const pinModal = document.getElementById('hostPinModal');
  const pinOverlay = document.querySelector('.host-pin-overlay');
  const pinCloseBtn = document.querySelector('.host-pin-close');
  const pinInput = document.getElementById('hostPinInput');
  const submitPinBtn = document.getElementById('submitHostPinBtn');
  const pinErrorMsg = document.getElementById('pinErrorMsg');

  if (!modal || !container) return;

  // Check if Host is authenticated in this session or localStorage
  const isHostAuthenticated = () => {
    return sessionStorage.getItem('E2_HOST_AUTH') === 'true' || localStorage.getItem('E2_HOST_AUTH') === 'true';
  };

  // Update DOM visibility of host-only edit buttons
  const updateHostControlsVisibility = () => {
    const hostControls = document.querySelectorAll('.host-only-control');
    const isAuthed = isHostAuthenticated();
    hostControls.forEach(ctrl => {
      if (isAuthed) {
        ctrl.classList.add('host-active');
      } else {
        ctrl.classList.remove('host-active');
      }
    });
  };

  // Run initial visibility check
  updateHostControlsVisibility();

  // Open Host PIN Verification Modal
  const openPinModal = () => {
    if (isHostAuthenticated()) {
      openImageModal();
      return;
    }
    pinModal?.classList.add('active');
    pinOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
    if (pinErrorMsg) pinErrorMsg.textContent = '';
  };

  const closePinModal = () => {
    pinModal?.classList.remove('active');
    pinOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Verify PIN
  const verifyPin = () => {
    const enteredPin = pinInput ? pinInput.value.trim() : '';
    const currentHostPin = getHostPin();
    if (enteredPin && enteredPin === currentHostPin) {
      sessionStorage.setItem('E2_HOST_AUTH', 'true');
      updateHostControlsVisibility();
      closePinModal();
      showToast('Host Access Verified!', 'success');
      openImageModal();
    } else {
      if (pinErrorMsg) pinErrorMsg.textContent = 'Incorrect PIN passcode. Please try again.';
      if (pinInput) pinInput.select();
    }
  };

  submitPinBtn?.addEventListener('click', verifyPin);
  pinInput?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') verifyPin();
  });
  pinCloseBtn?.addEventListener('click', closePinModal);
  pinOverlay?.addEventListener('click', closePinModal);

  // Open Image Manager Modal
  const openImageModal = () => {
    if (!isHostAuthenticated()) {
      openPinModal();
      return;
    }
    renderImageList();
    renderHostSuitesList();
    renderPropertySettings();
    renderHostReviewsList();
    modal.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    modal.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggerBtns.forEach(btn => btn.addEventListener('click', openImageModal));
  closeBtn?.addEventListener('click', closeImageModal);
  overlay?.addEventListener('click', closeImageModal);

  // Tab Navigation in Host Control Panel
  const tabBtns = modal.querySelectorAll('.host-mgr-tab');
  const tabContents = modal.querySelectorAll('.host-mgr-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      const targetEl = modal.querySelector(`#${targetTab}`);
      if (targetEl) targetEl.style.display = 'block';
    });
  });

  // Logout Host
  lockHostBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('E2_HOST_AUTH');
    localStorage.removeItem('E2_HOST_AUTH');
    updateHostControlsVisibility();
    closeImageModal();
    showToast('Host session logged out', 'info');
  });

  // Change Host Passcode PIN
  changePinBtn?.addEventListener('click', () => {
    const newPin = prompt('Set a new Host Passcode PIN (minimum 4 characters):');
    if (newPin !== null) {
      const trimmed = newPin.trim();
      if (trimmed.length >= 4) {
        localStorage.setItem('E2_HOST_PIN', trimmed);
        showToast('Host PIN updated successfully!', 'success');
      } else {
        alert('PIN must be at least 4 characters long.');
      }
    }
  });

  /* ------------------------------------------------------------------------
     HOST ACCESS SECRET SHORTCUTS & TRIGGERS (FOR WEBSITE OWNER)
     ------------------------------------------------------------------------ */
  // 1. URL Hash / Query Parameter Trigger (e.g. website.com/#admin or ?admin)
  if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
    setTimeout(openPinModal, 500);
  }

  // 2. Keyboard Shortcut Trigger: Ctrl + Shift + E
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
      e.preventDefault();
      openPinModal();
    }
  });

  // 3. Triple Click Brand Logo Header Trigger
  const brandLogo = document.querySelector('.site-header .brand-logo');
  let clickCount = 0;
  let clickTimer = null;
  brandLogo?.addEventListener('click', (e) => {
    clickCount++;
    if (clickCount === 3) {
      e.preventDefault();
      clickCount = 0;
      openPinModal();
    }
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 800);
  });

  // Render Tab 1: Image & Photo Name Fields
  function renderImageList() {
    const images = typeof getActiveSiteImages === 'function' ? getActiveSiteImages() : {};
    container.innerHTML = '';

    const categories = {};
    Object.keys(images).forEach(key => {
      const item = images[key];
      const cat = item.category || 'General Images';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push({ key, ...item });
    });

    Object.keys(categories).forEach(catName => {
      const catHeader = document.createElement('h4');
      catHeader.className = 'img-mgr-cat-title';
      catHeader.innerHTML = `<i class="fa-solid fa-folder"></i> ${catName}`;
      container.appendChild(catHeader);

      categories[catName].forEach(item => {
        let displayUrl = item.url || '';
        if (displayUrl.startsWith('/assets/')) {
          displayUrl = '.' + displayUrl;
        }

        const card = document.createElement('div');
        card.className = 'img-mgr-card';
        card.innerHTML = `
          <div class="img-mgr-thumb">
            <img src="${displayUrl}" id="preview-${item.key}" alt="${item.label}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'150\\' height=\\'150\\' viewBox=\\'0 0 150 150\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23f1f5f9\\'/><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2394a3b8\\' font-family=\\'sans-serif\\' font-size=\\'12\\'>No Preview</text></svg>';">
          </div>
          <div class="img-mgr-info">
            <div class="img-mgr-label-row">
              <span class="img-mgr-field-title">Photo Name / Title:</span>
              <input type="text" id="label-${item.key}" class="img-mgr-input img-mgr-label-input" data-key="${item.key}" value="${item.label}" placeholder="Photo or Room Name">
            </div>
            <div class="img-mgr-url-row">
              <span class="img-mgr-field-title">Image URL or Upload:</span>
              <div class="img-mgr-input-group">
                <input type="text" id="input-${item.key}" class="img-mgr-input img-mgr-url-input" data-key="${item.key}" value="${displayUrl}" placeholder="Paste Image URL or ./assets/filename.jpg">
                <label class="btn btn-outline-forest btn-sm img-mgr-file-btn">
                  <i class="fa-solid fa-upload"></i> Upload
                  <input type="file" accept="image/*" class="img-mgr-file-input" data-key="${item.key}" style="display:none;">
                </label>
              </div>
            </div>
          </div>
        `;

        container.appendChild(card);

        // Bind input URL live preview update
        const urlInput = card.querySelector(`#input-${item.key}`);
        const previewImg = card.querySelector(`#preview-${item.key}`);
        urlInput?.addEventListener('input', (e) => {
          let val = e.target.value.trim();
          if (val.startsWith('/assets/')) {
            val = '.' + val;
          }
          previewImg.src = val;
        });

        // Helper: Compress & Downscale Uploaded Images to fit in localStorage
        const compressAndConvertImage = (file, callback) => {
          const maxWidth = 800;
          const maxHeight = 800;
          const reader = new FileReader();

          reader.onload = function(evt) {
            const img = new Image();
            img.onload = function() {
              let width = img.width;
              let height = img.height;

              if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                  height = Math.round((height * maxWidth) / width);
                  width = maxWidth;
                } else {
                  width = Math.round((width * maxHeight) / height);
                  height = maxHeight;
                }
              }

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.70);
              callback(compressedDataUrl);
            };

            img.onerror = function() {
              callback(evt.target.result);
            };

            img.src = evt.target.result;
          };

          reader.readAsDataURL(file);
        };

        const fileInput = card.querySelector('.img-mgr-file-input');
        fileInput?.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            compressAndConvertImage(file, (dataUrl) => {
              urlInput.value = dataUrl;
              previewImg.src = dataUrl;
            });
          }
        });
      });
    });
  }

  // Render Tab 2: Suites & Bedrooms Management
  function renderHostSuitesList() {
    const suitesListContainer = modal.querySelector('#hostSuitesList');
    if (!suitesListContainer) return;

    const suites = getSuites();
    const siteImages = typeof getActiveSiteImages === 'function' ? getActiveSiteImages() : {};
    suitesListContainer.innerHTML = '';

    const photoOptions = Object.keys(siteImages).map(k => {
      const item = siteImages[k];
      return `<option value="${k}">${k} (${item.label || 'Photo'})</option>`;
    }).join('');

    suites.forEach((suite, idx) => {
      const card = document.createElement('div');
      card.className = 'host-suite-card';
      card.setAttribute('data-suite-id', suite.id || 'suite_' + idx);

      let featuresStr = Array.isArray(suite.features) ? suite.features.join(', ') : (suite.features || '');
      let currentKey = suite.imgKey || ('gallery-' + ((idx % 8) + 1));
      if (currentKey === 'livingRoom') currentKey = 'gallery-1';
      if (currentKey === 'bedroom') currentKey = 'gallery-2';
      if (currentKey === 'masterBedroom') currentKey = 'gallery-3';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:0.4rem; margin-bottom:0.4rem;">
          <span class="img-mgr-field-title" style="font-size:0.85rem;"><i class="fa-solid fa-bed"></i> Bedroom / Suite #${idx + 1}</span>
          <button type="button" class="btn btn-outline-forest btn-sm host-suite-del-btn" style="color:#ef4444; border-color:#ef4444; padding:0.25rem 0.5rem; font-size:0.75rem;">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>

        <div class="host-suite-card-grid">
          <div>
            <span class="img-mgr-field-title">Suite Title (e.g. 4 BHK Villa):</span>
            <input type="text" class="img-mgr-input suite-title-inp" value="${suite.title || ''}" placeholder="e.g. 4 BHK Villa">
          </div>
          <div>
            <span class="img-mgr-field-title">Tagline / Capacity:</span>
            <input type="text" class="img-mgr-input suite-tagline-inp" value="${suite.tagline || ''}" placeholder="e.g. Ideal for 8-12 Guests">
          </div>
          <div>
            <span class="img-mgr-field-title">Guests Capacity:</span>
            <input type="text" class="img-mgr-input suite-guests-inp" value="${suite.guests || ''}" placeholder="e.g. 8-12 Guests">
          </div>
          <div>
            <span class="img-mgr-field-title">Size / Area:</span>
            <input type="text" class="img-mgr-input suite-size-inp" value="${suite.size || ''}" placeholder="e.g. 2,000 sq. ft.">
          </div>
          <div>
            <span class="img-mgr-field-title">Price Tag:</span>
            <input type="text" class="img-mgr-input suite-price-inp" value="${suite.price || ''}" placeholder="e.g. ₹5,999 / night">
          </div>
          <div>
            <span class="img-mgr-field-title">Badge Label:</span>
            <input type="text" class="img-mgr-input suite-badge-inp" value="${suite.badge || ''}" placeholder="e.g. Royal Luxury">
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.6rem; margin-top:0.4rem;">
          <div>
            <span class="img-mgr-field-title">Linked Photo from Photo Manager:</span>
            <select class="img-mgr-input suite-imgkey-select">
              ${Object.keys(siteImages).map(k => {
                const item = siteImages[k];
                const sel = k === currentKey ? 'selected' : '';
                return `<option value="${k}" ${sel}>${item.label || k} (${k})</option>`;
              }).join('')}
            </select>
          </div>
          <div>
            <span class="img-mgr-field-title">Or Direct Custom Image URL (optional):</span>
            <input type="text" class="img-mgr-input suite-imgurl-inp" value="${suite.imgUrl || ''}" placeholder="Paste URL or leave empty to use linked photo">
          </div>
        </div>

        <div style="margin-top:0.4rem;">
          <span class="img-mgr-field-title">Description:</span>
          <textarea class="img-mgr-input suite-desc-inp" rows="2" placeholder="Suite description...">${suite.desc || ''}</textarea>
        </div>

        <div style="margin-top:0.4rem;">
          <span class="img-mgr-field-title">Features / Amenities (comma separated):</span>
          <input type="text" class="img-mgr-input suite-features-inp" value="${featuresStr}" placeholder="e.g. 4 AC Master Bedrooms, Private Balcony, Jacuzzi, Full Kitchen">
        </div>
      `;

      suitesListContainer.appendChild(card);

      card.querySelector('.host-suite-del-btn')?.addEventListener('click', () => {
        if (confirm(`Delete suite "${suite.title}"?`)) {
          card.remove();
        }
      });
    });

    const addSuiteBtn = modal.querySelector('#addHostSuiteBtn');
    if (addSuiteBtn) {
      addSuiteBtn.onclick = () => {
        const newIdx = suitesListContainer.children.length + 1;
        const newKey = 'gallery-' + (((newIdx - 1) % 8) + 1);
        const newSuite = {
          id: 'suite_custom_' + Date.now(),
          badge: 'New Suite',
          badgeType: '',
          title: `${newIdx} BHK Luxury Suite`,
          tagline: `Ideal for ${newIdx * 2} Guests • Premium Living`,
          desc: `A newly added fully-furnished ${newIdx} BHK apartment suite with air-conditioned bedrooms, living room, washroom, and kitchen facilities.`,
          guests: `${newIdx * 2} Guests`,
          size: `${newIdx * 350} sq. ft.`,
          imgKey: newKey,
          imgUrl: '',
          price: 'Contact for Price',
          features: ['Air Conditioned Bedrooms', 'Living Room & Dining', 'RO Water & Kitchen', 'High Speed Wi-Fi']
        };

        const card = document.createElement('div');
        card.className = 'host-suite-card';
        card.setAttribute('data-suite-id', newSuite.id);

        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:0.4rem; margin-bottom:0.4rem;">
            <span class="img-mgr-field-title" style="font-size:0.85rem;"><i class="fa-solid fa-bed"></i> Bedroom / Suite #${newIdx}</span>
            <button type="button" class="btn btn-outline-forest btn-sm host-suite-del-btn" style="color:#ef4444; border-color:#ef4444; padding:0.25rem 0.5rem; font-size:0.75rem;">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>

          <div class="host-suite-card-grid">
            <div>
              <span class="img-mgr-field-title">Suite Title:</span>
              <input type="text" class="img-mgr-input suite-title-inp" value="${newSuite.title}" placeholder="e.g. 4 BHK Villa">
            </div>
            <div>
              <span class="img-mgr-field-title">Tagline:</span>
              <input type="text" class="img-mgr-input suite-tagline-inp" value="${newSuite.tagline}" placeholder="e.g. Ideal for 8 Guests">
            </div>
            <div>
              <span class="img-mgr-field-title">Guests Capacity:</span>
              <input type="text" class="img-mgr-input suite-guests-inp" value="${newSuite.guests}" placeholder="e.g. 8 Guests">
            </div>
            <div>
              <span class="img-mgr-field-title">Size / Area:</span>
              <input type="text" class="img-mgr-input suite-size-inp" value="${newSuite.size}" placeholder="e.g. 1,800 sq. ft.">
            </div>
            <div>
              <span class="img-mgr-field-title">Price Tag:</span>
              <input type="text" class="img-mgr-input suite-price-inp" value="${newSuite.price}" placeholder="e.g. ₹5,999 / night">
            </div>
            <div>
              <span class="img-mgr-field-title">Badge Label:</span>
              <input type="text" class="img-mgr-input suite-badge-inp" value="${newSuite.badge}">
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.6rem; margin-top:0.4rem;">
            <div>
              <span class="img-mgr-field-title">Linked Photo from Photo Manager:</span>
              <select class="img-mgr-input suite-imgkey-select">
                ${Object.keys(siteImages).map(k => {
                  const item = siteImages[k];
                  const sel = k === newKey ? 'selected' : '';
                  return `<option value="${k}" ${sel}>${item.label || k} (${k})</option>`;
                }).join('')}
              </select>
            </div>
            <div>
              <span class="img-mgr-field-title">Or Direct Custom Image URL (optional):</span>
              <input type="text" class="img-mgr-input suite-imgurl-inp" value="" placeholder="Paste URL or leave empty">
            </div>
          </div>

          <div style="margin-top:0.4rem;">
            <span class="img-mgr-field-title">Description:</span>
            <textarea class="img-mgr-input suite-desc-inp" rows="2" placeholder="Suite description...">${newSuite.desc}</textarea>
          </div>

          <div style="margin-top:0.4rem;">
            <span class="img-mgr-field-title">Features / Amenities (comma separated):</span>
            <input type="text" class="img-mgr-input suite-features-inp" value="${newSuite.features.join(', ')}">
          </div>
        `;

        suitesListContainer.prepend(card);
        card.querySelector('.host-suite-del-btn')?.addEventListener('click', () => { card.remove(); });
      };
    }
  }

  // Render Tab 3: Property & Contact Info
  function renderPropertySettings() {
    const info = typeof getSiteInfo === 'function' ? getSiteInfo() : {};
    const propNameInp = modal.querySelector('#cfg-property-name');
    const taglineInp = modal.querySelector('#cfg-tagline');
    const addressInp = modal.querySelector('#cfg-address');
    const phoneInp = modal.querySelector('#cfg-phone');
    const whatsappInp = modal.querySelector('#cfg-whatsapp');

    if (propNameInp) propNameInp.value = info.propertyName || '';
    if (taglineInp) taglineInp.value = info.tagline || '';
    if (addressInp) addressInp.value = info.address || '';
    if (phoneInp) phoneInp.value = info.phone || '';
    if (whatsappInp) whatsappInp.value = info.whatsapp || '';
  }

  // Render Tab 4: Guest Reviews & Guest Names
  function renderHostReviewsList() {
    const reviewsListContainer = modal.querySelector('#hostReviewsList');
    if (!reviewsListContainer) return;

    const reviews = typeof window.getReviews === 'function' ? window.getReviews() : [];
    reviewsListContainer.innerHTML = '';

    reviews.forEach((rev) => {
      const revCard = document.createElement('div');
      revCard.className = 'host-review-card';
      revCard.innerHTML = `
        <div class="host-review-card-row">
          <div>
            <span class="img-mgr-field-title">Guest Name:</span>
            <input type="text" class="img-mgr-input host-rev-name" value="${rev.name || ''}" placeholder="Guest Name">
          </div>
          <div>
            <span class="img-mgr-field-title">Stay Information:</span>
            <input type="text" class="img-mgr-input host-rev-stay" value="${rev.stayInfo || ''}" placeholder="e.g. 2 BHK Suite • 5 Day Stay">
          </div>
          <div>
            <span class="img-mgr-field-title">Rating:</span>
            <select class="img-mgr-input host-rev-rating">
              <option value="5" ${rev.rating === 5 ? 'selected' : ''}>5 Stars</option>
              <option value="4" ${rev.rating === 4 ? 'selected' : ''}>4 Stars</option>
              <option value="3" ${rev.rating === 3 ? 'selected' : ''}>3 Stars</option>
            </select>
          </div>
        </div>
        <div>
          <span class="img-mgr-field-title">Review Text:</span>
          <textarea class="img-mgr-input host-rev-text" rows="2" placeholder="Guest comment...">${rev.text || ''}</textarea>
        </div>
        <div style="display:flex; justify-content:flex-end;">
          <button type="button" class="btn btn-outline-forest btn-sm host-rev-del-btn" style="color:#ef4444; border-color:#ef4444;">
            <i class="fa-solid fa-trash"></i> Delete Review
          </button>
        </div>
      `;

      reviewsListContainer.appendChild(revCard);

      revCard.querySelector('.host-rev-del-btn')?.addEventListener('click', () => {
        if (confirm(`Delete review from "${rev.name}"?`)) {
          revCard.remove();
        }
      });
    });

    const addBtn = modal.querySelector('#addHostReviewBtn');
    if (addBtn) {
      addBtn.onclick = () => {
        const newRev = {
          name: 'New Guest Name',
          stayInfo: '2 BHK Suite • 3 Day Stay',
          rating: 5,
          text: 'Wonderful experience staying at E2 Homes Raipur! High quality amenities and great service.'
        };
        
        const revCard = document.createElement('div');
        revCard.className = 'host-review-card';
        revCard.innerHTML = `
          <div class="host-review-card-row">
            <div>
              <span class="img-mgr-field-title">Guest Name:</span>
              <input type="text" class="img-mgr-input host-rev-name" value="${newRev.name}" placeholder="Guest Name">
            </div>
            <div>
              <span class="img-mgr-field-title">Stay Information:</span>
              <input type="text" class="img-mgr-input host-rev-stay" value="${newRev.stayInfo}" placeholder="e.g. 2 BHK Suite • 5 Day Stay">
            </div>
            <div>
              <span class="img-mgr-field-title">Rating:</span>
              <select class="img-mgr-input host-rev-rating">
                <option value="5" selected>5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>
          </div>
          <div>
            <span class="img-mgr-field-title">Review Text:</span>
            <textarea class="img-mgr-input host-rev-text" rows="2" placeholder="Guest comment...">${newRev.text}</textarea>
          </div>
          <div style="display:flex; justify-content:flex-end;">
            <button type="button" class="btn btn-outline-forest btn-sm host-rev-del-btn" style="color:#ef4444; border-color:#ef4444;">
              <i class="fa-solid fa-trash"></i> Delete Review
            </button>
          </div>
        `;
        reviewsListContainer.prepend(revCard);
        revCard.querySelector('.host-rev-del-btn')?.addEventListener('click', () => { revCard.remove(); });
      };
    }
  }

  // Save changes to LocalStorage and apply
  saveBtn?.addEventListener('click', () => {
    let hasQuotaError = false;

    // 1. Photo Custom Labels & URLs
    const customMap = {};
    const cards = container.querySelectorAll('.img-mgr-card');
    cards.forEach(card => {
      const labelInput = card.querySelector('.img-mgr-label-input');
      const urlInput = card.querySelector('.img-mgr-url-input');
      if (labelInput && urlInput) {
        const key = labelInput.getAttribute('data-key');
        const label = labelInput.value.trim();
        let url = urlInput.value.trim();
        
        if (typeof sanitizeImageUrl === 'function') {
          url = sanitizeImageUrl(url);
        } else if (url.startsWith('/assets/')) {
          url = '.' + url;
        }

        if (key && (label || url)) {
          customMap[key] = { label, url };
        }
      }
    });

    try {
      localStorage.setItem('E2_CUSTOM_SITE_IMAGES', JSON.stringify(customMap));
    } catch (e) {
      console.warn('LocalStorage quota limit reached:', e);
      hasQuotaError = true;
    }

    // 2. Suites & Bedrooms Customization
    const suiteCards = modal.querySelectorAll('.host-suite-card');
    const updatedSuites = [];
    suiteCards.forEach((card, idx) => {
      const title = card.querySelector('.suite-title-inp')?.value.trim() || 'Apartment Suite';
      const tagline = card.querySelector('.suite-tagline-inp')?.value.trim() || '';
      const guests = card.querySelector('.suite-guests-inp')?.value.trim() || '1-4 Guests';
      const size = card.querySelector('.suite-size-inp')?.value.trim() || '800 sq. ft.';
      const price = card.querySelector('.suite-price-inp')?.value.trim() || 'Contact for Price';
      const badge = card.querySelector('.suite-badge-inp')?.value.trim() || '';
      const desc = card.querySelector('.suite-desc-inp')?.value.trim() || '';
      const featStr = card.querySelector('.suite-features-inp')?.value.trim() || '';
      const features = featStr ? featStr.split(',').map(s => s.trim()).filter(Boolean) : [];

      const imgKey = card.querySelector('.suite-imgkey-select')?.value || ('gallery-' + ((idx % 8) + 1));
      let imgUrl = card.querySelector('.suite-imgurl-inp')?.value.trim() || '';
      if (typeof sanitizeImageUrl === 'function') {
        imgUrl = sanitizeImageUrl(imgUrl);
      }

      updatedSuites.push({
        id: card.getAttribute('data-suite-id') || 'suite_' + idx,
        badge,
        badgeType: badge.toLowerCase().includes('popular') || badge.toLowerCase().includes('featured') ? 'featured' : '',
        title,
        tagline,
        desc,
        guests,
        size,
        imgKey,
        imgUrl,
        price,
        features
      });
    });

    try {
      localStorage.setItem('E2_CUSTOM_SUITES', JSON.stringify(updatedSuites));
    } catch (e) {
      hasQuotaError = true;
    }

    // 3. Property Settings Info
    const propNameVal = modal.querySelector('#cfg-property-name')?.value.trim() || 'E2 Homes Raipur';
    const taglineVal = modal.querySelector('#cfg-tagline')?.value.trim() || 'Comfort. Luxury. Home.';
    const addressVal = modal.querySelector('#cfg-address')?.value.trim() || '';
    const phoneVal = modal.querySelector('#cfg-phone')?.value.trim() || '+91 93011 54606';
    const whatsappVal = modal.querySelector('#cfg-whatsapp')?.value.trim() || '919301154606';

    const updatedSiteInfo = {
      propertyName: propNameVal,
      tagline: taglineVal,
      address: addressVal,
      phone: phoneVal,
      whatsapp: whatsappVal
    };
    
    try {
      localStorage.setItem('E2_CUSTOM_SITE_INFO', JSON.stringify(updatedSiteInfo));
    } catch (e) {
      hasQuotaError = true;
    }

    if (typeof applySiteInfo === 'function') {
      applySiteInfo();
    }

    // 4. Reviews & Guest Names
    const revCards = modal.querySelectorAll('.host-review-card');
    const updatedReviews = [];
    revCards.forEach((card, idx) => {
      const name = card.querySelector('.host-rev-name')?.value.trim() || 'Guest';
      const stayInfo = card.querySelector('.host-rev-stay')?.value.trim() || 'Stayed at E2 Homes';
      const rating = parseInt(card.querySelector('.host-rev-rating')?.value || '5', 10);
      const text = card.querySelector('.host-rev-text')?.value.trim() || 'Great stay!';
      const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'GS';

      updatedReviews.push({
        id: 'rev_cust_' + idx,
        name,
        avatar,
        rating,
        category: 'family',
        stayInfo,
        text
      });
    });

    try {
      localStorage.setItem('E2_GUEST_REVIEWS_ALL', JSON.stringify(updatedReviews));
    } catch (e) {
      hasQuotaError = true;
    }

    renderSiteSuites();

    if (typeof applySiteImages === 'function') {
      applySiteImages();
    }

    if (typeof window.refreshReviewsCarousel === 'function') {
      window.refreshReviewsCarousel();
    }

    if (hasQuotaError) {
      showToast('Storage limit reached! Please use image URLs (Google Drive / Unsplash) instead of large uploaded photos.', 'error');
    } else {
      showToast('All custom bedrooms, suites, photos, property details & guest reviews saved successfully!', 'success');
    }
    closeImageModal();
  });

  // Reset to default original images & names
  resetBtn?.addEventListener('click', () => {
    if (confirm('Reset all site bedrooms, photo names, image URLs, property info & reviews back to defaults?')) {
      localStorage.removeItem('E2_CUSTOM_SITE_IMAGES');
      localStorage.removeItem('E2_CUSTOM_SITE_INFO');
      localStorage.removeItem('E2_GUEST_REVIEWS_ALL');
      localStorage.removeItem('E2_CUSTOM_SUITES');
      
      renderSiteSuites();
      if (typeof applySiteInfo === 'function') {
        applySiteInfo();
      }
      if (typeof applySiteImages === 'function') {
        applySiteImages();
      }
      if (typeof window.refreshReviewsCarousel === 'function') {
        window.refreshReviewsCarousel();
      }
      showToast('Restored defaults for suites, images, names and reviews', 'info');
      closeImageModal();
    }
  });

  // Export updated js/images-config.js file content
  exportBtn?.addEventListener('click', () => {
    const images = typeof getActiveSiteImages === 'function' ? getActiveSiteImages() : {};
    let jsCode = `/**\n * E2 HOMES RAIPUR - CUSTOMIZED SITE IMAGE CONFIGURATION\n * Update this file when hosting your website!\n */\n\nwindow.DEFAULT_SITE_IMAGES = {\n`;

    const keys = Object.keys(images);
    keys.forEach((key, idx) => {
      const item = images[key];
      const isLast = idx === keys.length - 1;
      jsCode += `  "${key}": {\n    category: "${item.category}",\n    label: "${item.label}",\n    url: "${item.url}"\n  }${isLast ? '' : ','}\n`;
    });

    jsCode += `};\n`;

    // Prompt user to download updated file
    const blob = new Blob([jsCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'images-config.js';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded images-config.js! Replace js/images-config.js when hosting.', 'success');
  });
}

/* --------------------------------------------------------------------------
   13. LOCAL GUIDE CATEGORY FILTER TABS
   -------------------------------------------------------------------------- */
function initLocalGuideFilter() {
  const tabs = document.querySelectorAll('.guide-tab');
  const cards = document.querySelectorAll('.guide-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-guide-cat');

      cards.forEach(card => {
        const itemCat = card.getAttribute('data-guide-item') || '';
        if (category === 'all' || itemCat.includes(category)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   14. GUEST REVIEWS & RATINGS CAROUSEL
   -------------------------------------------------------------------------- */
function initGuestReviewsCarousel() {
  const DEFAULT_REVIEWS = [
    {
      id: 'rev_1',
      name: 'Rajesh Verma',
      avatar: 'RA',
      rating: 5,
      category: 'medical',
      stayInfo: 'Medical Attendant • 10 Day Stay',
      text: 'E2 Homes was a blessing during my mother\'s treatment at Shri Venkatesh Superspeciality Hospital. The close proximity made daily visits effortless, and having a full kitchen allowed us to cook her prescribed home food. Exceptionally clean and peaceful!'
    },
    {
      id: 'rev_2',
      name: 'Sneha Patel',
      avatar: 'SP',
      rating: 5,
      category: 'family',
      stayInfo: 'Family Staycation • 2 BHK Suite',
      text: 'One of the finest homestays in Raipur! Empresia Elite is a modern gated society with great security. The suite is beautifully furnished, WiFi is lightning fast, and host assistance was 10/10.'
    },
    {
      id: 'rev_3',
      name: 'Amitabh Mukherjee',
      avatar: 'AM',
      rating: 5,
      category: 'business',
      stayInfo: 'Business Traveler • 5 Day Stay',
      text: 'As a corporate consultant visiting Naya Raipur & Sector 8A, E2 Homes offered far better value than 4-star hotels. Spacious living room, high-speed WiFi, and hassle-free parking. Highly recommended!'
    },
    {
      id: 'rev_4',
      name: 'Dr. Ananya Sharma',
      avatar: 'AS',
      rating: 5,
      category: 'medical',
      stayInfo: 'Medical Specialist • 12 Day Stay',
      text: 'Stayed for 12 days while attending a medical conference and visiting VY Hospital. E2 Homes exceeded my expectations! Fresh linen, spotless bathrooms, quiet atmosphere, and proactive host support.'
    },
    {
      id: 'rev_5',
      name: 'Pankaj Agarwal',
      avatar: 'PA',
      rating: 5,
      category: 'family',
      stayInfo: 'Family Group • 3 BHK Stay',
      text: 'We booked the 3 BHK Royal Grand Suite for our extended family attending a wedding near Kamal Vihar. The apartment was super spacious, fully air-conditioned, and had safe gated parking for both our cars!'
    },
    {
      id: 'rev_6',
      name: 'Vikram Singh',
      avatar: 'VS',
      rating: 5,
      category: 'longstay',
      stayInfo: 'NRI Guest • 2 BHK Suite',
      text: 'Visiting Raipur from Dubai to meet relatives. E2 Homes felt like a luxury home away from home. High-speed WiFi for work calls, RO water, automatic power backup, and top security in Empresia Elite.'
    }
  ];

  const getReviews = () => {
    try {
      const storedAll = localStorage.getItem('E2_GUEST_REVIEWS_ALL');
      if (storedAll) {
        return JSON.parse(storedAll);
      }
      const stored = localStorage.getItem('E2_GUEST_REVIEWS');
      const userRevs = stored ? JSON.parse(stored) : [];
      return [...userRevs, ...DEFAULT_REVIEWS];
    } catch (e) {
      return DEFAULT_REVIEWS;
    }
  };

  window.getReviews = getReviews;

  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewsViewport = document.getElementById('reviewsViewport');
  const prevBtn = document.getElementById('reviewsPrevBtn');
  const nextBtn = document.getElementById('reviewsNextBtn');
  const dotsContainer = document.getElementById('reviewsDots');
  const filterChips = document.querySelectorAll('.review-filter-chip');
  const autoplayToggle = document.getElementById('reviewsAutoplayToggle');
  const totalCountEl = document.getElementById('total-reviews-count');

  if (!reviewsTrack || !reviewsViewport) return;

  let currentFilter = 'all';
  let currentIndex = 0;
  let autoPlayInterval = null;
  let isAutoplayPlaying = true;
  let activeFilteredReviews = [];

  const updateCounts = (allReviews) => {
    const counts = { all: allReviews.length, medical: 0, family: 0, business: 0, longstay: 0 };
    allReviews.forEach(r => {
      if (counts[r.category] !== undefined) counts[r.category]++;
    });

    Object.keys(counts).forEach(cat => {
      const el = document.getElementById(`count-${cat}`);
      if (el) el.textContent = counts[cat];
    });

    if (totalCountEl) {
      totalCountEl.textContent = `${allReviews.length + 115}+`;
    }
  };

  const getCardsPerPage = () => {
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 992) return 2;
    return 3;
  };

  const renderCarousel = () => {
    const allReviews = getReviews();
    updateCounts(allReviews);

    activeFilteredReviews = currentFilter === 'all' 
      ? allReviews 
      : allReviews.filter(r => r.category === currentFilter);

    reviewsTrack.innerHTML = '';

    if (activeFilteredReviews.length === 0) {
      reviewsTrack.innerHTML = `
        <div style="padding: 2.5rem; text-align: center; width: 100%; color: var(--color-gray-muted);">
          <i class="fa-solid fa-comments" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
          <p>No reviews in this category yet. Be the first to leave feedback!</p>
        </div>
      `;
      if (dotsContainer) dotsContainer.innerHTML = '';
      return;
    }

    activeFilteredReviews.forEach(r => {
      const slide = document.createElement('div');
      slide.className = 'review-card-slide';

      const starsHtml = Array.from({ length: r.rating || 5 }, () => '<i class="fa-solid fa-star"></i>').join('');

      slide.innerHTML = `
        <div class="review-card">
          <div>
            <div class="review-card-stars">${starsHtml}</div>
            <p class="review-text">"${r.text}"</p>
          </div>
          <div class="reviewer-profile">
            <div class="reviewer-avatar">${r.avatar || 'EG'}</div>
            <div class="reviewer-info">
              <h4>${r.name}</h4>
              <span class="reviewer-tag">
                <i class="fa-solid fa-circle-check" style="color: var(--color-gold);"></i> 
                ${r.stayInfo || 'Verified Stay'}
              </span>
            </div>
          </div>
        </div>
      `;
      reviewsTrack.appendChild(slide);
    });

    updatePosition();
    renderDots();
  };

  window.refreshReviewsCarousel = renderCarousel;

  const updatePosition = () => {
    const cardsPerPage = getCardsPerPage();
    const maxIndex = Math.max(0, activeFilteredReviews.length - cardsPerPage);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const slideWidthPercent = 100 / cardsPerPage;
    reviewsTrack.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex || activeFilteredReviews.length <= cardsPerPage;

    updateActiveDot();
  };

  const renderDots = () => {
    if (!dotsContainer) return;
    const cardsPerPage = getCardsPerPage();
    const totalDots = Math.max(1, activeFilteredReviews.length - cardsPerPage + 1);

    dotsContainer.innerHTML = '';
    if (totalDots <= 1) return;

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.className = `reviews-dot ${i === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentIndex = i;
        updatePosition();
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateActiveDot = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.reviews-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  // Nav Button Events
  prevBtn?.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updatePosition();
    resetAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    const cardsPerPage = getCardsPerPage();
    const maxIndex = Math.max(0, activeFilteredReviews.length - cardsPerPage);
    if (currentIndex >= maxIndex) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updatePosition();
    resetAutoplay();
  });

  // Filter Chips Events
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter') || 'all';
      currentIndex = 0;
      renderCarousel();
      resetAutoplay();
    });
  });

  // Touch Swipe & Drag Support
  let startX = 0;
  let isDragging = false;

  reviewsViewport.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  }, { passive: true });

  reviewsViewport.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentIndex > 0) {
        currentIndex--;
        isDragging = false;
        updatePosition();
      } else if (diff < 0) {
        const cardsPerPage = getCardsPerPage();
        if (currentIndex < activeFilteredReviews.length - cardsPerPage) {
          currentIndex++;
          isDragging = false;
          updatePosition();
        }
      }
    }
  }, { passive: true });

  reviewsViewport.addEventListener('touchend', () => {
    isDragging = false;
    startAutoplay();
  });

  // AutoPlay Loop
  const startAutoplay = () => {
    if (!isAutoplayPlaying) return;
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      const cardsPerPage = getCardsPerPage();
      const maxIndex = Math.max(0, activeFilteredReviews.length - cardsPerPage);
      if (maxIndex <= 0) return;

      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updatePosition();
    }, 4000);
  };

  const stopAutoplay = () => {
    clearInterval(autoPlayInterval);
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  reviewsViewport.addEventListener('mouseenter', (e) => {
    if (e.pointerType !== 'touch') {
      stopAutoplay();
    }
  });

  reviewsViewport.addEventListener('mouseleave', () => {
    if (isAutoplayPlaying) {
      startAutoplay();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else if (isAutoplayPlaying) {
      startAutoplay();
    }
  });

  autoplayToggle?.addEventListener('click', () => {
    isAutoplayPlaying = !isAutoplayPlaying;
    if (isAutoplayPlaying) {
      autoplayToggle.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pause Auto-play</span>';
      startAutoplay();
    } else {
      autoplayToggle.innerHTML = '<i class="fa-solid fa-play"></i> <span>Resume Auto-play</span>';
      stopAutoplay();
    }
  });

  window.addEventListener('resize', () => {
    updatePosition();
    renderDots();
  });

  renderCarousel();
  startAutoplay();
}

/* --------------------------------------------------------------------------
   14. DYNAMIC SUITES & BEDROOMS ENGINE
   -------------------------------------------------------------------------- */
const DEFAULT_SUITES = [
  {
    id: 'suite-1bhk',
    badge: 'Popular for Business & Medical',
    badgeType: '',
    title: '1 BHK Executive Apartment',
    tagline: 'Ideal for 1-3 Guests • High Speed WiFi',
    desc: 'A private fully-furnished 1 BHK suite featuring a serene AC Master Bedroom, an inviting living room lounge, private washroom, and an attached kitchenette.',
    guests: '1-3 Guests',
    size: '650 sq. ft.',
    imgKey: 'gallery-1',
    imgUrl: '',
    price: '₹1,999 / night',
    features: ['1 AC King Master Bedroom', 'Living Lounge with LED TV', 'Kitchenette & RO Purifier', 'High-Speed Wi-Fi & Work Desk']
  },
  {
    id: 'suite-2bhk',
    badge: 'Most Popular for Families',
    badgeType: 'featured',
    title: '2 BHK Deluxe Family Suite',
    tagline: 'Ideal for 4-6 Guests • Spacious Living',
    desc: 'Spacious 2 BHK family suite equipped with two air-conditioned bedrooms, large living room with sofa set, dining area, balcony views, and full kitchen.',
    guests: '4-6 Guests',
    size: '1,100 sq. ft.',
    imgKey: 'gallery-2',
    imgUrl: '',
    price: '₹2,999 / night',
    features: ['2 AC Bedrooms + 2 Washrooms', 'Expansive Living & Dining Room', 'Fully Equipped Kitchen', 'Private Balcony with City View']
  },
  {
    id: 'suite-3bhk',
    badge: 'Grand Stays & Groups',
    badgeType: '',
    title: '3 BHK Royal Grand Suite',
    tagline: 'Ideal for 6-10 Guests • Luxury Living',
    desc: 'Our flagship 3 BHK luxury apartment offering 3 air-conditioned bedrooms, opulent living hall, full kitchen setup, and premium furnishings for large families or groups.',
    guests: '6-10 Guests',
    size: '1,550 sq. ft.',
    imgKey: 'gallery-3',
    imgUrl: '',
    price: '₹4,499 / night',
    features: ['3 AC Master Bedrooms', '3 Washrooms + Premium Toiletries', 'Grand Living Hall & 6-Seat Dining', 'Full Modular Kitchen + Washing Area']
  }
];

function getSuites() {
  const saved = localStorage.getItem('E2_CUSTOM_SUITES');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) {
      console.warn('Failed to parse saved suites:', e);
    }
  }
  return DEFAULT_SUITES;
}

function renderSiteSuites() {
  const grid = document.getElementById('apartmentsGrid');
  if (!grid) return;

  const suites = getSuites();
  if (!suites || !suites.length) return;

  grid.innerHTML = '';
  const siteImages = typeof getActiveSiteImages === 'function' ? getActiveSiteImages() : {};

  suites.forEach((suite, idx) => {
    let keyToUse = suite.imgKey || ('gallery-' + ((idx % 8) + 1));
    if (keyToUse === 'livingRoom') keyToUse = 'gallery-1';
    if (keyToUse === 'bedroom') keyToUse = 'gallery-2';
    if (keyToUse === 'masterBedroom') keyToUse = 'gallery-3';

    let imgSrc = suite.imgUrl || siteImages[keyToUse]?.url || siteImages['gallery-1']?.url || './assets/real-red-sofa-living.svg';
    if (imgSrc && imgSrc.startsWith('/assets/')) imgSrc = '.' + imgSrc;

    const isFeatured = suite.badgeType === 'featured';
    const card = document.createElement('div');
    card.className = `apartment-card ${isFeatured ? 'apt-featured' : ''} animate-on-scroll animated`;
    
    let featuresList = [];
    if (Array.isArray(suite.features)) {
      featuresList = suite.features;
    } else if (typeof suite.features === 'string') {
      featuresList = suite.features.split(',').map(f => f.trim()).filter(Boolean);
    }

    const featuresHtml = featuresList.map(f => `<span><i class="fa-solid fa-check"></i> ${f}</span>`).join('');
    const encodedMsg = encodeURIComponent(`Hello E2 Homes, I want to inquire about booking the ${suite.title}.`);

    card.innerHTML = `
      <div class="apt-header">
        <span class="apt-badge ${isFeatured ? 'badge-popular' : ''}">
          <i class="fa-solid ${isFeatured ? 'fa-fire' : 'fa-house'}"></i> ${suite.badge || suite.title}
        </span>
      </div>
      <div class="apt-image-box">
        <img src="${imgSrc}" data-img-key="${keyToUse}" alt="${suite.title} - E2 Homes" class="apt-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='./assets/real-red-sofa-living.svg';">
      </div>
      <div class="apt-body">
        <h3>${suite.title}</h3>
        <p class="apt-location"><i class="fa-solid fa-location-dot" style="color: var(--color-gold);"></i> Empresia Elite, Sector 8A Kamal Vihar</p>
        <p class="apt-desc">${suite.desc || suite.tagline || ''}</p>
        <div class="apt-features-list">
          ${featuresHtml}
        </div>
      </div>
      <div class="apt-footer">
        <a href="https://wa.me/919301154606?text=${encodedMsg}" target="_blank" rel="noopener noreferrer" class="btn ${isFeatured ? 'btn-gold' : 'btn-whatsapp'} w-full">
          <i class="fa-brands fa-whatsapp"></i> Inquire ${suite.title}
        </a>
      </div>
    `;
    grid.appendChild(card);
  });

  if (typeof initScrollAnimations === 'function') {
    initScrollAnimations();
  }
}


