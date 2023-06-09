import React, { useState, useEffect, useRef } from "react";
import Cookies from 'js-cookie';

// API
import { buyStock, getDatabaseStock, sellStock } from "api/Stock/Stock";

// Components
import Button from 'components/PrimeReact/Button/Button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';

// Styles
import './style.scss';

interface Props {
  portfolioId: string,
  stock: any,
  balance: number,
  displayTradeDialog: boolean,
  hideTradeDialog: () => void,
  isSell: boolean
}

const StockTradeDialog = ({ ...props }) => {

  // ** useRef ** //
  const toast = useRef(null);

  // ** useStates ** //
  const [quantity, setQuantity] = useState<number>(0);
  const [minQuantity, setMinQuantity] = useState<number>(1);
  const [maxQuantity, setMaxQuantity] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** @todo Find way to prevent purchasing shares if total is less than current balance */
  useEffect(() => {

    async function getDBStock(symbol) {
      
      let stockPrice = props.stock.ask;
      if (!stockPrice) {
        const dbStock = await getDatabaseStock(symbol);
        stockPrice = dbStock.price_per_share;
      }
  
      let min = 0;
      let max = 100;
      if (props.isSell) {
        min = 1;
        max = props.stock.ownedShares;
      } else {
        max = Math.floor((props.balance - 10) / stockPrice);
      }
  
      if (props.balance < 0) {
        max = 0;
      }
  
      setMinQuantity(min);
      setMaxQuantity(max);
    }

    // getDBStock(props.stock.symbol);
    if (!props.stock) return;

    getDBStock(props.stock.symbol);
  }, [props.stock]);

  // ** Callback Functions ** //
  const onHide = () => {
    props.hideTradeDialog();
    if (props.refresh) {
      props.refresh();
    }
  }

  const executeTrade = async () => {
    setIsLoading(true);
    const symbol = props.stock && props.stock.symbol;
    let asking = props.stock && props.stock.ask;

    if (!asking) {
      const dbStock = await getDatabaseStock(symbol);
      asking = dbStock.price_per_share;
    }

    if (props.isSell) {
      const res = await sellStock(symbol, asking, quantity, props.portfolioId);
      if (res) {
        toast.current.show({
          severity: 'success',
          summary: 'Order Successfully Executed',
          detail: `${quantity} shares of ${props.stock.symbol} sold`,
          life: 3000
        });

        setIsLoading(false);
      }
    } else {
        const res = await buyStock(symbol, asking, quantity, props.portfolioId);
        if (res) {
          toast.current.show({
            severity: 'success',
            summary: 'Order Successfully Executed',
            detail: `${quantity} shares of ${props.stock.symbol} purchased`,
            life: 3000
          });
          setIsLoading(false);
        }
    }
    onHide();
  };

  // ** Components ** //
  const renderFooter = () => {
    return (
      <div className="flex flex-column justify-content-center">
        <div className="field mb-1 text-left">
          {props.balance <= 0 ? <small id="btn" className="p-error block mt-0 text-left">Insufficient Funds</small> : <></>}
        </div>
        <Button
          id="btn"
          className="w-full" label={`${props.isSell ? 'Sell' : 'Buy'}`}
          onClick={executeTrade}
          disabled={(props.balance && props.balance <= 0) || quantity <= 0 || isLoading || quantity > maxQuantity} />
      </div>
    );
  }

  const stockDescription = (
    <div className="flex">
      <div className="flex font-bold text-gray-900">
        {props.stock && props.stock.symbol} -
      </div>
      <div className="flex text-900 ml-2">
        {props.stock && props.stock.longName}
      </div>
    </div>
  );

  const additionalInformationFields = (
    <>
      <div className="mb-1 col-12">
        Order Type: <b>Market</b>
      </div>

      <div className="mb-3 col-12">
        Duration: <b>Day</b>
      </div>
    </>
  );

  const quantityField = (
    <>
      <label htmlFor="quantity" className="font-bold">Quantity</label>
      <InputNumber
        inputId="quantity"
        value={quantity}
        onValueChange={(e) => setQuantity(e.value)}
        showButtons
        min={minQuantity}
        max={maxQuantity}
      />
    </>
  );

  const tradeDialog = (
    <Dialog
      header="Order Entry"
      visible={props.displayTradeDialog}
      style={{ width: '35vw' }}
      footer={renderFooter}
      onHide={onHide}
    >
      <div className="p-fluid grid formgrid">

        <h3 className="col-12">
          {`Available Funds: ${props.balance.toFixed(2)}`}
        </h3>

        <div className="col-12 mb-2">
          {stockDescription}
        </div>

        {additionalInformationFields}


        <div className="field col-12">
          {quantityField}
        </div>

        <Message className="ml-3 mb-2" severity="info" text="A $10 brokers fee will be applied"></Message>
      </div>

    </Dialog>
  );

  return (
    <div className="stock-trade-dialog">
      <Toast ref={toast} />
      {tradeDialog}
    </div>
  );
}

export default StockTradeDialog;