const RECIPES = {
  "Chocolate": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Chocolate Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Chocolate Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: []
  },
  "Vanilla Bean": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Vanilla Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: [
      ing("Vanilla Extract", "small splash", 0, 0)
    ]
  },
  "Strawberry Cheesecake": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Cheesecake Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: [
      ing("Strawberries", "75 g", 25, 1)
    ]
  },
  "Blueberry Cheesecake": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Cheesecake Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: [
      ing("Blueberries", "75 g", 43, 1)
    ]
  },
  "Banana Cream Pie": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Banana Cream Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: [
      ing("Banana", "1/2 medium", 53, 1)
    ]
  },
  "Cookies & Cream": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Vanilla Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: [
      ing("Oreo Thins Crushed", "2 cookies", 70, 1)
    ]
  },
  "Peanut Butter Cup": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Chocolate Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Chocolate Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: [
      ing("PB2 Powder", "13 g", 60, 6)
    ]
  },
  "Key Lime Pie": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Cheesecake Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: [
      ing("Key Lime Juice", "1 tbsp", 4, 0),
      ing("Graham Cracker Crumbs", "1 sheet", 65, 1)
    ]
  },
  "Lemon Cheesecake": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Cheesecake Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: [
      ing("Lemon Juice", "1 tbsp", 4, 0)
    ]
  },
  "Birthday Cake": {
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Vanilla Pudding Mix", "8 g", 25, 0),
      ing("Light Whipped Topping", "30 g", 60, 0),
      ing("Acacia Fiber", "5 g", 15, 0)
    ],
    mixins: [
      ing("Birthday Cake Extract", "small splash", 0, 0),
      ing("Sprinkles", "1 tsp", 20, 0)
    ]
  }
};

function ing(name, amount, calories, protein) {
  return { name, amount, calories, protein };
}
