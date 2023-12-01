require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');



/**
 * get /
 * home page
 */

exports.homepage = async(req, res) => {

try{   
const limitNumber = 5;
const categories = await Category.find({}).limit(limitNumber);
const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);


const food = { latest, thai, american, chinese };



res.render('index', {title: 'Cooking Blog - Home', categories, food});
}

catch(error){
    res.status(500).send({message: error.message || "Error Occured"});
}

}




/**
 * get / categories
 * categories
 */

exports.exploreCategories = async(req, res) => {

    try{  
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    
    res.render('categories', {title: 'Cooking Blog - Categories', categories});  
    }
    
    catch(error){   
        res.status(500).send({message: error.message || "Error Occured"});   
    }    
 }



/**
 * get / categories
 * categories
 */

exports.exploreCategories = async(req, res) => {

    try{  
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    
    res.render('categories', {title: 'Cooking Blog - Categories', categories});  
    }
    catch(error){   
        res.status(500).send({message: error.message || "Error Occured"});   
    }    
 }




 
/**
 * get / categories/:id
 * categoriesBy id
 */

exports.exploreCategoriesById = async(req, res) => {

    try{  

        let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({'category':categoryId }).limit(limitNumber);
    
    res.render('categories', {title: 'Cooking Blog - Categories', categoryById});  
    }
    
    catch(error){   
        res.status(500).send({message: error.message || "Error Occured"});   
    }    
 }




//  get recipes/ :id
// recipe page



exports.exploreRecipe = async(req, res) => {

    try{  
   
   let recipeId = req.params.id;

   const recipe = await Recipe.findById(recipeId);
    
    res.render('recipe', {title: 'Cooking Blog - Recipe', recipe});  
    }
    
    catch(error){   
        res.status(500).send({message: error.message || "Error Occured"});   
    }    
 }





//  post/search
// search


exports.searchRecipe = async(req, res) => {

 //search term

try{
    let searchTerm = req.body.searchTerm;

    let recipe = await Recipe.find( { $text : {$search: searchTerm, $diacriticSensitive: true} });
    res.render('search', {title: 'Cooking Blog - Search', recipe});  
}
catch(error){
    res.status(500).send({message: error.message || "Error Occured"});
}
   
}






 
//  get/ explorelatest
//  explorelatest



exports.exploreLatest = async(req, res) => {

    try{  
   
   const limitNumber = 20;
   const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    res.render('explore-latest', {title: 'Cooking Blog - Explore-Latest', recipe});  
    }
    
    catch(error){   
        res.status(500).send({message: error.message || "Error Occured"});   
    }    
 }





 //get/exploreRandom
//explore random as json

 
exports.exploreRandom = async(req, res) => {

    try{  
   
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();

    res.render('explore-random', {title: 'Cooking Blog - Explore-Latest', recipe});  
    }
    
    catch(error){   
        res.status(500).send({message: error.message || "Error Occured"});   
    }    
 }








 //get/submitRecipe
//submit Recipe
 
exports.submitRecipe = async(req, res) => { 
   
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

    res.render('submit-recipe', {title: 'Cooking Blog - Submit-Recipe', infoErrorsObj, infoSubmitObj});  
    }
   



 //POST/submitRecipe
//submit Recipe
 
exports.submitRecipeOnPost = async(req, res) => { 


    try{



        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(req.files || Object.keys(req.files).length === 0 ){
            console.log('No Files were uploaded');
        }

        else{


            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err);
            })

        }






        const newRecipe = new Recipe({
 
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName

        });

        await newRecipe.save();



        req.flash('infoSubmit', 'Recipe has been added.') 
        res.redirect('/submit-recipe');      

    }

    catch(error){
        // req.json(error);
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');      

    }
   
 }




//delete recipe
 
//  async function deleteRecipe(){

//     try{

//         const res = await Recipe.deleteOne( { name: 'New Chocolate Cake'  });
//         res.n;   //no of documents
//         res.nModified; //no of Modified documents
//     }

//     catch(error){



//     }
//  }


//  deleteRecipe();










//update recipe


//  async function updateRecipe(){

//     try{

//         const res = await Recipe.updateOne({name: 'fruits'}, { $set: { name: 'new recipe' } });
//         res.n;   //no of documents
//         res.nModified; //no of Modified documents
//     }

//     catch(error){

//         console.log(error);

//     }
//  }


//  updateRecipe();









     
    

 async function insertDymmyRecipeData(){
    try{
        await Recipe.insertMany([
            {
                "name": "Alfajores",
                "description":`

                 "This classic, South American alfajores recipe is filled with melt-in-your-mouth dulce de leche and rolled in shredded coconut. They are so soft, delicate, decadent, 
                 and so easy to make! You’ll love how the different textures come together to create an amazing cookie. ",

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "1/2 cups (200g) all-purpose flour",
                    "2 1/8 cups (300g) cornstarch",
                    "2 teaspoons baking powder",
                    "1/2 teaspoon baking soda",
                    "1 and 3/4 sticks (200g) unsalted butter, at room temperature",
                    
                ],
                
                "category":"American",
                "image": "american2.jpg"
            },

            {
                "name": "Dal Makhani ",
                "description":`
                
                 "Dal Makhani is one of the most popular Indian dals, and this vegan version makes no sacrifices. The flavors are complex and the texture
                  is velvety and luxurious. It's a special occasion dish that will blow your mind! Stovetop and Instant Pot instructions.",

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/crab-cakes/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "cup whole black lentil ((200 grams black gram - whole urad dal))",
                    "¼ cup rajma ((red kidney beans) (optional))",
                    "4 cups water (for pressure cooking - more for pot)",
                    "3 tablespoons unsalted butter ((divided - 1 ½ tbsp + 1 ½ tbsp))",
                    "1 tablespoon ghee",

                ],
                "category":"Indian",
                "image": "indian1.jpg"
            },

            {
                "name": "Fluffy American pancakes",
                "description":`
                
                This easy American pancake recipe makes really light and fluffy pancakes that are great for making a 
                special weekend brunch from scratch. Try adding a large handful of fresh blueberries to the batter before cooking.,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "135g/4¾oz plain flour",
                    "1 tsp baking powder",
                    "½ tsp salt",
                    "2 tbsp caster sugar",
                    "130ml/4½fl oz milk",

                ],
                "category":"American",
                "image": "american1.jpg"
            },

            {
                "name": "Sausage pasta",
                "description":`
                
                If you are looking for easy one-pot pasta meal recipes, try this one-pot penne pasta with sausage. In this recipe, you will learn 
                how to cook delicious pasta for dinner by throwing all of the ,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "6 small russet potatoes (, scrubbed, rinsed and dried (do not peel))",
                    "5 tablespoons unsalted butter",
                    "5 garlic cloves (, minced)",
                    "salt and fresh ground pepper (, to taste)",
                    "1 cup Italian shredded cheese (, optional)",

                ],
                "category":"American",
                "image": "american3.jpg"
            },

            {
                "name": "Burger",
                "description":`
                
                If you are looking for easy one-pot pasta meal recipes, try this one-pot penne pasta with sausage. In this recipe, you will learn 
                how to cook delicious burger,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "Homemade Burger",
                    "Seafood Chowder",
                    "Fried Green Tomatoes",
                    "Chicago Style Deep Dish Pizza",
                    "Apple Pie",

                ],
                "category":"American",
                "image": "american4.jpg"
            },

            {
                "name": "Cherry Puff Pastery",
                "description":`
                
                Twisted and flaky, fruity and chocolatey, this pastry is 
                all I ever want for breakfast from here on ...,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "12 ounces frozen tart cherries",
                    "3 tablespoons cornstarch",
                    "1/3 cup granulated sugar",
                    "1/2 teaspoon vanilla extract",
                    "1/4 teaspoon almond extract",

                ],
                "category":"American",
                "image": "american5.jpg"
            },

            {
                "name": "Noodles ",
                "description":`
                
                
                Twisted and flaky, fruity and chocolatey, this pastry is 
                all I ever want for breakfast from here on ...,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "6 small russet potatoes (, scrubbed, rinsed and dried (do not peel))",
                    "5 tablespoons unsalted butter",
                    "5 garlic cloves (, minced)",
                    "salt and fresh ground pepper (, to taste)",
                    "1 cup Italian shredded cheese (, optional)",

                ],
                "category":"Chinese",
                "image": "chinese1.jpg"
            },

            {
                "name": "Crispy Chinese Chicken ",
                "description":`
                
                Chinese crispy shredded chicken coated in a sweet and chilli sauce. Not only is this recipe a real crowd pleaser 
                but it’s delicious and very simple to put together.
                It’s the perfect meal to make when you’re feeling for a Chinese fakeaway at home. Pieces of
                 chicken are marinated in a soy sauce mixture before being coated
                in cornflour and fried till crispy. It’s then tossed in a sweet chilli sauce which is the perfect glaze!,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "300 g Chicken Breast",
                    "100 g Cornflour Add More If Needed (See Notes)",
                   "1 tsp Garlic And Ginger Paste",
                    "1 Egg White",
                    "2 Spring Onions",
                    "Vegetable Oil",

                ],
                "category":"American",
                "image": "chinese2.jpg"
            },

            {
                "name": "Chinese chopsticks rolls",
                "description":`
                
                his is one of the favourite Chinese-style meatless snack that people of all age groups love to eat. It is a common restaurant dish in China and now in India also. It is delicious, easy-to-make and quite healthy if baked instead of deep frying. Prefer to eat home-made spring rolls with this recipe as 
                restaurant-made are generally fried ones. You need to try this one.,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "6 small russet potatoes (, scrubbed, rinsed and dried (do not peel))",
                    "5 tablespoons unsalted butter",
                    "5 garlic cloves (, minced)",
                    "salt and fresh ground pepper (, to taste)",
                    "1 cup Italian shredded cheese (, optional)",

                ],
                "category":"Chinese",
                "image": "chinese3.jpg"
            },

            {
                "name": "Noodles",
                "description":`
                
                Twisted and flaky, fruity and chocolatey, this pastry is 
                all I ever want for breakfast from here on ...,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "6 small russet potatoes (, scrubbed, rinsed and dried (do not peel))",
                    "5 tablespoons unsalted butter",
                    "5 garlic cloves (, minced)",
                    "salt and fresh ground pepper (, to taste)",
                    "1 cup Italian shredded cheese (, optional)",

                ],
                "category":"Chinese",
                "image": "chinese4.jpg"
            },

            {
                "name": "Southern fried chicken",
                "description":`
                
                Twisted and flaky, fruity and chocolatey, this pastry is 
                all I ever want for breakfast from here on ...,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "6 small russet potatoes (, scrubbed, rinsed and dried (do not peel))",
                    "5 tablespoons unsalted butter",
                    "5 garlic cloves (, minced)",
                    "salt and fresh ground pepper (, to taste)",
                    "1 cup Italian shredded cheese (, optional)",

                ],
                "category":"Indian",
                "image": "indian2.jpg"
            },

            {
                "name": "Microwave Fried Rice",
                "description":`
                
                Healthy, nutritious and delicious egg fried rice 
                made in microwave in minutes!,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                   " 1 teaspoon oil",
                    "1 egg, lightly whisked",
                    "1/2 cup rice, basmati, long grain or jasmine, rinsed (I used regular basmati)",
                    "1/2 cup chopped vegetables (I used carrots, bell peppers and green peas)",
                    "1 cup water",

                ],
                "category":"Chinese",
                "image": "chinese5.jpg"
            },

            {
                "name": "Spanish Paella",
                "description":`
                
                Here’s a stunning one pan dinner that’s made for celebrations: paella! This traditional Spanish rice dish has thousands of variations, but it’s always rice with an explosion of colorful toppings. This classic paella recipe is based on our travels through Spain. It stars saffron-scented rice, mixed colorful vegetables and shrimp, and it’s full of traditional flavor. 

                ,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "1 medium yellow onion",
                    "6 garlic cloves",
                    "2 to 3 roma or plum tomatoes (1 ½ cups finely chopped)",
                    "¼ cup olive oil, divided",
                    "1/2 pound shrimp, peel and deveined",
                    "1 ½ teaspoons smoked paprika, divided",
                    "¼ teaspoon red pepper flakes",
                    "1 large pinch saffron",

                ],
                "category":"Spanish",
                "image": "spanish2.jpg"
            },

            
            {
                "name": "Classic Gazpacho",
                "description":`
                Gazpacho is a cold tomato-based soup from the Andalusia region of Southern Spain. It’s made of raw, pureed vegetables and is now eaten around the world. An important thing about gazpacho: it’s intended as a refreshment on a hot day, not to be a filling main course! So it’s usually served as a starter or tapas recipe. There are a few similar Spanish soups, like salmorejo 
                (creamier and made with bread) and ajoblanco (a white garlic version). ,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                   " 2 pounds ripe quality tomatoes, cored and roughly chopped (about 3 large)",
                    "1/2 mediumcucumber, peeled and roughly chopped",
                    "1/2 red bell pepper, roughly chopped",
                    "1 tablespoon minced shallot",
                    "1 small garlic clove, peeled",
                    "1 cup olive oil",
                   

                ],
                "category":"Spanish",
                "image": "spanish3.jpg"
            },


            
            {
                "name": "Patats Bravas",
                "description":`
                
                So what are patatas bravas? Man, are you in for a treat! Patatas bravas are a traditional Spanish tapas recipe. You’ll see them at literally all the tapas bars in Spain. Literally! “Patatas bravas” means brave potatoes (how cute is that?), and these brave little potatoes are crisp fried deliciousness. What makes
                 them brave is the sauce, which varies based on each bar you go to.,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "6 small russet potatoes (, scrubbed, rinsed and dried (do not peel))",
                    "5 tablespoons unsalted butter",
                    "5 garlic cloves (, minced)",
                    "salt and fresh ground pepper (, to taste)",
                    "1 cup Italian shredded cheese (, optional)",

                ],
                "category":"Indian",
                "image": "spanis4.jpg"
            },

            
            


            {
                "name": "Salmorejo",
                "description":`
                
                Salmorejo is a famous, Spanish cold tomato soup. It’s a summertime ‘go-to’ in restaurants and households throughout Spain, but particularly in the south of Spain (Andalucia). It’s a standalone meal and a perfect dish for the hot summer days. It’s made from the best 
                ripe tomatoes, bread, garlic, sherry vinegar, and olive oil.  ,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "9 Roma Tomatoes Medium size, peeled and seeds removed",
                   " 2 cloves Garlic",
                   " 2 cups Bread Only inside from whole baguette or rustic white bread",
                    "2 teaspoon Sherry Vinegar",
                    "1/2 teaspoon Salt Or more to taste",
                    "1/4 cup Olive Oil Extra Virgin",

                ],
                "category":"Spanish",
                "image": "spanish5.jpg"
            },


            
            {
                "name": "Salmorejo",
                "description":`
                
                Salmorejo is a famous, Spanish cold tomato soup. It’s a summertime ‘go-to’ in restaurants and households throughout Spain, but particularly in the south of Spain (Andalucia). It’s a standalone meal and a perfect dish for the hot summer days. It’s made from the best 
                ripe tomatoes, bread, garlic, sherry vinegar, and olive oil.  ,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "9 Roma Tomatoes Medium size, peeled and seeds removed",
                   " 2 cloves Garlic",
                   " 2 cups Bread Only inside from whole baguette or rustic white bread",
                    "2 teaspoon Sherry Vinegar",
                    "1/2 teaspoon Salt Or more to taste",
                    "1/4 cup Olive Oil Extra Virgin",

                ],
                "category":"Thai",
                "image": "thai.jpg"
            },

            
            {
                "name": "Thai Sing Toukley",
                "description":`
                
                The key to our success is simple: providing quality consistent food that taste great every single time. We pride ourselves on serving our customers delicious genuine dishes like:

                Eat delicious food. Grab a drink. But most of all, relax! We thank you from the bottom of our hearts for your continued support.  ,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "9 Roma Tomatoes Medium size, peeled and seeds removed",
                   " 2 cloves Garlic",
                   " 2 cups Bread Only inside from whole baguette or rustic white bread",
                    "2 teaspoon Sherry Vinegar",
                    "1/2 teaspoon Salt Or more to taste",
                    "1/4 cup Olive Oil Extra Virgin",

                ],
                "category":"Thai",
                "image": "thai2.jpg"
            },

            
            {
                "name": "Sawadee Thai Cuisine",
                "description":`
                
                Sawadee Thai Cuisine is a famous, thai cold tomato soup. It’s a summertime ‘go-to’ in restaurants and households throughout Spain, but particularly in the south of Spain (Andalucia). It’s a standalone meal and a perfect dish for the hot summer days. It’s made from the best 
                ripe tomatoes, bread, garlic, sherry vinegar, and olive oil.  ,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "9 Roma Tomatoes Medium size, peeled and seeds removed",
                   " 2 cloves Garlic",
                   " 2 cups Bread Only inside from whole baguette or rustic white bread",
                    "2 teaspoon Sherry Vinegar",
                    "1/2 teaspoon Salt Or more to taste",
                    "1/4 cup Olive Oil Extra Virgin",

                ],
                "category":"Thai",
                "image": "thai3.jpg"
            },

            
            {
                "name": "Fresh Spring Rolls",
                "description":`
                These spring rolls are refreshing, colorful and fun to make. I left out tofu (you really can’t pack enough into the rolls to make it worthwhile) 
                and shrimp, since I don’t eat shrimp.  ,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "9 Roma Tomatoes Medium size, peeled and seeds removed",
                   " 2 cloves Garlic",
                   " 2 cups Bread Only inside from whole baguette or rustic white bread",
                    "2 teaspoon Sherry Vinegar",
                    "1/2 teaspoon Salt Or more to taste",
                    "1/4 cup Olive Oil Extra Virgin",

                ],
                "category":"Thai",
                "image": "thai5.jpg"
            },

            
            {
                "name": "Thai Vegan Red Curry ",
                "description":`
                
                This Vegan Thai Red Curry with Tofu is packed with bold flavours and fresh veggies!  ,

                Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/` ,
                "email": "sargambakshi@gmail.com",
                "ingredients": [
                    "1 16 ounce block of firm or extra firm tofu, pressed (for about 30 minutes)",
                   " 3 tablespoons coconut milk",
                    "1 teaspoon red curry paste",
                   "salt and pepper",
                    "2 teaspoons cornstarch",

                ],
                "category":"Thai",
                "image": "thai4.jpg.jpg"
            },


        ]);

    }

    catch(error){
        console.log('err', + error)
    }
 }

 insertDymmyRecipeData();



