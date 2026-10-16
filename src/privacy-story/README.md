# Veilify privacy story — Part 1

35 seconds · 1600×1000 · 60 fps · English narration and original stereo sound design.

The sender and receiver make a public payment. An observer reads its addresses, amount and time. The sender then chooses Veilify. A shared-pool payment reaches the recipient, while the proof conceals which private note paid. Public deposit/payout records remain visible. The ending leads into Part 2, Inside the pool.

The observer gathers information; the film does not suggest that observing a public transaction alone allows theft. The pool/characters/notes are explanatory illustrations, not live user-count or anonymity measurements. There are no mainnet, network-launch or fee claims in this film.

## Timeline

| Time | Scene |
| --- | --- |
| 0–6 s | You send. They receive. |
| 6–13 s | Public transaction details and the observer |
| 13–18 s | Same wallet, Veilify Network |
| 18–29 s | Shared pool, ZK proof, payout, concealed funding note |
| 29–35 s | Brand close and Part 2 lead-in |

Edit narration in script.json. Regenerate local narration and sound with `python3 create_privacy_story_audio.py` from the Remotion project directory. The final voice is the user-supplied ElevenLabs Kyle recording, split at paragraph silences into eleven-01.wav through eleven-06.wav. The source and cut timing are preserved in public/privacy-story/elevenlabs-original.mp3 and elevenlabs-timing.json. The local generator is for placeholder narration only; running it does not replace the final ElevenLabs clips. All character graphics are native SVG and all motion is driven by Remotion frames.

Preview: open the VeilifyPrivacyStory composition in Remotion Studio.

Render from the project directory:

```sh
./node_modules/.bin/remotion render src/index.ts VeilifyPrivacyStory ../veilify-privacy-story-part-1.mp4 --codec=h264 --crf=17 --pixel-format=yuv420p --concurrency=4 --browser-executable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

Standalone English captions are saved alongside the MP4 as veilify-privacy-story-part-1.srt.
