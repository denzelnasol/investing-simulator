import React, { useState, useEffect, useRef } from "react";

// API
import { buyStock, sellStock } from "api/Stock/Stock";

// Components
import Button from 'components/PrimeReact/Button/Button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

// Styles
import './style.scss';

const StockTradeDialog = ({ ...props }) => {
  const navigate = useNavigate();

  // ** useRef ** //
  const toast = useRef(null);

  // ** useStates ** //
  const [quantity, setQuantity] = useState<number>(0);
  const [minQuantity, setMinQuantity] = useState<number>(1);
  const [maxQuantity, setMaxQuantity] = useState<number>(100);
  
  /** @todo Find way to prevent purchasing shares if total is less than current balance */
  useEffect(() => {
    let min = 0;
    let max = 100;
    if (props.stock && props.isSell) {
      min = 1;
      max = props.stock.ownedShares;
    }

    if (props.balance < 0) {
      max = 0;
    }

    setMinQuantity(min);
    setMaxQuantity(max);
  }, [props.stock]);

  // ** Callback Functions ** //
  const onHide = () => {
    props.hideTradeDialog();
  }

  const executeTrade = async () => {
    const symbol = props.stock && props.stock.symbol;
    const asking = props.stock && props.stock.ask;
    if (props.isSell) {
      const res = await sellStock(symbol, asking, quantity);
      if (res) {
        toast.current.show({
          severity: 'success',
          summary: 'Order Successfully Executed',
          detail: `${quantity} shares of ${props.stock.symbol} sold`,
          life: 3000
        });
      }
    } else {
      const res = await buyStock(symbol, asking, quantity);
      if (res) {
        toast.current.show({
          severity: 'success',
          summary: 'Order Successfully Executed',
          detail: `${quantity} shares of ${props.stock.symbol} purchased`,
          life: 3000
        });
      }
    }
    onHide();
  };
  
  // ** Components ** //
  const renderFooter = () => {
    return (
      <div className="flex flex-column justify-content-center">
        <div className="field mb-1 text-left">
          {props.balance <= 0 ? <small id="btn" className="p-error block mt-0 text-left">Insufficient Funds</small>: <></>}
        </div>
        <Button id="btn" className="w-full" label={`${props.isSell ? 'Sell' : 'Buy'}`} onClick={executeTrade} disabled={props.balance && props.balance <= 0}/>
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
      <div className="flex text-gray-900 ml-1">
        ({props.stock && props.stock.fullExchangeName})
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

        <div className="col-12 mb-2">
          {stockDescription}
        </div>

        {additionalInformationFields}

        <div className="field col-12">
          {quantityField}
        </div>
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