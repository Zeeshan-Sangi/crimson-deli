/**
 * Product catalogue, bootstrapped from the template markup by
 * scripts/extract-products.mjs and maintained by hand from here on.
 */

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  sizes: string[];
};

export const PRODUCTS: Product[] = [
  {
    "id": "bbq-chicken-wings",
    "name": "BBQ Chicken Wings",
    "price": 9.99,
    "image": "/assets/img/home-4/food-14.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "black-hum-burger",
    "name": "Black Hum Burger",
    "price": 7.99,
    "image": "/assets/img/home-4/food-17.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "cheesy-beef-nachos",
    "name": "Cheesy Beef Nachos",
    "price": 25.99,
    "image": "/assets/img/home-4/food-9.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "classic-beef-hotdog",
    "name": "Classic Beef Hotdog",
    "price": 12.99,
    "image": "/assets/img/home-4/food-7.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "crispy-chicken-burger",
    "name": "Crispy Chicken Burger",
    "price": 13.99,
    "image": "/assets/img/home-4/food-10.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "crispy-onion-rings",
    "name": "Crispy Onion Rings",
    "price": 6.99,
    "image": "/assets/img/home-4/food-8.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "double-cheese-burger",
    "name": "Double Cheese Burger",
    "price": 15.99,
    "image": "/assets/img/home-4/food-15.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "double-cheese-pizza",
    "name": "Double Cheese Pizza",
    "price": 15.99,
    "image": "/assets/img/home-4/food-11.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "pepperoni-calzone",
    "name": "Pepperoni Calzone",
    "price": 9.99,
    "image": "/assets/img/home-4/food-12.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "pepperoni-pizza",
    "name": "Pepperoni Pizza",
    "price": 9.99,
    "image": "/assets/img/home-4/food-16.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "special-biryani",
    "name": "Special Biryani",
    "price": 9.99,
    "image": "/assets/img/home-4/food-18.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  },
  {
    "id": "spicy-beef-burrito",
    "name": "Spicy Beef Burrito",
    "price": 7.99,
    "image": "/assets/img/home-4/food-13.png",
    "rating": 4,
    "sizes": [
      "Large",
      "Medium",
      "Small"
    ]
  }
];

/** Case-insensitive name match used by the header search box. */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
