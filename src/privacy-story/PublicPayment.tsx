import {useCurrentFrame} from 'remotion';
import {Caption,Character,Headline,PathPulse,Pill,Stage,Token,Wallet,World,progress} from './Elements';

export const PublicPayment:React.FC=()=>{
 const f=useCurrentFrame();const travel=progress(f,104,208);
 return <Stage>
  <Headline first="You send." second="They receive." />
  <World>
   <path d="M100 773L440 588L740 766L400 951Z" fill="#111213" stroke="#3e3027" strokeWidth="1.5"/>
   <path d="M890 773L1230 588L1530 766L1190 951Z" fill="#111213" stroke="#3e3027" strokeWidth="1.5"/>
   <Character x={330} y={420} scale={1.05} label="SENDER"/>
   <Character x={1270} y={420} scale={1.05} kind="receiver" label="RECEIVER"/>
   <Wallet x={465} y={710} scale={.75}/><Wallet x={1135} y={710} scale={.75}/>
   <PathPulse d="M530 710H1070" start={72} end={135} frame={f}/>
   <path d="M1055 700L1070 710L1055 720" fill="none" stroke="#ff6900" strokeWidth="3" opacity={progress(f,120,135)}/>
   <g opacity={progress(f,98,110)*(1-progress(f,210,225))}><Token x={565+travel*470} y={676} scale={.68}/></g>
   <Pill x={800} y={597} text="100 USDG" width={210}/>
   <g opacity={progress(f,215,235)}><Pill x={1260} y={818} text="RECEIVED" width={220} active/></g>
   <text x="800" y="782" textAnchor="middle" fill="#b9b4ad" fontSize="25" letterSpacing="3">A PUBLIC PAYMENT</text>
  </World>
  <Caption text="A familiar payment. A permanent public record." from={190}/>
 </Stage>;
};
