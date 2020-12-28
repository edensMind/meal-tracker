import axios from 'axios';

const headers = {
    headers: {
        'content-type': 'application/json'
    }
};

// DB Calls GETs
const GetUser = () => axios.get(`/api/getUsername`);
const GetAllFood = () => axios.get(`/api/food`);
const GetFoodById = (id) => axios.get(`/api/food/${id}`);
const GetMealsForTime = (startDate, endDate) => axios.get(`/api/meal/history/${startDate}/${endDate}`);

// DB Calls POSTs
const CreateNewFood = (foodData) => {
    foodData = {
        "description": "Apples",
        "calories": 50,
        "servingSize": "1 cup",
        "image": "apples.png",
    };
    return axios.post(`/api/food`, foodData, headers);
};
const CreateNewMeal = (foodData) => {
    foodData = {
        "food": []
    };
    return axios.post(`/api/meal`, foodData, headers);
};

// DB Calls PUTs
const AddFoodToMeal = (id, foodData) => {
    foodData = {
        "food": []
    };
    return axios.put(`/api/meal/${id}`, foodData, headers);
};
const EditFoodItem = (id, foodData) => {
    foodData = {
        "description": "Apples",
        "calories": 50,
        "servingSize": "1 cup",
        "image": "apples.png",
    };
    return axios.put(`/api/food/${id}`, foodData, headers);
};

// DB Calls DELETEs
const RemoveFoodItem = (id) => axios.delete(`/api/food/${id}`);
const RemoveFoodFromMeal = (mealId, foodId) => axios.delete(`/api/mealFood/${mealId}/${foodId}`);
const RemoveMeal = (id) => axios.delete(`/api/meal/${id}`);

//Exports
export { 
    GetUser,
    GetAllFood,
    GetFoodById,
    GetMealsForTime,
    CreateNewFood,
    CreateNewMeal,
    AddFoodToMeal,
    EditFoodItem,
    RemoveFoodItem,
    RemoveFoodFromMeal,
    RemoveMeal,
};