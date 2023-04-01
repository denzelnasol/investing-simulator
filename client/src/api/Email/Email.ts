import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_NODE_URL}/email`,
  });


const sendEmail = async (emails: Array<string>, competitionName: string, competitionId: string) => {
    const data = {
        emails,
        competitionName,
        competitionId,
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