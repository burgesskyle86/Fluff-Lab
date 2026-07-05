function ing(name, amount, calories, protein) {
  return { name, amount, calories, protein };
}

const RECIPES = {
  "Banana Cream Pie": {
    description: "Creamy banana pudding flavor with a protein-heavy base.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Banana Cream Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [ing("Banana", "1/2 medium", 53, 1)],
    method: [
      "Add yogurt to your mixing container.",
      "Add vanilla whey and pudding mix.",
      "Add acacia fiber and light whipped topping.",
      "Mix until smooth and thick.",
      "Fold in banana.",
      "Refrigerate 15–30 minutes before tasting."
    ]
  },
  "Birthday Cake": {
    description: "Vanilla fluff with cake-batter flavor and sprinkles.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Vanilla Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [ing("Birthday Cake Extract", "small splash", 0, 0), ing("Sprinkles", "1 tsp", 20, 0)],
    method: ["Add yogurt.", "Mix in whey, pudding, fiber, and whipped topping.", "Add birthday cake extract.", "Mix until smooth.", "Fold in sprinkles last.", "Chill 15–30 minutes."]
  },
  "Blueberry Cheesecake": {
    description: "Cheesecake-style fluff with blueberries folded in.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Cheesecake Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [ing("Blueberries", "75 g", 43, 1)],
    method: ["Add yogurt.", "Mix in whey, cheesecake pudding, fiber, and whipped topping.", "Whip until smooth.", "Fold in blueberries gently.", "Chill 15–30 minutes."]
  },
  "Chocolate": {
    description: "Simple chocolate protein fluff base.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Chocolate Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Chocolate Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [],
    method: ["Add yogurt.", "Add chocolate whey and chocolate pudding mix.", "Add acacia fiber and whipped topping.", "Mix until smooth and thick.", "Chill 15–30 minutes."]
  },
  "Cookies & Cream": {
    description: "Creamy, sweet, and packed with classic Oreo flavor.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Vanilla Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [ing("Oreo Thins Crushed", "2 cookies", 70, 1)],
    method: [
      "Add yogurt to your mixing container.",
      "Add vanilla whey and vanilla pudding mix.",
      "Add acacia fiber and light whipped topping.",
      "Mix for 60–90 seconds until smooth and thick.",
      "Fold in crushed Oreo Thins last so the cookie pieces stay intact.",
      "Refrigerate 15–30 minutes, then come back to rate the experiment."
    ]
  },
  "Key Lime Pie": {
    description: "Tart key lime flavor with cheesecake body and graham crunch.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Cheesecake Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [ing("Key Lime Juice", "1 tbsp", 4, 0), ing("Graham Cracker Crumbs", "1 sheet", 65, 1)],
    method: ["Add yogurt.", "Add whey, cheesecake pudding, fiber, and whipped topping.", "Mix until smooth.", "Stir in key lime juice.", "Fold in graham cracker crumbs last.", "Chill 15–30 minutes."]
  },
  "Lemon Cheesecake": {
    description: "Bright lemon cheesecake-style protein fluff.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Cheesecake Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [ing("Lemon Juice", "1 tbsp", 4, 0)],
    method: ["Add yogurt.", "Add whey, cheesecake pudding, fiber, and whipped topping.", "Mix until smooth.", "Stir in lemon juice.", "Chill 15–30 minutes."]
  },
  "Peanut Butter Cup": {
    description: "Chocolate base with peanut butter flavor from PB2.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Chocolate Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Chocolate Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [ing("PB2 Powder", "13 g", 60, 6)],
    method: ["Add yogurt.", "Add chocolate whey, chocolate pudding, fiber, and whipped topping.", "Add PB2 powder.", "Mix until smooth.", "Chill 15–30 minutes."]
  },
  "Strawberry Cheesecake": {
    description: "Cheesecake base with strawberries folded in.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Cheesecake Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [ing("Strawberries", "75 g", 25, 1)],
    method: ["Add yogurt.", "Add whey, cheesecake pudding, fiber, and whipped topping.", "Mix until smooth.", "Fold in strawberries.", "Chill 15–30 minutes."]
  },
  "Vanilla Bean": {
    description: "Clean vanilla protein fluff that works as a base for experiments.",
    base: [
      ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
      ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
      ing("Sugar-Free Vanilla Pudding Mix", "1 tbsp", 25, 0),
      ing("Light Whipped Topping", "2 tbsp", 60, 0),
      ing("Acacia Fiber", "1 tsp", 15, 0)
    ],
    additives: [ing("Vanilla Extract", "small splash", 0, 0)],
    method: ["Add yogurt.", "Add whey, vanilla pudding, fiber, and whipped topping.", "Add vanilla extract.", "Mix until smooth.", "Chill 15–30 minutes."]
  }
};
