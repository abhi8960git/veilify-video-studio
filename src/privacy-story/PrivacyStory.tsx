import {AbsoluteFill,Sequence,staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {PublicPayment} from './PublicPayment';
import {PublicObserver} from './PublicObserver';
import {ChooseVeilify} from './ChooseVeilify';
import {ProtectedPayment} from './ProtectedPayment';
import {StoryEnd} from './StoryEnd';

export const PrivacyStory:React.FC=()=> <AbsoluteFill>
 <TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={360} name="You send. They receive."><PublicPayment/></TransitionSeries.Sequence>
  <TransitionSeries.Sequence durationInFrames={420} name="A public payment can be followed"><PublicObserver/></TransitionSeries.Sequence>
  <TransitionSeries.Sequence durationInFrames={300} name="Choose Veilify"><ChooseVeilify/></TransitionSeries.Sequence>
  <TransitionSeries.Sequence durationInFrames={660} name="The proof conceals the funding note"><ProtectedPayment/></TransitionSeries.Sequence>
  <TransitionSeries.Sequence durationInFrames={360} name="Next: inside the pool"><StoryEnd/></TransitionSeries.Sequence>
 </TransitionSeries>
 <Audio src={staticFile('privacy-story/soundtrack.wav')}/>
 <Sequence from={27} layout="none"><Audio src={staticFile('privacy-story/eleven-01.wav')}/></Sequence>
 <Sequence from={375} layout="none"><Audio src={staticFile('privacy-story/eleven-02.wav')}/></Sequence>
 <Sequence from={801} layout="none"><Audio src={staticFile('privacy-story/eleven-03.wav')}/></Sequence>
 <Sequence from={1101} layout="none"><Audio src={staticFile('privacy-story/eleven-04.wav')}/></Sequence>
 <Sequence from={1570} layout="none"><Audio src={staticFile('privacy-story/eleven-05.wav')}/></Sequence>
 <Sequence from={1758} layout="none"><Audio src={staticFile('privacy-story/eleven-06.wav')}/></Sequence>
</AbsoluteFill>;
