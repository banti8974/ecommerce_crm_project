import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../api';

const TransactionsTable = ({ selectedMonth, search, page, setPage }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const transactionsPerPage = 10;

    useEffect(() => {
        loadTransactions();
    }, [selectedMonth, page, search]);

    const loadTransactions = () => {
        setLoading(true);
        fetchTransactions(selectedMonth, page, search, transactionsPerPage)
            .then(response => {
                setTransactions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
                setError('Error fetching transactions. Please try again.');
                setLoading(false);
            });
    };

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };

    return (
        <div>
            {loading && <p>Loading transactions...</p>}
            {error && <p>{error}</p>}
            <br/>
            <br/>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.sold ? 'Yes' : 'No'}</td>
                            <td>{transaction.image && <img src={transaction.image} alt="Product" style={{ width: '200px', height: '200px' }} />}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='transactionPaginationContainer'>
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <span>Page {page}</span>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default TransactionsTable;
