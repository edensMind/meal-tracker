import axios from 'axios';

const GetUser = axios.get(`/api/getUsername`);

const GetAllFood = axios.get(`/api/food`);

const GetFoodById = (id) => axios.get(`/api/food/${id}`);

export { 
    GetUser,
    GetAllFood,
    GetFoodById
};