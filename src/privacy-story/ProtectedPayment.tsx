import {interpolate,useCurrentFrame} from 'remotion';
import {Caption,Character,Headline,PathPulse,Pill,Stage,Token,Wallet,World,clamp,orange,progress} from './Elements';

export const ProtectedPayment:React.FC=()=>{
 const f=useCurrentFrame();
 const notes=[[-106,-29],[-18,-29],[70,-29],[-106,57],[-18,57],[70,57]];
 const concealed=progress(f,79,150);
 return <Stage>
  <Headline first="Payment received." second="Funding note concealed." size={100}/>
  <World>
   <Character x={228} y={391} scale={.85} label="SENDER"/>
   <Character x={1370} y={391} scale={.85} kind="receiver" label="RECEIVER"/>
   <Wallet x={362} y={574} scale={.57} protected/><Wallet x={1240} y={574} scale={.57}/>
   <g opacity={progress(f,5,32)}>
    <path d="M523 506L799 354L1077 514L801 674Z" fill="#151616" stroke="#9d6841" strokeWidth="1.6"/>
    <path d="M523 506V523L801 692L1077 532V514L801 674Z" fill="#0b0d0e" stroke="#775033" strokeWidth="1.4"/>
    {notes.map(([dx,dy],i)=><g key={i}>
      <Token x={818+dx} y={440+dy} scale={.77}/>
      <text x={818+dx} y={520+dy} textAnchor="middle" fill="#f2dac1" fontFamily="Menlo,monospace" fontSize="13">
       {concealed>i/10?'••••••':`NOTE ${i+1}`}
      </text>
     </g>)}
    <Pill x={804} y={351} text="SHARED POOL" width={244}/>
   </g>
   <PathPulse d="M411 574H521" start={28} end={75} frame={f}/>
   <g opacity={progress(f,40,50)*(1-progress(f,90,101))}><Token x={430+progress(f,42,98)*195} y={542} scale={.48}/></g>
   <text x="463" y="623" fill="#9c958c" textAnchor="middle" fontSize="19" letterSpacing="2" opacity={progress(f,40,65)}>DEPOSIT</text>
   <g opacity={progress(f,155,185)}>
    <rect x="1029" y="386" width="116" height="112" rx="21" fill="#151719" stroke={orange} strokeWidth="2"/>
    <path d="M1060 439L1079 458L1119 415" fill="none" stroke={orange} strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(f,162,195)} strokeLinecap="round"/>
    <text x="1087" y="527" textAnchor="middle" fill="#ded8cf" fontSize="20" letterSpacing="2">ZK CHECK</text>
   </g>
   <PathPulse d="M1077 574H1186" start={210} end={260} frame={f}/>
   <g opacity={progress(f,216,229)*(1-progress(f,280,295))}><Token x={1085+progress(f,218,282)*110} y={542} scale={.48}/></g>
   <g opacity={progress(f,290,310)}><Pill x={1370} y={739} text="RECEIVED" width={195} active/></g>
   <text x="1134" y="623" fill="#9c958c" textAnchor="middle" fontSize="19" letterSpacing="2" opacity={progress(f,220,240)}>PAYOUT</text>

   <g opacity={progress(f,315,345)}>
    <Character x={800} y={706} scale={.53} kind="observer"/>
    <path d="M800 728V698" stroke="#a8a19a" strokeWidth="2" strokeDasharray="5 6"/>
    {[-98,0,98].map((dx,i)=><g key={dx} opacity={progress(f,350+i*25,375+i*25)}>
     <path d={`M800 700Q${800+dx} 663 ${800+dx} 628`} fill="none" stroke="#887462" strokeWidth="2" strokeDasharray="6 7" strokeDashoffset={-f/7}/>
     <rect x={785+dx} y="603" width="31" height="34" rx="9" fill="#1a1b1c" stroke="#8b735e"/>
     <text x={800+dx} y="627" textAnchor="middle" fill="#e9b881" fontSize="24">?</text>
    </g>)}
   </g>
   <g opacity={progress(f,445,475)}>
    <rect x="84" y="755" width="462" height="100" rx="19" fill="#141618" stroke="#5e5043" strokeWidth="1.4"/>
    <text x="108" y="793" fill="#b0a79b" fontSize="18" letterSpacing="2">OBSERVER'S VIEW</text>
    <text x="108" y="833" fill="#f5f1ea" fontSize="29" fontWeight="650">Funding note: unknown</text>
   </g>
   <rect x="638" y={interpolate(f,[85,155],[413,590],clamp)} width="334" height="2" fill="#ffad61" opacity={f>85&&f<155?.45:0}/>
  </World>
  <Caption text="Deposits and payouts remain public. The proof conceals the funding note." from={490}/>
 </Stage>;
};
