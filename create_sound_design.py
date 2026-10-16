#!/usr/bin/env python3
"""Original Veilify sound design, synthesized with Python's standard library.

Run: python3 create_sound_design_v2.py
No recordings, speech, music, online services, or third-party dependencies.
Change event times or parameters below to re-time the editable sound design.
"""
from array import array
import json
import math
from pathlib import Path
import random
import struct
import wave

SR = 48000
DURATION = 23.0
SEED = 48192
TARGET_PEAK_DBFS = -3.0
OUTPUT = Path(__file__).parent / "public" / "sound-design.wav"
rng = random.Random(SEED)
N = round(SR * DURATION)
left = array("d", [0.0]) * N
right = array("d", [0.0]) * N
events = []


def ease(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3.0 - 2.0 * x)


def noise_band(count, lo, hi):
    """Quiet shaped noise from two first-order low-pass filters."""
    a_lo = 1.0 - math.exp(-2.0 * math.pi * lo / SR)
    a_hi = 1.0 - math.exp(-2.0 * math.pi * hi / SR)
    lp_lo = lp_hi = 0.0
    result = array("d")
    for _ in range(count):
        sample = rng.uniform(-1.0, 1.0)
        lp_lo += a_lo * (sample - lp_lo)
        lp_hi += a_hi * (sample - lp_hi)
        result.append(lp_hi - lp_lo)
    return result


def add(at, samples, gain=1.0, pan=0.0, pan_end=None):
    offset = round(at * SR)
    count = len(samples)
    for k, sample in enumerate(samples):
        dest = offset + k
        if dest < 0 or dest >= N:
            continue
        pos = pan if pan_end is None else pan + (pan_end - pan) * k / max(1, count - 1)
        # Constant-power pan, intentionally subtle for natural stereo imaging.
        angle = (max(-1, min(1, pos)) + 1) * math.pi / 4
        left[dest] += gain * sample * math.cos(angle)
        right[dest] += gain * sample * math.sin(angle)


def air(at, duration, gain=0.075, direction=1, label="row movement"):
    samples = noise_band(round(duration * SR), 520, 2800)
    for k in range(len(samples)):
        x = k / max(1, len(samples) - 1)
        envelope = math.sin(math.pi * x) ** 2
        # Short bright leading breath, smooth tails; no bass/impact component.
        samples[k] *= envelope * (0.75 + 0.25 * math.cos(x * math.pi))
    add(at, samples, gain, -0.35 * direction, 0.35 * direction)
    events.append({"time": at, "duration": duration, "sound": label})


def click(at, gain=0.15, pan=0.0, frequency=1750, label="typing"):
    duration = 0.061
    samples = noise_band(round(duration * SR), 1150, 8200)
    for k in range(len(samples)):
        t = k / SR
        attack = min(1.0, t / 0.00045)
        noise = samples[k] * math.exp(-t / 0.0065) * 0.66
        tone = math.sin(2 * math.pi * frequency * t) * math.exp(-t / 0.010) * 0.18
        body = math.sin(2 * math.pi * 310 * t) * math.exp(-t / 0.008) * 0.21
        samples[k] = attack * (noise + tone + body)
    add(at, samples, gain, pan)
    events.append({"time": round(at, 4), "duration": duration, "sound": label})


def tactile_switch(at, gain, pan, label):
    duration = 0.17
    samples = noise_band(round(duration * SR), 850, 7200)
    for k in range(len(samples)):
        t = k / SR
        attack = min(1.0, t / 0.0004)
        # Two small physical contacts and a warm, brief mechanism resonance.
        first = samples[k] * math.exp(-t / 0.0078) * 0.80
        body = math.sin(2 * math.pi * 205 * t) * math.exp(-t / 0.015) * 0.59
        upper = math.sin(2 * math.pi * 2240 * t) * math.exp(-t / 0.0048) * 0.16
        second_time = t - 0.018
        second = 0.0 if second_time < 0 else samples[k] * math.exp(-second_time / 0.0045) * 0.42
        samples[k] = attack * (first + body + upper + second)
    add(at, samples, gain, pan)
    events.append({"time": at, "duration": duration, "sound": label})


def lock_tick(at, pan=0.0, gain=0.16):
    # A tiny latch, then a single bright digital confirmation, no melody.
    click(at, gain, pan, 2450, "privacy lock latch")
    duration = 0.092
    samples = array("d")
    for k in range(round(duration * SR)):
        t = k / SR
        envelope = min(1.0, t / 0.0015) * math.exp(-t / 0.014)
        samples.append(envelope * math.sin(2 * math.pi * 3050 * t) * 0.12)
    add(at + 0.028, samples, gain, pan)


# 0–7 s: opposing rows move; the magnifier gently moves into clear view.
for at, duration, direction, gain in [(0.15, 2.05, 1, 0.055), (2.1, 2.25, -1, 0.042), (4.2, 2.55, 1, 0.037)]:
    air(at, duration, gain, direction)
air(2.4, 0.70, 0.17, 1, "public magnifier glass zoom in")
air(5.8, 0.70, 0.13, -1, "public magnifier glass zoom out")

# 7–10 s: clean cut, touch/slide at 8 s, tactile snap precisely at 8.55 s.
air(6.94, 0.19, 0.072, 1, "toggle scene transition")
tactile_switch(8.00, 0.27, -0.13, "toggle touch")
air(8.00, 0.55, 0.27, 1, "toggle sliding")
tactile_switch(8.55, 0.74, 0.13, "toggle snap on")

# 10–19 s: private scene magnifier enlarges, data holds, then encrypts.
air(9.94, 0.24, 0.11, -1, "private scene transition")
air(10.10, 1.0, 0.037, -1)
air(10.80, 0.70, 0.17, 1, "private magnifier glass zoom in")

# Focused close-up: centered, clearly audible crisp typing, 12–14.5 s.
# Small variations keep it tactile. Each burst maps to a changing data line.
focused_clusters = [12.0, 12.57, 13.14, 13.71]
focused_key_pattern = [0.0, 0.070, 0.126, 0.213, 0.272, 0.351, 0.418, 0.489]
for cluster_index, start in enumerate(focused_clusters):
    for key_index, relative in enumerate(focused_key_pattern):
        variation = rng.uniform(-0.006, 0.006) if key_index else 0.0
        gain = rng.uniform(0.350, 0.460)
        frequency = rng.uniform(1550, 2250)
        pan = [-0.09, 0.09][key_index % 2]
        click(start + relative + variation, gain, pan, frequency, "magnifier encryption typing")
# Finish the last privacy dots and settle on the lock.
click(14.28, 0.335, -0.04, 1870, "final magnifier privacy dot")
click(14.37, 0.315, 0.04, 2130, "final magnifier privacy dot")
lock_tick(14.50, 0.0, 0.335)
air(15.2, 0.70, 0.13, -1, "private magnifier glass zoom out")

# Surrounding field: softer distributed typing with staggered small latches.
swarm_clusters = [(16.10, [-0.34, -0.12]), (16.62, [0.14, 0.33]), (17.15, [-0.22, 0.08]), (17.70, [0.22, -0.06])]
swarm_key_pattern = [0.0, 0.066, 0.123, 0.201, 0.267, 0.345]
for start, pans in swarm_clusters:
    for key_index, relative in enumerate(swarm_key_pattern):
        variation = rng.uniform(-0.006, 0.006) if key_index else 0.0
        gain = rng.uniform(0.190, 0.265)
        frequency = rng.uniform(1450, 2250)
        click(start + relative + variation, gain, pans[key_index % 2], frequency, "surrounding cube encryption typing")
    lock_tick(start + 0.43, pans[-1], 0.19)
air(16.1, 2.1, 0.030, 1)

# 19–23 s: clean end-card entry, then delicate tagline and URL accents.
air(19.0, 0.40, 0.21, 1, "end card airy hit")
click(19.5, 0.13, 0.0, 1700, "tagline reveal")
air(19.53, 0.31, 0.045, -1, "tagline breath")
click(20.1, 0.17, 0.0, 2100, "URL reveal")
air(20.12, 0.38, 0.063, 1, "URL breath")

# Remove any accumulated DC, and allow margin for reconstructed true peaks.
mean_l, mean_r = sum(left) / N, sum(right) / N
for i in range(N):
    # Final 750 ms fade acts as a guard if additional sounds are edited in.
    fade = 1.0 - ease((i / SR - 22.25) / 0.75)
    left[i] = (left[i] - mean_l) * fade
    right[i] = (right[i] - mean_r) * fade
peak = max(max(abs(x) for x in left), max(abs(x) for x in right))
scale = 10 ** (TARGET_PEAK_DBFS / 20) / peak
pcm = array("h")
energy = 0.0
for l, r in zip(left, right):
    l, r = l * scale, r * scale
    energy += l * l + r * r
    pcm.extend([round(l * 32767), round(r * 32767)])
if struct.pack("=h", 1) != struct.pack("<h", 1):
    pcm.byteswap()
with wave.open(str(OUTPUT), "wb") as wav:
    wav.setnchannels(2)
    wav.setsampwidth(2)
    wav.setframerate(SR)
    wav.writeframes(pcm.tobytes())
metrics = {"path": str(OUTPUT), "duration_s": DURATION, "sample_rate_hz": SR, "channels": 2, "bit_depth": 16, "sample_peak_dbfs": TARGET_PEAK_DBFS, "rms_dbfs": round(20 * math.log10(math.sqrt(energy / (2 * N))), 3), "clipped_samples": sum(abs(x) >= 32767 for x in pcm), "seed": SEED, "events": events}
OUTPUT.with_suffix(".json").write_text(json.dumps(metrics, indent=2) + "\n")
print(json.dumps({k: v for k, v in metrics.items() if k != "events"}, indent=2))
