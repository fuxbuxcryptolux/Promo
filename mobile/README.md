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
