import React, { useState, useEffect } from "react";

// Components
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import Button from 'components/PrimeReact/Button/Button';
import { useNavigate } from 'react-router-dom';

// Styles
import './style.scss';

const StockTradeDialog = ({ ...props }) => {
  const navigate = useNavigate();

  // ** useStates ** //
  const [quantity, setQuantity] = useState<number>(0);

  // ** Callback Functions ** //
  const onHide = () => {
    props.hideTradeDialog();
  }

  /** @todo: execute stock trade for portfolio here */
  const buyStock = (rowData) => {
    // navigate(`/buy/${rowData.id}`);
    // buy stock here
  };


  // ** Components ** //
  const renderFooter = () => {
    return (
      <div className="flex justify-content-center">
        <Button className="w-full" label="Buy" onClick={buyStock} disabled={quantity <= 0}/>
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
      <InputNumber inputId="quantity" value={quantity} onValueChange={(e) => setQuantity(e.value)} showButtons />
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
      {tradeDialog}
    </div>
  );
}

export default StockTradeDialog;