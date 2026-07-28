/**
 * E2 HOMES RAIPUR - CENTRALIZED SITE IMAGE CONFIGURATION
 * 
 * Hosting Instructions:
 * - To change images permanently when hosting:
 *   1. Upload your new photo files to the `/assets/` directory (e.g. `/assets/my-bedroom.jpg`).
 *   2. Update the image URLs below in `DEFAULT_SITE_IMAGES`.
 *   3. Or use the built-in "Edit Images" button on the website to swap image URLs / upload files interactively!
 */

window.DEFAULT_SITE_IMAGES = {
  // Hero Fullscreen Slider Images
  "hero-slide-1": {
    category: "Hero Slider",
    label: "Slide 1: Red Velvet Living Lounge",
    url: "./assets/real-red-sofa-living.svg"
  },
  "hero-slide-2": {
    category: "Hero Slider",
    label: "Slide 2: Olive Green Velvet Lounge",
    url: "./assets/real-green-sofa-living.svg"
  },
  "hero-slide-3": {
    category: "Hero Slider",
    label: "Slide 3: Classic Teak Floral Lounge",
    url: "./assets/real-floral-sofa-living.svg"
  },
  "hero-slide-4": {
    category: "Hero Slider",
    label: "Slide 4: Master Suite Bedroom",
    url: "./assets/real-master-bedroom.svg"
  },

  // About Section Images
  "about-primary": {
    category: "About Section",
    label: "Main Living Area Photo",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
  },
  "about-secondary": {
    category: "About Section",
    label: "Cozy Guest Bedroom Photo",
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80"
  },

  // Gallery Photos
  "gallery-1": {
    category: "Photo Gallery",
    label: "Living Room 1 - Red Velvet Sofa",
    url: "./assets/real-red-sofa-living.svg"
  },
  "gallery-2": {
    category: "Photo Gallery",
    label: "Living Room 2 - Olive Green Velvet",
    url: "./assets/real-green-sofa-living.svg"
  },
  "gallery-3": {
    category: "Photo Gallery",
    label: "Living Room 3 - Teak Floral Sofa",
    url: "./assets/real-floral-sofa-living.svg"
  },
  "gallery-4": {
    category: "Photo Gallery",
    label: "Bedroom 1 - Master Suite Bed",
    url: "./assets/real-master-bedroom.svg"
  },
  "gallery-5": {
    category: "Photo Gallery",
    label: "Kitchen - Modular Kitchen Setup",
    url: "./assets/real-kitchen-dining.svg"
  },
  "gallery-6": {
    category: "Photo Gallery",
    label: "Bedroom 2 - Executive Guest Room",
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80"
  },
  "gallery-7": {
    category: "Photo Gallery",
    label: "Washroom - Clean Modern Bathroom",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
  },
  "gallery-8": {
    category: "Photo Gallery",
    label: "Dining - Dining Table Setup",
    url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80"
  }
};

/**
 * Get current active image mapping (Merging Defaults with LocalStorage Overrides)
 */
function getActiveSiteImages() {
  const customStr = localStorage.getItem('E2_CUSTOM_SITE_IMAGES');
  let customMap = {};
  if (customStr) {
    try {
      customMap = JSON.parse(customStr);
    } catch (e) {
      console.error("Could not parse saved custom images", e);
    }
  }

  const activeMap = {};
  Object.keys(window.DEFAULT_SITE_IMAGES).forEach(key => {
    const defaultItem = window.DEFAULT_SITE_IMAGES[key];
    const customVal = customMap[key];
    
    let url = defaultItem.url;
    let label = defaultItem.label;

    if (typeof customVal === 'string') {
      url = customVal;
    } else if (customVal && typeof customVal === 'object') {
      if (customVal.url) url = customVal.url;
      if (customVal.label) label = customVal.label;
    }

    if (url && typeof url === 'string') {
      if (url.startsWith('/assets/')) {
        url = '.' + url;
      } else if (url.startsWith('assets/')) {
        url = './' + url;
      }
    }

    activeMap[key] = {
      ...defaultItem,
      url: url,
      label: label
    };
  });

  return activeMap;
}

/**
 * Apply site images and names to DOM elements
 */
function applySiteImages() {
  const imagesMap = getActiveSiteImages();
  
  Object.keys(imagesMap).forEach(key => {
    const item = imagesMap[key];
    if (!item) return;

    const imgElements = document.querySelectorAll(`img[data-img-key="${key}"]`);
    imgElements.forEach(img => {
      if (item.url) {
        img.src = item.url;
        img.setAttribute('src', item.url);
      }
      if (item.label) {
        img.alt = item.label;
      }

      // If wrapped in a gallery lightbox anchor, update lightbox link target as well
      const parentAnchor = img.closest('a');
      if (parentAnchor && item.url) {
        parentAnchor.href = item.url;
        parentAnchor.setAttribute('href', item.url);
      }
    });

    // Update any label / caption elements bound to this image key
    const labelElements = document.querySelectorAll(`[data-label-key="${key}"]`);
    labelElements.forEach(el => {
      if (item.label) el.textContent = item.label;
    });
  });
}

// Auto apply images and property info as soon as DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    applySiteImages();
    applySiteInfo();
  });
} else {
  applySiteImages();
  applySiteInfo();
}

window.DEFAULT_SITE_INFO = {
  propertyName: "E2 Homes Raipur",
  tagline: "Raipur • Homestay",
  address: "Empresia Elite, Sector 8A, Kamal Vihar, Raipur",
  phone: "+91 93011 54606",
  whatsapp: "919301154606"
};

function getSiteInfo() {
  const customStr = localStorage.getItem('E2_CUSTOM_SITE_INFO');
  if (customStr) {
    try {
      return { ...window.DEFAULT_SITE_INFO, ...JSON.parse(customStr) };
    } catch (e) {
      console.error("Could not parse saved site info", e);
    }
  }
  return { ...window.DEFAULT_SITE_INFO };
}

function applySiteInfo() {
  const info = getSiteInfo();

  // 1. Property Name
  if (info.propertyName) {
    document.querySelectorAll('.logo-title').forEach(el => el.textContent = info.propertyName);
    const heroTitleSpan = document.querySelector('.hero-title span');
    if (heroTitleSpan) heroTitleSpan.textContent = info.propertyName;
    document.title = `${info.propertyName} | Premium Serviced Homestay near Kamal Vihar`;
  }

  // 2. Tagline
  if (info.tagline) {
    document.querySelectorAll('.logo-tagline').forEach(el => el.textContent = info.tagline);
  }

  // 3. Phone Number
  if (info.phone) {
    const rawTel = 'tel:' + info.phone.replace(/[^+0-9]/g, '');
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      a.href = rawTel;
      
      // If link contains a .hide-mobile-xs span, preserve it!
      const hideSpan = a.querySelector('.hide-mobile-xs');
      if (hideSpan) {
        // Keep header button markup intact: <i class="..."></i> <span class="hide-mobile-xs">Call Now</span>
        return;
      }

      // If it's a direct text link without child elements
      if (!a.children.length) {
        a.textContent = info.phone;
        return;
      }

      // If it has children (like an icon)
      const textNodes = Array.from(a.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
      textNodes.forEach(node => {
        if (node.textContent.match(/(\+91|93011|\d{10})/)) {
          node.textContent = node.textContent.replace(/(\+91\s?\d{5}\s?\d{5}|\d{10})/g, info.phone);
        }
      });
    });
  }

  // 4. WhatsApp Number
  if (info.whatsapp) {
    const cleanWa = info.whatsapp.replace(/[^0-9]/g, '');
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
      const currentHref = a.getAttribute('href') || '';
      const textMatch = currentHref.match(/\?text=(.*)/);
      const textParam = textMatch ? textMatch[0] : '';
      a.href = `https://wa.me/${cleanWa}${textParam}`;
    });
  }
}

window.getSiteInfo = getSiteInfo;
window.applySiteInfo = applySiteInfo;
window.getActiveSiteImages = getActiveSiteImages;
window.applySiteImages = applySiteImages;

