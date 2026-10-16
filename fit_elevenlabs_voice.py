from pathlib import Path
import json,shutil,subprocess
root=Path('/Users/abhishek/Buildorz-Work/nullmask-robinhood/output/video/veilify-motion')
out=root/'public/privacy-story'
source=Path('/Users/abhishek/Downloads/ElevenLabs_2026-10-16T11_53_59_Kyle - Engaging, Confident, Authentic_pvc_sp105_s50_sb75_v4.mp3')
shutil.copy2(source,out/'elevenlabs-original.mp3')
subprocess.run(['ffmpeg','-v','error','-y','-i',str(source),'-af','loudnorm=I=-18:TP=-3:LRA=8','-ar','48000','-ac','2',str(out/'elevenlabs-master.wav')],check=True)
# Cuts fall in the recorded silence between the six script paragraphs.
cuts=[0,2.85,9.15,13.35,20.25,22.85,26.044063]
script=json.loads((root/'src/privacy-story/script.json').read_text())
for i,e in enumerate(script):
 dur=cuts[i+1]-cuts[i]
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(out/'elevenlabs-master.wav'),'-ss',str(cuts[i]),'-t',str(dur),'-c:a','pcm_s16le',str(out/f"eleven-{e['id']}.wav")],check=True)
 e['sourceStart']=cuts[i]; e['sourceEnd']=cuts[i+1]; e['duration']=dur
(out/'elevenlabs-timing.json').write_text(json.dumps(script,indent=2)+'\n')
p=root/'src/privacy-story/PrivacyStory.tsx'
s=p.read_text()
for i in range(1,6): s=s.replace(f'voice-{i:02}.wav',f'eleven-{i:02}.wav')
s=s.replace(' {/* Final narration will be replaced with the supplied ElevenLabs recording. */}'," <Sequence from={1758} layout=\"none\"><Audio src={staticFile('privacy-story/eleven-06.wav')}/></Sequence>")
p.write_text(s)
def stamp(t):
 ms=round(t*1000)
 return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
lines=[]
for i,e in enumerate(script,1): lines.extend([str(i),f"{stamp(e['start'])} --> {stamp(e['start']+e['duration'])}",e['text'],''])
(root.parent/'veilify-privacy-story-part-1.srt').write_text('\n'.join(lines))
p=root/'src/privacy-story/README.md'
s=p.read_text().replace('The voice uses macOS Daniel.','The final voice is the user-supplied ElevenLabs Kyle recording, split at paragraph silences into eleven-01.wav through eleven-06.wav. The source and cut timing are preserved in public/privacy-story/elevenlabs-original.mp3 and elevenlabs-timing.json. The local generator is for placeholder narration only; running it does not replace the final ElevenLabs clips.')
p.write_text(s)
print('Six ElevenLabs clips aligned without changing voice speed.')
