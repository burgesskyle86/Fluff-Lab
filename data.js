const FLUFF_DATA = {
  version: "4.0",
  releaseName: "The Laboratory Update",
  categories: {
    base: "Base",
    fruits: "Fruits",
    mixins: "Mix-ins",
    flavorings: "Flavorings"
  },
  genericIngredients: {
    plain_protein_yogurt: {
      id: "plain_protein_yogurt",
      name: "Plain Protein Yogurt",
      category: "base",
      purpose: "Primary creamy base and protein source.",
      effects: ["Adds creaminess", "Adds tang", "Boosts protein"],
      bestRange: "3/4 cup to 1 cup"
    },
    vanilla_whey: {
      id: "vanilla_whey",
      name: "Vanilla Whey Isolate",
      category: "base",
      purpose: "Protein booster and vanilla flavor base.",
      effects: ["Adds protein", "Adds sweetness", "Can thicken when mixed with pudding"],
      bestRange: "1/2 to 1 scoop"
    },
    chocolate_whey: {
      id: "chocolate_whey",
      name: "Chocolate Whey Isolate",
      category: "base",
      purpose: "Protein booster and chocolate flavor base.",
      effects: ["Adds protein", "Adds chocolate flavor", "Can make dessert flavors richer"],
      bestRange: "1/2 to 1 scoop"
    },
    whipped_topping: {
      id: "whipped_topping",
      name: "Zero Sugar Whipped Topping",
      category: "base",
      purpose: "Adds air, volume, and a lighter mouthfeel.",
      effects: ["Creamier", "Fluffier", "More volume"],
      bestRange: "1/4 cup to 1/2 cup"
    },
    acacia_fiber: {
      id: "acacia_fiber",
      name: "Acacia Fiber",
      category: "base",
      purpose: "Thickener, stabilizer, and fiber source.",
      effects: ["Thicker texture", "Better stability", "Can become gummy if overused"],
      bestRange: "1 tsp to 1 tbsp"
    },
    vanilla_pudding: {
      id: "vanilla_pudding",
      name: "Vanilla Pudding Mix",
      category: "base",
      purpose: "Thickens and adds vanilla flavor.",
      effects: ["Thicker", "Sweeter", "More classic dessert flavor"],
      bestRange: "1 to 2 tbsp"
    },
    cheesecake_pudding: {
      id: "cheesecake_pudding",
      name: "Cheesecake Pudding Mix",
      category: "base",
      purpose: "Thickens and adds cheesecake flavor.",
      effects: ["Richer", "Cheesecake note", "Pairs well with fruit and crust flavors"],
      bestRange: "1 to 2 tbsp"
    },
    chocolate_pudding: {
      id: "chocolate_pudding",
      name: "Chocolate Fudge Pudding Mix",
      category: "base",
      purpose: "Thickens and adds chocolate flavor.",
      effects: ["Richer chocolate", "More dessert-like", "Pairs with cookies or peanut butter"],
      bestRange: "1 to 2 tbsp"
    },
    lemon_pudding: {
      id: "lemon_pudding",
      name: "Lemon Pudding Mix",
      category: "base",
      purpose: "Thickens and adds lemon flavor.",
      effects: ["Citrus flavor", "Brighter taste", "Sweeter lemon profile"],
      bestRange: "1 to 2 tbsp"
    },
    banana_pudding: {
      id: "banana_pudding",
      name: "Banana Cream Pudding Mix",
      category: "base",
      purpose: "Thickens and adds banana cream flavor.",
      effects: ["Banana flavor", "Sweeter", "Dessert pie profile"],
      bestRange: "1 to 2 tbsp"
    },
    strawberries: { id:"strawberries", name:"Strawberries", category:"fruits", purpose:"Fruit flavor and volume.", effects:["Fresh fruit flavor", "More moisture", "Pairs well with cheesecake"], bestRange:"1/4 to 1/2 cup" },
    blueberries: { id:"blueberries", name:"Blueberries", category:"fruits", purpose:"Fruit flavor and color.", effects:["Berry flavor", "Softer texture after chilling", "Pairs well with vanilla"], bestRange:"1/4 to 1/2 cup" },
    banana: { id:"banana", name:"Banana", category:"fruits", purpose:"Fruit sweetness and banana flavor.", effects:["Sweeter", "Creamier", "Stronger banana flavor over time"], bestRange:"1/2 banana" },
    thin_chocolate_cookie: { id:"thin_chocolate_cookie", name:"Thin Chocolate Sandwich Cookie", category:"mixins", purpose:"Crunch and chocolate cookie flavor.", effects:["Crunch", "Dessert flavor", "Softens after chilling"], bestRange:"1 to 3 cookies" },
    graham_cracker: { id:"graham_cracker", name:"Graham Cracker", category:"mixins", purpose:"Pie crust flavor and crunch.", effects:["Crust flavor", "Crunch", "Softens into cheesecake-like texture"], bestRange:"1/2 to 1 sheet" },
    lemon_juice: { id:"lemon_juice", name:"Lemon Juice", category:"flavorings", purpose:"Bright citrus flavor.", effects:["Tartness", "Freshness", "Cuts sweetness"], bestRange:"1 tsp to 1 tbsp" },
    key_lime_juice: { id:"key_lime_juice", name:"Key Lime Juice", category:"flavorings", purpose:"Key lime tartness.", effects:["Tart citrus", "Pie flavor", "Fresh finish"], bestRange:"1 tsp to 1 tbsp" },
    vanilla_extract: { id:"vanilla_extract", name:"Vanilla Extract", category:"flavorings", purpose:"Rounds out sweetness and dessert flavor.", effects:["Warmer vanilla flavor", "Better sweetness perception"], bestRange:"1/4 to 1/2 tsp" }
  },
  products: {
    siggis_plain_protein: {
      id:"siggis_plain_protein", ingredient:"plain_protein_yogurt", brand:"Siggi's", name:"Siggi's Protein Plain Skyr",
      serving:{ kitchen:"1 container", metric:"170 g", calories:170, protein:25, carbs:8, fat:0, fiber:0 },
      notes:"Current default yogurt. Thick, high protein, tangy."
    },
    chobani_nonfat: {
      id:"chobani_nonfat", ingredient:"plain_protein_yogurt", brand:"Chobani", name:"Chobani Nonfat Plain Greek Yogurt",
      serving:{ kitchen:"1 cup", metric:"227 g", calories:120, protein:21, carbs:6, fat:0, fiber:0 },
      notes:"Optional yogurt substitute."
    },
    tl_vanilla: {
      id:"tl_vanilla", ingredient:"vanilla_whey", brand:"Transparent Labs", name:"Transparent Labs French Vanilla Whey Isolate",
      serving:{ kitchen:"1 scoop", metric:"34.3 g", calories:130, protein:28, carbs:1, fat:0.5, fiber:0 },
      notes:"Current vanilla protein default."
    },
    tl_chocolate: {
      id:"tl_chocolate", ingredient:"chocolate_whey", brand:"Transparent Labs", name:"Transparent Labs Milk Chocolate Whey Isolate",
      serving:{ kitchen:"1 scoop", metric:"34.9 g", calories:130, protein:28, carbs:1, fat:1, fiber:0 },
      notes:"Current chocolate protein default."
    },
    cool_whip_zero: {
      id:"cool_whip_zero", ingredient:"whipped_topping", brand:"Cool Whip", name:"Cool Whip Zero Sugar Whipped Topping",
      serving:{ kitchen:"2 tbsp", metric:"9 g", calories:20, protein:0, carbs:3, fat:1, fiber:0 },
      notes:"Adds volume and fluffiness."
    },
    anthonys_acacia: {
      id:"anthonys_acacia", ingredient:"acacia_fiber", brand:"Anthony's", name:"Anthony's Organic Acacia Senegal Powder",
      serving:{ kitchen:"1 tsp", metric:"2.5 g", calories:5, protein:0, carbs:2, fat:0, fiber:2 },
      notes:"Thickener and stabilizer."
    },
    jello_sf_vanilla: {
      id:"jello_sf_vanilla", ingredient:"vanilla_pudding", brand:"Jell-O", name:"Jell-O Sugar Free Vanilla Pudding Mix",
      serving:{ kitchen:"1/4 package", metric:"7 g", calories:20, protein:0, carbs:5, fat:0, fiber:0 },
      notes:"Thickens and adds vanilla flavor."
    },
    jello_sf_cheesecake: {
      id:"jello_sf_cheesecake", ingredient:"cheesecake_pudding", brand:"Jell-O", name:"Jell-O Sugar Free Cheesecake Pudding Mix",
      serving:{ kitchen:"1/4 package", metric:"7 g", calories:25, protein:0, carbs:6, fat:0, fiber:0 },
      notes:"Cheesecake flavor base."
    },
    jello_sf_chocolate: {
      id:"jello_sf_chocolate", ingredient:"chocolate_pudding", brand:"Jell-O", name:"Jell-O Sugar Free Chocolate Fudge Pudding Mix",
      serving:{ kitchen:"1/4 package", metric:"8 g", calories:30, protein:0, carbs:6, fat:0, fiber:0 },
      notes:"Chocolate fudge flavor base."
    },
    jello_lemon: {
      id:"jello_lemon", ingredient:"lemon_pudding", brand:"Jell-O", name:"Jell-O Lemon Pudding & Pie Filling",
      serving:{ kitchen:"1/4 package", metric:"24 g", calories:90, protein:0, carbs:22, fat:0, fiber:0 },
      notes:"Regular lemon pudding mix."
    },
    jello_banana: {
      id:"jello_banana", ingredient:"banana_pudding", brand:"Jell-O", name:"Jell-O Banana Cream Pudding Mix",
      serving:{ kitchen:"1/4 package", metric:"24 g", calories:90, protein:0, carbs:22, fat:0, fiber:0 },
      notes:"Regular banana cream pudding mix."
    },
    usda_strawberries: { id:"usda_strawberries", ingredient:"strawberries", brand:"Generic", name:"Strawberries", serving:{ kitchen:"1/2 cup", metric:"75 g", calories:24, protein:0.5, carbs:6, fat:0, fiber:2 }, notes:"Fresh or frozen unsweetened." },
    usda_blueberries: { id:"usda_blueberries", ingredient:"blueberries", brand:"Generic", name:"Blueberries", serving:{ kitchen:"1/2 cup", metric:"75 g", calories:43, protein:0.5, carbs:11, fat:0, fiber:2 }, notes:"Fresh or frozen unsweetened." },
    usda_banana: { id:"usda_banana", ingredient:"banana", brand:"Generic", name:"Banana", serving:{ kitchen:"1/2 medium", metric:"59 g", calories:53, protein:0.6, carbs:13.5, fat:0, fiber:1.5 }, notes:"Adds sweetness and body." },
    oreo_thins: { id:"oreo_thins", ingredient:"thin_chocolate_cookie", brand:"Oreo", name:"Oreo Thins", serving:{ kitchen:"3 cookies", metric:"29 g", calories:130, protein:1, carbs:18, fat:6, fiber:1 }, notes:"Optional product for thin chocolate sandwich cookie." },
    honeymaid_graham: { id:"honeymaid_graham", ingredient:"graham_cracker", brand:"Honey Maid", name:"Honey Maid Graham Crackers", serving:{ kitchen:"4 squares", metric:"31 g", calories:130, protein:2, carbs:24, fat:3, fiber:1 }, notes:"Optional crust-style mix-in." },
    santa_cruz_lemon: { id:"santa_cruz_lemon", ingredient:"lemon_juice", brand:"Santa Cruz", name:"Santa Cruz Organic Lemon Juice", serving:{ kitchen:"1 tbsp", metric:"15 mL", calories:0, protein:0, carbs:0, fat:0, fiber:0 }, notes:"Lemon flavoring." },
    key_west_lime: { id:"key_west_lime", ingredient:"key_lime_juice", brand:"Nellie & Joe's", name:"Key West Lime Juice", serving:{ kitchen:"1 tbsp", metric:"15 mL", calories:0, protein:0, carbs:0, fat:0, fiber:0 }, notes:"Key lime flavoring." },
    generic_vanilla_extract: { id:"generic_vanilla_extract", ingredient:"vanilla_extract", brand:"Generic", name:"Vanilla Extract", serving:{ kitchen:"1 tsp", metric:"5 mL", calories:12, protein:0, carbs:0.5, fat:0, fiber:0 }, notes:"Rounds out dessert flavor." }
  },
  defaultSupplies: {
    plain_protein_yogurt:"siggis_plain_protein",
    vanilla_whey:"tl_vanilla",
    chocolate_whey:"tl_chocolate",
    whipped_topping:"cool_whip_zero",
    acacia_fiber:"anthonys_acacia",
    vanilla_pudding:"jello_sf_vanilla",
    cheesecake_pudding:"jello_sf_cheesecake",
    chocolate_pudding:"jello_sf_chocolate",
    lemon_pudding:"jello_lemon",
    banana_pudding:"jello_banana",
    strawberries:"usda_strawberries",
    blueberries:"usda_blueberries",
    banana:"usda_banana",
    thin_chocolate_cookie:"oreo_thins",
    graham_cracker:"honeymaid_graham",
    lemon_juice:"santa_cruz_lemon",
    key_lime_juice:"key_west_lime",
    vanilla_extract:"generic_vanilla_extract"
  },
  formulas: [
    {
      id:"banana_cream_pie", name:"Banana Cream Pie", description:"A banana pudding-style fluff with a creamy pie profile.", inspiredBy:null,
      ingredients:[
        amt("plain_protein_yogurt",1,[.75,1,1.25],"base"), amt("vanilla_whey",1,[.5,1],"base"), amt("banana_pudding",.33,[.25,.33,.5],"base"), amt("whipped_topping",2,[1,2,4],"base"), amt("acacia_fiber",1,[.5,1,2],"base"), amt("banana",1,[.5,1,1.5],"fruits")
      ],
      procedure:["Add yogurt to the mixing bowl.","Add whey, pudding mix, whipped topping, and acacia fiber.","Mix until smooth and slightly fluffy.","Fold in banana.","Refrigerate 15–30 minutes."]
    },
    {
      id:"birthday_cake", name:"Birthday Cake", description:"Vanilla-forward fluff with a sweet celebration profile.", inspiredBy:null,
      ingredients:[amt("plain_protein_yogurt",1,[.75,1,1.25],"base"),amt("vanilla_whey",1,[.5,1],"base"),amt("vanilla_pudding",.33,[.25,.33,.5],"base"),amt("whipped_topping",2,[1,2,4],"base"),amt("acacia_fiber",1,[.5,1,2],"base"),amt("vanilla_extract",.5,[.25,.5,1],"flavorings")],
      procedure:["Add yogurt to the mixing bowl.","Add whey, pudding mix, whipped topping, and acacia fiber.","Mix until smooth.","Add vanilla extract and fold gently.","Refrigerate 15–30 minutes."]
    },
    {
      id:"blueberry_cheesecake", name:"Blueberry Cheesecake", description:"Cheesecake fluff with blueberries for a bright dessert flavor.", inspiredBy:null,
      ingredients:[amt("plain_protein_yogurt",1,[.75,1,1.25],"base"),amt("vanilla_whey",1,[.5,1],"base"),amt("cheesecake_pudding",.33,[.25,.33,.5],"base"),amt("whipped_topping",2,[1,2,4],"base"),amt("acacia_fiber",1,[.5,1,2],"base"),amt("blueberries",1,[.5,1,1.5],"fruits")],
      procedure:["Add yogurt to the mixing bowl.","Add whey, cheesecake pudding, whipped topping, and acacia fiber.","Mix until smooth and thick.","Fold in blueberries.","Refrigerate 15–30 minutes."]
    },
    {
      id:"chocolate", name:"Chocolate", description:"Simple chocolate fluff built from a chocolate protein and pudding base.", inspiredBy:null,
      ingredients:[amt("plain_protein_yogurt",1,[.75,1,1.25],"base"),amt("chocolate_whey",1,[.5,1],"base"),amt("chocolate_pudding",.33,[.25,.33,.5],"base"),amt("whipped_topping",2,[1,2,4],"base"),amt("acacia_fiber",1,[.5,1,2],"base")],
      procedure:["Add yogurt to the mixing bowl.","Add chocolate whey, chocolate pudding, whipped topping, and acacia fiber.","Mix until smooth and fluffy.","Refrigerate 15–30 minutes."]
    },
    {
      id:"cookies_and_cream", name:"Cookies & Cream", description:"Vanilla cream base with a thin chocolate sandwich cookie finish.", inspiredBy:null,
      ingredients:[amt("plain_protein_yogurt",1,[.75,1,1.25],"base"),amt("vanilla_whey",1,[.5,1],"base"),amt("vanilla_pudding",.33,[.25,.33,.5],"base"),amt("whipped_topping",2,[1,2,4],"base"),amt("acacia_fiber",1,[.5,1,2],"base"),amt("thin_chocolate_cookie",.67,[.33,.67,1],"mixins")],
      procedure:["Add yogurt to the mixing bowl.","Add vanilla whey, vanilla pudding, whipped topping, and acacia fiber.","Mix until smooth.","Fold in thin chocolate sandwich cookies last.","Refrigerate 15–30 minutes."]
    },
    {
      id:"key_lime_pie", name:"Key Lime Pie", description:"Cheesecake-style fluff with key lime and crust flavor.", inspiredBy:null,
      ingredients:[amt("plain_protein_yogurt",1,[.75,1,1.25],"base"),amt("vanilla_whey",1,[.5,1],"base"),amt("cheesecake_pudding",.33,[.25,.33,.5],"base"),amt("whipped_topping",2,[1,2,4],"base"),amt("acacia_fiber",1,[.5,1,2],"base"),amt("key_lime_juice",1,[.33,.67,1],"flavorings"),amt("graham_cracker",.25,[.125,.25,.5],"mixins")],
      procedure:["Add yogurt to the mixing bowl.","Add whey, cheesecake pudding, whipped topping, and acacia fiber.","Mix until smooth.","Fold in key lime juice.","Add graham cracker near the end.","Refrigerate 15–30 minutes."]
    },
    {
      id:"lemon_cheesecake", name:"Lemon Cheesecake", description:"Bright lemon cheesecake-style fluff.", inspiredBy:null,
      ingredients:[amt("plain_protein_yogurt",1,[.75,1,1.25],"base"),amt("vanilla_whey",1,[.5,1],"base"),amt("cheesecake_pudding",.33,[.25,.33,.5],"base"),amt("whipped_topping",2,[1,2,4],"base"),amt("acacia_fiber",1,[.5,1,2],"base"),amt("lemon_juice",1,[.33,.67,1],"flavorings")],
      procedure:["Add yogurt to the mixing bowl.","Add whey, cheesecake pudding, whipped topping, and acacia fiber.","Mix until smooth.","Add lemon juice and fold gently.","Refrigerate 15–30 minutes."]
    },
    {
      id:"peanut_butter_cup", name:"Peanut Butter Cup", description:"Chocolate base ready for peanut butter style experiments.", inspiredBy:null,
      ingredients:[amt("plain_protein_yogurt",1,[.75,1,1.25],"base"),amt("chocolate_whey",1,[.5,1],"base"),amt("chocolate_pudding",.33,[.25,.33,.5],"base"),amt("whipped_topping",2,[1,2,4],"base"),amt("acacia_fiber",1,[.5,1,2],"base")],
      procedure:["Add yogurt to the mixing bowl.","Add chocolate whey, chocolate pudding, whipped topping, and acacia fiber.","Mix until smooth and thick.","Add your peanut butter-style mix-in if desired.","Refrigerate 15–30 minutes."]
    },
    {
      id:"strawberry_cheesecake", name:"Strawberry Cheesecake", description:"Cheesecake fluff with strawberry folded in.", inspiredBy:null,
      ingredients:[amt("plain_protein_yogurt",1,[.75,1,1.25],"base"),amt("vanilla_whey",1,[.5,1],"base"),amt("cheesecake_pudding",.33,[.25,.33,.5],"base"),amt("whipped_topping",2,[1,2,4],"base"),amt("acacia_fiber",1,[.5,1,2],"base"),amt("strawberries",1,[.5,1,1.5],"fruits")],
      procedure:["Add yogurt to the mixing bowl.","Add whey, cheesecake pudding, whipped topping, and acacia fiber.","Mix until smooth and thick.","Fold in strawberries.","Refrigerate 15–30 minutes."]
    },
    {
      id:"vanilla_bean", name:"Vanilla Bean", description:"Simple vanilla fluff that works as a base for experiments.", inspiredBy:null,
      ingredients:[amt("plain_protein_yogurt",1,[.75,1,1.25],"base"),amt("vanilla_whey",1,[.5,1],"base"),amt("vanilla_pudding",.33,[.25,.33,.5],"base"),amt("whipped_topping",2,[1,2,4],"base"),amt("acacia_fiber",1,[.5,1,2],"base"),amt("vanilla_extract",.5,[.25,.5,1],"flavorings")],
      procedure:["Add yogurt to the mixing bowl.","Add vanilla whey, vanilla pudding, whipped topping, and acacia fiber.","Mix until smooth.","Add vanilla extract and fold gently.","Refrigerate 15–30 minutes."]
    }
  ].sort((a,b)=>a.name.localeCompare(b.name))
};
function amt(ingredient, multiplier, options, group){ return { ingredient, multiplier, options, group }; }
