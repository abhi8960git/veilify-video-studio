# Veilify motion film

23 seconds · 1600 × 1000 (16:10) · 60 fps · MP4 / H.264 + stereo AAC.

The supplied frames and later layout references are archived in `public/references`. Independently moving vector layers let alternating diagonal rows move smoothly. The highlighted cube stays within the original row and depth order. Every cube displays a block header and three wallet-to-token-amount transaction rows. A square panel enlarges that same ledger in the public scene. In the private scene, its rows encrypt first; after zooming out, surrounding block details encrypt. The toggle and closing card follow the supplied artwork and copy. Sound effects are original synthesized audio.

| Time | Scene |
| --- | --- |
| 0:00–0:07 | Public block trains; magnifier opens at 0:02.4 and closes at 0:06.5 |
| 0:07–0:10 | Normal transactions → Veilify; switch at 0:08 |
| 0:10–0:19 | Magnifier opens at 0:10.8, encrypts at 0:12–0:14.5, closes by 0:15.9; surrounding blocks encrypt from 0:16.1 |
| 0:19–0:23 | Veilify brand, tagline and website |

Preview: `npm run dev`

Render: `npm run render`

The resulting video is saved one directory above this project as `veilify-motion-v3.mp4`. To use an installed Chrome browser, add `--browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` to the render command.

Edit scene timing in `src/VeilifyMotion.tsx` and motion in `src/scenes/`. The original sound track is `public/sound-design.wav`; its editable synthesis script is `create_sound_design.py`, which regenerates the WAV directly in `public/`.
