require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); 
const app = express();

app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2'; 

const FoodItem = require('./models/FoodItem');  

app.post('/api/calories', async (req, res) => {
    try {
        const { foodDescription } = req.body;

         const food = await FoodItem.findOne({ name: foodDescription.toLowerCase() });

        if (food) {
            return res.json({ calories: food.calories });
        }

        const calories = await getCaloriesFromExternalAPI(foodDescription);
        res.json({ calories });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});


async function getCaloriesFromExternalAPI(foodDescription) {
    const prompt = `How many calories are there in a serving of ${foodDescription}? Please provide the number of calories.`;

    const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${HF_API_KEY}`
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 20 }
        })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const output = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

      const match = output?.match(/\d+/);

    if (!match) {
        throw new Error('No calorie value found in response');
    }

    return parseInt(match[0]);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
