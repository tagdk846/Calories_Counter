const API_URL = 'http://localhost:3001/api/calories';

const foodImages = {
    pizza: 'https://tse4.mm.bing.net/th/id/OIP.SEfXqwWqK1NNMpH9ZmNrgwHaE8?w=7513&h=5011&rs=1&pid=ImgDetMain',
    burger: 'https://images.freeimages.com/images/large-previews/530/burger-1320739.jpg',
    pasta: 'https://th.bing.com/th/id/R.fb3702d881db062ee5d68abfbf5e32f9?rik=CQb9ucXzE2B%2fHw&pid=ImgRaw&r=0',
    sushi: 'https://tse4.mm.bing.net/th/id/OIP.VzTMToMYzFc8v-9CCfqJQwHaE9?rs=1&pid=ImgDetMain',
    salad: 'https://tse3.mm.bing.net/th/id/OIP.5mH3m6atVE5M3xFEbDtQFwHaHa?rs=1&pid=ImgDetMain',
    friedChicken: 'https://tse4.mm.bing.net/th/id/OIP.pH5ENZ2AoAoqpfqSyG15jAHaEY?rs=1&pid=ImgDetMain',
    iceCream: 'https://thafd.bing.com/th/id/OIP.rW0r84sZ4cKBrZ2KcLlpUgHaE7?rs=1&pid=ImgDetMain',
    chocolateCake: 'https://thafd.bing.com/th/id/OIP.GF2tdh12ZqTP6wVZ1Qi_pwHaHa?rs=1&pid=ImgDetMain',
};

async function getNutritionInfo(foodDescription) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ foodDescription }),
        });

        if (!response.ok) {
            throw new Error('Failed to get calorie information');
        }

        const data = await response.json();
        if (data.calories) {
            return data.calories;
        } else {
            throw new Error('No calories data found');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to get calorie information. Please try again.');
        throw error;
    }
}

const foodUrlInput = document.getElementById('foodUrl');
const foodSelect = document.getElementById('foodSelect');
const analyzeBtn = document.getElementById('analyzeBtn');
const foodInfo = document.getElementById('foodInfo');
const nutritionInfo = document.getElementById('nutritionInfo');
const foodImage = document.getElementById('foodImage');
const foodName = document.getElementById('foodName');
const calories = document.getElementById('calories');
const protein = document.getElementById('protein');
const carbs = document.getElementById('carbs');
const fats = document.getElementById('fats');
const reasoning = document.getElementById('reasoning');

function initializeUI() {
    foodInfo.style.display = 'none';
    nutritionInfo.style.display = 'none';
}

async function analyzeFoodItem() {
    let foodItem = '';

    if (foodUrlInput.value.trim()) {
        const input = foodUrlInput.value.toLowerCase();
        foodItem = Object.keys(foodImages).find(key => input.includes(key)) || 'default';
    } else if (foodSelect.value) {
        foodItem = foodSelect.value;
    }

    if (!foodItem) {
        alert('Please enter a valid food link or select a food item.');
        return;
    }

    try {
        const cal = await getNutritionInfo(foodItem);

        foodInfo.style.display = 'block';
        nutritionInfo.style.display = 'block';
        foodName.textContent = foodItem.charAt(0).toUpperCase() + foodItem.slice(1);
        calories.textContent = `Calories: ${cal} kcal`;

        protein.style.display = 'none';
        carbs.style.display = 'none';
        fats.style.display = 'none';
        reasoning.style.display = 'none';

        // Display food image (default if not found)
        const imageUrl = foodImages[foodItem.toLowerCase()] || 'https://picsum.photos/200/200';
        foodImage.style.backgroundImage = `url(${imageUrl})`;
    } catch (error) {
        console.error('Failed to analyze food:', error);
    }
}

analyzeBtn.addEventListener('click', analyzeFoodItem);

initializeUI();
