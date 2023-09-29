import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import styles from './home.module.css';

const ChartComponent = () => {
    const [chartData, setChartData] = useState([]);

    const processChartData = rawData => {

        const processedData = rawData.map(item => {
            const timestamp = item[0];
            const value = item[1];

            const date = new Date(timestamp * 1000);
            const formattedDate = date.toLocaleDateString();
            return { x: formattedDate, y: value };
        });
        return processedData;
    };

    useEffect(() => {

        fetch('https://api.llama.fi/summary/fees/lyra?dataType=dailyFees')
            .then(response => response.json())
            .then(data => {

                const processedData = processChartData(data.totalDataChart);
                setChartData(processedData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {

        if (chartData.length > 0) {
            const ctx = document.getElementById('myChart').getContext('2d');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.map(item => item.x),
                    datasets: [
                        {
                            label: 'Value',
                            data: chartData.map(item => item.y),
                            borderColor: '#91b8ff',
                            fill: false,
                        },
                    ],
                },
                options: {
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        bodyFontColor: 'white',
                        titleFontColor: 'white',
                        titleFontStyle: 'bold',
                        bodyFontStyle: 'normal',
                        borderRadius: 4,
                        displayColors: false,
                        callbacks: {
                            title: (tooltipItems) => {
                                return 'Date: ' + tooltipItems[0].label;
                            },
                            label: (tooltipItem) => {
                                return 'Value: ' + tooltipItem.formattedValue;
                            },
                        },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
        }
    }, [chartData]);

    return (
        <div className={styles.fullPageContainer}>
            <div className={styles.chartContainer}>
                <canvas id="myChart" height="400"></canvas>
            </div>
        </div>
    );
};

export default ChartComponent;
