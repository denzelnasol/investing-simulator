import { expect, jest, test } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-canvas-mock'

import React from 'react';
import Stock from '../Stock';

import { MemoryRouter } from 'react-router';

const resizeObserverMock = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

test("Error is generated when passed invalid stock symbol", async () => {    
    (window as any).ResizeObserver = resizeObserverMock;

    const { getByText } = render(
        <MemoryRouter>
            <Stock stockSymbol=""/>
        </MemoryRouter>
    );
    await waitFor(() => expect(getByText('ERROR')))
});