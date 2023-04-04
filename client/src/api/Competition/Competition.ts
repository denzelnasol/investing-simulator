import axios from 'axios';
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_NODE_URL}/competitions`,
});

const createCompetition = async ({ entry_points, max_num_players, start_balance, start_time, end_time, name }) => {
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
    const result = await axiosInstance.post('/create', data, { headers });
    return result.status;
}


async function getCompetitionData(competitionId: string) {
    const result = await axiosInstance.get(`${competitionId}`)
        .then(res => {
            console.log(res);
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
    });
    return result;
}

async function updateCompetition(data) {
    const result = await axiosInstance.post(`/update`, data);
    return result.status;
}

async function startCompetition(competitionId: string) {
    const data = { competitionId };
    const result = await axiosInstance.post('/start', data);
    return result.status;
}

async function endCompetition(competitionId: string) {
    const data = { competitionId };
    const result = await axiosInstance.post('/end', data);
    return result.status;
}

export {
    getCompetitionData,
    acceptInvite,
    createCompetition,
    updateCompetition,
    startCompetition,
    endCompetition
};
