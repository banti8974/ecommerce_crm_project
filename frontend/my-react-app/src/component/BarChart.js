import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { fetchBarChartData } from '../api';

const BarChart = ({ selectedMonth, selectedMonthName }) => {
    // const [chartData, setChartData] = useState({});
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        loadChartData();
    }, [selectedMonth]);

    const loadChartData = () => {
        fetchBarChartData(selectedMonth)
            .then(response => {
                const data = response.data;
                // const labels = Object.keys(data);
                const res = Object.values(data);
                const labels = res.map((obj) => {
                    return obj.range;
                });

                const values = res.map((obj) => {
                    return obj.count;
                });

                const chartData = {
                    labels,
                    datasets: [{
                        label: 'Number of Items',
                        data: values,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    }]
                };

                if (chartInstance) {
                    chartInstance.data = chartData;
                    chartInstance.update();
                } else {
                    const newChartInstance = new Chart(chartRef.current, {
                        type: 'bar',
                        data: chartData,
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        },
                    });
                    setChartInstance(newChartInstance);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        

        <div>
            <br/>

            <div>
            <br/>
            

            <h1 style={{ textAlign: 'center ' }}>Transactions Bar Char</h1>
            
           
            <h2 style={{ textAlign: 'center '}}>Bar Chart Stats - {selectedMonthName}</h2>
            </div>
           <div className='barchart'>
           <canvas ref={chartRef} />
           </div>
        </div>
    );
};

export default BarChart;
