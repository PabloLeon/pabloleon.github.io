# GSP Chord Pleasant Experiment Spec

## Overview
This experiment uses Gibbs Sampling with People (GSP) to map participants' mental representations of "pleasant" chords by adjusting musical intervals.

## Experiment Flow
1. **Instructions Screen**: Explains GSP method, shows audio controls example
2. **Trial Screen**: Shows audio controls and slider for adjusting one interval at a time
3. **Debrief Screen**: Shows completion message and session statistics

## Configuration
- **Domain**: Chord (musical intervals)
- **Dimensions**: 2 (Interval 1, Interval 2)
- **Samples per Dimension**: 3
- **Target Iterations**: 15
- **Initial Vector**: [7, 4] (Perfect 5th + Major 3rd)
- **Root Frequency**: 220 Hz

## Dimension Ranges
- **Interval 1**: 0.5-11.5 semitones
- **Interval 2**: 0.5-11.5 semitones

## User Interaction
- Adjust slider to create the most pleasant-sounding chord
- Slider cycles through intervals automatically
- Audio plays the chord as slider moves
- Progress shows current iteration and interval being adjusted

## Data Collection
- Sample values for each interval
- Iteration count
- Sample count per dimension
- Timestamps for each sample

## Expected Behavior
- Instructions screen displays with audio controls example
- Trial screen shows audio controls and interval-specific slider
- Interval name displays correctly (Interval 1 or Interval 2)
- Progress updates as samples are recorded
- Debrief screen displays statistics (iterations completed, total samples, duration, average samples per iteration)

