import axios from 'axios';

const GetUser = axios.get(`/api/getUsername`);

const GetAllFood = axios.get(`/api/food`);

const GetFoodById = (id) => axios.get(`/api/food/${id}`);

const GetMealsForTime = (startDate, endDate) => {
    // /api/meal/history/2020-12-26/2020-12-27
    return axios.get(`/api/meal/history/${startDate}/${endDate}`);
};

const CreateNewFood = (foodData) => {
    foodData = {
        "description": "Apples",
        "calories": 50,
        "servingSize": "1 cup",
        "image": "apples.png",
    };
    return axios.post(`/api/food`, foodData,{
        headers: {
            'content-type': 'application/json'
        }
    });
};

export { 
    GetUser,
    GetAllFood,
    GetFoodById,
    GetMealsForTime,
    CreateNewFood,
};