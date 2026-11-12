(() => {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const toast=$('#toast');let toastTimer;
 function notify(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300)}
 $('#year').textContent=new Date().getFullYear();

 const catBtn=$('#categoryToggle'),extra=$('#extraCategories');
 catBtn.addEventListener('click',()=>{const open=catBtn.getAttribute('aria-expanded')==='true';catBtn.setAttribute('aria-expanded',String(!open));extra.hidden=open;$('.plus',catBtn).textContent=open?'+':'−'});

 const cards=$$('#couponGrid .coupon-card'),input=$('#couponSearchInput'),empty=$('#emptyState');
 function filter(q){let count=0;const term=q.trim().toLowerCase();cards.forEach(c=>{const hay=`${c.dataset.search} ${c.dataset.category} ${c.textContent}`.toLowerCase();c.hidden=!!term&&!hay.includes(term);if(!c.hidden)count++});empty.hidden=count!==0}
 $('#couponSearchForm').addEventListener('submit',e=>{e.preventDefault();filter(input.value);$('#coupons').scrollIntoView({behavior:'smooth'})});
 $$('.category-link').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.category;filter(input.value);$('#coupons').scrollIntoView({behavior:'smooth'})}));

 const track=$('#offerTrack'),dots=$$('#carouselDots span');
 $('.carousel-arrow.prev').addEventListener('click',()=>track.scrollBy({left:-track.clientWidth*.8,behavior:'smooth'}));
 $('.carousel-arrow.next').addEventListener('click',()=>track.scrollBy({left:track.clientWidth*.8,behavior:'smooth'}));
 function dotUpdate(){const first=$('.offer-card',track);const width=first.getBoundingClientRect().width+16;const idx=Math.min(dots.length-1,Math.round(track.scrollLeft/width));dots.forEach((d,i)=>d.classList.toggle('active',i===idx))}
 track.addEventListener('scroll',()=>requestAnimationFrame(dotUpdate),{passive:true});

 $$('.favorite-button').forEach(b=>b.addEventListener('click',()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));notify(on?'Offer saved to your favorites.':'Offer removed from favorites.')}));

 $$('.code-button').forEach(b=>b.addEventListener('click',async()=>{const code=b.closest('.coupon-card').dataset.code;if(!code)return;try{await navigator.clipboard.writeText(code);b.textContent='Copied!';notify(`Coupon code ${code} copied.`);setTimeout(()=>b.textContent='Get Code',1800)}catch{notify(`Use coupon code: ${code}`)}}));

 const translations={
 en:{label:'English',categories:'Categories',babyKids:'Baby & Kids',beautyHealth:'Beauty & Health',electronics:'Electronics',fashion:'Fashion',travel:'Travel',dining:'Dining',homeGarden:'Home & Garden',pets:'Pets',heroCopy:'Find coupons, offers and capture savings — all in one app.',popularOffers:'🎯 Explore Popular Offers',trending:'🔥 Hottest Trending Deals',getApp:'Get the Krispy App',firstToKnow:'Be the First to Know!',entertainment:'Discover Fun and Entertainment',blog:'From the Krispy Blog',placeholder:'Search for coupons (e.g., Walmart, fashion, travel)'},
 es:{label:'Español',categories:'Categorías',babyKids:'Bebés y niños',beautyHealth:'Belleza y salud',electronics:'Electrónica',fashion:'Moda',travel:'Viajes',dining:'Restaurantes',homeGarden:'Hogar y jardín',pets:'Mascotas',heroCopy:'Encuentra cupones, ofertas y ahorra — todo en una app.',popularOffers:'🎯 Explora ofertas populares',trending:'🔥 Ofertas más populares',getApp:'Descarga la app Krispy',firstToKnow:'¡Sé el primero en enterarte!',entertainment:'Descubre diversión y entretenimiento',blog:'Del blog de Krispy',placeholder:'Busca cupones (moda, viajes...)'},
 fr:{label:'Français',categories:'Catégories',babyKids:'Bébés et enfants',beautyHealth:'Beauté et santé',electronics:'Électronique',fashion:'Mode',travel:'Voyage',dining:'Restaurants',homeGarden:'Maison et jardin',pets:'Animaux',heroCopy:'Trouvez des coupons et économisez — dans une seule application.',popularOffers:'🎯 Offres populaires',trending:'🔥 Offres tendance',getApp:'Téléchargez Krispy',firstToKnow:'Soyez les premiers informés !',entertainment:'Découvrez le divertissement',blog:'Le blog Krispy',placeholder:'Rechercher des coupons (mode, voyage...)'},
 pt:{label:'Português',categories:'Categorias',babyKids:'Bebês e crianças',beautyHealth:'Beleza e saúde',electronics:'Eletrônicos',fashion:'Moda',travel:'Viagem',dining:'Restaurantes',homeGarden:'Casa e jardim',pets:'Animais',heroCopy:'Encontre cupons, ofertas e economize — tudo em um app.',popularOffers:'🎯 Explore ofertas populares',trending:'🔥 Ofertas em alta',getApp:'Baixe o app Krispy',firstToKnow:'Saiba antes de todo mundo!',entertainment:'Descubra diversão e entretenimento',blog:'Do blog Krispy',placeholder:'Buscar cupons (moda, viagem...)'}
 };
 const langBtn=$('#languageToggle'),menu=$('#languageMenu');
 langBtn.addEventListener('click',()=>{const open=langBtn.getAttribute('aria-expanded')==='true';langBtn.setAttribute('aria-expanded',String(!open));menu.hidden=open});
 $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>{const t=translations[b.dataset.lang];document.documentElement.lang=b.dataset.lang;$$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(t[key])el.textContent=t[key]});input.placeholder=t.placeholder;$('#languageCurrent').textContent=t.label;menu.hidden=true;langBtn.setAttribute('aria-expanded','false')}));
 document.addEventListener('click',e=>{if(!e.target.closest('.language-control')){menu.hidden=true;langBtn.setAttribute('aria-expanded','false')}});

 $('#subscribeForm').addEventListener('submit',e=>{e.preventDefault();const email=$('#emailInput').value.trim();if(!email)return;$('#formMessage').textContent='Thanks! You’re on the Krispy updates list.';e.currentTarget.reset()});
})();