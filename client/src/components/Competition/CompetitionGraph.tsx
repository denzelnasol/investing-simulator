import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { Chart } from 'primereact/chart';
import Card from 'components/PrimeReact/Card/Card';
import { getHistory, getHistoryByEmail } from 'api/Profile/User';

function CompetitionGraph({ ...props }) {

    // Referenced from chatGPT
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


    // ** Graph Data ** //
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const options = {
        responsive: true,
        legend: {
            position: 'top',
        },
    };

    useEffect(() => {
        if (!props.competition) {
            return;
        }

        const token = Cookies.get('token');

        async function getUsersBalanceHistory(players) {

            const playerDataSets = players.map((player) => {
                return {
                    label: player.firstName,
                    backgroundColor: getRandomColor(),
                    data: [],
                    email: player.email,
                }
            })

            const history = await getHistory(token);
            const labels = history.history.map((date: any) => {
                return new Date(date.time).toDateString();
            })
            labels.push(new Date().toDateString());

            for (const dataSet of playerDataSets) {
                const history = await getHistoryByEmail(token, dataSet.email, props.competitionId);
                dataSet.data = history.history.map((h: any) => h.balance);
                dataSet.data.push(history.currentBalance);
            }

            setChartData(prevChart => ({ ...prevChart, datasets: playerDataSets, labels }))
        }

        getUsersBalanceHistory(props.competition.rankings);
    }, [props.competition]);

    return (
        <Card className="mb-3">
            <h1 className="m-0 text-gray-700">Performance Timeline</h1>
            <Chart
                type="line"
                data={chartData}
                options={options}
            />
        </Card>
    );
}

export default CompetitionGraph