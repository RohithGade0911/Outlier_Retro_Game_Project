🎮 Product Requirements Document (PRD)
📝 Project Title
Sky Pixels: Chicken Invasion
________________________________________
📌 Overview
“Sky Pixels: Chicken Invasion” is a vertical-scrolling, pixel-art arcade shooter inspired by Chicken Invaders and classic shooters like 1942. The player pilots a retro spaceship and defends Earth from waves of invading space chickens and their bizarre arsenal — eggs, feathers, and alien tech.
This version is focused entirely on the frontend UI and gameplay, built using HTML5 Canvas/WebGL + JavaScript — with no backend integration initially.
________________________________________
🎯 Objectives
•	Build a fully functional arcade shooter UI with humor, chaos, and retro flair.
•	Deliver quirky mechanics and smooth gameplay using modern frontend tools.
•	Maintain pixel-perfect visual fidelity and sound for maximum nostalgia.
•	Optimize for performance and cross-device responsiveness.
________________________________________
🧱 Core Features
1. 🛸 Player Mechanics
•	Movement: Keyboard (Arrow keys / WASD) or Touch for mobile.
•	Shooting: Spacebar / Auto-fire option.
•	Power-ups: Rapid fire, lasers, missiles, shield.
•	Lives: 3 lives per run with animation when hit.
2. 🐔 Enemies: Space Chickens
•	Standard Chickens: Appear in patterns, drop eggs.
•	Egg Bombers: Drop rapid-fire eggs that splatter.
•	Feather Flurry Chickens: On death, explode into feathers that act as projectiles.
•	Chickens-in-UFOs: Shoot laser beams.
3. 🐓 Boss Chickens
•	Appear every 5 waves with a unique entrance animation.
•	May lay massive egg bombs or peck the screen.
•	Bosses have comical attacks, taunts, and multi-stage health.
4. 🧀 Power-Ups & Collectibles
•	Chicken Nuggets: Collect for score.
•	Drumsticks: Restore health.
•	Hot Sauce: Temporary flame thrower.
•	Golden Egg: Invincibility for 5 seconds.
5. 💻 UI Components
•	Main Menu
o	Start Game
o	How to Play
o	Sound/Music Toggle
•	HUD (In-Game)
o	Score
o	Lives
o	Current Wave
o	Active Power-up Indicator
•	Pause Menu
o	Resume / Restart / Exit
•	Game Over Screen
o	Final Score
o	Retry / Main Menu
•	Victory Screen
o	“Chicken Dinner!” animation
o	Total Nuggets Collected
6. 🎨 Graphics & Animations
•	Pixel-art chicken sprites and wacky UFOs.
•	Scrolling space background with parallax stars.
•	Explosions: egg splatters, smoke, feathers.
•	UI: Retro arcade fonts and blinking neon pixel buttons.
7. 🔊 Sound & Music
•	Background 8-bit-style spacey BGM.
•	Sound FX:
o	Chicken clucks, squawks
o	Laser / Egg splat
o	Power-up pickup
o	Boss chicken intro theme
o	“Bawk bawk!” when hit
________________________________________
🛠️ Tech Stack
Layer	Tool
Game Loop / Canvas	HTML5 <canvas>, requestAnimationFrame
Rendering	PixiJS (preferred) or pure Canvas 2D
Audio	Howler.js
Dev Server	Vite
Animations (UI / transitions)	GSAP (optional)
Assets	Created in Piskel or Aseprite
Code Quality	ESLint, Prettier
________________________________________
🧩 File Structure
csharp
CopyEdit
chicken-invasion/
├── public/
│   └── index.html
├── src/
│   ├── assets/           # Chicken sprites, sound FX, explosions
│   ├── core/             # Game loop, rendering engine
│   ├── entities/         # Player, chicken types, projectiles, bosses
│   ├── ui/               # HUD, menu screens
│   ├── effects/          # Animations, explosions
│   ├── utils/            # Collision, game math, constants
│   └── main.js
├── styles/
├── vite.config.js
└── README.md
________________________________________
✅ Milestones
🔹 Phase 1: Core Engine
•	Canvas setup with game loop
•	Player ship with controls
•	Shooting and bullet system
🔹 Phase 2: Chicken Mayhem
•	Basic chicken wave logic
•	Egg-dropping enemies
•	Collision detection (egg hits, bullet hits)
•	Chicken nugget collection
🔹 Phase 3: UI / UX
•	Main menu and how-to-play screen
•	HUD overlay and score tracking
•	Game over and restart flow
🔹 Phase 4: Boss & Powerups
•	Boss chicken mechanics
•	Power-up logic and effects
•	Final win condition
🔹 Phase 5: Polish
•	Add sound/music
•	Mobile touch controls (optional)
•	Screen shake, flashes, game feel polish
•	Bug fixes + Performance optimization
________________________________________
📱 Device Compatibility
•	Desktop browsers: Chrome, Firefox, Safari, Edge
•	Mobile devices: Chrome, Safari (touch support in v2)
________________________________________
📝 Notes
•	All visuals should be consistent in pixel-art style.
•	Humor and surprise are key — visual effects and sound should make it playful.
•	Later backend features like leaderboards or cloud saves are not part of v1.
________________________________________
🚀 Success Criteria
•	Smooth game experience with no crashes.
•	All menu + gameplay UI flows implemented.
•	Chicken humor, polished retro vibe, and full playability.

