import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#faf9f6', fontFamily: 'InterTight'}}>
      <div style={{position: 'absolute', left: 366, top: 216, width: 880,
        display: 'flex', alignItems: 'center', gap: 18,
        opacity: interpolate(frame, [0, 18], [0,1], clamp),
        translate: `0 ${interpolate(frame, [0, 30], [28, 0], {...clamp,easing:Easing.bezier(.16,1,.3,1)})}px`,
      }}>
        <Img src={staticFile('logo.svg')} style={{width: 290, height: 290}} />
        <div style={{fontSize: 194, fontWeight: 800, letterSpacing: -7.6, lineHeight: 1}}>Veilify</div>
      </div>
      <div style={{position: 'absolute', top: 563, width: '100%', textAlign: 'center',
        fontSize: 72, fontWeight: 650, letterSpacing: -1.9,
        opacity: interpolate(frame,[24,43],[0,1],clamp),
        translate: `0 ${interpolate(frame,[24,43],[15,0],clamp)}px`,
      }}>Your money. Your business.</div>
      <div style={{position: 'absolute', top: 670, width: '100%', textAlign: 'center',
        fontSize: 51, fontWeight: 400, letterSpacing: -1.2, color:'#bfc0c2',
        opacity: interpolate(frame,[40,60],[0,1],clamp),
      }}>Pay privately on Robinhood &amp; Solana.</div>
      <div style={{position: 'absolute', top: 810, width: '100%', textAlign: 'center',
        fontSize: 57, fontWeight: 750, letterSpacing: -1.6, color:'#ff6900',
        opacity: interpolate(frame,[60,78],[0,1],clamp),
        translate: `0 ${interpolate(frame,[60,80],[12,0],clamp)}px`,
      }}>veilify.live</div>
    </AbsoluteFill>
  );
};
