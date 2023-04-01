import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_NODE_URL}/competitions`,
});

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

export {
    getCompetitionData,
};
