# Welcome to your Expo app 👋

ScanIQ is a mobile app built with Expo and React Native that helps users make smarter shopping decisions by scanning product barcodes and analyzing ingredients. It provides clear insights, product scores, and better alternatives—all in real time.

Features:
Barcode Scanning – Scan products instantly using your camera
Ingredient Analysis – Identify potentially harmful or low-quality ingredients
Smart Scoring – Simple product ratings based on ingredient quality
Alternative Suggestions – Discover healthier or better product options
Favorites – Save products for later
History – Track previously scanned items

Tech Stack:
Framework: Expo (React Native)
Language: TypeScript
Routing: Expo Router (file-based routing)
Camera/Scanner: Expo Camera & Barcode Scanner
State Management: Local storage (favorites & history)
API Layer: Custom product API

Project Structure
ScanIQ/
│── app/ # Screens & routes (Expo Router)
│── components/ # Reusable UI components
│── logic/ # Ingredient analysis & scoring
│── api/ # API calls (products)
│── data/ # Static data (e.g., barcodes)
│── hooks/ # Custom hooks
│── styles/ # Styling
│── assets/ # Images/icons

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

````

3. Run on a device

From the Expo CLI, you can open the app in:

Android emulator
iOS simulator
Expo Go (physical device)
In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


## Get a fresh project

You can start editing the app inside the app/ directory.
This project uses file-based routing via Expo Router.(https://docs.expo.dev/router/introduction).
When you're ready, run:

```bash
npm run reset-project
`npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
````
