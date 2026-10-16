import {AbsoluteFill, Easing, Img, interpolate, interpolateColors, staticFile, useCurrentFrame} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const ToggleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const selected = interpolate(frame, [60, 93], [0, 1], {
    ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#faf9f6', fontFamily: 'InterTight'}}>
      <div style={{position: 'absolute', left: 70, top: 201, width: 1460,
        textAlign: 'center', fontSize: 126, fontWeight: 800, lineHeight: 1.05,
        letterSpacing: -5.3,
        opacity: interpolate(frame, [0, 13], [0, 1], clamp),
        translate: `${interpolate(frame, [0, 20], [22, 0], {...clamp, easing: Easing.bezier(.16,1,.3,1)})}px 0`,
      }}>They don’t have to be.</div>

      <div style={{position: 'absolute', left: 93, top: 425, width: 1414, height: 218,
        borderRadius: 116, border: '4px solid #ff6900',
        background: 'linear-gradient(115deg,#191919,#111111 60%,#191919)',
        opacity: interpolate(frame, [4, 20], [0, 1], clamp),
        boxShadow: `0 0 ${interpolate(frame, [60, 81, 118], [0, 20, 0], clamp)}px #ff690034`,
      }}>
        <div style={{position: 'absolute', top: 8, left: interpolate(selected,[0,1],[8,694]),
          height: 194, width: 704, borderRadius: 106,
          backgroundColor: interpolateColors(selected,[0,1],['#fbfaf7','#ff6900']),
        }} />
        <div style={{position: 'absolute', left: 45, top: 0, width: 636, height: 210,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 57, fontWeight: 700, letterSpacing: -1.4,
          color: interpolateColors(selected,[0,1],['#101010','#b2b2b2']),
        }}>Normal transactions</div>
        <div style={{position: 'absolute', left: 826, top: 35, width: 454, height: 142,
          display:'flex', alignItems:'center', gap: 20,
        }}>
          <Img src={staticFile('logo.svg')} style={{width: 143, height: 143,
            filter: `brightness(${1-selected})`,
          }} />
          <div style={{fontSize: 94, fontWeight: 800, letterSpacing: -3.5,
            color: interpolateColors(selected,[0,1],['#faf9f6','#050505']),
          }}>Veilify</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
