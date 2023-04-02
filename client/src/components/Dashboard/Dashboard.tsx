import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// API
import { getProfile, getPortfolio, getStocks, getHistory } from 'api/Profile/User';
import { getCurrentStockInfo } from 'api/Stock/Stock';

// Components
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
import Button from 'components/PrimeReact/Button/Button';
import StockTradeDialog from 'components/StockTradeDialog/StockTradeDialog';

// Styles
import './style.scss';

const CHART_MAX_NUM_DATAPOINTS = 14;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const Dashboard = () => {
  // ** useStates ** //
  const [profile, setProfile] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [stocks, setStocks] = useState<any>(null);
  const [profitLossValue, setProfitLossValue] = useState<number>(0);
  const [isTradeSelected, setIsTradeSelected] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState(null);
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

    async function getUserBalanceHistory() {
      const history = await getHistory(token);

      setChartData((chart: any) => {
        chart.labels = history.history
          // .slice(CHART_MAX_NUM_DATAPOINTS - 1)
          .map((h: any) => {
            return new Date(h.time).toDateString();
          });

        chart.datasets[0].data = history.history
          .map((h: any) => h.balance);

        chart.labels.push(new Date().toDateString());
        chart.datasets[0].data.push(history.currentBalance);
        setIsLoading(false);
        return chart;
      });
    }

    getUserProfile();
    getUserPortfolio();
    getUserStocks();
    getUserBalanceHistory();
  }, [isTradeSelected]);

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

      {isLoading
        ? <Skeleton className='flex mb-3' width='6rem' />
        : <div className="flex text-lg" style={{ color: 'var(--primary-color)' }}>
          {`Hello ${profile && profile.first_name}, you have a current balance of ${formatter.format(portfolio && portfolio.base_balance)}`}
        </div>}

      {isLoading
        ? <Skeleton className='flex' width='6rem' />
        :
        <div className="flex text-lg" style={{ color: 'var(--primary-color)' }}>
          {`Current Profit/Loss: ${formatter.format(profitLossValue)}`}
        </div>
      }
    </div>
  );

  const historyGraph = (
    isLoading ? <Skeleton height='20rem' /> : <Chart className="" type="line" data={chartData} options={options} />
  )

  const stocksOwnedTable = (

    isLoading ? <Skeleton height='18rem' /> :
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