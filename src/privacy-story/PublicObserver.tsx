import {interpolate,useCurrentFrame} from 'remotion';
import {Caption,Character,Headline,PathPulse,Pill,Stage,World,clamp,progress} from './Elements';

const rows=[['SENDER','0x71A2…91D3'],['RECIPIENT','0x8B6A…2C9E'],['AMOUNT','100 USDG'],['TIME','14:32:08']];
export const PublicObserver:React.FC=()=>{
 const f=useCurrentFrame();
 return <Stage>
  <Headline first="Someone else" second="can follow it." />
  <World>
   <Character x={280} y={467} scale={1.14} kind="observer" label="THE OBSERVER"/>
   <g opacity={progress(f,16,40)}>
    <rect x="640" y="390" width="795" height="363" rx="24" fill="url(#story-panel)" stroke="#b58660" strokeWidth="1.6"/>
    <text x="680" y="438" fill="#b8b0a6" fontSize="24" letterSpacing="3">PUBLIC TRANSACTION</text>
    <circle cx="1388" cy="430" r="7" fill="#ff6900"/>
    <path d="M680 462H1394" stroke="#5c4c3d"/>
    {rows.map(([key,value],i)=>{
      const p=progress(f,50+i*30,74+i*30);return <g key={key} opacity={p}>
       <text x="682" y={510+i*62} fill="#8e8e91" fontSize="25" letterSpacing="2">{key}</text>
       <text x="1390" y={510+i*62} fill="#f5f1ea" textAnchor="end" fontSize="31" fontFamily="Menlo,monospace">{value.slice(0,Math.ceil(p*value.length))}</text>
      </g>;
    })}
   </g>
   <PathPulse d="M361 668C470 668 479 533 615 533" start={40} end={96} frame={f} dash/>
   <g opacity={progress(f,196,222)}>
    <Pill x={780} y={835} text="WHO YOU PAY" width={245}/>
    <Pill x={1050} y={835} text="HOW MUCH" width={230}/>
    <Pill x={1310} y={835} text="WHEN" width={220}/>
    <PathPulse d="M760 758V806M1050 758V806M1320 758V806" start={200} end={235} frame={f}/>
   </g>
   <rect x="653" y={interpolate(f,[35,210],[473,735],clamp)} width="770" height="2" fill="#ff9b41" opacity={f>35&&f<210?.4:0}/>
  </World>
  <Caption text="One payment can reveal a pattern of financial activity." from={228}/>
 </Stage>;
};
