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

    // Referenced from chatGPT
    const hexToRgba = (hex: any, opacity: any) => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    
    // ** Graph Data ** //
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
        options: {},
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

        async function getUsersBalanceHistory(players: any) {

            const playerDataSets = players.map((player: any) => {
                const randomColour = getRandomColor();
                const rgbColour = hexToRgba(randomColour, 0.1);
                return {
                    label: player.firstName,
                    backgroundColor: rgbColour,
                    borderColor: randomColour,
                    data: [],
                    email: player.email,
                    fill: true,
                }
            })
            let labels = [];

            for (const dataSet of playerDataSets) {
                const history = await getHistoryByEmail(token, dataSet.email, props.competitionId);
                dataSet.data = history.history.map((h: any) => h.balance);
                dataSet.data.push(history.currentBalance);

                // Generate labels for each data point
                history.history.forEach((h: any) => {
                    const label = new Date(h.time).toLocaleDateString();
                    if (!labels.includes(label)) {
                        labels.push(label);
                    }
                });

                // Add the current balance date to the labels
                const currentDate = new Date().toLocaleDateString();
                if (!labels.includes(currentDate)) {
                    labels.push(currentDate);
                }
            }

            // Sort the labels in ascending order
            labels = labels.sort((a: any, b: any) => new Date(a).valueOf() - new Date(b).valueOf());

            setChartData({
                datasets: playerDataSets,
                labels,
                options: {
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM DD'
                                },
                            },
                        }],
                    },
                },
            });
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