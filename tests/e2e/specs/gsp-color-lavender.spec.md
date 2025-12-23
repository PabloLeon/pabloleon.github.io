# GSP Color Lavender Experiment Spec

## Overview
This experiment uses Gibbs Sampling with People (GSP) to map participants' mental representations of the color "lavender" in HSL color space.

## Experiment Flow
1. **Instructions Screen**: Explains GSP method, shows color preview example
2. **Trial Screen**: Shows color preview and slider for adjusting one dimension at a time
3. **Debrief Screen**: Shows completion message and session statistics

## Configuration
- **Domain**: Color (HSL)
- **Dimensions**: 3 (Hue, Saturation, Lightness)
- **Samples per Dimension**: 3
- **Target Iterations**: 20
- **Initial Vector**: [270, 50, 80] (purple-ish starting point)

## Dimension Ranges
- **Hue**: 0-360 (wrapped, circular)
- **Saturation**: 0-100
- **Lightness**: 0-100

## User Interaction
- Adjust slider to match mental prototype of "lavender"
- Slider cycles through dimensions automatically
- Color preview updates in real-time as slider moves
- Progress shows current iteration and dimension being adjusted

## Data Collection
- Sample values for each dimension
- Iteration count
- Sample count per dimension
- Timestamps for each sample

## Expected Behavior
- Instructions screen displays with color preview example
- Trial screen shows color preview and dimension-specific slider
- Dimension name displays correctly (Hue, Saturation, or Lightness)
- Progress updates as samples are recorded
- Debrief screen displays statistics (iterations completed, total samples, duration, average samples per iteration)

