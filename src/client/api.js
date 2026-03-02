import axios from 'axios';
import { createAsyncStorage } from '@react-native-async-storage/async-storage';

axios.defaults.baseURL = 'https://api.samithwijesekara.me';
const storage = createAsyncStorage('appDb');

async function getToken() {
  const token=await storage.getItem('token');
  return token;
}

async function setToken(token) {
  await storage.setItem('token', token);
}

async function removeToken() {
  await storage.removeItem('token');
}

async function axiosClient(method = 'get', path, body = null, config = null) {
  try {
    if (method === 'post') {
      const res = await axios.post(path, body);
      return res;
    } else if (method === 'delete') {
      await axios.delete(path, config);
      return;
    } else {
      const result = await axios.get(path, config);
      return result;
    }
  } catch (error) {
    console.log(error);
    
  }
}

const api = {
  login: async (payload) => await axiosClient('post', '/login', payload),
  register: async (payload) => await axiosClient('post', '/auth/', payload),
  getExpenses: async () =>{
    const token=await getToken();
    return await axiosClient('get','/expense/load',null, {
      headers: { Authorization: `Bearer ${token}` },
    })},
};

export { api, removeToken, setToken, getToken };
