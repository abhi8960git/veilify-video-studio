# Veilify on your phone

Open this repository in GitHub Codespaces. The dev container installs Node, the Linux rendering libraries, project dependencies, and Remotion Chrome Headless Shell. It starts Studio automatically on port 3345.

1. Sign into GitHub on your phone and open the repository.
2. Choose Code → Codespaces → create or resume a codespace.
3. Open the forwarded port 3345 in the Ports panel. Keep port visibility Private.
4. Choose VeilifyPrivacyStory to view the current 35-second film.

To render, run `npm run render:story`. Download `out/veilify-privacy-story-part-1.mp4` from the file explorer. If Studio has stopped, run `npm run dev:cloud`.

The machine runs in GitHub, so your Mac does not need to stay on. A stopped Codespace needs to be resumed before previewing or rendering. Codespaces compute and storage are subject to your GitHub allowance and billing settings.

Narration and original sound effects are included in public/privacy-story. The final composition uses the supplied ElevenLabs clips. The macOS placeholder narration generator is not required in the cloud. Edit src/privacy-story for the story, and src/scenes for the earlier block animation.

This repository contains video assets only, not the Veilify application or its credentials. Codex chat history is not transferred with these files.
