# Demonanic Expo Mobile Prototype

This is an isolated Android/iOS proof of concept. It does not replace the existing web game.

Prototype loop:
Home -> Preparation -> 5-second Scout Countdown -> Battle -> Results -> Preparation

Included:
- portrait mobile layout
- neon synthwave visual language
- four Castle Squad heroes
- four tower types
- five-lane battlefield
- outer wall / gate / keep layers
- touch-to-target enemy commands
- automatic background combat pressure
- basic win/result flow
- EAS development, preview APK, and production profiles

Boundary:
The existing frontend remains authoritative for the v140 systems. This mobile prototype uses a small isolated simulation so mobile presentation and touch interaction can be validated before migrating the real engine.

Run from mobile/:
npm install
npx expo start

For an installable Android preview:
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview

The preview profile is configured as an APK for direct Android installation. The prototype has no authentication, Supabase, ads, payments, or production backend yet.


## Combat Prototype v2

The mobile combat loop was revised after the first physical-device recording.

### Changes
- Enemy units are substantially smaller and no longer use giant battlefield boxes.
- Enemy advance is continuous and smoothed with React Native Animated transforms.
- Heroes now visibly advance toward the active engagement area instead of remaining stationary.
- Towers automatically acquire targets and fire on a repeating cadence.
- Heroes automatically attack on a repeating cadence.
- Projectiles are visible in flight:
  - Archer: arrow
  - Catapult: rock
  - Wizard/Mage: magic bolt
  - Ballista: heavy bolt
  - Hero attacks use class-colored traces.
- Projectile impact applies damage after the projectile reaches the target.
- Tap-to-target remains available as a direct hero command instead of being the only source of damage.
- Selected targets receive a visible targeting ring.
- The battlefield was tightened vertically to reduce empty space on phone screens.
- The five-lane structure, Outer Wall, Gate, Keep, tower positions, and Castle Squad remain intact.

### Device test goal

For the next APK, record 10–20 seconds from the start of the live battle and verify:

1. Enemies are clearly smaller than the first APK.
2. Enemy movement is smooth and continuous.
3. Heroes visibly move/advance.
4. Towers fire without tapping.
5. Heroes attack without tapping.
6. Projectiles/traces are visible.
7. Enemy HP decreases from automated combat.
8. Tapping an enemy changes the selected target and causes a directed attack.
9. No obvious jitter, frozen units, or console-breaking runtime errors appear.

This remains an isolated mobile combat prototype. It does not replace or migrate the production web GameEngine yet.
