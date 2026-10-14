// Control panel + page wiring. The active brand is kept in the URL (?brand=redbubble)
// so a link opens straight into one brand.

(function () {
  var BRANDS = ['teepublic', 'redbubble'];
  var grid = document.getElementById('grid');
  var saleEnd = Date.now() + window.SALE_ENDS_IN * 1000;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function tick() {
    var s = Math.max(0, Math.round((saleEnd - Date.now()) / 1000));
    var text = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60);
    document.querySelectorAll('[data-countdown]').forEach(function (el) { el.textContent = text; });
  }

  function setBrand(brand) {
    if (BRANDS.indexOf(brand) === -1) brand = BRANDS[0];
    document.documentElement.setAttribute('data-brand', brand);
    grid.innerHTML = window.renderTiles(brand, window.PRODUCTS[brand]);
    document.querySelectorAll('[data-brand-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-brand-btn') === brand));
    });
    var url = new URL(location.href);
    url.searchParams.set('brand', brand);
    history.replaceState(null, '', url);
    restoreQty();
    tick();
  }

  document.querySelectorAll('[data-brand-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () { setBrand(btn.getAttribute('data-brand-btn')); });
  });

  // Quantity lives outside the tile markup so brand switches keep the cart count.
  var cartQty = {};
  var cartSize = {};

  function setQty(wrap, qty) {
    var id = wrap.getAttribute('data-product');
    qty = Math.max(0, Math.min(99, qty));
    cartQty[id] = qty;
    if (!qty) delete cartSize[id];
    wrap.setAttribute('data-qty', String(qty));
    var label = wrap.querySelector('[data-qty-label]');
    if (label) label.textContent = (cartSize[id] ? cartSize[id] + ' · ' : '') + qty;

    var tile = wrap.closest('.tile');
    var note = tile && tile.querySelector('[data-deal-note]');
    if (!note) return;
    if (qty < 2) return tile.removeAttribute('data-deal');
    tile.setAttribute('data-deal', '');
    var next = null;
    note.querySelectorAll('[data-deal-min]').forEach(function (tier) {
      var show = !next && qty < Number(tier.getAttribute('data-deal-min'));
      if (show) next = tier;
      tier.hidden = !show;
    });
    note.querySelector('[data-deal-done]').hidden = Boolean(next);
  }

  function restoreQty() {
    grid.querySelectorAll('[data-qty-wrap]').forEach(function (wrap) {
      setQty(wrap, cartQty[wrap.getAttribute('data-product')] || 0);
    });
  }

  function setSizesOpen(tile, open) {
    tile.toggleAttribute('data-sizes-open', open);
    var trigger = tile.querySelector('[data-size-open]');
    if (trigger) trigger.setAttribute('aria-expanded', String(open));
    if (open) tile.querySelector('[data-size]:not(:disabled)').focus({ preventScroll: true });
  }

  function closeSizes(except) {
    grid.querySelectorAll('[data-sizes-open]').forEach(function (tile) {
      if (tile !== except) setSizesOpen(tile, false);
    });
  }

  // Favorite toggle, so the heart has a pressed state to look at.
  grid.addEventListener('click', function (e) {
    var fav = e.target.closest('[data-fav]');
    if (fav) fav.classList.toggle('is-on');

    var tile = e.target.closest('.tile');
    var wrap = tile && tile.querySelector('[data-qty-wrap]');
    if (!wrap) return;
    var id = wrap.getAttribute('data-product');
    var qty = cartQty[id] || 0;
    var size = e.target.closest('[data-size]');

    if (e.target.closest('[data-size-open]')) setSizesOpen(tile, !tile.hasAttribute('data-sizes-open'));
    else if (e.target.closest('[data-size-close]')) setSizesOpen(tile, false);
    else if (size) {
      cartSize[id] = size.getAttribute('data-size');
      setSizesOpen(tile, false);
      setQty(wrap, 1);
    }
    else if (e.target.closest('[data-qty-add]') || e.target.closest('[data-qty-inc]')) setQty(wrap, qty + 1);
    else if (e.target.closest('[data-qty-dec]')) setQty(wrap, qty - 1);
  });

  // Any click outside an open picker (or its trigger) dismisses it.
  document.addEventListener('click', function (e) {
    var keep = e.target.closest('[data-size-panel], [data-size-open]');
    closeSizes(keep && keep.closest('.tile'));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSizes();
  });

  setBrand(new URL(location.href).searchParams.get('brand'));
  setInterval(tick, 1000);
})();
