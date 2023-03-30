import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// API
import { getProfile, verifyUser, getPortfolio, getStocks } from 'api/Profile/User';
import { getCurrentStockInfo } from 'api/Stock/Stock';

// Components
import { Divider } from 'primereact/divider';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Button from 'components/PrimeReact/Button/Button';
import StockTradeDialog from 'components/StockTradeDialog/StockTradeDialog';

// Styles
import './style.scss';

const Dashboard = () => {
  const navigate = useNavigate();

  // ** useStates ** //
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [stocks, setStocks] = useState<any>(null);
  const [profitLossValue, setProfitLossValue] = useState<number>(0);
  const [isTradeSelected, setIsTradeSelected] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // ** Graph Data ** //
  const [chartData, setChartData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'TFSA',
        backgroundColor: '#42A5F5',
        data: [1200, 4500, 8000, 7621, 5621, 5500, 4000],
      },

    ],
  });
  const options = {
    responsive: true,
    legend: {
      position: 'top',
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  // ** useEffect ** //
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
    }

    async function userVerified() {
      const isUserVerified = await verifyUser(token);
      if (isUserVerified) {
        setIsAuthenticated(true);
      }
      return isUserVerified;
    }

    async function getUserProfile() {
      const profile = await getProfile(token);
      setProfile(profile);
    }

    async function getUserPortfolio() {
      const portfolio = await getPortfolio(token);
      setPortfolio(portfolio);
    }

    async function getUserStocks() {
      const stocks = await getStocks(token);
      let totalInvested = 0;
      let totalCost = 0;
      const updatedStocks = await Promise.all(stocks.map(async (stock: any) => {

        const symbol = stock.fk_stock;
        const currentStockInfo = await getCurrentStockInfo(symbol);
        const currentPrice = currentStockInfo.regularMarketPrice;
        const ask = currentStockInfo.ask;
        const longName = currentStockInfo.longName;
        const fullExchangeName = currentStockInfo.fullExchangeName;
        const ownedShares = stock.num_shares;
        const netChange = (stock.amount_invested + (currentPrice * ownedShares)).toFixed(2);

        totalInvested += stock.amount_invested;
        totalCost += (currentPrice * ownedShares);

        return {
          ...stock,
          netChange,
          currentPrice,
          symbol,
          ask,
          longName,
          fullExchangeName,
          ownedShares,
        };

      }));
      const profitLossValue = parseFloat((totalInvested + totalCost).toFixed(2))
      setProfitLossValue(profitLossValue);
      setStocks(updatedStocks);
    }

    userVerified();
    getUserProfile();
    getUserPortfolio();
    getUserStocks();
  }, [isTradeSelected]);

  if (!isAuthenticated) {
    navigate('/login');
  }

  // ** DataTable ** //
  const netChangeColumn = (rowData) => {
    return (
      <span className={`font-semibold ${rowData.netChange >= 0 ? "text-green-500" : "text-red-600"}`}>
        {rowData.netChange}
      </span>
    )
  }

  const tradeColumn = (rowData) => {
    return (
      <Button label="Trade" onClick={() => {
        setSelectedStock(rowData)
        setIsTradeSelected(true)
      }
      }
      />
    );
  }

  // ** UI ** //
  const welcomeText = (
    <div className="flex flex-column m-4">

      <div className="flex text-lg" style={{ color: 'var(--primary-color)' }}>
        {`Hello ${profile && profile.first_name}, you have a current balance of $${portfolio && portfolio.base_balance.toFixed(2)}`}
      </div>

      <div className="flex text-lg" style={{ color: 'var(--primary-color)' }}>
        {`Current Profit/Loss: $${profitLossValue}`}
      </div>
    </div>
  );

  const historyGraph = (
    <Chart className="" type="line" data={chartData} options={options} />
  );

  const stocksOwnedTable = (
    <DataTable
      value={stocks}
      selectionMode="single"
      paginator
      rows={10}
    >
      <Column field="symbol" header="Name" sortable></Column>
      <Column field="num_shares" header="Shares"></Column>
      <Column body={netChangeColumn} header="Net Change"></Column>
      <Column field="currentPrice" header="Current Share Price"></Column>
      <Column body={tradeColumn}></Column>
    </DataTable>

  );

  return (
    <>
      <StockTradeDialog
        stock={selectedStock}
        displayTradeDialog={isTradeSelected}
        hideTradeDialog={() => setIsTradeSelected(false)}
        isSell={true}
      />
      <div className="grid">

        <div className='col-12'>
          {welcomeText}
        </div>

      </div>

      {/* <Divider /> */}

      {/* balance chart (line) */}
      <div className='grid'>
        <div className='col-6'>
          <h1 style={{ textAlign: 'center' }}>Graph of Changes</h1> <br></br>
          {historyGraph}
        </div>

        <div className='col-6'>
          <h1 style={{ textAlign: 'center' }}> Stocks Owned</h1>
          {stocksOwnedTable}
        </div>
      </div>
    </>
  );

}
export default Dashboard;