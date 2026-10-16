#!/usr/bin/env python3
"""Local narration + original deterministic sound effects for PrivacyStory.
No cloud calls or third-party recordings. Narration uses macOS Daniel.
"""
from pathlib import Path
from array import array
import json, math, random, struct, subprocess, wave

ROOT=Path(__file__).parent
OUT=ROOT/'public/privacy-story'
OUT.mkdir(exist_ok=True,parents=True)
script=json.loads((ROOT/'src/privacy-story/script.json').read_text())
for entry in script:
    target=OUT/f"voice-{entry['id']}.aiff"
    subprocess.run(['/usr/bin/say','-v','Daniel','-r','165','-o',str(target),entry['text']],check=True)
    wav=target.with_suffix('.wav')
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(target),'-af','loudnorm=I=-18:TP=-3:LRA=8','-ar','48000','-ac','2',str(wav)],check=True)
    probe=subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(wav)],text=True)
    duration=float(json.loads(probe)['format']['duration'])
    available=entry['limit']-entry['start']
    if duration>available:
        temp=OUT/f"voice-{entry['id']}-fit.wav"
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-af',f'atempo={duration/available:.5f}',str(temp)],check=True)
        temp.replace(wav)
        duration=available
    entry['duration']=round(duration,4)
    print('Narration',entry['id'],duration,flush=True)
(OUT/'narration-timing.json').write_text(json.dumps(script,indent=2))

SR=48000
DURATION=35
N=SR*DURATION
rng=random.Random(62831)
left=array('d',[0])*N
right=array('d',[0])*N
events=[]

def add(at,seconds,kind,gain=.2,pan=0,frequency=1500):
    offset=round(at*SR)
    count=round(seconds*SR)
    low=0.0
    for k in range(count):
        t=k/SR
        p=k/max(1,count-1)
        noise=rng.uniform(-1,1)
        low+=.18*(noise-low)
        if kind=='air':
            sample=(noise-low)*math.sin(math.pi*p)**2*.19
        elif kind=='tick':
            sample=((noise-low)*.35+math.sin(2*math.pi*frequency*t)*.27)*math.exp(-t/.009)*min(1,t/.001)
        elif kind=='ding':
            sample=(math.sin(2*math.pi*frequency*t)+.24*math.sin(2*math.pi*frequency*1.5*t))*math.exp(-t/.095)*min(1,t/.003)*.3
        else:
            sample=(math.sin(2*math.pi*(frequency*t-220*t*t))*.37+low*.22)*math.exp(-t/.026)*min(1,t/.001)
        index=offset+k
        if 0<=index<N:
            angle=(pan+1)*math.pi/4
            left[index]+=sample*gain*math.cos(angle)
            right[index]+=sample*gain*math.sin(angle)
    events.append({'time':at,'duration':seconds,'effect':kind})

for t in [0,6,13,18,29]: add(t,.6,'air',.27)
add(1.72,.08,'snap',.38,-.3,240)
add(1.77,1.55,'air',.25)
add(3.6,.32,'ding',.34,.35,1400)
for i in range(30): add(6.83+i*.067,.04,'tick',.16,(-1 if i%2 else 1)*.18,1500+i%5*90)
add(9.55,.07,'snap',.18,0,280)
add(14.43,.08,'snap',.4,.2,210)
add(14.73,.23,'ding',.17,.2,1800)
add(18.72,.7,'air',.18,-.2)
add(19.53,.08,'snap',.22,-.2,260)
for i in range(23): add(19.36+i*.047,.04,'tick',.11,0,1800+i%4*110)
add(21.15,.34,'ding',.27,0,1620)
add(21.62,1.1,'air',.2,.3)
add(22.88,.30,'ding',.3,.3,1400)
for i in range(8): add(23.9+i*.13,.045,'tick',.1,(-1 if i%2 else 1)*.28,750+i%3*180)
add(25.55,.13,'snap',.13,0,330)
add(30.7,.24,'ding',.16,0,1400)
peak=max(max(abs(v) for v in left),max(abs(v) for v in right))
gain=(10**(-12/20))/max(peak,1e-8)
pcm=array('h')
for i in range(N):
    fade=min(1,i/(SR*.02),(N-i)/(SR*.4))
    pcm.append(round(max(-1,min(1,left[i]*gain*fade))*32767))
    pcm.append(round(max(-1,min(1,right[i]*gain*fade))*32767))
with wave.open(str(OUT/'soundtrack.wav'),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes())
(OUT/'sound-events.json').write_text(json.dumps(events,indent=2))

def timestamp(value):
    ms=round(value*1000)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
srt=[]
for i,entry in enumerate(script,1):
    srt.extend([str(i),f"{timestamp(entry['start'])} --> {timestamp(entry['start']+entry['duration'])}",entry['text'],''])
(ROOT.parent/'veilify-privacy-story-part-1.srt').write_text('\n'.join(srt))
print('Original soundtrack and subtitles ready',flush=True)
