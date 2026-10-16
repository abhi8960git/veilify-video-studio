export type TransactionRow = {wallet: string; amount: string};
export type BlockLedger = {number: string; transactions: readonly TransactionRow[]};

export const FOCUS_TRANSACTION: BlockLedger = {
  number: '284,019,567',
  transactions: [
    {wallet: 'Nze5…6wYQ', amount: '19M BONK'},
    {wallet: 'uM4z…Gfs1', amount: '4,094.19 SOL'},
    {wallet: '1jPM…vcxJ', amount: '2,811.04 SOL'},
  ],
};

const rows: readonly TransactionRow[] = [
  ...FOCUS_TRANSACTION.transactions,
  {wallet: '8FQv…M2rB', amount: '850 USDG'},
  {wallet: '7bXn…K4tZ', amount: '320 USDG'},
  {wallet: '3hVp…N6aJ', amount: '640 USDG'},
  {wallet: 'Gfs1…8Hpn', amount: '0.95 SOL'},
  {wallet: 'D9cE…7Xmt', amount: '2.40 SOL'},
];

const mod = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

export const getBlockLedger = (row: number, carriage: number): BlockLedger => {
  if (row === 0 && carriage === 0) return FOCUS_TRANSACTION;
  const seed = mod(carriage * 19 + row * 37, 997);
  const offset = mod(carriage + row * 3, rows.length);
  return {
    number: (284019568 + seed).toLocaleString('en-US'),
    transactions: [0, 1, 2].map((index) => rows[mod(offset + index, rows.length)]),
  };
};
