// D O M   C O N T E N T   L O A D E D
document.addEventListener("DOMContentLoaded", function() {

// V A R I A B L E S

const searchButton = document.querySelector("#searchResult");
const foodInput = document.querySelector("#food");
const displaySearch = document.querySelector(".searchResultText span");
const gridContainer = document.querySelector(".grid");
const overlay = document.querySelector(".overlay")
const modalSection = document.querySelector(".modalSection");
const mealImageContainer = document.querySelector("#mealImageContainer");
const mealTitle = document.querySelector("#mealTitle");
const mealIngredients = document.querySelector("#mealIngredients");
const mealInstructions = document.querySelector("#mealInstructions");
const closeModalButton = document.querySelector("#closeModal");
const body = document.querySelector("body");


// F E T C H  &  D E C L A R E

async function fetchMeals(searchQuery){
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
        const data = await response.json();
        displayMeals(data.meals, searchQuery);
    } catch (error) {
        console.error("Download failure", error)
    }
}

// C O N S U M E  &  D I S P L A Y

function displayMeals(meals, searchQuery) {
    gridContainer.innerHTML = '';

    displaySearch.textContent = searchQuery;

    //No result:
    if(!meals) {
        gridContainer.innerHTML = "<p>No result</p>";
        gridContainer.style.width = '100vw';
        gridContainer.style.fontSize = '2rem';
        gridContainer.style.fontFamily = 'Fira Sans';
        gridContainer.style.textTransform = 'Uppercase';
        gridContainer.style.fontWeight = '600';
        const noResultText = gridContainer.querySelector('p');
        noResultText.style.gridColumn = '1/-1';
        noResultText.style.textAlign = 'center'
        noResultText.style.backgroundColor = '#F4D35E';
        noResultText.style.color = '#F87666';

        return;
    }

    //Grid creation:
    meals.forEach((meal) => {
        //1 div / 1 meal
        const mealDiv = document.createElement("div");
        mealDiv.classList.add("meal-item");

        //Add image
        const mealImage = document.createElement("img");
        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;
        mealDiv.appendChild(mealImage);

        //Add title
        const mealTitle = document.createElement("h3");
        mealTitle.textContent = meal.strMeal;
        mealDiv.appendChild(mealTitle);

        //Open Modal
        mealDiv.addEventListener("click", () => showMealDetails(meal))

        //Add to grid
        gridContainer.appendChild(mealDiv);
    })
}

// O P E N   M O D A L

function showMealDetails(meal){
    //Details
    overlay.classList.remove("hide");
    modalSection.classList.remove("hide");
    body.style.overflowY = 'hidden';

    //Add image
    mealImageContainer.style.backgroundImage = `url(${meal.strMealThumb})`;
    mealImageContainer.style.backgroundSize = "cover";

    //Add title
    mealTitle.textContent = meal.strMeal;

    //Ingredients list (20max)
    mealIngredients.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        //Filtrer que l'ingrédient existe
        if(ingredient){
            const listItem = document.createElement("li");
            listItem.textContent = `${measure} ${ingredient}`
            mealIngredients.appendChild(listItem);
        }
}

    //Add instructions
    mealInstructions.textContent = meal.strInstructions;
}

// C L O S E   M O D A L  F U N C T I O N
closeModalButton.addEventListener("click", () => closingModal());
overlay.addEventListener("click", () => closingModal());

function closingModal(){
    modalSection.classList.add('hide');
    overlay.classList.add('hide');
    body.style.overflowY = 'auto';
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalSection.classList !== 'hide') {
        closingModal();
    }
});

// S E A R C H   E V E N T
searchButton.addEventListener("click", () => searchMeal());

foodInput.addEventListener("keypress", (e) => {
    if(e.key === 'Enter') searchMeal();
});

function searchMeal(){
    const searchQuery = foodInput.value;
    fetchMeals(searchQuery);
} ;
});