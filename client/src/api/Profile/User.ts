import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_NODE_URL}/users`,
  });


const loginUser = async (email: string, password: string): Promise<boolean> => {
    const data = {
        email: email,
        password: password
    };
    
    const result: boolean = await axiosInstance.post('/login', data)
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
    const result: boolean = await axiosInstance.get('/verify', {
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

    const result = await axiosInstance.post('/register', data)
        .then(res => {
            return res.data.success;
        })
        .catch(err => {
            console.error(err);
            return false;
        });

    return result;
}

const getProfile = async (token: any) => {
    const result: any = await axiosInstance.get('/profile', {
        headers: { Authorization: token },
    })
    return result.data;
}

const getPortfolio = async (competitionId: string = null) => {
    const authToken = Cookies.get('token');

    const result: any = await axiosInstance.get('/portfolio', {
        headers: { Authorization: authToken },
        params: { competitionId }
    })
    return result.data;
}

const getCompetitionPortfolios = async (token) => {
    const result = await axiosInstance.get('/competition-portfolios', {
         headers: {Authorization: token}
    })
        .then(res => {
            return res.data.portfolios;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
    
    return result;
}


const getStocks = async (token: string, competitionId: string = null) => {
    console.log(competitionId);

    const result: any = await axiosInstance.get('/owned-stocks', {
        headers: { Authorization: token },
        params: { competitionId: competitionId }
    })  
    return result.data;
}

const getHistory = async (token: any, competitionName: string = null) => {
    const result: any = await axiosInstance.get('/history', {
        headers: { Authorization: token },
        params: { competitionName }
    });
    return result.data;
}


export {
    loginUser,
    verifyUser,
    registerUser,
    getProfile,
    getPortfolio,
    getCompetitionPortfolios,
    getStocks,
    getHistory,
}
