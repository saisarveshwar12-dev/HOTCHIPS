// Simple particle background animation
(function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const colors = ['#ffde7d', '#ff9a3c', '#ff4b5c', '#ffc857'];

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resize);
  resize();

  const COUNT = 40;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    });
    // Optimized to roughly 30fps for performance
    setTimeout(() => {
      requestAnimationFrame(tick);
    }, 33);
  }

  tick();
})();

// Navigation toggle for mobile
(function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
})();

// Scroll animations
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window) || !elements.length) {
    elements.forEach((el) => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  elements.forEach((el) => observer.observe(el));
})();

// Cart + products helpers
const STORAGE_KEYS = {
  PRODUCTS: 'sb_hotchips_products',
  CART: 'sb_hotchips_cart',
  ORDER: 'sb_hotchips_last_order',
  DISTANCE_KM: 'sb_hotchips_distance_km',
  ADMIN_SESSION: 'sb_hotchips_admin_session',
  USERS: 'sb_hotchips_users',
  CURRENT_USER: 'sb_hotchips_current_user',
  ORDER_HISTORY: 'sb_hotchips_order_history',
  WISHLIST: 'sb_hotchips_wishlist',
  REVIEWS: 'sb_hotchips_reviews',
  LOYALTY: 'sb_hotchips_loyalty',
};

// Weight-based category constants
const WEIGHT_BASED_CATEGORIES = ['chips', 'fryums', 'murukku', 'mixture', 'sweets'];

function isWeightBased(product) {
  if (!product || !product.tag) return false;
  return WEIGHT_BASED_CATEGORIES.includes(product.tag.toLowerCase());
}

function formatQuantity(pid, qty) {
  const products = getStoredProducts();
  const p = products.find(p => p.id === pid);
  if (!p) return qty; // Combos or unknown
  if (p.isAvailable === false) return qty;
  // Others/Biscuits are usually per piece or pack, Chips are per 100g
  const tag = (p.tag || '').toLowerCase();
  if (tag === 'chips' || tag === 'mixture' || tag === 'murukku') {
    return (qty * 100) + 'g';
  }
  return qty;
}

// Update these shop coordinates if needed (Keelkattalai, Chennai)
const SHOP_LOCATION = {
  lat: 12.9648,
  lon: 80.1882,
};

const defaultProducts = [
  // CHIPS
  { id: 'potato-chips-salt', name: 'Potato chips (salt)', price: 100, image: 'images/potato salt chips.jpeg', tag: 'Chips' },
  { id: 'potato-chips-spicy', name: 'Potato chips (spicy)', price: 100, image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'lays-tomato', name: 'Lays (tomato flavour)', price: 100, image: 'images/lays chips.jpeg', tag: 'Chips' },
  { id: 'potato-masala-chips', name: 'Potato masala chips', price: 100, image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'potato-finger-masala', name: 'Potato finger masala chips', price: 100, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'potato-masala-pudhina', name: 'Potato masala chips (pudhina flavour)', price: 100, image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'nendram-chips', name: 'Nendram chips', price: 100, image: 'images/nendram chips.jpeg', tag: 'Chips' },
  { id: 'vaazhakai-chips', name: 'Vaazhakai chips', price: 100, image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'vaazhai-thandu-chips', name: 'Vaazhai thandu chips', price: 100, image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'maravalli-chips', name: 'Maravalli chips', price: 100, image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'maravalli-finger-chips', name: 'Maravalli finger chips', price: 100, image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'pala-chips', name: 'Pala chips', price: 100, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'carrot-chips', name: 'Carrot chips', price: 100, image: 'https://images.unsplash.com/photo-1590779033100-9f60485a2b3d?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'ladys-finger-chips', name: 'Ladys finger chips', price: 100, image: 'https://images.unsplash.com/photo-1590779033100-9f60485a2b3d?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'bitterguard-chips', name: 'Bitterguard chips', price: 100, image: 'https://images.unsplash.com/photo-1590779033100-9f60485a2b3d?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },
  { id: 'picnic', name: 'Picnic', price: 100, image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?q=80&w=1000&auto=format&fit=crop', tag: 'Chips' },

  // FRYUMS
  { id: 'wheel-chips', name: 'Wheel chips (salt/spicy)', price: 80, image: 'images/wheel fryums salt.jpeg', tag: 'Fryums' },
  { id: 'triangle-chips', name: 'Triangle chips (salt/spicy)', price: 80, image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?q=80&w=1000&auto=format&fit=crop', tag: 'Fryums' },
  { id: 'corn-fryum', name: 'Corn', price: 80, image: 'images/corn.jpeg', tag: 'Fryums' },
  { id: 'lays-fryum', name: 'Lays fryum', price: 80, image: 'images/lays fryum.jpeg', tag: 'Fryums' },
  { id: 'finger-fryum', name: 'Finger fryum', price: 80, image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?q=80&w=1000&auto=format&fit=crop', tag: 'Fryums' },
  { id: 'twister-fryum', name: 'Twister fryum', price: 80, image: 'images/twister fryum.jpeg', tag: 'Fryums' },
  { id: 'onion-fryum', name: 'Onion fryum', price: 80, image: 'images/onion fryum salt.jpeg', tag: 'Fryums' },
  { id: 'garlic-fryum', name: 'Garlic fryum', price: 80, image: 'images/garlic fryum salt.jpeg', tag: 'Fryums' },
  { id: 'cheese-ball', name: 'Cheese ball', price: 80, image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?q=80&w=1000&auto=format&fit=crop', tag: 'Fryums' },
  { id: 'corn-puff', name: 'Corn puff', price: 80, image: 'images/corn puff.jpeg', tag: 'Fryums' },

  // MURUKKU ITEMS
  { id: 'thaen-kuzhal-murukku', name: 'Thaen kuzhal murukku', price: 120, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop', tag: 'Murukku' },
  { id: 'thaenga-pal-murukku', name: 'Thaenga pal murukku', price: 120, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop', tag: 'Murukku' },
  { id: 'mullu-murukku', name: 'Mullu murukku', price: 120, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop', tag: 'Murukku' },
  { id: 'classic-murukku', name: 'Murukku', price: 120, image: 'images/butter murkuu.jpeg', tag: 'Murukku' },
  { id: 'garlic-murukku', name: 'Garlic murukku', price: 120, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop', tag: 'Murukku' },
  { id: 'thattai', name: 'Thattai', price: 120, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop', tag: 'Murukku' },
  { id: 'pepper-thattai', name: 'Pepper thattai', price: 120, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop', tag: 'Murukku' },
  { id: 'maida-thattai', name: 'Maida thattai', price: 120, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop', tag: 'Murukku' },
  { id: 'achu-murukku', name: 'Achu murukku', price: 120, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=1000&auto=format&fit=crop', tag: 'Murukku' },

  // BREAD
  { id: 'bread', name: 'Bread', price: 40, image: 'images/milk bread.jpeg', tag: 'Bread' },
  { id: 'jam-bun', name: 'Jam bun', price: 30, image: 'images/bun butter jam.jpeg', tag: 'Bread' },
  { id: 'frooti-cream-bun', name: 'Frooti cream bun', price: 30, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop', tag: 'Bread' },
  { id: 'cup-cake', name: 'Cup cake', price: 20, image: 'images/cup cake.jpeg', tag: 'Bread' },

  // MIXTURES
  { id: 'avul-mixture', name: 'Avul mixture', price: 110, image: 'images/avul mixture.jpeg', tag: 'Mixture' },
  { id: 'kerala-mixture', name: 'Kerala mixture', price: 110, image: 'https://images.unsplash.com/photo-1505575967455-40e256f7377c?q=80&w=1000&auto=format&fit=crop', tag: 'Mixture' },
  { id: 'special-mixture', name: 'Special mixture', price: 110, image: 'images/speical mixture.jpeg', tag: 'Mixture' },
  { id: 'kaaraboondhi', name: 'Kaaraboondhi', price: 110, image: 'images/kaaraboondi.jpeg', tag: 'Mixture' },
  { id: 'ompodi', name: 'Ompodi', price: 110, image: 'images/om podi.jpeg', tag: 'Mixture' },
  { id: 'milagu-saev', name: 'Milagu saev', price: 110, image: 'images/milagu sev.jpeg', tag: 'Mixture' },
  { id: 'om-saev', name: 'Om saev', price: 110, image: 'https://images.unsplash.com/photo-1505575967455-40e256f7377c?q=80&w=1000&auto=format&fit=crop', tag: 'Mixture' },
  { id: 'ribbon-saev', name: 'Ribbon saev', price: 110, image: 'images/ribbon pakoda.jpeg', tag: 'Mixture' },
  { id: 'masala-kadalai', name: 'Masala kadalai', price: 110, image: 'images/masala kadalai.jpeg', tag: 'Mixture' },
  { id: 'masala-oil-peanut', name: 'Masala oil peanut', price: 110, image: 'images/masala oil kadalai.jpeg', tag: 'Mixture' },
  { id: 'butter-murukku', name: 'Butter murukku', price: 110, image: 'images/butter murkuu.jpeg', tag: 'Mixture' },
  { id: 'dal', name: 'Dal', price: 110, image: 'https://images.unsplash.com/photo-1505575967455-40e256f7377c?q=80&w=1000&auto=format&fit=crop', tag: 'Mixture' },
  { id: 'uppu-kadalai', name: 'Uppu kadalai', price: 110, image: 'images/uppu kadalai.jpeg', tag: 'Mixture' },
  { id: 'green-pattani', name: 'Green pattani', price: 110, image: 'images/green pattani.jpeg', tag: 'Mixture' },
  { id: 'navadhaaniyam', name: 'Navadhaaniyam', price: 110, image: 'images/navadhaniyam.jpeg', tag: 'Mixture' },

  // SWEETS
  { id: 'gulab-jamun', name: 'Gulab jamun', price: 150, image: 'images/gulab jamun.jpeg', tag: 'Sweets' },
  { id: 'tirunelveli-alwa', name: 'Tirunelveli alwa', price: 150, image: 'https://images.unsplash.com/photo-1589119137048-232a5df97793?q=80&w=1000&auto=format&fit=crop', tag: 'Sweets' },
  { id: 'muscoth-alwa', name: 'Muscoth alwa', price: 150, image: 'images/muscoth halwa.jpeg', tag: 'Sweets' },
  { id: 'wheat-alwa', name: 'Wheat alwa', price: 150, image: 'images/wheat halwa.jpeg', tag: 'Sweets' },
  { id: 'rasagulla', name: 'Rasagulla', price: 150, image: 'images/rasagulla.jpeg', tag: 'Sweets' },
  { id: 'soan-papudi', name: 'Soan papudi', price: 150, image: 'images/soan papudi.jpeg', tag: 'Sweets' },
  { id: 'poli-dal', name: 'Poli (dal)', price: 150, image: 'images/parupu poli.jpeg', tag: 'Sweets' },
  { id: 'macroons', name: 'Macroons', price: 150, image: 'https://images.unsplash.com/photo-1558326527-f7be2242044e?q=80&w=1000&auto=format&fit=crop', tag: 'Sweets' },
  { id: 'appam', name: 'Appam', price: 150, image: 'https://images.unsplash.com/photo-1593560704563-f1118256248c?q=80&w=1000&auto=format&fit=crop', tag: 'Sweets' },
  { id: 'palkova', name: 'Palkova', price: 150, image: 'images/paalkova.jpeg', tag: 'Sweets' },
  { id: 'coconut-burfi-balls', name: 'Coconut burfi (in balls)', price: 150, image: 'images/round coconut burfi.jpeg', tag: 'Sweets' },
  { id: 'thaen-mittai', name: 'Thaen mittai', price: 150, image: 'images/thaen mittai.jpeg', tag: 'Sweets' },
  { id: 'athurasam', name: 'Athurasam', price: 150, image: 'images/adhirasam.jpeg', tag: 'Sweets' },
  { id: 'somasu', name: 'Somasu', price: 150, image: 'images/somasu.jpeg', tag: 'Sweets' },

  // OTHERS
  { id: 'pori-urundai', name: 'Pori urundai', price: 60, image: 'images/pori urundai.jpeg', tag: 'Others' },
  { id: 'corn-urndai', name: 'Corn urndai', price: 60, image: 'images/corn urundai.jpeg', tag: 'Others' },
  { id: 'peanut-urundai', name: 'Peanut urundai', price: 60, image: 'images/peanut urundai.jpeg', tag: 'Others' },
  { id: 'udacha-kadailai-urundai', name: 'Udacha kadailai urundai', price: 60, image: 'images/udacha kadalai urundai.jpeg', tag: 'Others' },
  { id: 'yellu-urundai', name: 'Yellu urundai (black/white)', price: 60, image: 'images/ellu urundai black.jpeg', tag: 'Others' },
  { id: 'burfi', name: 'Burfi', price: 60, image: 'https://images.unsplash.com/photo-1547014762-3a94fb4df40a?q=80&w=1000&auto=format&fit=crop', tag: 'Others' },
  { id: 'rava-laddu', name: 'Rava laddu', price: 60, image: 'images/ravva laddu.jpeg', tag: 'Others' },
  { id: 'coconut-burfi-sugar', name: 'Coconut burfi (sugar)', price: 60, image: 'images/sugar coconut burfi.jpeg', tag: 'Others' },
  { id: 'coconut-burfi-jaggery', name: 'Coconut burfi (jaggery)', price: 60, image: 'images/jaggery coconut burfi.jpeg', tag: 'Others' },
  { id: 'pop-corn', name: 'Pop corn', price: 40, image: 'images/pop corn.jpeg', tag: 'Others' },
  { id: 'masala-pori', name: 'Masala pori', price: 40, image: 'images/masala pori.jpeg', tag: 'Others' },

  // BISCUITS
  { id: 'butter-biscuit', name: 'Butter biscuit', price: 80, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop', tag: 'Biscuit' },
  { id: 'ragi-biscuit', name: 'Ragi biscuit', price: 80, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop', tag: 'Biscuit' },
  { id: 'nei-biscuit', name: 'Nei biscuit', price: 80, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop', tag: 'Biscuit' },
  { id: 'nice-biscuit', name: 'Nice biscuit', price: 80, image: 'images/nice biscuit rs10.jpeg', tag: 'Biscuit' },
  { id: 'coconut-biscuit-mini', name: 'Coconut biscuit (mini size)', price: 80, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop', tag: 'Biscuit' },
  { id: 'malkist', name: 'Malkist (chocolate/cheese)', price: 80, image: 'images/malkist biscuit chocolate.jpeg', tag: 'Biscuit' },
  { id: 'hide-and-seek', name: 'Hide and seek', price: 80, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop', tag: 'Biscuit' },
  { id: 'moms-magic', name: 'Mom’s magic', price: 80, image: 'images/moms magic.jpeg', tag: 'Biscuit' },
  { id: 'nutrichoice', name: 'Nutrichoice', price: 80, image: 'images/nutri choice.jpeg', tag: 'Biscuit' },
  { id: 'mariegold-small', name: 'Mariegold (small)', price: 80, image: 'images/marie gold small.jpeg', tag: 'Biscuit' },
  { id: 'mariegold-large', name: 'Mariegold (large)', price: 80, image: 'images/marie gold large.jpeg', tag: 'Biscuit' },
  { id: 'marielight-active', name: 'Marielight (active)', price: 80, image: 'images/marie light active.jpeg', tag: 'Biscuit' },
  { id: 'marielight-large', name: 'Marielight (large)', price: 80, image: 'images/marie light large.jpeg', tag: 'Biscuit' },
  { id: 'marielight-medium', name: 'Marielight (medium)', price: 80, image: 'images/marie light medium.jpeg', tag: 'Biscuit' },
  { id: 'good-day-butter', name: 'Good day (butter)', price: 80, image: 'images/good day butter cookies.jpeg', tag: 'Biscuit' },
  { id: 'good-day-cashew-large', name: 'Good day (cashew large)', price: 80, image: 'images/good day cashew large.jpeg', tag: 'Biscuit' },
  { id: 'good-day-cashew-small', name: 'Good day (cashew small)', price: 80, image: 'images/goood day cashew small.jpeg', tag: 'Biscuit' },
  { id: 'good-day-choco-chips', name: 'Good day (choco chips)', price: 80, image: 'images/good day choco chips.jpeg', tag: 'Biscuit' },
  { id: 'good-day-pista-badham', name: 'Good day (pista badham)', price: 80, image: 'images/good day pista badham.jpeg', tag: 'Biscuit' },
  { id: 'dark-fantasy', name: 'Dark fantasy', price: 80, image: 'images/dark fantasy.jpeg', tag: 'Biscuit' },
  { id: 'bourbon', name: 'Bourbon', price: 80, image: 'images/hash burbon.jpeg', tag: 'Biscuit' },
  { id: 'treat-choco', name: 'Treat (choco cream)', price: 80, image: 'images/treat choco cream.jpeg', tag: 'Biscuit' },
  { id: 'treat-vanilla', name: 'Treat (vanilla cream)', price: 80, image: 'images/treat venilla cream.jpeg', tag: 'Biscuit' },
  { id: 'jim-jam', name: 'Jim jam', price: 80, image: 'images/jimjam.jpeg', tag: 'Biscuit' },
  { id: 'parle-g', name: 'Parle – G', price: 80, image: 'images/parle g.jpeg', tag: 'Biscuit' },
  { id: 'pure-magic', name: 'Pure magic', price: 80, image: 'images/pure magic.jpeg', tag: 'Biscuit' },
  { id: '50-50', name: '50 50', price: 80, image: 'images/50 50.jpeg', tag: 'Biscuit' },
  { id: 'maska-chaska', name: 'Maska chaska', price: 80, image: 'images/maska chaska.jpeg', tag: 'Biscuit' },
  { id: 'salt-biscuit', name: 'Salt biscuit', price: 80, image: 'images/salt biscuit.jpeg', tag: 'Biscuit' },
  { id: 'lottee-choco-pei', name: 'Lottee choco pei', price: 80, image: 'images/lotte chocopei.jpeg', tag: 'Biscuit' },

  // RUSK
  { id: 'savera-cashew-rusk', name: 'Savera cashew rusk', price: 70, image: 'images/savera cashew rusk.jpeg', tag: 'Rusk' },
  { id: 'savera-milk-rusk', name: 'Savera milk rusk', price: 70, image: 'images/savera rusk.jpeg', tag: 'Rusk' },
  { id: 'parle-milk-rusk', name: 'Parle milk rusk', price: 70, image: 'images/parle milk rusk.jpeg', tag: 'Rusk' },
  { id: 'parle-elachi-rusk', name: 'Parle elachi rusk', price: 70, image: 'images/parle elachi rusk.jpeg', tag: 'Rusk' },
  { id: 'brittania-milk-rusk', name: 'Brittania milk rusk', price: 70, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop', tag: 'Rusk' },
  { id: 'britania-elachi-rush', name: 'Britania elachi rush', price: 70, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop', tag: 'Rusk' },

  // EVENING SPECIALS
  { id: 'orian-pakoda', name: 'Onion pakoda', price: 50, image: 'images/onion pakoda.jpeg', tag: 'Evening' },
  { id: 'cauliflower-pakoda', name: 'Cauliflower pakoda', price: 60, image: 'images/cauliflower.jpeg', tag: 'Evening' },
  { id: 'samosa', name: 'Samosa', price: 15, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000&auto=format&fit=crop', tag: 'Evening' },
  { id: 'cutlet', name: 'Cutlet', price: 20, image: 'images/cutlet.jpeg', tag: 'Evening' },
  { id: 'mini-samosa', name: 'Mini samosa', price: 5, image: 'images/mini samosa.jpeg', tag: 'Evening' },
];

function getStoredProducts() {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!stored) return defaultProducts;
  try {
    let parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.length) return defaultProducts;

    // Auto-Migrate: If products have old paths or placeholders, upgrade them to the current defaultProducts paths
    let changed = false;
    const migrated = parsed.map(p => {
      const def = defaultProducts.find(d => d.id === p.id);
      if (def && p.image !== def.image) {
        changed = true;
        return { ...p, image: def.image };
      }
      return p;
    });

    if (changed) {
      saveProducts(migrated);
      return migrated;
    }

    return parsed;
  } catch {
    return defaultProducts;
  }
}


function saveProducts(products) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

function getCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getDistanceKm() {
  const raw = localStorage.getItem(STORAGE_KEYS.DISTANCE_KM);
  if (!raw) return 0;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function setDistanceKm(km) {
  const value = Number(km);
  const safe = Number.isFinite(value) && value >= 0 ? value : 0;
  localStorage.setItem(STORAGE_KEYS.DISTANCE_KM, String(safe));
}

function getLoyaltyPoints() {
  return Number(localStorage.getItem(STORAGE_KEYS.LOYALTY) || 0);
}

function addLoyaltyPoints(amount) {
  const current = getLoyaltyPoints();
  const added = Math.floor(amount / 100) * 5; // 5 points per 100 spent
  localStorage.setItem(STORAGE_KEYS.LOYALTY, String(current + added));
}

function calcDeliveryCharge(km) {
  const distance = Number(km);
  if (!Number.isFinite(distance) || distance <= 0) return { charge: 0, allowed: true, message: '' };
  
  const charge = Math.ceil(distance) * 10;
  if (distance > 10) {
    return { 
      charge, 
      allowed: false, 
      message: 'Distance exceeds 10km limit for automatic delivery. Please contact us for specialized delivery.' 
    };
  }
  return { charge, allowed: true, message: '' };
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

async function fillDistanceFromGPS(targetInput) {
  if (!targetInput) return;
  if (!('geolocation' in navigator)) {
    alert('GPS not supported in this browser.');
    return;
  }

  const feedback = document.getElementById('distance-feedback');
  if (feedback) feedback.textContent = 'Calculating distance...';
  let rounded = 0;
  targetInput.disabled = true;
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      });
    });

    const user = { lat: pos.coords.latitude, lon: pos.coords.longitude };
    const km = haversineKm(SHOP_LOCATION, user);
    rounded = Math.max(0, Math.round(km * 10) / 10);
    targetInput.value = String(rounded);
    if (feedback) feedback.innerHTML = `✓ Distance from Keelkattalai: <strong>${rounded} km</strong>`;
    setDistanceKm(rounded);
    
    if (rounded > 10) {
      alert('Distance exceeds our standard 10km radius. Please contact us to see if we can deliver to your area.');
    }
    
    targetInput.dispatchEvent(new Event('input', { bubbles: true }));
  } catch (err) {
    const code = err && typeof err === 'object' ? err.code : 0;
    if (code === 1) {
      alert('Location permission denied. Please allow GPS or enter distance manually.');
    } else {
      alert('Unable to fetch GPS location. Please try again or enter distance manually.');
    }
  } finally {
    if (feedback && !rounded) feedback.textContent = '❌ Unable to fetch GPS.';
    targetInput.disabled = false;
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  updateCartBadge();
  updateFloatingCart();
}

function updateFloatingCart() {
  const cart = getCart();
  let floatingBar = document.getElementById('floating-cart-bar');
  
  if (!cart.length) {
    if (floatingBar) floatingBar.classList.remove('active');
    return;
  }

  const products = getStoredProducts();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const p = products.find(prod => prod.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  if (!floatingBar) {
    floatingBar = document.createElement('div');
    floatingBar.id = 'floating-cart-bar';
    floatingBar.className = 'floating-cart-bar';
    floatingBar.onclick = () => window.location.href = 'cart.html';
    document.body.appendChild(floatingBar);
  }

  floatingBar.innerHTML = `
    <div class="cart-info">
      <span>${totalItems} Item${totalItems > 1 ? 's' : ''} | ₹${totalPrice}</span>
      <span>Extra charges may apply</span>
    </div>
    <div class="view-cart">
      VIEW CART 🛒
    </div>
  `;
  
  // Show after a tiny delay for smooth animation
  setTimeout(() => floatingBar.classList.add('active'), 10);
}

// User Auth Helpers
function getUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  updateNavForAuth();
}

function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  updateNavForAuth();
  window.location.href = 'index.html';
}

function updateNavForAuth() {
  const user = getCurrentUser();
  const navs = document.querySelectorAll('.main-nav');
  navs.forEach(nav => {
    // Remove existing dynamic links
    const dynamicTags = nav.querySelectorAll('.nav-auth-dynamic');
    dynamicTags.forEach(tag => tag.remove());

    const loginLink = document.createElement('a');
    loginLink.href = 'login-signup.html';
    loginLink.className = 'nav-link nav-auth-dynamic';
    loginLink.textContent = 'Customer Login';

    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.className = 'nav-link nav-auth-dynamic';
    logoutLink.textContent = 'Logout';
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });

    if (user) {
      // Find where to insert
      const adminLink = nav.querySelector('a[href="admin.html"]');
      if (adminLink) {
        nav.insertBefore(logoutLink, adminLink.nextSibling);
      } else {
        nav.appendChild(logoutLink);
      }
      // Hide login if exists in static HTML (though we'll clean it up)
      const staticLogin = nav.querySelector('a[href="login-signup.html"]');
      if (staticLogin) staticLogin.style.display = 'none';
    } else {
      const adminLink = nav.querySelector('a[href="admin.html"]');
      if (adminLink) {
        nav.insertBefore(loginLink, adminLink);
      } else {
        nav.appendChild(loginLink);
      }
    }
  });
}

function addToCart(productId, quantity = 1) {
  const products = getStoredProducts();
  const product = products.find((p) => p.id === productId);
  
  if (!product) return;


  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  saveCart(cart);
  animateAddToCart();
}

function animateAddToCart() {
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach((badge) => {
    badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 400);
  });
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count-badge');
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  badges.forEach((badge) => {
    badge.textContent = totalQty;
  });

  // Also update any dynamic product actions on the page
  document.querySelectorAll('.product-add[data-product-id]').forEach(container => {
    const pid = container.getAttribute('data-product-id');
    container.innerHTML = renderCartAction(pid);
  });
}

function renderCartAction(productId) {
  const products = getStoredProducts();
  const product = products.find(p => p.id === productId);
  
  if (product && product.isAvailable === false) {
    return `<div class="stock-unavailable">Stock Unavailable</div>`;
  }

  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) {
    return `<button class="btn-add-to-cart swiggy-btn" data-add-to-cart="${productId}">ADD</button>`;
  }
  const qtyDisplay = formatQuantity(productId, item.quantity);
  return `
    <div class="qty-toggle swiggy-toggle">
      <button data-dec="${productId}">−</button>
      <span class="qty-val">${qtyDisplay}</span>
      <button data-inc="${productId}">+</button>
    </div>
  `;
}

function initProductsPage() {
  const list = document.getElementById('product-list');
  if (!list) return;

  // Show Skeleton Loaders first for perceived speed
  list.innerHTML = Array(8).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-img skeleton-box"></div>
      <div class="skeleton-text skeleton-box"></div>
      <div class="skeleton-text skeleton-box" style="width:50%"></div>
      <div class="skeleton-price skeleton-box"></div>
    </div>
  `).join('');

  // Slight delay to simulate data fetching and ensure skeletons are visible
  setTimeout(() => {
    const products = getStoredProducts();
    const query = new URLSearchParams(window.location.search);
    const catFilter = query.get('cat');
    const searchFilter = query.get('q');

    renderProducts(products, catFilter, searchFilter);
    initCategoryFilters(products);
    updateFloatingCart();
  }, 400);
}

// Global click handler for dynamic buttons
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add-to-cart]');
  if (addBtn) {
    const pid = addBtn.getAttribute('data-add-to-cart');
    addToCart(pid, 1);
    return;
  }

  const incBtn = e.target.closest('[data-inc]');
  if (incBtn) {
    const pid = incBtn.getAttribute('data-inc');
    addToCart(pid, 1);
    return;
  }

  const decBtn = e.target.closest('[data-dec]');
  if (decBtn) {
    const pid = decBtn.getAttribute('data-dec');
    removeFromCart(pid, 1);
    return;
  }
});

function removeFromCart(productId, quantity = 1) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === productId);
  if (index === -1) return;

  cart[index].quantity -= quantity;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart(cart);
}

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  updateCartBadge();
  updateNavForAuth();
  initHomeEveningSpecials();
  initProductsPage();
  initAdminPanel();
  initCartPage();
  initCheckoutPage();
  initSuccessPage();
  initAuth();
  initDeliveryDashboard();
  initEngagementFeatures();
});

function initHomeEveningSpecials() {
  const grid = document.querySelector('[data-products-grid="evening-specials"]');
  if (!grid) return;

  const products = getStoredProducts().filter(p => p.tag === 'Evening').slice(0, 4);
  grid.innerHTML = products
    .map(
      (p) => `
      <article class="product-card">
        <div class="product-image-wrap">
          <span class="product-chip">${p.tag || 'Hot'}</span>
          <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1599490659213-e2b9527bb087?q=80&w=400&auto=format&fit=crop'; this.classList.add('image-fallback');" />
        </div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-meta">
            <div class="product-price">₹${p.price} <span>/ 100g </span></div>
            <div class="product-add" data-product-id="${p.id}">
              ${renderCartAction(p.id)}
            </div>
          </div>
        </div>
      </article>
    `
    )
    .join('');

  // No local grid listener needed, using global click handler
}

function initProductsPage() {
  const listEl = document.getElementById('product-list');
  const filterContainer = document.getElementById('category-filters');
  const searchInput = document.getElementById('product-search');
  if (!listEl) return;

  let currentCategory = 'All';
  let searchQuery = '';

  function render() {
    let products = getStoredProducts();
    
    // Filter by Category
    if (currentCategory !== 'All') {
      products = products.filter((p) => {
        const tag = (p.tag || '').toLowerCase();
        const cat = currentCategory.toLowerCase();
        if (cat === 'others') return tag === 'others' || tag === 'custom';
        if (cat === 'biscuit') return tag === 'biscuit';
        return tag === cat;
      });
    }

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.tag && p.tag.toLowerCase().includes(q))
      );
    }

    if (products.length === 0) {
      listEl.innerHTML = `<p class="no-products">No products found${searchQuery ? ` matching "${searchQuery}"` : ''}${currentCategory !== 'All' ? ` in the "${currentCategory}" category` : ''}.</p>`;
      return;
    }

    listEl.innerHTML = products
      .map(
        (p) => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-image-wrap">
          <button class="wishlist-btn ${isInWishlist(p.id) ? 'active' : ''}" data-wishlist="${p.id}">❤</button>
          <span class="product-chip">${p.tag || 'Fresh'}</span>
          <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1599490659213-e2b9527bb087?q=80&w=400&auto=format&fit=crop'; this.classList.add('image-fallback');" />
        </div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-meta">
            <div class="product-price">₹${p.price} <span>/ 100g </span></div>
            <div class="product-add" data-product-id="${p.id}">
              ${renderCartAction(p.id)}
            </div>
          </div>
          <div class="product-rating">
            ${renderStars(getAvgRating(p.id))} <small>(${getReviewCount(p.id)})</small>
          </div>
        </div>
      </article>
    `
      )
      .join('');
      
    // Add Reviews Section to Products Page if applicable
    if (listEl && !document.getElementById('reviews-container')) {
      const revSection = document.createElement('section');
      revSection.id = 'reviews-container';
      revSection.className = 'container reviews-section';
      revSection.innerHTML = `
        <h2>Customer Reviews</h2>
        <div id="reviews-list"></div>
        <div class="add-review glass">
          <h3>Write a Review</h3>
          <div class="star-rating" id="review-stars">
            <span class="star" data-val="1">★</span>
            <span class="star" data-val="2">★</span>
            <span class="star" data-val="3">★</span>
            <span class="star" data-val="4">★</span>
            <span class="star" data-val="5">★</span>
          </div>
          <textarea id="review-text" placeholder="Share your experience..."></textarea>
          <button id="submit-review" class="btn btn-primary">Submit Review</button>
        </div>
      `;
      listEl.parentElement.appendChild(revSection);
      initReviewSystem();
    }
  }

  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Update active state
      filterContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Re-render
      currentCategory = btn.getAttribute('data-category');
      render();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
      
      // If we are on home page and search, redirect to products page or handle locally
      if (document.body.classList.contains('page-home') && searchQuery.length > 0) {
        // Option A: Just filter home products (already handled if elements exist)
        // Option B: Redirect to products page with search query (more common)
        // For this task, let's keep it simple and filter what's there if possible, 
        // but the user wants it to "search products" properly.
      }
    });
  }

  render();

  // No local listener needed, using global click handler
}

function initAdminPanel() {
  const form = document.getElementById('admin-product-form');
  const list = document.getElementById('admin-product-list');
  if (!form || !list) return;

  const authCard = document.getElementById('admin-auth');
  const panel = document.getElementById('admin-panel');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const panelLogoutBtn = document.getElementById('admin-panel-logout');
  const hint = document.getElementById('admin-login-hint');

  const idInput = document.getElementById('admin-product-id');
  const nameInput = document.getElementById('admin-name');
  const priceInput = document.getElementById('admin-price');
  const imageInput = document.getElementById('admin-image');
  const availableInput = document.getElementById('admin-available');
  const saveBtn = document.getElementById('admin-save-btn');
  const resetBtn = document.getElementById('admin-reset-btn');

  const ADMIN_USER = 'balaji';
  const ADMIN_PASS = '1423';
  
  const DELIVERY_USER = 'delivery';
  const DELIVERY_PASS = '1423';

  function isLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === '1' || localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'delivery';
  }

  function isAdmin() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === '1';
  }

  function isDelivery() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'delivery';
  }

  function setLoggedIn(role) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, role === 'admin' ? '1' : (role === 'delivery' ? 'delivery' : '0'));
  }

  function updateAdminVisibility() {
    const logged = isLoggedIn();
    const admin = isAdmin();
    const delivery = isDelivery();

    if (authCard) authCard.style.display = logged ? 'none' : 'block';
    
    if (admin) {
      if (panel) panel.style.display = 'grid';
    } else {
      if (panel) panel.style.display = 'none';
    }

    if (delivery) {
       window.location.href = 'delivery.html';
       return;
    }

    if (logoutBtn) logoutBtn.style.display = logged ? 'inline-flex' : 'none';
    if (!logged) resetForm();
    if (admin) {
      render();
      initAdminAnalytics();
      initTabNavigation();
    }
  }

  function initTabNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.admin-tab-content');
    const tabAnalytics = document.getElementById('tab-analytics');

    // Only Admin can see analytics
    if (tabAnalytics) {
        tabAnalytics.style.display = isAdmin() ? 'inline-block' : 'none';
    }

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        contents.forEach(c => {
          c.style.display = c.id === `tab-content-${target}` ? 'block' : 'none';
        });

        if (target === 'sales-analytics') {
          initAdminAnalytics();
        }
      });
    });
  }

  function render() {
    const products = getStoredProducts();
    list.innerHTML = products
      .map(
        (p) => `
        <div class="admin-product-item" data-id="${p.id}">
          <div class="admin-product-info">
            <img src="${p.image}" class="admin-product-thumb" onerror="this.src='images/placeholder.jpg'; this.onerror=null;" />
            <div class="admin-product-details">
              <span class="admin-product-name">${p.name}</span>
              <span class="admin-product-price">₹${p.price}</span>
              <span class="admin-product-tag">${p.tag || 'Custom'}</span>
              <span class="admin-product-status ${p.isAvailable !== false ? 'available' : 'unavailable'}">
                ${p.isAvailable !== false ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
          <div class="admin-product-controls">
            <button class="admin-btn edit">Edit</button>
            <button class="admin-btn delete">Delete</button>
          </div>
        </div>
      `
      )
      .join('');
  }

  const fileInput = document.getElementById('admin-image-file');

  // Image preview logic
  const previewContainer = document.createElement('div');
  previewContainer.className = 'admin-image-preview';
  previewContainer.style.marginTop = '0.5rem';
  previewContainer.style.display = 'none';
  imageInput.insertAdjacentElement('afterend', previewContainer);

  function setPreview(src) {
    if (src) {
      previewContainer.style.display = 'block';
      previewContainer.innerHTML = `<img src="${src}" style="max-height: 100px; border-radius: 8px;" onerror="this.parentElement.innerHTML='<span style-color:var(--accent-red)>Invalid Image Link</span>';" />`;
    } else {
      previewContainer.style.display = 'none';
    }
  }

  imageInput.addEventListener('input', () => {
    setPreview(imageInput.value.trim());
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        imageInput.value = base64; // Temporarily store in URL field
        setPreview(base64);
      };
      reader.readAsDataURL(file);
    });
  }

  function resetForm() {
    idInput.value = '';
    nameInput.value = '';
    priceInput.value = '';
    imageInput.value = '';
    if (availableInput) availableInput.checked = true;
    if (fileInput) fileInput.value = '';
    previewContainer.style.display = 'none';
    saveBtn.textContent = 'Add Product';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('admin-username')?.value?.trim() || '';
      const password = document.getElementById('admin-password')?.value || '';

      if (username === ADMIN_USER && password === ADMIN_PASS) {
        setLoggedIn('admin');
        if (hint) hint.textContent = '';
        updateAdminVisibility();
      } else if (username === DELIVERY_USER && password === DELIVERY_PASS) {
        setLoggedIn('delivery');
        if (hint) hint.textContent = '';
        updateAdminVisibility();
      } else {
        if (hint) hint.textContent = 'Invalid username or password.';
      }
    });
  }

  function logout() {
    setLoggedIn(false);
    const u = document.getElementById('admin-username');
    const p = document.getElementById('admin-password');
    if (u) u.value = '';
    if (p) p.value = '';
    updateAdminVisibility();
  }

  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  if (panelLogoutBtn) panelLogoutBtn.addEventListener('click', logout);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      alert('Please login as admin to manage products.');
      return;
    }
    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const image = imageInput.value.trim();
    if (!name || !price) return;

    // Create ID from name if not editing
    const id = idInput.value || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);

    // Preserve existing tag if editing, otherwise default to 'Custom'
    const existingProduct = index >= 0 ? products[index] : null;

    const productData = {
      id,
      name,
      price,
      image: image || (existingProduct ? existingProduct.image : `images/products/${id}.jpg`),
      tag: existingProduct ? existingProduct.tag : 'Custom',
      isAvailable: availableInput ? availableInput.checked : true,
    };

    if (index >= 0 && idInput.value) {
      // Editing existing
      products[index] = productData;
    } else {
      // Adding new (ensure unique ID)
      if (products.some(p => p.id === id) && !idInput.value) {
        productData.id = id + '-' + Date.now().toString().slice(-4);
      }
      products.push(productData);
    }

    saveProducts(products);
    render();
    initProductsPage();
    initHomeEveningSpecials();
    resetForm();
    alert('Product saved successfully!');
  });

  list.addEventListener('click', (e) => {
    if (!isLoggedIn()) {
      alert('Please login as admin to manage products.');
      return;
    }
    const item = e.target.closest('.admin-product-item');
    if (!item) return;
    const id = item.getAttribute('data-id');
    const products = getStoredProducts();
    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (e.target.classList.contains('edit')) {
      idInput.value = product.id;
      nameInput.value = product.name;
      priceInput.value = product.price;
      imageInput.value = product.image;
      if (availableInput) availableInput.checked = product.isAvailable !== false;
      imageInput.dispatchEvent(new Event('input')); // Trigger preview
      saveBtn.textContent = 'Update Product';
      window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    } else if (e.target.classList.contains('delete')) {
      if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        const filtered = products.filter((p) => p.id !== id);
        saveProducts(filtered);
        render();
        initProductsPage();
        initHomeEveningSpecials();
      }
    }
  });

  const resetDefaultsBtn = document.getElementById('admin-reset-defaults');
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all products and prices to defaults? This will erase your current modifications.')) {
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        render();
        initProductsPage();
        initHomeEveningSpecials();
        alert('Products reset to defaults. All 100+ items loaded!');
      }
    });
  }

  resetBtn.addEventListener('click', resetForm);
  updateAdminVisibility();
}

function initCartPage() {
  const itemsEl = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const packagingEl = document.getElementById('cart-packaging');
  const deliveryEl = document.getElementById('cart-delivery');
  const totalEl = document.getElementById('cart-total');
  const clearBtn = document.getElementById('clear-cart');
  const distanceInput = document.getElementById('cart-distance');

  if (!itemsEl || !subtotalEl || !packagingEl || !totalEl) return;

  const PACKAGING = 10;

  function render() {
    const products = getStoredProducts();
    const cart = getCart();
    if (!cart.length) {
      itemsEl.innerHTML = '<p>Your cart is empty. Add some crispy snacks from the products page.</p>';
      subtotalEl.textContent = '0';
      packagingEl.textContent = PACKAGING;
      if (deliveryEl) deliveryEl.textContent = '0';
      totalEl.textContent = '0';
      return;
    }

    let subtotal = 0;
    itemsEl.innerHTML = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return '';
        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;
        return `
          <div class="cart-item" data-id="${product.id}">
            <div class="cart-thumb">
              <img src="${product.image}" alt="${product.name}" onerror="this.parentElement.innerHTML='<span>${product.name}</span>';" />
            </div>
            <div class="cart-info">
              <span>${product.name}</span>
              <span class="line">₹${product.price} x ${formatQuantity(product.id, item.quantity)}</span>
              <div class="cart-qty">
                <button data-action="dec">-</button>
                <span>${item.quantity}</span>
                <button data-action="inc">+</button>
              </div>
                <button class="cart-remove" data-action="remove">Remove</button>
                ${product.isAvailable === false ? `<div class="admin-product-status unavailable" style="display:block; margin-top:5px;">Currently Unavailable</div>` : ''}
              </div>
            <div class="cart-price">
              <strong>₹${lineTotal}</strong>
            </div>
          </div>
        `;
      })
      .join('');

    subtotalEl.textContent = subtotal;
    packagingEl.textContent = subtotal ? PACKAGING : 0;
    const km = distanceInput ? Number(distanceInput.value || 0) : getDistanceKm();
    const deliveryRes = subtotal ? calcDeliveryCharge(km) : { charge: 0, allowed: true };
    
    if (deliveryEl) {
      const distanceText = km > 0 ? ` (${km} km)` : '';
      deliveryEl.innerHTML = `${deliveryRes.charge}<small style="font-weight:normal; opacity:0.8; margin-left:4px;">${distanceText}</small>`;
    }
    
    totalEl.textContent = subtotal ? subtotal + PACKAGING + deliveryRes.charge : 0;
  }

  if (distanceInput) {
    distanceInput.value = getDistanceKm() || '';
    distanceInput.addEventListener('input', () => {
      setDistanceKm(distanceInput.value);
      render();
    });
  }


  // Auto-trigger GPS on cart page load
  if (distanceInput) {
    setTimeout(() => {
      fillDistanceFromGPS(distanceInput);
    }, 800);
  }

  itemsEl.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.cart-item');
    if (!itemEl) return;
    const id = itemEl.getAttribute('data-id');
    const action = e.target.getAttribute('data-action');
    if (!action) return;

    let cart = getCart();
    const index = cart.findIndex((item) => item.id === id);
    if (index === -1) return;

    if (action === 'inc') {
      cart[index].quantity += 1;
    } else if (action === 'dec') {
      cart[index].quantity = Math.max(1, cart[index].quantity - 1);
    } else if (action === 'remove') {
      cart.splice(index, 1);
    }

    saveCart(cart);
    render();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEYS.CART);
      render();
      updateCartBadge();
    });
  }

  render();
}

function initCheckoutPage() {
  const form = document.getElementById('checkout-form');
  const itemsEl = document.getElementById('checkout-summary-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const packagingEl = document.getElementById('checkout-packaging');
  const deliveryEl = document.getElementById('checkout-delivery');
  const totalEl = document.getElementById('checkout-total');
  const distanceInput = document.getElementById('checkout-distance');
  const paymentModal = document.getElementById('payment-modal');
  const paymentClose = document.getElementById('payment-close');
  const paymentCancel = document.getElementById('payment-cancel');
  const paymentPayNow = document.getElementById('payment-paynow');
  const payAmountEl = document.getElementById('pay-amount');

  if (!form || !itemsEl || !subtotalEl || !packagingEl || !totalEl) return;

  // Enforce Login for Checkout
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login-signup.html?redirect=checkout';
    return;
  }

  const PACKAGING = 10;
  let pendingOrder = null;

  function renderSummary() {
    const products = getStoredProducts();
    const cart = getCart();
    if (!cart.length) {
      itemsEl.innerHTML = '<p>Your cart is empty. Please add items before checkout.</p>';
      subtotalEl.textContent = '0';
      packagingEl.textContent = PACKAGING;
      if (deliveryEl) deliveryEl.textContent = '0';
      totalEl.textContent = '0';
      return false;
    }

    let subtotal = 0;
    itemsEl.innerHTML = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return '';
        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;
        return `
          <div class="summary-row">
            <span>${product.name} x ${formatQuantity(product.id, item.quantity)} ${product.isAvailable === false ? '<strong style="color:var(--accent-red)">(Unavailable)</strong>' : ''}</span>
            <span>₹${lineTotal}</span>
          </div>
        `;
      })
      .join('');

    subtotalEl.textContent = subtotal;
    packagingEl.textContent = PACKAGING;
    const km = distanceInput ? Number(distanceInput.value || 0) : getDistanceKm();
    const deliveryRes = calcDeliveryCharge(km);
    
    if (deliveryEl) {
      const distanceText = km > 0 ? ` (${km} km)` : '';
      deliveryEl.innerHTML = `${deliveryRes.charge}<small style="font-weight:normal; opacity:0.8; margin-left:4px;">${distanceText}</small>`;
    }
    
    totalEl.textContent = subtotal + PACKAGING + deliveryRes.charge;
    if (payAmountEl) payAmountEl.textContent = String(subtotal + PACKAGING + deliveryRes.charge);

    const submitBtn = form.querySelector('button[type="submit"]');
    const warningElId = 'checkout-distance-warning';
    // Look for warning in summary instead of next to hidden input
    let warningEl = document.getElementById(warningElId);
    
    if (!deliveryRes.allowed && km > 0) {
      if (!warningEl) {
        warningEl = document.createElement('div');
        warningEl.id = warningElId;
        warningEl.className = 'summary-row';
        warningEl.style.color = '#ff4b5c';
        warningEl.style.fontSize = '0.85rem';
        warningEl.style.marginTop = '0.5rem';
        warningEl.style.fontWeight = 'bold';
        warningEl.style.textAlign = 'right';
        warningEl.style.display = 'block';
        totalEl.closest('.summary-total').insertAdjacentElement('afterend', warningEl);
      }
      warningEl.textContent = deliveryRes.message;
      if (submitBtn) submitBtn.disabled = true;
    } else {
      if (warningEl) warningEl.remove();
      if (submitBtn) submitBtn.disabled = false;
    }

    return true;
  }

  function getPaymentMethod() {
    const method = form.querySelector('input[name="paymentMethod"]:checked');
    return method ? method.value : 'ONLINE';
  }

  function openPaymentModal(amount, order) {
    if (!paymentModal) return;
    pendingOrder = order;
    if (payAmountEl) payAmountEl.textContent = String(amount);
    paymentModal.classList.add('open');
    paymentModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePaymentModal() {
    if (!paymentModal) return;
    paymentModal.classList.remove('open');
    paymentModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initPaymentTabs() {
    if (!paymentModal) return;
    const tabs = paymentModal.querySelectorAll('[data-paytab]');
    const panels = paymentModal.querySelectorAll('[data-panel]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.getAttribute('data-paytab');
        tabs.forEach((t) => t.classList.toggle('active', t === tab));
        panels.forEach((p) => p.classList.toggle('active', p.getAttribute('data-panel') === key));
      });
    });
  }

  if (distanceInput) {
    distanceInput.value = getDistanceKm() || '';
    distanceInput.addEventListener('input', () => {
      setDistanceKm(distanceInput.value);
      renderSummary();
    });
  }


  // Auto-trigger GPS on checkout page load
  if (distanceInput) {
    setTimeout(() => {
      fillDistanceFromGPS(distanceInput);
    }, 800);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const hasItems = renderSummary();
    if (!hasItems) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    const order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      name: form.customerName.value.trim(),
      phone: form.customerPhone.value.trim(),
      address: form.customerAddress.value.trim(),
      distanceKm: distanceInput ? Number(distanceInput.value || 0) : getDistanceKm(),
      deliveryCharge: Number(deliveryEl?.textContent || 0) || 0,
      paymentMethod: getPaymentMethod(),
      deliverySlot: form.deliverySlot?.value || 'immediate',
      orderNotes: form.orderNotes?.value?.trim() || '',
      giftWrap: form.giftWrap?.checked || false,
      isPreOrder: form.isPreOrder?.checked || false,
      preOrderDate: form.preOrderDate?.value || null,
      total: Number(totalEl.textContent) || 0,
      timestamp: new Date().toISOString(),
      cart: getCart(),
      userEmail: getCurrentUser()?.email || null,
      status: 'Pending',
    };

    if (order.giftWrap) order.total += 20;

    if (!order.name || !order.phone || !order.address) {
      alert('Please fill all required fields.');
      return;
    }

    if (!Number.isFinite(order.distanceKm) || order.distanceKm <= 0) {
      alert('Please enter the distance (km) to calculate delivery charge.');
      return;
    }

    localStorage.setItem(STORAGE_KEYS.ORDER, JSON.stringify(order));

    // Remove online payment logic and modal. Only COD allowed.
    localStorage.removeItem(STORAGE_KEYS.CART);
    window.location.href = 'order-success.html';
  });

  initPaymentTabs();

  if (paymentClose) paymentClose.addEventListener('click', closePaymentModal);
  if (paymentCancel) paymentCancel.addEventListener('click', closePaymentModal);

  if (paymentModal) {
    paymentModal.addEventListener('click', (e) => {
      if (e.target === paymentModal) closePaymentModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePaymentModal();
  });

  if (paymentPayNow) {
    paymentPayNow.addEventListener('click', () => {
      const orderRaw = localStorage.getItem(STORAGE_KEYS.ORDER);
      if (!orderRaw || !pendingOrder) {
        alert('Please click "Place Order" again.');
        return;
      }
      closePaymentModal();
      localStorage.removeItem(STORAGE_KEYS.CART);
      window.location.href = 'order-success.html';
    });
  }

  // Pre-order toggle logic
  const preOrderToggle = document.getElementById('is-pre-order');
  const preOrderField = document.getElementById('pre-order-date-field');
  if (preOrderToggle && preOrderField) {
    preOrderToggle.addEventListener('change', () => {
      preOrderField.style.display = preOrderToggle.checked ? 'block' : 'none';
    });
  }

  initTrackingPage();
  render();
}

function initTrackingPage() {
  const btn = document.getElementById('btn-track');
  const input = document.getElementById('track-id');
  const result = document.getElementById('track-result');
  if (!btn || !input || !result) return;

  btn.addEventListener('click', () => {
    const id = input.value.trim();
    if (!id) return;

    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY) || '[]');
    const order = history.find(h => h.id === id);

    if (!order) {
      result.style.display = 'block';
      result.innerHTML = '<p class="text-center">Order not found. Please check the ID.</p>';
      return;
    }

    const steps = [
      { key: 'Pending', label: 'Order Received', desc: 'We have received your order.' },
      { key: 'Confirmed', label: 'Confirmed', desc: 'Bakery is preparing your snacks.' },
      { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Our driver is on the way.' },
      { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your crispy snacks!' }
    ];

    const currentIdx = steps.findIndex(s => s.key === (order.status || 'Pending'));
    
    result.style.display = 'block';
    result.innerHTML = `
      <h3>Status for ${id}</h3>
      <div class="track-timeline">
        ${steps.map((s, i) => `
          <div class="track-step ${i <= currentIdx ? 'active' : ''}">
            <div class="track-icon"></div>
            <div class="track-info">
              <h4>${s.label}</h4>
              <p>${s.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="track-details glass" style="margin-top:1rem; padding:1rem;">
        <p><strong>ETA:</strong> ${order.status === 'Delivered' ? 'Delivered' : '30-45 mins'}</p>
        <p><strong>Delivery Slot:</strong> ${order.deliverySlot}</p>
        ${order.giftWrap ? '<div class="eta-badge">Gift Wrapped 🎁</div>' : ''}
      </div>
    `;
  });
}

function isInWishlist(pid) {
  const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
  return wishlist.includes(pid);
}

function toggleWishlist(pid) {
  let wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
  if (wishlist.includes(pid)) {
    wishlist = wishlist.filter(id => id !== pid);
  } else {
    wishlist.push(pid);
  }
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  initProductsPage();
}

function initReviewSystem() {
  const stars = document.querySelectorAll('#review-stars .star');
  let selectedRating = 5;

  stars.forEach(s => {
    s.addEventListener('click', () => {
      selectedRating = parseInt(s.getAttribute('data-val'));
      stars.forEach(star => {
        const val = parseInt(star.getAttribute('data-val'));
        star.classList.toggle('active', val <= selectedRating);
      });
    });
  });

  const btn = document.getElementById('submit-review');
  if (btn) {
    btn.addEventListener('click', () => {
      const text = document.getElementById('review-text').value.trim();
      if (!text) return;
      
      const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');
      // For demo, we'll associate with a random product or first product if none selected
      // Real app would have a specific product ID
      const pid = 'potato-chips-salt'; 
      if (!reviews[pid]) reviews[pid] = [];
      reviews[pid].push({
        user: getCurrentUser()?.email?.split('@')[0] || 'Guest',
        rating: selectedRating,
        text: text,
        date: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
      alert('Review submitted! Thank you.');
      renderReviews();
    });
  }
  renderReviews();
}

function renderReviews() {
  const list = document.getElementById('reviews-list');
  if (!list) return;
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');
  const allReviews = Object.values(reviews).flat().sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  
  if (!allReviews.length) {
    list.innerHTML = '<p>No reviews yet. Be the first!</p>';
    return;
  }

  list.innerHTML = allReviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <span class="review-user">${r.user}</span>
        <span class="review-rating">${renderStars(r.rating)}</span>
      </div>
      <p class="review-text">${r.text}</p>
    </div>
  `).join('');
}

function renderStars(rating) {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}

function getAvgRating(pid) {
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}')[pid] || [];
  if (!reviews.length) return 5;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function getReviewCount(pid) {
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}')[pid] || [];
  return reviews.length;
}

document.addEventListener('click', (e) => {
  const wishlistBtn = e.target.closest('[data-wishlist]');
  if (wishlistBtn) {
    toggleWishlist(wishlistBtn.getAttribute('data-wishlist'));
  }
});

function initSuccessPage() {
  if (!document.body.classList.contains('page-success')) return;
  const orderRaw = localStorage.getItem(STORAGE_KEYS.ORDER);
  if (orderRaw) {
    const order = JSON.parse(orderRaw);
    const user = getCurrentUser();
    if (user) {
      // Save to persistent history
      let history = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY);
        if (stored) history = JSON.parse(stored);
      } catch {}
      
      // Prevent duplicates if page reloaded
      const exists = history.some(h => h.timestamp === order.timestamp && h.userEmail === user.email);
      if (!exists) {
        history.push({ ...order, userEmail: user.email, status: 'Completed' });
        localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(history));
      }
    }
  }
  localStorage.removeItem(STORAGE_KEYS.ORDER);
}

function initAuth() {
  const loginForm = document.getElementById('user-login-form');
  const signupForm = document.getElementById('user-signup-form');
  const otpForm = document.getElementById('user-otp-form');
  const showSignupBtn = document.getElementById('show-signup');
  const showLoginBtn = document.getElementById('show-login');
  
  const loginSection = document.getElementById('login-section');
  const signupSection = document.getElementById('signup-section');
  const otpSection = document.getElementById('otp-section');

  if (!loginSection || !signupSection || !otpSection) return;

  function showSection(name) {
    loginSection.style.display = name === 'login' ? 'block' : 'none';
    signupSection.style.display = name === 'signup' ? 'block' : 'none';
    otpSection.style.display = name === 'otp' ? 'block' : 'none';
  }

  if (showSignupBtn) showSignupBtn.addEventListener('click', () => showSection('signup'));
  if (showLoginBtn) showLoginBtn.addEventListener('click', () => showSection('login'));

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = signupForm.email.value.trim();
      const pass = signupForm.password.value;
      const users = getUsers();
      if (users.find(u => u.email === email)) {
        alert('Email already registered.');
        return;
      }
      
      // Store temporary signup data for OTP phase
      localStorage.setItem('sb_temp_signup', JSON.stringify({ email, pass }));
      alert('OTP sent to your email (Demo: 123456)');
      showSection('otp');
    });
  }

  if (otpForm) {
    otpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const otp = otpForm.otp.value;
      if (otp === '123456') {
        const temp = JSON.parse(localStorage.getItem('sb_temp_signup'));
        if (temp) {
          const users = getUsers();
          users.push(temp);
          saveUsers(users);
          localStorage.removeItem('sb_temp_signup');
          alert('Account verified! You can now login.');
          showSection('login');
        }
      } else {
        alert('Invalid OTP. Try 123456');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const pass = loginForm.password.value;
      const users = getUsers();
      const user = users.find(u => u.email === email && u.pass === pass);
      if (user) {
        setCurrentUser(user);
        
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');
        if (redirect === 'checkout') {
          window.location.href = 'checkout.html';
        } else {
          window.location.href = 'index.html';
        }
      } else {
        alert('Invalid email or password.');
      }
    });
  }
}

function initDeliveryDashboard() {
  const listEl = document.getElementById('delivery-orders-list');
  if (!listEl) return;

  function isDeliveryLogged() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'delivery';
  }

  if (!isDeliveryLogged()) {
    window.location.href = 'admin.html';
    return;
  }

  function render() {
    let history = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY);
      if (stored) history = JSON.parse(stored);
    } catch {}

    if (!history.length) {
      listEl.innerHTML = '<div class="no-orders">No customer orders yet.</div>';
      return;
    }

    // Sort by timestamp desc
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    listEl.innerHTML = history.map((order, idx) => {
      const date = new Date(order.timestamp).toLocaleString();
      const statusClass = order.status ? order.status.toLowerCase().replace(/\s+/g, '-') : 'pending';
      return `
        <div class="delivery-card" data-idx="${idx}">
          <div class="delivery-header">
            <span class="order-id">Order #${history.length - idx}</span>
            <span class="delivery-status status-${statusClass}">${order.status || 'Pending'}</span>
          </div>
          <div class="delivery-info">
            <p><strong>Customer:</strong> ${order.name}</p>
            <p><strong>Email:</strong> ${order.userEmail || 'Guest'}</p>
            <p><strong>Phone:</strong> <a href="tel:${order.phone}">${order.phone}</a></p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Total:</strong> ₹${order.total} (COD Only)</p>
            <p><strong>Distance:</strong> ${order.distanceKm} km</p>
            <p><strong>Time Slot:</strong> ${order.deliverySlot || 'N/A'}</p>
            <p><strong>Order Time:</strong> ${date}</p>
          </div>
          <div class="order-items-minimal">
            <strong>Items:</strong>
            ${order.cart.map(item => {
              const product = getStoredProducts().find(p => p.id === item.id);
              const name = product ? product.name : item.id;
              return `<div>• ${name} x ${item.quantity}</div>`;
            }).join('')}
          </div>
          <div class="delivery-actions">
            <select class="status-select" data-idx="${idx}">
              <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
              <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
            <button class="btn btn-primary btn-sm update-status" data-idx="${idx}">Update Status</button>
          </div>
        </div>
      `;
    }).join('');
  }

  listEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('update-status')) {
      const idx = e.target.getAttribute('data-idx');
      const select = listEl.querySelector(`.status-select[data-idx="${idx}"]`);
      const newStatus = select.value;
      
      let history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY));
      // Re-sort because we need to find the right one
      history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      history[idx].status = newStatus;
      
      localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(history));
      render();
      alert('Status updated and customer notified!');
    }
  });

  const logoutBtn = document.getElementById('delivery-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, '0');
      window.location.href = 'admin.html';
    });
  }

  render();
}

function initEngagementFeatures() {
  // Subscription boxes injection
  const cartGrid = document.querySelector('.cart-layout');
  if (cartGrid && !document.getElementById('sub-section')) {
    const subSection = document.createElement('div');
    subSection.id = 'sub-section';
    subSection.className = 'glass';
    subSection.style.padding = '1.5rem';
    subSection.style.marginTop = '1.5rem';
    subSection.innerHTML = `
      <h3>Subscription Boxes 📦</h3>
      <p style="font-size:0.85rem; color:var(--text-soft);">Never run out of snacks! Weekly or monthly deliveries.</p>
      <div class="sub-options">
        <div class="sub-card" onclick="alert('Weekly Subscription added to cart!')">
          <strong>Weekly</strong>
          <p>₹299 / week</p>
        </div>
        <div class="sub-card" onclick="alert('Monthly Subscription added to cart!')">
          <strong>Monthly</strong>
          <p>₹999 / month</p>
        </div>
      </div>
    `;
    cartGrid.after(subSection);
  }

  // Loyalty Points injection
  const checkoutSummary = document.querySelector('.checkout-summary');
  if (checkoutSummary && !document.getElementById('loyalty-promo')) {
    const points = getLoyaltyPoints();
    const promo = document.createElement('div');
    promo.id = 'loyalty-promo';
    promo.style.background = 'rgba(255, 138, 0, 0.1)';
    promo.style.border = '1px dashed var(--primary)';
    promo.style.padding = '0.8rem';
    promo.style.borderRadius = '8px';
    promo.style.marginTop = '1rem';
    promo.style.fontSize = '0.85rem';
    promo.innerHTML = `
      <strong>Loyalty Points: ${points}</strong><br>
      ${points >= 50 ? '<button class="btn btn-mini" onclick="alert(\'₹50 discount applied!\')">Redeem 50 pts for ₹50 off</button>' : 'Earn 50 pts to get ₹50 off!'}
    `;
    checkoutSummary.appendChild(promo);
  }

}


function initAdminAnalytics() {
  const container = document.getElementById('analytics-placeholder');
  if (!container) return;

  const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY) || '[]');
  
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

  function calcRevenue(orders) {
    return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }

  const weeklyOrders = history.filter(o => new Date(o.timestamp) >= sevenDaysAgo);
  const monthlyOrders = history.filter(o => new Date(o.timestamp) >= thirtyDaysAgo);

  const totalRevenue = calcRevenue(history);
  const weeklyRevenue = calcRevenue(weeklyOrders);
  const monthlyRevenue = calcRevenue(monthlyOrders);
  
  const itemsSold = history.reduce((sum, o) => sum + (o.cart ? o.cart.reduce((isum, i) => isum + (Number(i.quantity) || 0), 0) : 0), 0);

  container.innerHTML = `
    <div id="analytics-dash" class="glass" style="padding: 1.5rem;">
      <h2>Sales Analytics 📊</h2>
      <div class="analytics-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem; margin-top:1.5rem;">
        <div class="stat-card">
          <span class="stat-val">₹${weeklyRevenue}</span>
          <p class="stat-label">Weekly Revenue (7d)</p>
        </div>
        <div class="stat-card">
          <span class="stat-val">₹${monthlyRevenue}</span>
          <p class="stat-label">Monthly Revenue (30d)</p>
        </div>
        <div class="stat-card">
          <span class="stat-val">₹${totalRevenue}</span>
          <p class="stat-label">Total Revenue (All Time)</p>
        </div>
        <div class="stat-card">
          <span class="stat-val">${history.length}</span>
          <p class="stat-label">Total Orders</p>
        </div>
        <div class="stat-card">
          <span class="stat-val">${itemsSold}</span>
          <p class="stat-label">Total Items Sold</p>
        </div>
      </div>
      
      <div style="margin-top:2rem;">
        <h3>Recent Sales Activity</h3>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${history.slice(0, 5).map(o => `
                <tr>
                  <td>${new Date(o.timestamp).toLocaleDateString()}</td>
                  <td>${o.id || 'N/A'}</td>
                  <td>₹${o.total}</td>
                  <td><span class="status-pill ${o.status?.toLowerCase().replace(/\s+/g, '-') || 'pending'}">${o.status || 'Pending'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Kitchen Display System (KDS) basic logic inside Admin
function initKDS() {
  const panel = document.getElementById('admin-panel');
  if (!panel || document.getElementById('kds-view')) return;

  const kdsBtn = document.createElement('button');
  kdsBtn.className = 'btn btn-ghost';
  kdsBtn.textContent = 'View Kitchen System (KDS)';
  kdsBtn.style.marginBottom = '1rem';
  kdsBtn.onclick = () => {
    window.open('kds.html', '_blank');
  };
  panel.prepend(kdsBtn);
}

// Swiggy-style search placeholder animation
function initSearchPlaceholder() {
  const input = document.getElementById('product-search');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const term = input.value.trim().toLowerCase();
      const products = getStoredProducts();
      
      if (document.body.classList.contains('page-products')) {
        renderProducts(products, 'All', term);
      } else {
        // If on home, redirect with search term
        if (term.length > 2) {
          window.location.href = `products.html?q=${encodeURIComponent(term)}`;
        }
      }
    }, 200); // 200ms debounce
  });

  const placeholders = [
    'Search for "Potato Chips"',
    'Search for "Hot Murukku"',
    'Search for "Sweet Gulab Jamun"',
    'Search for "Spicy Mixture"',
    'Search for "Butter Biscuits"',
    'Search for "Evening Specials"'
  ];
  let index = 0;

  setInterval(() => {
    input.classList.add('fade-out');
    setTimeout(() => {
      index = (index + 1) % placeholders.length;
      input.placeholder = placeholders[index];
      input.classList.remove('fade-out');
    }, 400);
  }, 3500);
}

// Finalize initializations
document.addEventListener('DOMContentLoaded', () => {
  initSearchPlaceholder();
  updateFloatingCart(); // Show cart bar if items exist
  if (isAdmin()) {
    initAdminAnalytics();
  }
});


