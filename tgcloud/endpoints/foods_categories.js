// tgcloud/endpoints/foods_categories.js
// Static categorized food & drink catalog (no DB table).
// Call as: Telegram.WebApp.Serverless.call('foods_categories', ...)

const CATALOG = {
  drinks: [
    'Milk Tea with Boba',
    'Iced Oat Latte',
    'Mango Smoothie',
    'Espresso',
    'Fresh Orange Juice',
  ],
  meals: [
    'Chicken Shawarma Wrap',
    'Spicy Miso Ramen',
    'Burrito Bowl with Chicken',
    'Veggie Poke Bowl',
    'Pepperoni Pizza Slice',
  ],
  snacks: [
    'Garlic Fries',
    'Everything Bagel with Cream Cheese',
    'Blueberry Muffin',
    'Samosa',
    'Croissant',
  ],
};

export default async function () {
  return { results: CATALOG };
}
