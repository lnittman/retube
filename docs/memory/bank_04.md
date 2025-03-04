# Retube Implementation Memory Bank 04

## Design Direction Update
We're pivoting to a hardware-inspired UI design that emulates physical devices like Teenage Engineering products and the Rabbit R1. This approach will make retube unique and memorable, while providing a consistent experience across devices.

## Design Vision
- **Device-Like Interface**: The entire UI will resemble a specialized hardware device with a screen and physical controls
- **Consistent Form Factor**: Maintain fixed proportions regardless of screen size (like a virtual device in the center)
- **Utilitarian Aesthetics**: Embrace constraints with deliberate, functional design elements
- **Playful Hardware Details**: Include screws, buttons, switches, and texture for a tangible feel
- **Boot Sequence**: Add hardware-like startup animations and transitions

## Home Page Redesign
- Replace generic "semantic clusters" concept with a more engaging device boot experience
- Show "retube" briefly on startup, then fade to a minimal interface with a video preview
- Keep only a "begin" button visible after the initial sequence
- Create a framed "screen" where content appears with subtle scan lines or pixel effects

## UI Elements to Create
- **Device Frame**: Persistent container with hardware-inspired details
- **Screen Area**: Main content display with subtle CRT/LCD effects
- **Hardware Controls**:
  - D-pad or joystick-like navigation
  - Physical buttons/switches for common actions
  - Dials for adjusting parameters
  - Terminal-like prompt interface
  - Palette selection resembling physical color switches

## Implementation Plan
1. Create base device frame component with CSS
2. Update home page with new boot sequence
3. Redesign the grid listing page to fit within the device screen
4. Modify navigation to use hardware-inspired controls
5. Update palette selection to match the hardware aesthetic
6. Redesign the prompt interface to resemble a terminal
7. Add satisfying button press animations and sounds

## Technical Approach
- Use fixed aspect ratio container for the device frame
- Implement hardware details with CSS (borders, textures, shadows)
- Use Framer Motion for physical-feeling animations
- Create a design system for consistent hardware elements
- Maintain a constrained color palette appropriate for a device

## Current Status
- Core functionality is operational but with a generic web app aesthetic
- Recent improvements to palette selection and UI positioning
- All required pages are implemented

## Next Steps
- [ ] Create a `.device-frame` component with hardware styling
- [ ] Redesign the home page with boot sequence
- [ ] Update grid listing page to fit device aesthetic
- [ ] Redesign navigation as hardware controls
- [ ] Modify palette interface to match hardware look
- [ ] Update prompt interface to terminal style

## Design References
- Teenage Engineering OP-1 and Pocket Operator UI/UX
- Rabbit R1 minimalist interface
- Playdate handheld game console
- Retro computing terminals and command lines
- Gameboy and other classic handheld devices

## Technical Considerations
- Ensure accessibility despite the hardware aesthetic
- Maintain responsive design while keeping the device proportions
- Ensure the UI is still functional and intuitive
- Balance the aesthetic with good UX principles 