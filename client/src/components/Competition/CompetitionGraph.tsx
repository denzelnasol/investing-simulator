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

            var playerDataSets: any[] = players.map((player: any) => {
                let randomColour = getRandomColor();
                let rgbColour = hexToRgba(randomColour, 0.1);
                return {
                    label: player.firstName,
                    backgroundColor: rgbColour,
                    borderColor: randomColour,
                    data: [],
                    email: player.email,
                    fill: true,
                }
            });

            var dataMap: Map<string, number>[] = [];
            var balances: number[] = [];

            const timestampToLabel = (timestamp: string): string => { 
                return new Date(timestamp).toLocaleDateString(); 
            };

            // get history of each player
            for (const dataSet of playerDataSets) {
                let history = await getHistoryByEmail(token, dataSet.email, props.competitionId);

                // after this each datapoint will be unique
                let uniqueSnapshots: Map<string, number> = new Map();
                for (let h of history.history) {
                    uniqueSnapshots.set(timestampToLabel(h.time), h.balance);
                }

                dataMap.push(uniqueSnapshots);
                balances.push(history.currentBalance);
            }

            // align points for each dataset
            var labelSet: Set<string> = new Set();
            for (let x of dataMap) {
                for (const [time, balance] of x) {
                    labelSet.add(time);
                }
            }

            // fill empty/missing datapoints with NaN
            const fillMissingLabel = (x: string) => {
                for (let h of dataMap) {
                    if (!h.has(x)) {
                        h.set(x, NaN);
                    }
                }
            };
            for (let x of labelSet) {
                fillMissingLabel(x);
            }

            // Sort the labels in ascending order
            var labels: string[] = Array.from(labelSet)
                .sort((a: string, b: string) => new Date(a).valueOf() - new Date(b).valueOf());

            for (let x of labels) {
                for (let i = 0; i < playerDataSets.length; i++) {
                    playerDataSets[i].data.push(dataMap[i].get(x));
                }
            }

            // add latest data
            labels.push('Now');
            for (let i = 0; i < playerDataSets.length; i++) {
                playerDataSets[i].data.push(balances[i]);
            }

            setChartData({
                datasets: playerDataSets,
                labels: labels,
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