// import axios from 'axios';

// const API_BASE_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// export const fetchTransactions = (month, page, search) => {
//     return axios.get(`${API_BASE_URL}/transactions`, {
//         params: { month, page, search }
//     });
// };

// export const fetchStatistics = (month) => {
//     return axios.get(`${API_BASE_URL}/statistics`, {
//         params: { month }
//     });
// };

// export const fetchBarChartData = (month) => {
//     return axios.get(`${API_BASE_URL}/bar_chart`, {
//         params: { month }
//     });
// };




import axios from 'axios';

// Replace with your backend server URL
const API_BASE_URL = 'http://localhost:5000/api';

export const fetchTransactions = (month, page = 1, search = '') => {
    return axios.get(`${API_BASE_URL}/transactions`, {
        params: { month: parseInt(month), page, search }
    });
};

export const fetchStatistics = (month) => {
    return axios.get(`${API_BASE_URL}/statistics`, {
        params: { month: parseInt(month) }
    });
};

export const fetchBarChartData = (month) => {
    return axios.get(`${API_BASE_URL}/bar-chart`, {
        params: { month: parseInt(month) }
    });
};

export const fetchPieChartData = (month) => {
    return axios.get(`${API_BASE_URL}/pie-chart`, {
        params: { month: parseInt(month) }
    });
};

export const fetchCombinedData = (month) => {
    return axios.get(`${API_BASE_URL}/combined`, {
        params: { month: parseInt(month) }
    });
};
