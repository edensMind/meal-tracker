import axios from 'axios';

const GetUser = axios.get(`/api/getUsername`);

export { 
    GetUser 
};