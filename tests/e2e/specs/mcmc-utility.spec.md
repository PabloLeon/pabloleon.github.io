# MCMC Utility Estimation Experiment Spec

## Overview
This experiment uses Markov Chain Monte Carlo (MCMC) methods to estimate a participant's utility function over probabilistic outcomes.

## Experiment Flow
1. **Instructions Screen**: Explains the experiment, shows example lottery, explains keyboard controls
2. **Trial Screen**: Presents pairs of lotteries, participant chooses preferred option
3. **Debrief Screen**: Shows completion message and session statistics

## Configuration
- **Target Trials**: 60
- **Interaction Method**: Keyboard shortcuts (ArrowLeft/ArrowRight)
- **Lottery Structure**: Three outcomes (£20, £10, £0) with probabilities summing to 1

## User Interaction
- Press `←` (Left Arrow) to choose the left lottery (Option A)
- Press `→` (Right Arrow) to choose the right lottery (Option B)
- Progress bar shows current trial number and remaining trials

## Data Collection
- Participant choices between lotteries
- Response times for each choice
- Agent logs (MCMC proposal acceptance/rejection)
- Session metadata (start time, trial count, chain states)

## Expected Behavior
- Instructions screen displays with example lottery visualization
- Trial screen shows two lottery cards side-by-side
- Progress updates after each choice
- Debrief screen displays statistics (total trials, duration, average response time, agent acceptance rate)

