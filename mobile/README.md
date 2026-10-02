# Demonanic Mobile Shell

This branch uses a thin Expo/React Native WebView around the existing Demonanic web application. The existing web game remains authoritative for combat, economy, preparation, results, and backend communication.

The mobile shell is intentionally not a second game engine.

Default web-game URL: https://demonanic.pages.dev

To run locally:

    cd mobile
    npm install
    npx expo start

A different deployment can be supplied with EXPO_PUBLIC_GAME_URL.
