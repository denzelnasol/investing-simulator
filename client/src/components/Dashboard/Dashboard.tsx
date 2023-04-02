import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// API
import { getProfile, getPortfolio, getStocks, getHistory } from 'api/Profile/User';
import { getCurrentStockInfo } from 'api/Stock/Stock';

// Components
import { Chart } from 'primereact/chart';
import { Skeleton } from 'primereact/skeleton';
import StocksOwnedTable from '../StocksOwned/StocksOwnedTable';
import DashboardWelcome from './DashboardWelcome';

// Styles
import './style.scss';

const CHART_MAX_NUM_DATAPOINTS = 14;

function formatDate(date: Date): string {
  return date.getMonth().toString() + '/' + date.getDay().toString() + '/' + date.getFullYear().toString();
}

const Dashboard = () => {
  // ** useStates ** //
  const [profile, setProfile] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [stocks, setStocks] = useState<any>(null);
  const [profitLossValue, setProfitLossValue] = useState<number>(0);
  const [isTradeSelected, setIsTradeSelected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ** Graph Data ** //
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Balance',
        backgroundColor: '#42A5F5',
        data: [],
      },

    ],
  });
  const options = {
    responsive: true,
    legend: {
      position: 'top',
    },
    // scales: {
    //   yAxes:
    //     {
    //       ticks: {
    //         beginAtZero: true,
    //       },
    //     },
    // },
  };

  const handleOnTrade = (isTrading: boolean) => {
    setIsTradeSelected(isTrading);
  }

  // ** useEffect ** //
  useEffect(() => {
    const token = Cookies.get('token');

    async function getUserProfile() {
      const profile = await getProfile(token);
      setProfile(profile);
    }

    async function getUserPortfolio() {
      const portfolio = await getPortfolio(token);
      setPortfolio(portfolio);
    }

    async function updateNetProfit() {
      const fetchedStocks = await getStocks(token);
      setStocks(fetchedStocks);
      
      let totalInvested = 0;
      let totalCost = 0;
      fetchedStocks.forEach(async (stock: any) => {
        const symbol = stock.fk_stock;

        const currentStockInfo = await getCurrentStockInfo(symbol);
        const currentPrice = currentStockInfo.regularMarketPrice;
        const ownedShares = stock.num_shares;

        totalInvested += stock.amount_invested;
        totalCost += (currentPrice * ownedShares);
        const profitLossValue = parseFloat((totalInvested + totalCost).toFixed(2))
        setProfitLossValue(profitLossValue);
      });
    }

    async function getUserBalanceHistory() {
      const history = await getHistory(token);

      setChartData((chart: any) => {
        chart.labels = history.history
          .slice(CHART_MAX_NUM_DATAPOINTS - 1)
          .map((h: any) => h.time);
        chart.datasets[0].data = history.history
          .slice(CHART_MAX_NUM_DATAPOINTS - 1)
          .map((h: any) => h.balance);
        chart.labels.push(formatDate(new Date()));
        chart.datasets[0].data.push(history.currentBalance);

        setIsLoading(false);
        return chart;
      });
    }

    getUserProfile();
    getUserPortfolio();
    updateNetProfit();
    getUserBalanceHistory();
  }, [isTradeSelected]);


  const historyGraph = (
    isLoading ? <Skeleton height='20rem' /> : <Chart className="" type="line" data={chartData} options={options} />
  )

  return (
    <div className='grid'>

      {/* Welcome message */}
      <div className='col-12'>
        <DashboardWelcome 
          isLoading={isLoading} 
          name={profile ? profile.first_name : ""} 
          balance={portfolio ? portfolio.base_balance: 0} 
          netProfit={profitLossValue} />
      </div>

      {/* balance chart (line) */}
      <div className='col-6'>
        <h1 style={{ textAlign: 'center' }}>Graph of Changes</h1> <br></br>
        {historyGraph}
      </div>

      {/* Table of owned stocks */}
      <div className='col-6'>
        <h1 style={{ textAlign: 'center' }}> Stocks Owned</h1>
        <StocksOwnedTable rows={10} stocks={stocks} onTrade={handleOnTrade} />
      </div>

    </div>
  );

}
export default Dashboard;