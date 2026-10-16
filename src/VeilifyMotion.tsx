import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {BlockScene} from './scenes/BlockScene';
import {ToggleScene} from './scenes/ToggleScene';
import {EndCard} from './scenes/EndCard';

export const VeilifyMotion: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'InterTight'}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={420} name="Public blocks and magnified transaction">
        <BlockScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence durationInFrames={180} name="Switch privacy on">
        <ToggleScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence durationInFrames={540} name="Encrypt closeup, then the network">
        <BlockScene privateMode />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence durationInFrames={240} name="Veilify end card">
        <EndCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Audio src={staticFile('sound-design.wav')} />
  </AbsoluteFill>
);
