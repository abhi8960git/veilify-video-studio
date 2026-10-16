import {Img,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Caption,Character,Headline,Pill,Stage,World,clamp,ease,progress} from './Elements';

export const ChooseVeilify:React.FC=()=>{
 const f=useCurrentFrame();
 return <Stage>
  <Headline first="Your wallet." second="Now with Veilify." />
  <World>
   <Character x={340} y={442} scale={1.13} label="SAME WALLET"/>
   <g opacity={progress(f,18,38)}>
    <rect x="662" y="415" width="751" height="364" rx="28" fill="url(#story-panel)" stroke="#ae805c" strokeWidth="1.6"/>
    <text x="705" y="469" fill="#a9a39b" fontSize="24" letterSpacing="2.5">CHOOSE YOUR PAYMENT NETWORK</text>
    <rect x="699" y="500" width="677" height="81" rx="17" fill="#121416" stroke="#45413d"/>
    <text x="728" y="551" fill="#9d9a96" fontSize="30">Public network</text>
    <rect x="699" y="604" width="677" height="96" rx="17" fill="#ff6900" opacity={progress(f,85,103)}/>
    <rect x="699" y="604" width="677" height="96" rx="17" fill="none" stroke="#ff6900" strokeWidth="2"/>
    <text x="778" y="665" fill={f<92?'#f5f1ea':'#0b0c0c'} fontSize="37" fontWeight="700">Veilify Network</text>
    <path d="M1290 652L1300 663L1323 638" fill="none" stroke="#0b0c0c" strokeWidth="5" opacity={progress(f,100,115)}/>
    <text x="704" y="745" fill="#b7b0a7" fontSize="25">Your private balance, inside your existing wallet.</text>
   </g>
   <path d="M1233 590L1236 621L1245 613L1253 629L1263 623L1255 608L1268 607Z" fill="#f5f1ea" stroke="#0a0b0c" strokeWidth="2" opacity={progress(f,55,65)*(1-progress(f,135,155))} transform={`translate(0 ${interpolate(f,[55,85],[-70,0],{...clamp,easing:ease})})`}/>
   <g opacity={progress(f,145,165)}><Pill x={1036} y={840} text="NO EXTRA SEED PHRASE" width={405}/></g>
  </World>
  <Img src={staticFile('logo.svg')} style={{position:'absolute',left:717,top:625,width:48,height:48,filter:f>92?'brightness(0)':'none',opacity:progress(f,20,40)}}/>
  <Caption text="Shield funds first. Then pay from your private balance." from={160}/>
 </Stage>;
};
