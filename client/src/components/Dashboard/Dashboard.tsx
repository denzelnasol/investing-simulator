import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// API
import { getProfile, getPortfolio, getStocks, getHistory } from 'api/Profile/User';
import { getCurrentStockInfo } from 'api/Stock/Stock';

// Components
import { Chart } from 'primereact/chart';
import { Skeleton } from 'primereact/skeleton';
import Card from 'components/PrimeReact/Card/Card';
import StocksOwnedTable from '../StocksOwnedTable/StocksOwnedTable';
import DashboardWelcome from './DashboardWelcome';

// Styles
import './style.scss';

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
        data: [],
        fill: true,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
      },

    ],
  });
  const options = {
    responsive: true,
    legend: {
      position: 'top',
    },
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
      const portfolio = await getPortfolio();
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
          // .slice(CHART_MAX_NUM_DATAPOINTS - 1)
          .map((h: any) => new Date(h.time).toDateString());

        chart.datasets[0].data = history.history
          .map((h: any) => h.balance);

	chart.labels.push('Now');
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

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const historyGraph = (
    <Card className="dashboard-card surface-100 text-3xl font-semibold">
      <div style={{ textAlign: 'center' }}>Balance History</div>
      {
        isLoading
          ? <Skeleton className="" height='20rem' />
          : <Chart type="line" data={chartData} options={options} />
      }
    </Card>
  );

  const dashboardWelcome = (
    <Card className="dashboard-card surface-100">
      <DashboardWelcome
        isLoading={isLoading}
        name={profile ? profile.first_name : ""}
        balance={portfolio ? portfolio.base_balance : 0}
        netProfit={profitLossValue}
      />
    </Card>
  );

  const stocksOwnedTable = (
    <Card className="dashboard-card surface-100">
      <StocksOwnedTable rows={10} stocks={stocks} onTrade={handleOnTrade} />
    </Card>
  );

  return (
    <div className='grid surface-300 p-4 dashboard'>

      {/* Welcome message */}
      <div className='col-2 m-2'>
        <Card className="dashboard-card">
          {
            isLoading
              ? <Skeleton className='flex' width='9rem' height='3rem' />
              : <div className="flex justify-content-between">
                <div className="flex flex-column">
                  <div className="flex font-semibold text-600">Balance</div>
                  <div className={`flex text-xl font-bold mt-2 ${portfolio && portfolio.balance < 0 ? 'text-red-600' :'text-green-600'}`}>{portfolio ? formatter.format(portfolio.base_balance)  : 0}</div>
                </div>

                <div className="flex balance-icon-container p-3">
                  <i className="pi pi-briefcase balance-icon" style={{ 'fontSize': '1.5rem' }} />
                </div>

              </div>
          }

        </Card>

        <Card className="mt-3 dashboard-card">
          {
            isLoading
              ? <Skeleton className='flex' width='9rem' height='3rem' />
              : <div className="flex justify-content-between">
                <div className="flex flex-column">
                  <div className="flex font-semibold text-600">Portfolio +/-</div>
                  <div className={`flex text-xl font-bold mt-2 ${profitLossValue < 0 ? 'text-red-600' :'text-green-600'}`}>
                    {formatter.format(profitLossValue)}
                  </div>
                </div>

                <div className="flex balance-icon-container p-3">
                  <i className="pi pi-chart-pie balance-icon" style={{ 'fontSize': '1.5rem' }} />
                </div>

              </div>
          }

        </Card>
      </div>

      {/* balance chart (line) */}
      <div className='col-9 m-2'>
        {historyGraph}
      </div>

      {/* Table of owned stocks */}
      <div className='col-12 m-2'>
        {stocksOwnedTable}
      </div>


    </div>
  );

}
export default Dashboard;
