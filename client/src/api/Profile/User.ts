import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_NODE_URL,
});

const loginUser = async (email: string, password: string): Promise<boolean> => {
    const data = {
        email: email,
        password: password
    };

    const result: boolean = await axiosInstance.post('/users/login', data)
        .then(res => {
            if (res.data.success) {
                Cookies.set('token', res.data.token, { expires: 7, path: '/' });
                return true;
            }
            return false;
        })
        .catch(err => {
            console.error(err);
            return false;
        });

    return result;
};

const verifyUser = async (token: any) => {
    const result: boolean = await axiosInstance.get('/users/verify', {
        headers: { Authorization: token },
    })
        .then(res => {
            return res.data.success;
        })
        .catch(err => {
            console.error(err);
            return false;
        });

    return result;
}

const registerUser = async (firstName: string, lastName: string, password: string, email: string, phoneNumber: string) => {
    const data = {
        firstName,
        lastName,
        password,
        email,
        phoneNumber,
    };

    const result = await axiosInstance.post('/users/register', data)
        .then(res => {
            return res.data.success;
        })
        .catch(err => {
            console.error(err);
            return false;
        });

    return result;
}

const getUserPortfolios = async (id) => {
    const data = {
        profileId: id
    };

    const result = await axiosInstance.post('/users/portfolios', data)
        .then(res => {
            return res.data.portfolios;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
    
    return result;
}

export {
    loginUser,
    verifyUser,
    registerUser,
    getUserPortfolios
};
