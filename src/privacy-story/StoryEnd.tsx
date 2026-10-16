import {AbsoluteFill,Img,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {clamp,ease} from './Elements';

export const StoryEnd:React.FC=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:'#090a0b',fontFamily:'InterTight',color:'#f5f1ea'}}>
  <div style={{position:'absolute',top:200,left:0,width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:14,
   opacity:interpolate(f,[0,20],[0,1],clamp),translate:`0 ${interpolate(f,[0,35],[25,0],{...clamp,easing:ease})}px`}}>
   <Img src={staticFile('logo.svg')} style={{width:180,height:180}}/>
   <div style={{fontSize:140,fontWeight:800,letterSpacing:-6}}>Veilify</div>
  </div>
  <div style={{position:'absolute',top:446,width:'100%',textAlign:'center',fontSize:88,fontWeight:750,letterSpacing:-3,
   opacity:interpolate(f,[26,48],[0,1],clamp)}}>Your payments. Your business.</div>
  <div style={{position:'absolute',top:596,width:'100%',textAlign:'center',fontSize:42,color:'#c1b6a7',
   opacity:interpolate(f,[100,125],[0,1],clamp)}}>Next: Inside the pool</div>
  <div style={{position:'absolute',top:663,width:'100%',textAlign:'center',fontSize:28,color:'#85817a',letterSpacing:3,
   opacity:interpolate(f,[118,140],[0,1],clamp)}}>SHIELD · POOL · ROUNDS</div>
  <div style={{position:'absolute',top:805,width:'100%',textAlign:'center',fontSize:57,color:'#ff6900',fontWeight:750,
   opacity:interpolate(f,[140,165],[0,1],clamp)}}>veilify.live</div>
 </AbsoluteFill>;
};
