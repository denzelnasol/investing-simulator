import React, { useEffect } from "react";
import { useState } from "react";

import { getCurrentStockInfo } from 'api/Stock/Stock';

// components
import StockTradeDialog from 'components/StockTradeDialog/StockTradeDialog';
import Button from 'components/PrimeReact/Button/Button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';

interface Props {
    portfolioId?: string
    rows: number,
    stocks: any,
    onTrade: (isTrading: boolean) => void,
};

function StocksOwnedTable(props: Props) {
    /* useStates */
    const [selectedStock, setSelectedStock] = useState(null);
    const [isTradeSelected, setIsTradeSelected] = useState<boolean>(false);
    const [tableData, setTableData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getTableData() {
            if (!props.stocks) {
                return;
            }

            const tableData = await Promise.all(props.stocks.map(async (stock: any) => {
                const symbol = stock.fk_stock;
                const currentStockInfo = await getCurrentStockInfo(symbol);
                const currentPrice = currentStockInfo.regularMarketPrice;
                const ask = currentStockInfo.ask;
                const longName = currentStockInfo.longName;
                const fullExchangeName = currentStockInfo.fullExchangeName;
                const ownedShares = stock.num_shares;
                const netChange = (stock.amount_invested + (currentPrice * ownedShares)).toFixed(2);

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
         
            setTableData(tableData);
            setIsLoading(false);
        }

        //async function get

        getTableData();
    }, [props.stocks]);

    /* UI */
    const header = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h1 className="m-0 text-gray-700">Stocks Owned</h1>
            </div>
        );
    }
    const netChangeColumn = (rowData) => {
        return (
          <span className={`font-semibold ${rowData.netChange >= 0 ? "text-green-500" : "text-red-600"}`}>
            {rowData.netChange}
          </span>
        );
    }
    const tradeColumn = (rowData) => {
        return (
          <Button label="Trade" onClick={() => {
            setSelectedStock(rowData)
            setIsTradeSelected(true)
            
            props.onTrade(true);
            }}
          />
        );
    }

    return (
        <>
            <StockTradeDialog
                portfolioId={props.portfolioId}
                balance={0}
                stock={selectedStock}
                displayTradeDialog={isTradeSelected}
                hideTradeDialog={() => {
                    setIsTradeSelected(false);
                    props.onTrade(false);
                }}
                isSell={true}
            />

            {isLoading 
                ? <Skeleton height='18rem' /> 
                :
                <DataTable
                    header={header}
                    value={tableData}
                    selectionMode="single"
                    paginator
                    rows={10}
                >
                    <Column field="symbol" header="Name" sortable />
                    <Column field="num_shares" header="Shares" />
                    <Column body={netChangeColumn} header="Net Change" />
                    <Column field="currentPrice" header="Current Share Price" />
                    <Column body={tradeColumn} />
                </DataTable>
            }            
        </>
    );
}

export default StocksOwnedTable;