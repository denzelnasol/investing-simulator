import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_NODE_URL,
});

const testCompetitionApiCall = async () => {

    const result = await axiosInstance.get('/competitions')
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.error(err);
            return false;
        });

    return result;
};


export {
    testCompetitionApiCall,
};
