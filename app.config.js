export default {
  expo: {
    name: "ai-flashcards",
    slug: "ai-flashcards",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.adam.aiflashcards"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.adam.aiflashcards",
      versionCode: 1
    },
    web: {
      output: "static"
    },
    experiments: {
      typedRoutes: false // explicitly disables expo-router detection
    }
  }
};
