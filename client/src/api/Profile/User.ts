import axios from 'axios';
import Cookies from 'js-cookie';


export const loginUser = async (email: string, password: string): Promise<boolean> => {
    const data = {
        email: email,
        password: password
    };
    
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_NODE_URL,
    });

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

export const verifyUser = async (token: any) => {
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_NODE_URL,
    });
    
    const result: boolean = await axiosInstance.get('/users/verify', {
        headers: { Authorization: token },
    })
        .then((res) => {
            if (res.data.success) {
                return true;
            }
            return false;
        })
        .catch((err) => {
            console.error(err);
            return false;
        });

    return result;
}

export const registerUser = async (firstName: string, lastName: string, password: string, email: string, phoneNumber: string) => {
    const data = {
        firstName,
        lastName,
        password,
        email,
        phoneNumber,
    };

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_NODE_URL,
    });
    

    const result = await axiosInstance.post('/users/register', data)
        .then(res => {
            if (res.data.success) {
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            console.error(err);
            return false;
        });

    return result;
}
