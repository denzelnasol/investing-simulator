import { exportedForTesting } from "../Stock";

const { fetchCurrentData, fetchHistoricalData } = exportedForTesting;

test('check for null when fetching current stock data', () => {
    expect(fetchCurrentData(null)).toBe(null);
});
