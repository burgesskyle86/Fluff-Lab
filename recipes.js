const RECIPES = {
  "Chocolate": recipe("Chocolate", "Rich chocolate protein fluff with a pudding-style finish.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Chocolate Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Chocolate Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [], [
    "Add yogurt, whey, pudding mix, whipped topping, and acacia fiber to the bowl.",
    "Mix for 60 seconds until smooth and fully combined.",
    "Let it sit for 2 minutes so the pudding mix and fiber thicken.",
    "Whip another 30 to 60 seconds until lighter and smoother.",
    "Chill 15 to 30 minutes if you want a thicker texture."
  ]),
  "Vanilla Bean": recipe("Vanilla Bean", "Simple vanilla base that works with almost any additive.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Vanilla Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [ing("Vanilla Extract", "small splash", 0, 0)], [
    "Add the base ingredients to the bowl.",
    "Add vanilla extract and mix for 60 seconds.",
    "Scrape the sides and mix again until smooth.",
    "Taste for sweetness and add a tiny pinch of salt if needed.",
    "Chill before serving for a thicker spoonable texture."
  ]),
  "Strawberry Cheesecake": recipe("Strawberry Cheesecake", "Creamy cheesecake fluff with strawberries folded in at the end.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Cheesecake Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [ing("Strawberries", "75 g", 25, 1)], [
    "Mix the yogurt, whey, pudding mix, whipped topping, and fiber until smooth.",
    "Let the base hydrate for 2 minutes.",
    "Dice strawberries into small pieces.",
    "Fold strawberries in gently so the base does not get watery.",
    "Chill 15 to 30 minutes before eating."
  ]),
  "Blueberry Cheesecake": recipe("Blueberry Cheesecake", "Cheesecake base with blueberry bursts.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Cheesecake Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [ing("Blueberries", "75 g", 43, 1)], [
    "Mix the base ingredients until smooth.",
    "Let the mixture sit for 2 minutes to thicken.",
    "Fold blueberries in gently.",
    "For stronger flavor, lightly crush a few blueberries before folding.",
    "Chill before serving."
  ]),
  "Banana Cream Pie": recipe("Banana Cream Pie", "Banana pudding flavor with a thick creamy base.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Banana Cream Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [ing("Banana", "1/2 medium", 53, 1)], [
    "Mix all base ingredients until smooth.",
    "Slice or mash banana depending on the texture you want.",
    "Fold banana in after the base is mixed.",
    "Chill for 15 minutes.",
    "Eat the same day for best banana flavor."
  ]),
  "Cookies & Cream": recipe("Cookies & Cream", "Creamy, sweet, and packed with classic Oreo flavor.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Vanilla Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [ing("Oreo Thins Crushed", "2 cookies", 70, 1)], [
    "Add yogurt, whey, pudding mix, whipped topping, and acacia fiber to the mixing bowl.",
    "Mix for 60 seconds until the base is smooth.",
    "Let it sit for 2 minutes so it hydrates and thickens.",
    "Whip for another 60 to 90 seconds until lighter and fluffier.",
    "Crush the Oreo Thins and fold them in gently at the end.",
    "Chill 15 to 30 minutes for a thicker Oreo-filling texture."
  ], "images/cookies-cream.png"),
  "Peanut Butter Cup": recipe("Peanut Butter Cup", "Chocolate base with PB2 for peanut butter cup flavor.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Chocolate Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Chocolate Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [ing("PB2 Powder", "13 g", 60, 6)], [
    "Mix yogurt, whey, pudding mix, whipped topping, fiber, and PB2 together.",
    "Add a tiny splash of water if the PB2 makes it too thick.",
    "Mix until no powder remains.",
    "Chill to let the peanut butter flavor settle.",
    "Taste and adjust with more PB2 next time if needed."
  ]),
  "Key Lime Pie": recipe("Key Lime Pie", "Tart lime cheesecake fluff with graham cracker crunch.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Cheesecake Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [ing("Key Lime Juice", "1 tbsp", 4, 0), ing("Graham Cracker Crumbs", "1 sheet", 65, 1)], [
    "Mix the base ingredients until smooth.",
    "Add key lime juice slowly and mix again.",
    "Let the base sit for 2 minutes to thicken.",
    "Fold in graham cracker crumbs right before eating.",
    "Chill for a pie-like texture."
  ]),
  "Lemon Cheesecake": recipe("Lemon Cheesecake", "Bright lemon flavor with a cheesecake base.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Cheesecake Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [ing("Lemon Juice", "1 tbsp", 4, 0)], [
    "Mix the base ingredients until smooth.",
    "Add lemon juice and mix again.",
    "Taste and add more lemon only if needed.",
    "Chill 15 to 30 minutes.",
    "Record whether it needs more sweetness or more tartness next time."
  ]),
  "Birthday Cake": recipe("Birthday Cake", "Vanilla cake-style fluff with sprinkles.", "Easy", [
    ing("Chobani Nonfat Greek Yogurt", "1 cup", 130, 23),
    ing("Transparent Labs Vanilla Whey", "1 scoop", 120, 28),
    ing("Sugar-Free Vanilla Pudding Mix", "8 g", 25, 0),
    ing("Light Whipped Topping", "30 g", 60, 0),
    ing("Acacia Fiber", "5 g", 15, 0)
  ], [ing("Birthday Cake Extract", "small splash", 0, 0), ing("Sprinkles", "1 tsp", 20, 0)], [
    "Mix the base ingredients until smooth.",
    "Add birthday cake extract lightly; a little goes a long way.",
    "Let the mixture sit for 2 minutes.",
    "Fold in sprinkles at the end so the colors do not bleed too much.",
    "Chill and rate sweetness after tasting."
  ])
};

function recipe(name, description, difficulty, base, mixins, method, image = "") {
  return { name, description, difficulty, base, mixins, method, image };
}

function ing(name, amount, calories, protein) {
  return { name, amount, calories, protein };
}
