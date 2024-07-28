import React, { useState, useEffect } from 'react';
import { fetchStatistics } from '../api';

const Statistics = ({ selectedMonth }) => {
    const [statistics, setStatistics] = useState({
        total_sale_amount: 0,
        total_sold_items: 0,
        total_not_sold_items: 0,
    });

    useEffect(() => {
        loadStatistics();
    }, [selectedMonth]);

    const loadStatistics = () => {
        fetchStatistics(selectedMonth)
            .then(response => {
                const data = response.data;
                setStatistics(prev => ({
                    total_sale_amount: data.totalSales || 0,
                    total_sold_items: data.soldItems || 0,
                    total_not_sold_items: data.notSoldItems || 0,
                }));
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            <br/>
            <br/>
            <br/>
           
           <h1 style={{ textAlign: 'center ' }}>Statistics</h1>
          
         
            <div className='statistics'>
                <div>Total Sale Amount: {statistics.total_sale_amount}</div>
                <br/>
                <div>Total Sold Items: {statistics.total_sold_items}</div>
                <br/>
                <div>Total Not Sold Items: {statistics.total_not_sold_items}</div>

            </div>

        </div>
    );
};

export default Statistics;
