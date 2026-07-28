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
*Guests:* ${guests || '1'}
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
  const animElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    animElements.forEach(el => el.classList.add('animated'));
  }
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
  const HOST_PIN = '9301'; // Default Host PIN matching phone prefix
  const triggerBtns = document.querySelectorAll('.open-image-manager');
  const modal = document.getElementById('imageManagerModal');
  const closeBtn = document.querySelector('.image-manager-close');
  const overlay = document.querySelector('.image-manager-overlay');
  const container = document.getElementById('imageManagerList');
  const saveBtn = document.getElementById('saveImagesBtn');
  const resetBtn = document.getElementById('resetImagesBtn');
  const exportBtn = document.getElementById('exportConfigBtn');
  const lockHostBtn = document.getElementById('lockHostBtn');

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
    if (enteredPin === HOST_PIN || enteredPin === '1234') { // Allow 9301 or 1234 as valid host PINs
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

  // Logout Host
  lockHostBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('E2_HOST_AUTH');
    localStorage.removeItem('E2_HOST_AUTH');
    updateHostControlsVisibility();
    closeImageModal();
    showToast('Host session logged out', 'info');
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

  // Render Image Fields Grouped by Category
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
        const card = document.createElement('div');
        card.className = 'img-mgr-card';
        card.innerHTML = `
          <div class="img-mgr-thumb">
            <img src="${item.url}" id="preview-${item.key}" alt="${item.label}" referrerpolicy="no-referrer" onerror="this.src='https://via.placeholder.com/150?text=Invalid+Image'">
          </div>
          <div class="img-mgr-info">
            <label class="img-mgr-label" for="input-${item.key}">${item.label}</label>
            <div class="img-mgr-input-group">
              <input type="text" id="input-${item.key}" class="img-mgr-input" data-key="${item.key}" value="${item.url}" placeholder="Paste Image URL or /assets/filename.jpg">
              <label class="btn btn-outline-forest btn-sm img-mgr-file-btn">
                <i class="fa-solid fa-upload"></i> Upload
                <input type="file" accept="image/*" class="img-mgr-file-input" data-key="${item.key}" style="display:none;">
              </label>
            </div>
          </div>
        `;

        container.appendChild(card);

        // Bind input URL live preview update
        const urlInput = card.querySelector(`#input-${item.key}`);
        const previewImg = card.querySelector(`#preview-${item.key}`);
        urlInput?.addEventListener('input', (e) => {
          previewImg.src = e.target.value;
        });

        // Helper: Compress & Downscale Uploaded Images to fit in localStorage
        const compressAndConvertImage = (file, callback) => {
          const maxWidth = 1200;
          const maxHeight = 1200;
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

              // Convert to optimized JPEG data URL
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
              callback(compressedDataUrl);
            };

            img.onerror = function() {
              callback(evt.target.result);
            };

            img.src = evt.target.result;
          };

          reader.readAsDataURL(file);
        };

        // Bind File Upload -> Auto-Compress Base64 Data URL converter
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

  // Save changes to LocalStorage and apply
  saveBtn?.addEventListener('click', () => {
    const customMap = {};
    const inputs = container.querySelectorAll('.img-mgr-input');
    inputs.forEach(input => {
      const key = input.getAttribute('data-key');
      const val = input.value.trim();
      if (key && val) {
        customMap[key] = val;
      }
    });

    // Try saving to LocalStorage with fallback if quota is exceeded
    try {
      localStorage.setItem('E2_CUSTOM_SITE_IMAGES', JSON.stringify(customMap));
    } catch (e) {
      console.warn('LocalStorage quota limit reached, applying live in session memory:', e);
    }

    // Always update global window map for immediate live display
    if (window.DEFAULT_SITE_IMAGES) {
      Object.keys(customMap).forEach(k => {
        if (window.DEFAULT_SITE_IMAGES[k]) {
          window.DEFAULT_SITE_IMAGES[k].url = customMap[k];
        }
      });
    }

    if (typeof applySiteImages === 'function') {
      applySiteImages();
    }
    showToast('All site images updated and applied successfully!', 'success');
    closeImageModal();
  });

  // Reset to default original images
  resetBtn?.addEventListener('click', () => {
    if (confirm('Reset all site images back to their original defaults?')) {
      localStorage.removeItem('E2_CUSTOM_SITE_IMAGES');
      if (typeof applySiteImages === 'function') {
        applySiteImages();
      }
      showToast('Images restored to defaults', 'info');
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


