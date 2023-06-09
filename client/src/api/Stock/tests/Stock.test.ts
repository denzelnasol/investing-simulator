import { expect, jest, test } from '@jest/globals';

import { getCurrentStockInfo, getHistoricalStockInfo } from '../Stock';
import axios from 'axios';

jest.mock('axios');
const mockedSuccessfulGet = axios.get as jest.Mock;
mockedSuccessfulGet.mockReturnValue({data: 'success'});

test('API throws error on invalid arg', async () => {
    expect(getCurrentStockInfo("")).rejects.toThrowError();

    expect(getHistoricalStockInfo("")).rejects.toThrowError();
});

test('Successful get current stock', async () => {
    const res = await getCurrentStockInfo('aapl')
    expect(mockedSuccessfulGet).toHaveBeenCalledTimes(1);

    mockedSuccessfulGet.mockClear();
});

test('Successful get historical stock', async () => {
    const res = await getHistoricalStockInfo('aapl')
    expect(mockedSuccessfulGet).toHaveBeenCalledTimes(1);

    mockedSuccessfulGet.mockClear();
});

