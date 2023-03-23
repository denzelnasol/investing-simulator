import { expect, test } from '@jest/globals';
import { exportedForTesting } from "../Stock";

const { fetchCurrentData, fetchPastData } = exportedForTesting;

test('Null checks', () => {
    expect(fetchCurrentData(null)).toBe(null);
    expect(fetchPastData(null)).toBe(null);
});
