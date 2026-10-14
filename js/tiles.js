// Product tile markup, one renderer per brand.

(function () {
  var ICONS = {
    heart:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.6-4.6-9.3-9.3C1.5 7.6 3.6 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.3 0 5.4 3.1 4.2 6.5-1.7 4.7-9.3 9.3-9.3 9.3z"/></svg>',
    visualSearch:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8M21 16v2.5a2.5 2.5 0 0 1-2.5 2.5H16M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16"/><circle cx="11.3" cy="11.3" r="3.8"/><path d="M14.2 14.2l3 3"/></svg>',
    verified:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="seal" d="M12 1.8l2.4 1.8 3-.2.9 2.9 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-.9 2.9-3-.2L12 22.2l-2.4-1.8-3 .2-.9-2.9-2.5-1.7.9-2.9-.9-2.9 2.5-1.7.9-2.9 3 .2z"/><path class="tick" d="M8.2 12.2l2.6 2.6 5-5.2"/></svg>',
    cartPlus:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 4h2.6l2.3 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L20.5 8H9.5"/><circle cx="9.5" cy="19.3" r="1.2"/><circle cx="17" cy="19.3" r="1.2"/><path d="M14 5.5v5M11.5 8h5"/></svg>',
    minus:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"/></svg>',
    plus:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // $16 for whole dollars, $3.50 otherwise (matches the reference tiles).
  function tpMoney(n) {
    return '$' + (n % 1 === 0 && n >= 10 ? n.toFixed(0) : n.toFixed(2));
  }

  function qtyControl(prefix, productId, addButton) {
    return (
      '<div class="' + prefix + '-qty" data-qty-wrap data-product="' + esc(productId) + '" data-qty="0">' +
        addButton +
        '<div class="' + prefix + '-stepper" data-qty-stepper role="group" aria-label="Quantity">' +
          '<button type="button" data-qty-dec aria-label="Decrease quantity">' + ICONS.minus + '</button>' +
          '<span data-qty-label aria-live="polite">0</span>' +
          '<button type="button" data-qty-inc aria-label="Increase quantity">' + ICONS.plus + '</button>' +
        '</div>' +
      '</div>'
    );
  }

  // Products with sizes open a picker first; the rest add straight to cart.
  function addTrigger(p) {
    return p.sizes ? 'data-size-open aria-expanded="false"' : 'data-qty-add';
  }

  // Overlays the bottom of the product image; app.js toggles data-sizes-open on the tile.
  function sizePanel(prefix, p) {
    if (!p.sizes) return '';
    var soldOut = p.soldOutSizes || [];
    return (
      '<div class="' + prefix + '-sizes" data-size-panel role="group" aria-label="Select a size">' +
        '<div class="' + prefix + '-sizes-head">' +
          '<span>Select a size</span>' +
          '<button class="' + prefix + '-sizes-close" type="button" data-size-close aria-label="Close size picker">' + ICONS.close + '</button>' +
        '</div>' +
        '<div class="' + prefix + '-size-grid">' +
          p.sizes.map(function (s) {
            var out = soldOut.indexOf(s) !== -1;
            return '<button type="button" data-size="' + esc(s) + '"' +
              (out ? ' disabled aria-label="' + esc(s) + ', sold out"' : '') + '>' + esc(s) + '</button>';
          }).join('') +
        '</div>' +
      '</div>'
    );
  }

  // Hidden until the shopper adds a second item. app.js shows the next tier
  // they haven't reached, or the "applied" line once every tier is met.
  function dealNote(prefix, deals) {
    if (!deals || !deals.length) return '';
    var top = deals[deals.length - 1];
    return (
      '<p class="' + prefix + '-deal" data-deal-note aria-live="polite">' +
        deals.map(function (d) {
          return '<span data-deal-min="' + d.minQty + '" hidden>Add ' + d.minQty + ' or more for <strong>' + d.percentOff + '% off</strong></span>';
        }).join('') +
        '<span data-deal-done hidden><strong>' + top.percentOff + '% off</strong> applied</span>' +
      '</p>'
    );
  }

  function teepublicTile(p) {
    return (
      '<article class="tile tp-tile">' +
        '<div class="tp-media">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '">' +
          '<div class="tp-actions">' +
            '<button class="tp-round" type="button" aria-label="Add to favorites" data-fav>' + ICONS.heart + '</button>' +
            (p.visualSearch
              ? '<button class="tp-round" type="button" aria-label="Find similar designs">' + ICONS.visualSearch + '</button>'
              : '') +
          '</div>' +
          (p.sold ? '<span class="tp-sold">' + p.sold + ' Sold</span>' : '') +
          (p.addToCart ? sizePanel('tp', p) : '') +
        '</div>' +
        '<h3 class="tp-title">' + esc(p.title) + '</h3>' +
        '<p class="tp-artist">by <a href="#">' + esc(p.artist) + '</a></p>' +
        '<p class="tp-price"><strong>' + tpMoney(p.price) + '</strong>' +
          (p.originalPrice ? ' <s>' + tpMoney(p.originalPrice) + '</s>' : '') + '</p>' +
        '<p class="tp-timer">for <strong data-countdown>--:--:--</strong></p>' +
        (p.addToCart
          ? qtyControl('tp', p.id, '<button class="tp-cart" type="button" ' + addTrigger(p) + '>+ Add to Cart</button>') +
            dealNote('tp', p.bulkDeals)
          : '') +
      '</article>'
    );
  }

  function redbubbleTile(p) {
    return (
      '<article class="tile rb-tile">' +
        '<div class="rb-media">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '">' +
          (p.quickAdd ? sizePanel('rb', p) : '') +
        '</div>' +
        '<div class="rb-body">' +
          '<div class="rb-text">' +
            '<h3 class="rb-title">' + esc(p.title) + '</h3>' +
            '<p class="rb-artist">' + esc(p.artist) +
              (p.verified ? '<span class="rb-verified" title="Verified artist">' + ICONS.verified + '</span>' : '') +
            '</p>' +
          '</div>' +
          '<button class="rb-fav" type="button" aria-label="Add to favorites" data-fav>' + ICONS.heart + '</button>' +
        '</div>' +
        '<div class="rb-foot">' +
          '<p class="rb-price">From $' + p.fromPrice.toFixed(2) + '</p>' +
          (p.quickAdd
            ? qtyControl('rb', p.id,
                '<button class="rb-cart" type="button" ' + addTrigger(p) + ' aria-label="Add to cart">' +
                  ICONS.cartPlus + '<span>Add</span></button>')
            : '') +
        '</div>' +
        (p.quickAdd ? dealNote('rb', p.bulkDeals) : '') +
      '</article>'
    );
  }

  window.renderTiles = function (brand, products) {
    var render = brand === 'redbubble' ? redbubbleTile : teepublicTile;
    return products.map(render).join('');
  };
})();
