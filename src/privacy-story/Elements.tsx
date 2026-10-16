import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const orange = '#ff6900';
export const paper = '#f5f1ea';
export const muted = '#a29f9b';
export const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
export const ease = Easing.bezier(.16, 1, .3, 1);
export const progress = (frame: number, start: number, end: number) => interpolate(frame, [start,end],[0,1],clamp);

export const Stage: React.FC<{children:React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background:'#090a0b',color:paper,fontFamily:'InterTight',overflow:'hidden'}}>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 65%, #20150b65 0%, transparent 65%)'}} />
    <div style={{position:'absolute',left:68,top:40,display:'flex',alignItems:'center',gap:13}}>
      <Img src={staticFile('logo.svg')} style={{width:62,height:62}} />
      <span style={{fontSize:42,fontWeight:800,letterSpacing:-1.7}}>Veilify</span>
    </div>
    {children}
    <div style={{position:'absolute',right:72,bottom:35,color:'#a8a5a0',fontSize:29,letterSpacing:-.5}}>veilify.live</div>
  </AbsoluteFill>
);

export const Headline:React.FC<{first:string;second?:string;size?:number;center?:boolean}> = ({first,second,size=108,center=false}) => {
  const f=useCurrentFrame();
  return <div style={{position:'absolute',left:80,top:137,width:1440,fontSize:size,fontWeight:800,
    lineHeight:.98,letterSpacing:-4,textAlign:center?'center':'left',
    opacity:interpolate(f,[0,16],[0,1],clamp),
    translate:`0 ${interpolate(f,[0,28],[23,0],{...clamp,easing:ease})}px`}}>
    <div>{first}</div>{second&&<div style={{color:orange,marginTop:8}}>{second}</div>}
  </div>;
};

export const World:React.FC<{children:React.ReactNode}> = ({children}) => <svg width="1600" height="1000" viewBox="0 0 1600 1000" style={{position:'absolute',inset:0}}>
  <defs>
    <linearGradient id="story-orange" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#ff9b2d"/><stop offset="1" stopColor="#d64a00"/></linearGradient>
    <linearGradient id="story-coat" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#303237"/><stop offset="1" stopColor="#141619"/></linearGradient>
    <linearGradient id="story-cream" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ece5d9"/><stop offset="1" stopColor="#aca397"/></linearGradient>
    <linearGradient id="story-skin" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#efbc8c"/><stop offset="1" stopColor="#bd7f51"/></linearGradient>
    <linearGradient id="story-panel" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#24211d"/><stop offset="1" stopColor="#101112"/></linearGradient>
  </defs>
  {children}
 </svg>;

export const Character:React.FC<{x:number;y:number;scale?:number;kind?:'sender'|'receiver'|'observer';label?:string;opacity?:number}> = ({x,y,scale=1,kind='sender',label,opacity=1}) => {
 const observer=kind==='observer';const receiver=kind==='receiver';
 return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
   <ellipse cx="0" cy="286" rx="92" ry="21" fill="#000" opacity=".55"/>
   <ellipse cx="0" cy="284" rx="88" ry="22" fill="none" stroke={observer?'#3b3c40':'#82431e'} strokeWidth="1.5"/>
   {receiver&&<path d="M-40 40Q-43-12 1-15Q48-10 42 54L49 121L-49 121Z" fill="#38251c" stroke="#65422a" strokeWidth="2"/>}
   <path d="M-23 210L-31 270M23 210L34 270" stroke={observer?'#252830':'#363b41'} strokeWidth="28" strokeLinecap="round"/>
   <path d="M-32 271L-57 277M34 271L58 277" stroke="#666a6c" strokeWidth="16" strokeLinecap="round"/>
   <path d="M-29 107Q-55 108-57 143L-45 214Q0 235 45 214L57 143Q55 109 29 107Z" fill={observer?'url(#story-coat)':receiver?'url(#story-cream)':'url(#story-orange)'} stroke={observer?'#5e6268':receiver?'#d8cfc0':'#ff9345'} strokeWidth="2.5"/>
   <path d="M-46 124L-67 177L-45 200M47 124L67 174L50 194" fill="none" stroke={observer?'#30333a':receiver?'#d8d0c3':'#f7771c'} strokeWidth="22" strokeLinecap="round"/>
   <path d="M-12 91V111Q0 123 13 111V91" fill="#cf976d"/>
   <ellipse cx="0" cy="53" rx="36" ry="43" fill="url(#story-skin)" stroke="#f0c69c" strokeWidth="1.5"/>
   {!observer&&!receiver&&<path d="M-36 49Q-43 8-12 5Q24-9 39 24L33 45L19 27L-8 35L-30 28Z" fill="#342922"/>}
   {receiver&&<path d="M-34 46Q-41-7 4-10Q46-3 35 51L14 26Q-1 36-31 30Z" fill="#3d281c"/>}
   {!observer&&<><circle cx="-12" cy="54" r="3.2" fill="#342c28"/><circle cx="13" cy="54" r="3.2" fill="#342c28"/><path d="M-10 75Q0 83 11 75" fill="none" stroke="#824a30" strokeWidth="2.5" strokeLinecap="round"/></>}
   {observer&&<>
     <path d="M-40 28L-31-8L-5 3L26-8L40 28Z" fill="#16191e" stroke="#686970" strokeWidth="2"/>
     <ellipse cx="0" cy="31" rx="66" ry="12" fill="#121418" stroke="#6b6c72" strokeWidth="2"/>
     <path d="M-39 18H40" stroke={orange} strokeWidth="5"/>
     <rect x="-32" y="46" width="29" height="17" rx="5" fill="#12191e" stroke="#8e9498" strokeWidth="2"/>
     <rect x="3" y="46" width="29" height="17" rx="5" fill="#12191e" stroke="#8e9498" strokeWidth="2"/>
     <path d="M-3 51H3M-11 78H11" stroke="#6a5a4a" strokeWidth="2"/>
     <path d="M-28 110L0 147L28 110M0 147V212" stroke="#85858b" strokeWidth="2" fill="none"/>
     <path d="M-76 166H76L63 229H-62Z" fill="#1a1d22" stroke="#898d94" strokeWidth="2.5"/>
     <path d="M-79 232H80L88 242H-88Z" fill="#383c43" stroke="#757983" strokeWidth="1.5"/>
     <path d="M-13 194L-22 204L-13 213M13 194L22 204L13 213" stroke={orange} strokeWidth="3" fill="none"/>
   </>}
   {!observer&&<g transform="translate(46 159) rotate(-12)"><rect width="30" height="51" rx="6" fill="#15191c" stroke="#95918a" strokeWidth="2"/><rect x="5" y="8" width="20" height="29" rx="2" fill="#38362e"/><path d="M11 44H19" stroke={orange} strokeWidth="2"/></g>}
   {label&&<text x="0" y="332" textAnchor="middle" fill={observer?'#aaa9ad':paper} fontSize="25" letterSpacing="3" fontWeight="600">{label}</text>}
 </g>;
};

export const Wallet:React.FC<{x:number;y:number;scale?:number;protected?:boolean}> = ({x,y,scale=1,protected:shielded=false}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
 <rect x="-76" y="-45" width="152" height="95" rx="15" fill="#191b1d" stroke={shielded?orange:'#d4cec4'} strokeWidth="2.5"/>
 <path d="M-64-45V-55L54-67Q69-68 68-53V-45" fill="#272a2c" stroke={shielded?orange:'#bcb5aa'} strokeWidth="2.5"/>
 <rect x="30" y="-12" width="57" height="35" rx="8" fill="#202124" stroke={shielded?orange:'#d4cec4'} strokeWidth="2"/>
 <circle cx="48" cy="5" r="5" fill={orange}/>
</g>;

export const Token:React.FC<{x:number;y:number;scale?:number;label?:string}> = ({x,y,scale=1,label}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
 <path d="M0-25L37-4V37L0 59L-37 37V-4Z" fill="#6a2607" stroke={orange} strokeWidth="2"/>
 <path d="M0-25L37-4L0 18L-37-4Z" fill="#ff8a20" stroke="#ff9d41" strokeWidth="2"/>
 <path d="M0 18V59L37 37V-4Z" fill="#29170e" stroke={orange} strokeWidth="2"/>
 {label&&<text y="91" x="0" fill={paper} fontSize="24" textAnchor="middle" fontWeight="600">{label}</text>}
</g>;

export const Pill:React.FC<{x:number;y:number;text:string;active?:boolean;width?:number}> = ({x,y,text,active=false,width=210}) => <g transform={`translate(${x} ${y})`}>
 <rect x={-width/2} y="-22" width={width} height="44" rx="22" fill={active?'#ff6900':'#111315'} stroke={active?orange:'#605244'} strokeWidth="1.5"/>
 <text x="0" y="7" textAnchor="middle" fill={active?'#090a0b':paper} fontFamily="InterTight" fontSize="20" fontWeight="650" letterSpacing="2">{text}</text>
</g>;

export const PathPulse:React.FC<{d:string;start:number;end:number;frame:number;color?:string;dash?:boolean}> = ({d,start,end,frame,color=orange,dash=false}) => <path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" pathLength="1"
 strokeDasharray={dash?'.025 .025':1} strokeDashoffset={dash?-(frame-start)/500:1-progress(frame,start,end)} opacity={progress(frame,start,start+10)}/>;

export const Caption:React.FC<{text:string;from?:number}> = ({text,from=0}) => {const f=useCurrentFrame();return <div style={{position:'absolute',left:80,bottom:83,width:1280,color:muted,fontSize:31,letterSpacing:-.3,opacity:interpolate(f,[from,from+20],[0,1],clamp)}}>{text}</div>;};
