import { expect, jest, test } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-canvas-mock'

import React from 'react';
import StockGraph from '../StockGraph'

const resizeObserverMock = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

test("Error is generated after invalid stock symbol is passed", async () => {    
    (window as any).ResizeObserver = resizeObserverMock;   

    const { getByText } = render(<StockGraph stockSymbol="" />);
    await waitFor(() => expect(getByText('ERROR')))
});