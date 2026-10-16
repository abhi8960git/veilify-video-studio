import React from 'react';
import {FOCUS_TRANSACTION} from './transactionData';

export {FOCUS_TRANSACTION} from './transactionData';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const mod = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

export const magnifierVisibility = (frame: number, privateMode: boolean) => {
  const enter = privateMode ? 48 : 144;
  const entered = privateMode ? 90 : 186;
  const leave = privateMode ? 312 : 348;
  const left = privateMode ? 354 : 390;
  return smooth((frame - enter) / (entered - enter))
    * (1 - smooth((frame - leave) / (left - leave)));
};

const alphabet = '0123456789ABCDEFx/#$';
const encryptLine = (original: string, frame: number, start: number, end: number, seed: number) => {
  const characterTime = (end - start - 22) / Math.max(1, original.length - 1);
  return original.split('').map((character, index) => {
    const age = frame - start - index * characterTime;
    if (age < 0) return character;
    if (age >= 22) return '•';
    return alphabet[mod(seed * 7 + index * 11 + Math.floor(age / 3) * 13, alphabet.length)];
  }).join('');
};

type Props = {
  frame: number;
  privateMode: boolean;
  cubeX: number;
  cubeY: number;
};

/** The exact selected block, enlarged into an upright transaction ledger. */
export const TransactionMagnifier: React.FC<Props> = ({frame, privateMode, cubeX, cubeY}) => {
  const open = magnifierVisibility(frame, privateMode);
  if (open <= 0) return null;

  const focusX = cubeX + 192;
  const focusY = cubeY + 185;
  const x = focusX + (1080 - focusX) * open;
  const y = focusY + (610 - focusY) * open;
  const scale = 0.075 + 0.925 * open;
  const halfSize = 300 * scale;
  const dx = focusX - x;
  const dy = focusY - y;
  const rectangleDistance = Math.max(Math.abs(dx), Math.abs(dy)) || 1;
  const edgeFactor = halfSize / rectangleDistance;
  const edgeX = x + dx * edgeFactor;
  const edgeY = y + dy * edgeFactor;
  const connectorOpacity = open * clamp((rectangleDistance - halfSize - 18) / 70);
  const lock = privateMode ? smooth((frame - 270) / 24) : 0;

  return (
    <svg
      width="1600"
      height="1000"
      viewBox="0 0 1600 1000"
      style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
    >
      <defs>
        <radialGradient id="magnifier-glass" cx="13%" cy="12%" r="115%">
          <stop offset="0" stopColor="#251b13" />
          <stop offset="0.38" stopColor="#151613" />
          <stop offset="1" stopColor="#090b0a" />
        </radialGradient>
        <clipPath id="magnifier-clip">
          <rect x="-276" y="-276" width="552" height="552" rx="8" />
        </clipPath>
      </defs>
      <g opacity={open}>
        <path
          d={`M${focusX} ${focusY}C${focusX + 90} ${focusY},${edgeX - 90} ${edgeY},${edgeX} ${edgeY}`}
          fill="none"
          stroke="#e79b55"
          strokeWidth="2"
          opacity={connectorOpacity}
        />
        <circle cx={focusX} cy={focusY} r="4" fill="#ffd3a0" />
      </g>
      <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={open}>
        <rect x="-307" y="-292" width="614" height="608" rx="26" fill="#000" opacity="0.3" />
        <rect x="-300" y="-300" width="600" height="600" rx="20" fill="url(#magnifier-glass)" stroke="#e4dfd6" strokeWidth="2.2" strokeOpacity="0.76" />
        <path d="M-253 -300H-185" fill="none" stroke="#f5a05d" strokeWidth="2.8" strokeLinecap="round" />
        <g clipPath="url(#magnifier-clip)">
          <text
            x="-256"
            y="-228"
            fill="#a9a7a1"
            fontFamily="JetBrainsMono, Menlo, Consolas, monospace"
            fontSize="20"
            fontWeight="500"
            letterSpacing="2.6"
          >
            BLOCK {FOCUS_TRANSACTION.number}
          </text>
          <path d="M-256 -194H256" stroke="#b6b4ac" strokeWidth="1.4" strokeOpacity="0.24" />
          {FOCUS_TRANSACTION.transactions.map((transaction, index) => {
            const rowY = -97 + index * 133;
            const walletStart = 120 + index * 32;
            const walletEnd = index === 2 ? 250 : 183 + index * 32;
            const amountStart = walletStart + 12;
            const amountEnd = index === 2 ? 270 : 196 + index * 32;
            const wallet = privateMode
              ? encryptLine(transaction.wallet, frame, walletStart, walletEnd, 5 + index * 17)
              : transaction.wallet;
            const amount = privateMode
              ? encryptLine(transaction.amount, frame, amountStart, amountEnd, 13 + index * 19)
              : transaction.amount;
            const walletWidth = transaction.wallet.length * 17.4;
            // Stable text widths preserve the two columns while letters scramble.
            const amountWidth = transaction.amount.length > 9 ? 240 : 195;
            const cursorVisible = privateMode
              && frame >= walletStart && frame < walletEnd
              && mod(frame, 18) < 11;
            const cursorIndex = Math.min(transaction.wallet.length - 1,
              Math.floor(clamp((frame - walletStart) / (walletEnd - walletStart - 22))
                * (transaction.wallet.length - 1)));

            return (
              <g key={transaction.wallet}>
                <text
                  x="-256"
                  y={rowY}
                  fill="#aaa9a3"
                  fontFamily="JetBrainsMono, Menlo, Consolas, monospace"
                  fontSize="29"
                  fontWeight="500"
                  textLength={walletWidth}
                  lengthAdjust="spacingAndGlyphs"
                >
                  {wallet}
                </text>
                <path
                  d={`M-70 ${rowY - 10}H-44M-52 ${rowY - 17}L-44 ${rowY - 10}L-52 ${rowY - 3}`}
                  fill="none"
                  stroke="#a7a69f"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x="256"
                  y={rowY + 1}
                  textAnchor="end"
                  fill="#faf9f4"
                  fontFamily="InterTight, Arial, sans-serif"
                  fontSize="38"
                  fontWeight="550"
                  textLength={amountWidth}
                  lengthAdjust="spacingAndGlyphs"
                >
                  {amount}
                </text>
                {cursorVisible && (
                  <rect x={-256 + cursorIndex * 17.4} y={rowY - 26} width="2.5" height="31" fill="#efa462" />
                )}
              </g>
            );
          })}
        </g>
        <g
          transform="translate(232 -255) scale(0.55)"
          opacity={lock}
          fill="none"
          stroke="#eab481"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="210"
          strokeDashoffset={210 * (1 - lock)}
        >
          <path d="M8 24V11C8-7 34-7 34 11V24M2 22H40V58H2ZM21 35V46" />
        </g>
      </g>
    </svg>
  );
};
