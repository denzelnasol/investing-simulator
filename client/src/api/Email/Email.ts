import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_NODE_URL}/email`,
  });


const sendEmail = async (emails) => {
    const data = {
        emails
    };
    
    try {
        await axiosInstance.post('/send', data);
    } catch (e) {
        console.log(e);
    }
};

export {
    sendEmail
}