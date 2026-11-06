(() => {
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  // Reveal and copy a sample coupon code.
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.code-button');
    if (!button) return;
    const card = button.closest('.coupon-card');
    const code = card?.dataset.code;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      button.querySelector('span:last-child').textContent = 'Copied!';
      showToast(`Coupon code ${code} copied`);
    } catch {
      button.querySelector('span:last-child').textContent = code;
      showToast(`Use coupon code: ${code}`);
    }
  });

  document.addEventListener('click', (event) => {
    const favorite = event.target.closest('.favorite-button');
    if (!favorite) return;
    const saved = favorite.getAttribute('aria-pressed') === 'true';
    favorite.setAttribute('aria-pressed', String(!saved));
    showToast(saved ? 'Offer removed from saved items' : 'Offer saved');
  });
  // Toggle the additional category list.
  const categoryToggle = document.getElementById('categoryToggle');
  const extraCategories = document.getElementById('extraCategories');
  categoryToggle.addEventListener('click', () => {
    const expanded = categoryToggle.getAttribute('aria-expanded') === 'true';
    categoryToggle.setAttribute('aria-expanded', String(!expanded));
    extraCategories.hidden = expanded;
    categoryToggle.querySelector('.plus').textContent = expanded ? '+' : '−';
  });

  // Offer carousel controls and pagination dots.
  const track = document.getElementById('offerTrack');
  const dots = [...document.querySelectorAll('.carousel-dots span')];
  function moveCarousel(direction) {
    const card = track.querySelector('.offer-card');
    track.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || 280) + 16), behavior: 'smooth' });
  }
  document.querySelector('.carousel-arrow.prev').addEventListener('click', () => moveCarousel(-1));
  document.querySelector('.carousel-arrow.next').addEventListener('click', () => moveCarousel(1));
  track.addEventListener('scroll', () => {
    const first = track.querySelector('.offer-card');
    const step = (first?.offsetWidth || 280) + 16;
    const index = Math.round(track.scrollLeft / step);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === Math.min(index, dots.length - 1)));
  });

  // Search coupon cards by merchant, category, or deal keywords.
  const searchInput = document.getElementById('couponSearchInput');
  const couponGrid = document.getElementById('couponGrid');
  const emptyState = document.getElementById('emptyState');
  function filterCoupons(term) {
    const query = term.trim().toLowerCase();
    let visible = 0;
    couponGrid.querySelectorAll('.coupon-card').forEach((card) => {
      const haystack = `${card.innerText} ${card.dataset.search || ''} ${card.dataset.category || ''}`.toLowerCase();
      const match = !query || haystack.includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    emptyState.hidden = visible !== 0;
  }
  document.getElementById('couponSearchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    filterCoupons(searchInput.value);
    document.getElementById('coupons').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  searchInput.addEventListener('input', () => filterCoupons(searchInput.value));

  // Category shortcuts filter deals where matching sample cards exist.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    const category = button.dataset.category;
    searchInput.value = category;
    filterCoupons(category);
    document.getElementById('coupons').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`Showing ${category} deals`);
  });

  // Email signup front-end demo; connect to an email platform before launch.
  document.getElementById('subscribeForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('emailInput');
    const message = document.getElementById('formMessage');
    if (!email.checkValidity()) return email.reportValidity();
    message.textContent = 'Thanks! You’re on the Krispy early-access list.';
    email.value = '';
  });

  // Append sample deal cards as the shopper scrolls down.
  const sentinel = document.getElementById('couponSentinel');
  const moreDeals = [
    { name: 'Kroger', icon: 'K', cls: 'publix', offer: '$8 Off', detail: '$40+ Purchase', distance: '1.8 mi', code: 'KRISPYKROGER8', category: 'Groceries', search: 'kroger groceries food' },
    { name: 'Regal', icon: 'R', cls: 'amc', offer: '$5 Off', detail: 'Movie Tickets', distance: '2.0 mi', code: 'KRISPYREGAL5', category: 'Entertainment', search: 'regal movies entertainment' },
    { name: 'GameStop', icon: 'G', cls: 'chipotle', offer: '10% Off', detail: 'Select Games', distance: '2.3 mi', code: 'KRISPYGAME10', category: 'Electronics', search: 'gamestop electronics games' },
    { name: 'Old Navy', icon: 'O', cls: 'cvs', offer: '20% Off', detail: 'Select Styles', distance: '2.7 mi', code: 'KRISPYSTYLE20', category: 'Fashion', search: 'old navy fashion clothing' }
  ];
  let batches = 0;
  function appendDeals() {
    if (batches >= 3) return;
    batches++;
    moreDeals.forEach((deal) => {
      const card = document.createElement('article');
      card.className = 'coupon-card';
      card.dataset.category = deal.category;
      card.dataset.search = deal.search;
      card.dataset.code = deal.code;
      card.innerHTML = `<div class="coupon-logo ${deal.cls}-logo">${deal.name}</div><div class="coupon-details"><span class="coupon-kicker">${deal.name.toUpperCase()} COUPONS</span><strong>${deal.offer}</strong><p>${deal.detail}</p><small class="verified"><i class="fa-solid fa-square-check" aria-hidden="true"></i> Verified recently · ${deal.distance} away</small></div><button class="code-button" type="button"><span>Get Code</span></button><button class="favorite-button" type="button" aria-label="Save ${deal.name} offer" aria-pressed="false"><i class="fa-solid fa-heart" aria-hidden="true"></i></button>`;
      couponGrid.appendChild(card);
    });
    if (batches >= 3) document.getElementById('scrollHint').textContent = 'You’re all caught up on featured sample deals.';
    if (searchInput.value.trim()) filterCoupons(searchInput.value);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) appendDeals();
    }, { rootMargin: '250px' });
    observer.observe(sentinel);
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
