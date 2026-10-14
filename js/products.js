// Mock catalog. Content lives here, separate from the tile rendering in tiles.js,
// so copy, prices and images can change without touching layout code.
//
// Each brand gets its own list because the two tiles show different fields:
// TeePublic shows a sale price + countdown + units sold, Redbubble shows a
// "From" price + verified-artist badge.

window.PRODUCTS = {
  teepublic: [
    {
      id: 'tp-felix-tee',
      title: 'Felix The Cat T-Shirt',
      artist: 'Nikita Abakumov',
      image: 'assets/products/tp-felix-tee.png',
      price: 16,
      originalPrice: 24,
      sold: 20,
      visualSearch: true,
      addToCart: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      soldOutSizes: ['XS']
    },
    {
      id: 'tp-harvest-owl-sticker',
      title: 'Harvest Owl - Red Orange Sticker',
      artist: 'Adamzworld',
      image: 'assets/products/tp-harvest-owl-sticker.png',
      price: 3,
      originalPrice: 3.5,
      sold: 1,
      visualSearch: false,
      addToCart: true,
      bulkDeals: [{ minQty: 4, percentOff: 25 }, { minQty: 10, percentOff: 40 }]
    }
  ],
  redbubble: [
    {
      id: 'rb-arrakis-tee',
      title: 'Visit Arrakis - Vintage Distressed Surf - Dune',
      artist: 'Nemons',
      verified: true,
      image: 'assets/products/rb-arrakis-tee.jpg',
      fromPrice: 20.39,
      quickAdd: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      soldOutSizes: ['3XL']
    },
    {
      id: 'rb-silly-goose-sticker',
      title: 'Silly Goose Juice Sticker',
      artist: 'VaguelyOriginal',
      verified: true,
      image: 'assets/products/rb-silly-goose-sticker.png',
      fromPrice: 1.9,
      quickAdd: true,
      bulkDeals: [{ minQty: 4, percentOff: 25 }, { minQty: 10, percentOff: 40 }]
    }
  ]
};

// TeePublic sale countdown, in seconds from page load (14:10:32 in the reference).
window.SALE_ENDS_IN = 14 * 3600 + 10 * 60 + 32;
