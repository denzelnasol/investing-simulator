import React from "react";
import { useState } from "react";

// components
import StockTradeDialog from 'components/StockTradeDialog/StockTradeDialog';
import Button from 'components/PrimeReact/Button/Button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';

interface Props {
    isLoading: boolean,
    rows: number,
    stocks: any,
};

function StocksOwnedTable(props: Props) {
    /* useStates */
    const [selectedStock, setSelectedStock] = useState(null);
    const [isTradeSelected, setIsTradeSelected] = useState<boolean>(false);
    
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
          }
          }
          />
        );
    }

    console.log(props.isLoading);

    return (
        <>
            <StockTradeDialog
                stock={selectedStock}
                displayTradeDialog={isTradeSelected}
                hideTradeDialog={() => setIsTradeSelected(false)}
                isSell={true}
            />

            {props.isLoading 
                ? <Skeleton height='18rem' /> 
                :
                <DataTable
                    value={props.stocks}
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