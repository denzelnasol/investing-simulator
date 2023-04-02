import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import './style.scss';

// Components
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { Symbol } from 'enums/Stock';
import Button from 'components/PrimeReact/Button/Button';
import InputText from 'components/PrimeReact/InputText/InputText';
import StockTradeDialog from "components/StockTradeDialog/StockTradeDialog";

// API
import { getCurrentStockInfo } from "api/Stock/Stock";
import { getPortfolio } from "api/Profile/User";
import { useSearchParams } from "react-router-dom";

const StockTable = ({ ...props }) => {
  const [searchParams] = useSearchParams();

  // ** useStates ** //
  const [data, setData] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockFilters, setStockFilters] = useState(null);
  const [isTradeSelected, setIsTradeSelected] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [portfolioId, setPortfolioId] = useState<any>();
  const [balance, setBalance] = useState<number>(0);

  // ** useEffects ** //
  useEffect(() => {
    const symbols: Symbol[] = Object.values(Symbol).sort();
    const fetchData = async () => {
      const stockData = await getCurrentStockInfo(symbols);
      setData(stockData);
    };

    async function getUserPortfolio() {
      const competitionId = searchParams.get("competition-id") 
      console.log(competitionId);
      const authToken = Cookies.get('token');
      const portfolio = await getPortfolio(authToken, competitionId); // get main portfolio if competitionId is null

      console.log(portfolio.portfolio_type);
      setPortfolioId(portfolio.portfolio_id);
      setBalance(portfolio.base_balance);
    }

    getUserPortfolio();
    fetchData();
    initializeFilters();
  }, []);

  // ** Callback Functions ** // 

  const initializeFilters = () => {
    setStockFilters({
      'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
      'symbol': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    setGlobalFilterValue('');
  }

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value || null;
    let _filters1 = { ...stockFilters };
    _filters1['global'].value = value;

    setStockFilters(_filters1);
    setGlobalFilterValue(value);
  }

  const onStockSelect = (event) => {
    setSelectedStock(event.data);
  };

  const clearStockFilter = () => {
    initializeFilters();
  }

  // ** Components ** //

  const renderTableHeader = () => {
    return (
      <div>
        <div className="font-medium text-4xl mb-4">Trading Table</div>
        <div className="flex justify-content-between">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearStockFilter} />
          <span>
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
          </span>
        </div>
      </div>
    );
  }
  const tableHeader = renderTableHeader();

  const priceRecentChangeColumn = (rowData) => {
    return (
      <>
        <span>{rowData.regularMarketPrice}</span>
        <span className={rowData.regularMarketChange > 0 ? "green" : "red"}>
          {rowData.regularMarketChange.fmt} ({Math.round(rowData.regularMarketChange * 100) / 1000})
        </span>
      </>
    );
  }

  const marketOpenColumn = (rowData) => {
    return (
      <span className={rowData.regularMarketOpen > rowData.regularMarketPreviousClose ? "green" : "red"}>
        {rowData.regularMarketOpen}
      </span>
    );
  }

  const tradeColumn = (rowData) => {
    return (
      <Button label="Trade" onClick={() => {
        setSelectedStock(rowData)
        setIsTradeSelected(true)
      }}
      />
    );
  }

  return (
    <>
      <StockTradeDialog
        portfolioId={portfolioId}
        stock={selectedStock}
        displayTradeDialog={isTradeSelected}
        hideTradeDialog={() => setIsTradeSelected(false)}
        balance={balance}
        isSell={false}
      />

      <DataTable
        value={data}
        selectionMode="single"
        header={tableHeader}
        onSelectionChange={onStockSelect}
        filters={stockFilters}
        filterDisplay="menu"
        globalFilterFields={['symbol']}
        emptyMessage="No stocks found."
        paginator
        rows={15}
      >
        <Column
          field="symbol"
          header="Symbol"
          filter
          filterPlaceholder="Search by name"
          sortable />
        <Column
          header="Price/ Recent Change"
          body={priceRecentChangeColumn}
        />
        <Column
          header="Market Open"
          body={marketOpenColumn}
        />
        <Column
          field="regularMarketPreviousClose"
          header="Previous Market Close"
        />
        <Column
          header="Analyst Rating"
          field="averageAnalystRating"
          sortable
        />
        <Column
          body={tradeColumn}
        />
      </DataTable>
    </>
  )
}

export default StockTable;