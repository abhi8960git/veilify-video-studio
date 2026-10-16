import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TransactionMagnifier, magnifierVisibility} from './TransactionMagnifier';
import {getBlockLedger} from './transactionData';

type BlockSceneProps = {privateMode?: boolean};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const mod = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

const scrambleAlphabet = '0123456789ABCDEFx/#$';

// Deterministic characters make both the preview and the exported video identical.
const encryptedText = (
  original: string,
  progress: number,
  frame: number,
  seed: number,
) => {
  if (progress <= 0) return original;
  const head = progress * (original.length + 3);
  return original
    .split('')
    .map((character, index) => {
      if (index < head - 3) return '•';
      if (index < head) {
        return scrambleAlphabet[
          mod(seed * 13 + index * 7 + Math.floor(frame / 3) * 11, scrambleAlphabet.length)
        ];
      }
      return character;
    })
    .join('');
};

type CubeProps = {
  x: number;
  y: number;
  row: number;
  carriage: number;
  frame: number;
  privateMode: boolean;
  lensOpen: number;
};

const Cube: React.FC<CubeProps> = ({x, y, row, carriage, frame, privateMode, lensOpen}) => {
  const seed = mod(carriage * 19 + row * 37, 997);
  const selected = row === 0 && carriage === 0;
  const ledger = getBlockLedger(row, carriage);
  const bright = selected || mod(carriage + row * 3, 3) === 2;
  const delay = mod((row + 2) * 13 + mod(carriage + 5, 5) * 7, 49);
  // The focused transaction locks after its enlarged view finishes encrypting.
  // Other carriages remain public until the magnifier has returned to the cube.
  const progress = privateMode
    ? selected
      ? (frame >= 270 ? 1 : 0)
      : clamp((frame - 366 - delay) / 84)
    : 0;
  const lockProgress = smooth((progress - 0.78) / 0.22);
  const accentOpacity = progress > 0 && progress < 0.95
    ? Math.sin(progress * Math.PI) * 0.52
    : 0;

  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon
        points="0,220 128,296 256,220 322,258 190,341 51,265"
        fill="url(#cube-shadow)"
      />
      <polygon
        points="0,76 128,151 128,294 0,220"
        fill={bright ? 'url(#cube-left-bright)' : 'url(#cube-left-dark)'}
      />
      <polygon
        points="128,151 256,76 256,220 128,294"
        fill={bright ? 'url(#cube-right-bright)' : 'url(#cube-right-dark)'}
      />
      <polygon
        points="0,76 128,0 256,76 128,151"
        fill={bright ? 'url(#cube-top-bright)' : 'url(#cube-rim)'}
      />
      {!bright && (
        <polygon
          points="23,84 128,25 234,85 128,150"
          fill="url(#cube-top-dark)"
        />
      )}
      {bright && (
        <polygon
          points="23,83 128,26 234,85 128,150"
          fill="url(#cube-top-light)"
          opacity="0.72"
        />
      )}
      <path
        d="M0 76L128 151L256 76M128 151V294M0 76V220L128 294L256 220V76"
        fill="none"
        stroke={bright ? '#ff9a20' : '#e95400'}
        strokeWidth="2.8"
        strokeLinejoin="round"
        opacity={bright ? 0.8 : 0.94}
      />
      {bright && (
        <path
          d="M23 83L128 150L234 85"
          fill="none"
          stroke="#ffe2a0"
          strokeWidth="2.4"
          opacity="0.9"
        />
      )}
      <path
        d="M0 76L128 151L256 76M128 151V294M0 76V220L128 294L256 220V76"
        fill="none"
        stroke="#ffd382"
        strokeWidth="4"
        opacity={accentOpacity}
      />
      <g
        transform="matrix(1 -0.58 0 1 137 173)"
        fill={bright ? '#fff2d7' : '#ead2bb'}
        fontFamily="JetBrainsMono, Menlo, Consolas, monospace"
        fontSize="7.4"
        fontWeight="500"
        letterSpacing="-0.1"
      >
        <text x="0" y="0" fontSize="10.5" letterSpacing="-0.35">BLOCK {ledger.number}</text>
        <path d="M0 12H110" fill="none" stroke={bright ? '#fff2d7' : '#ead2bb'} strokeWidth="0.6" opacity="0.56" />
        {ledger.transactions.map((transaction, index) => {
          const rowProgress = clamp((progress - index * 0.12) / (1 - index * 0.12));
          return (
            <g key={index}>
              <text x="0" y={29 + index * 20}>
                {encryptedText(transaction.wallet, rowProgress, frame, seed + index * 7)}
              </text>
              <text x="45" y={29 + index * 20} fill="#ffd080">→</text>
              <text x="110" y={29 + index * 20} textAnchor="end">
                {encryptedText(transaction.amount, rowProgress, frame, seed + index * 7 + 3)}
              </text>
            </g>
          );
        })}
        <g
          transform="translate(96 81)"
          opacity={lockProgress}
          fill="none"
          stroke={bright ? '#fff4d7' : '#eed4bb'}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="74"
          strokeDashoffset={74 * (1 - lockProgress)}
        >
          <path d="M2 7V3C2-3 10-3 10 3V7M0 6H12V19H0ZM6 10V15" />
        </g>
        {progress > 0 && progress < 0.91 && (
          <rect
            x={Math.min(37, Math.floor(progress * 9) * 4.3)}
            y="23"
            width="1.2"
            height="8"
            fill="#fff0ce"
            opacity={mod(frame, 16) < 9 ? 0.85 : 0}
          />
        )}
      </g>
      <path
        d="M0 76L128 0L256 76V220L128 294L0 220Z"
        fill="#000"
        opacity={selected ? 0 : lensOpen * 0.43}
      />
      {selected && lensOpen > 0 && (
        <g opacity={lensOpen}>
          <path
            d="M128 151L256 76V220L128 294Z"
            fill="none"
            stroke="#ff9c35"
            strokeWidth="10"
            opacity="0.16"
            strokeLinejoin="round"
          />
          <path
            d="M128 151L256 76V220L128 294Z"
            fill="none"
            stroke="#ffd18a"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
};

export const BlockScene: React.FC<BlockSceneProps> = ({privateMode = false}) => {
  const frame = useCurrentFrame();
  // Both close-ups follow the same carriage; the private entrance returns to
  // its public entrance position after the switch scene.
  const movementFrame = frame + (privateMode ? 96 : 0);
  const lensOpen = magnifierVisibility(frame, privateMode);
  const focusCubeX = 24 + movementFrame * 1.28;
  const focusCubeY = 492 - movementFrame * 1.28 * (113 / 194);
  const cubes: Array<{x: number; y: number; row: number; carriage: number}> = [];

  // Each row is an independent train. Adjacent rows travel in opposite directions
  // along the same isometric rails; offscreen carriages enter without a jump.
  for (let row = -2; row <= 3; row++) {
    const direction = mod(row, 2) === 0 ? 1 : -1;
    const travel = movementFrame * 1.28 * direction;
    for (let carriage = -12; carriage <= 22; carriage++) {
      const x = 24 + carriage * 194 + travel;
      const y = 492 + row * 438 - carriage * 113 - travel * (113 / 194);
      if (x > -350 && x < 1660 && y > -340 && y < 1040) {
        cubes.push({x, y, row, carriage});
      }
    }
  }
  cubes.sort((a, b) => a.y - b.y);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundColor: '#0a0b09',
      }}
    >
      <svg width="1600" height="1000" viewBox="0 0 1600 1000" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="ground" cx="48%" cy="59%" r="78%">
            <stop offset="0" stopColor="#242522" />
            <stop offset="0.6" stopColor="#121411" />
            <stop offset="1" stopColor="#030503" />
          </radialGradient>
          <linearGradient id="cube-shadow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0.55" />
            <stop offset="1" stopColor="#000" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="cube-top-bright" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#ef7c0c" />
            <stop offset="0.6" stopColor="#ffad34" />
            <stop offset="1" stopColor="#ffb535" />
          </linearGradient>
          <linearGradient id="cube-top-light" x1="0" y1="0" x2="0.75" y2="1">
            <stop offset="0" stopColor="#ffd070" />
            <stop offset="1" stopColor="#ffb32b" />
          </linearGradient>
          <linearGradient id="cube-left-bright" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff990b" stopOpacity="0.96" />
            <stop offset="0.65" stopColor="#ff7505" stopOpacity="0.92" />
            <stop offset="1" stopColor="#e24b00" stopOpacity="0.94" />
          </linearGradient>
          <linearGradient id="cube-right-bright" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0" stopColor="#ff7905" stopOpacity="0.94" />
            <stop offset="0.84" stopColor="#e75200" stopOpacity="0.98" />
            <stop offset="1" stopColor="#ff7104" />
          </linearGradient>
          <linearGradient id="cube-rim" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="#db5200" />
            <stop offset="1" stopColor="#ec5900" />
          </linearGradient>
          <linearGradient id="cube-top-dark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#381404" />
            <stop offset="1" stopColor="#612001" />
          </linearGradient>
          <linearGradient id="cube-left-dark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a63a00" stopOpacity="0.89" />
            <stop offset="0.52" stopColor="#6e2300" stopOpacity="0.86" />
            <stop offset="1" stopColor="#742500" stopOpacity="0.91" />
          </linearGradient>
          <linearGradient id="cube-right-dark" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0" stopColor="#713000" stopOpacity="0.84" />
            <stop offset="0.77" stopColor="#542207" stopOpacity="0.91" />
            <stop offset="1" stopColor="#b74300" stopOpacity="0.96" />
          </linearGradient>
          <linearGradient id="headline-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0.77" />
            <stop offset="0.55" stopColor="#000" stopOpacity="0.49" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="left-shade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.06" />
            <stop offset="0.8" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.07" />
          </linearGradient>
        </defs>
        <rect width="1600" height="1000" fill="url(#ground)" />
        <rect width="1600" height="1000" fill="#000" opacity={lensOpen * 0.3} />
        {cubes.map((cube) => (
          <Cube
            key={`${cube.row}-${cube.carriage}`}
            {...cube}
            frame={frame}
            privateMode={privateMode}
            lensOpen={lensOpen}
          />
        ))}
        <rect width="1600" height="385" fill="url(#headline-shade)" />
        <rect width="1600" height="1000" fill="url(#left-shade)" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 48,
          top: 38,
          color: '#f8f7f3',
          fontFamily: 'InterTight, Arial, sans-serif',
          fontSize: 130,
          fontWeight: 800,
          lineHeight: 0.85,
          letterSpacing: '-4.8px',
          whiteSpace: 'nowrap',
          textShadow: '0 2px 20px rgba(0,0,0,0.18)',
        }}
      >
        <div>{privateMode ? 'Your transactions.' : 'Your transactions'}</div>
        <div style={{marginTop: 4}}>
          {privateMode ? 'Now ' : 'are '}
          <span
            style={{
              color: '#ff771e',
              background: 'linear-gradient(110deg, #ff641a 0%, #ff8c24 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {privateMode ? 'private.' : 'public.'}
          </span>
        </div>
      </div>
      <TransactionMagnifier
        frame={frame}
        privateMode={privateMode}
        cubeX={focusCubeX}
        cubeY={focusCubeY}
      />
    </AbsoluteFill>
  );
};
