import React, { useState } from 'react';
import TransactionsTable from './component/TransactionsTable';
import Statistics from './component/Statistics';
import BarChart from './component/BarChart';


const App = () => {
    const [selectedMonth, setSelectedMonth] = useState('03');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedMonthName, setSelectedMonthName] = useState("March");

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        setSelectedMonthName(event.target.options[parseInt(event.target.value) - 1].text);
        // console.log(event.target, event.target.options[parseInt(event.target.value) - 1].text);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    return (
        <div>
            <div>
                <div className='circle'>
                    <h1>Transactions Dashboard</h1>
                </div>
                <div className='homeInputContainer'>
                    <input
                        type="text"
                        placeholder="Search transactions"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <div>
                        <label>Select Month:</label>

                        <select value={selectedMonth} onChange={handleMonthChange}>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                </div>
            </div>

            <TransactionsTable selectedMonth={selectedMonth} search={search} page={page} setPage={setPage} />
            <Statistics selectedMonth={selectedMonth} selectedMonthName={selectedMonthName} />
            <BarChart selectedMonth={selectedMonth} selectedMonthName={selectedMonthName} />
        </div>
    );
};

export default App;
