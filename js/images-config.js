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
    url: "/assets/real-red-sofa-living.svg"
  },
  "hero-slide-2": {
    category: "Hero Slider",
    label: "Slide 2: Olive Green Velvet Lounge",
    url: "/assets/real-green-sofa-living.svg"
  },
  "hero-slide-3": {
    category: "Hero Slider",
    label: "Slide 3: Classic Teak Floral Lounge",
    url: "/assets/real-floral-sofa-living.svg"
  },
  "hero-slide-4": {
    category: "Hero Slider",
    label: "Slide 4: Master Suite Bedroom",
    url: "/assets/real-master-bedroom.svg"
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
    url: "/assets/real-red-sofa-living.svg"
  },
  "gallery-2": {
    category: "Photo Gallery",
    label: "Living Room 2 - Olive Green Velvet",
    url: "/assets/real-green-sofa-living.svg"
  },
  "gallery-3": {
    category: "Photo Gallery",
    label: "Living Room 3 - Teak Floral Sofa",
    url: "/assets/real-floral-sofa-living.svg"
  },
  "gallery-4": {
    category: "Photo Gallery",
    label: "Bedroom 1 - Master Suite Bed",
    url: "/assets/real-master-bedroom.svg"
  },
  "gallery-5": {
    category: "Photo Gallery",
    label: "Kitchen - Modular Kitchen Setup",
    url: "/assets/real-kitchen-dining.svg"
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
    activeMap[key] = {
      ...window.DEFAULT_SITE_IMAGES[key],
      url: customMap[key] || window.DEFAULT_SITE_IMAGES[key].url
    };
  });

  return activeMap;
}

/**
 * Apply site images to DOM elements
 */
function applySiteImages() {
  const imagesMap = getActiveSiteImages();
  
  Object.keys(imagesMap).forEach(key => {
    const imgElements = document.querySelectorAll(`img[data-img-key="${key}"]`);
    const newUrl = imagesMap[key] ? imagesMap[key].url : null;
    
    if (!newUrl) return;

    imgElements.forEach(img => {
      img.src = newUrl;
      img.setAttribute('src', newUrl);

      // If wrapped in a gallery lightbox anchor, update lightbox link target as well
      const parentAnchor = img.closest('a');
      if (parentAnchor) {
        parentAnchor.href = newUrl;
        parentAnchor.setAttribute('href', newUrl);
      }
    });
  });
}

// Auto apply images as soon as DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applySiteImages);
} else {
  applySiteImages();
}
