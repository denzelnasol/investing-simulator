import React from "react";

// components
import { Skeleton } from 'primereact/skeleton';

interface Props {
    isLoading: boolean,
    name: string,
    balance: number,
    netProfit: number,
};

function DashboardWelcome(props: Props) {
    const { isLoading, name, balance, netProfit } = props;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    
    return (
        <div className="flex flex-column m-4">
            {isLoading
                ? <Skeleton className='flex mb-3' width='6rem' />
                : 
                <div className="flex text-lg" style={{ color: 'var(--primary-color)' }}>
                    {`Hello ${name}, you have a current balance of ${formatter.format(balance)}`}
                </div>}

            {isLoading
                ? <Skeleton className='flex' width='6rem' />
                :
                <div className="flex text-lg" style={{ color: 'var(--primary-color)' }}>
                    {`Current Profit/Loss: ${formatter.format(netProfit)}`}
                </div>
            }
        </div>        
    );
}

export default DashboardWelcome;