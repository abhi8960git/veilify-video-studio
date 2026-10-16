import './index.css';
import {Composition, Folder, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {VeilifyMotion} from './VeilifyMotion';
import {BlockScene} from './scenes/BlockScene';
import {ToggleScene} from './scenes/ToggleScene';
import {EndCard} from './scenes/EndCard';
import {PrivacyStory} from './privacy-story/PrivacyStory';

loadFont({family: 'InterTight', url: staticFile('InterTight.ttf'), weight: '100 900'});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="VeilifyPrivacyStory" component={PrivacyStory}
      durationInFrames={2100} fps={60} width={1600} height={1000} />
    <Composition id="VeilifyMotion" component={VeilifyMotion}
      durationInFrames={1380} fps={60} width={1600} height={1000} />
    <Folder name="Scenes">
      <Composition id="PublicTransactions" component={BlockScene}
        durationInFrames={420} fps={60} width={1600} height={1000} />
      <Composition id="PrivacySwitch" component={ToggleScene}
        durationInFrames={180} fps={60} width={1600} height={1000} />
      <Composition id="PrivateTransactions" component={BlockScene}
        defaultProps={{privateMode: true}} durationInFrames={540}
        fps={60} width={1600} height={1000} />
      <Composition id="VeilifyEndCard" component={EndCard}
        durationInFrames={240} fps={60} width={1600} height={1000} />
    </Folder>
  </>
);
