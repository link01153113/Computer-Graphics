# Term Project Team Fire

### Members:
Justin Han, Mingchao Lai, I-Lin Wu

## Description:
The animation theme for our team project will draw inspiration from the Getty Fire incident that recently happened near UCLA. 
We’ll be displaying different types of fire animation based on interaction with various elements of nature including different 
directions of wind, smoke, and water drop from a helicopter. The default animation that we will be displaying is a 3D-rendering of 
fires, showing trees that are on fire. From here, based on the element that is chosen, we’ll render a particle + collision simulation 
of what happens when fire meets with that element. The main point of interaction for the user is pressing buttons labeled with various
elements of nature, where each button will result in simulation of how fire interacts with that specific element. The user will be able
to view the interaction at various camera angles, as well as switch between different elements whenever they want, simply by clicking the 
corresponding button.

## How to Run & Interact:
You can view the animation by running host.command (Mac/Linux) or host.bat<br>
We have six buttons that the user can interact with: (1) Start Fire, (2) Send Helicopter, (3) Send Helicopter Away, (4) Start Wind from the left, (5) Start Wind from the right, and (6) Drop water.<br>
(1) Start Fire: sets the forest on fire, simulating an actual fire using flame particles<br>
(2) Send Helicopter: this sends a helicopter to put out the forest fire (you need to turn on water manually!)<br>
(3) Send Helicopter Away: this sends the helicopter away after it has finished its job<br>
(4) Start Wind from the left: this blows either the fire or the smoke to the right direction<br>
(5) Start Wind from the right: this blows either the fire or the smoke to the left direction<br>
(6) Drop Water: this is the manual command for dropping water onto the forest fire (fire only goes out once water touches the fire!)

## Individual Contributions:
### Mingchao Lai:
- Implemented particle class that is used to render fire, water, and smoke particles
- Incorporated camera zoom-in upon helicopter appearance + rendered 3D helicopter
- Rendered trees + trees with various elements (fire, smoke)

### I-Lin Wu:
- Incoporated wind blowing direction logic for both left and right
- Added sounds for helicopter + wind
- Implemented sending back of helicopter + reset camera view (zoom out)

### Justin Han:
- Implemented collision detection logic for when water meets fire (removes fire and replaces it with smoke)
- Incorporated sound mechanics for forest fire and dropping water
- Set controls for manual water dropping by helicopter
- Helped team with overall git version control for project

## Advanced Features:
- Particle rendering
- Collision detection
