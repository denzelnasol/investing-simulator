import axios from 'axios';
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_NODE_URL}/competitions`,
  });

  export const createCompetition = async ({entry_points, max_num_players, start_balance, start_time, end_time, name}) => {
    const token = Cookies.get('token');
    const data = {
        entry_points,
        max_num_players,
        start_balance,
        start_time,
        end_time,
        name,
    };
    const headers = {
        Authorization: token
      };

    const result = await axiosInstance.post('/create', data,{headers})
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


async function getCompetitionData(competitionId: string) {
    const result = await axiosInstance.get(`${competitionId}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.error(err);
            return false;
        });

    return result;
};

async function acceptInvite(competitionId: string) {
    const token = Cookies.get('token');
    const result = await axiosInstance.get(`/join/${competitionId}`, {
        headers: { Authorization: token },
    })
    return result;
}

export {
    getCompetitionData,
    acceptInvite,
};
