import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const GAME_URL =
  process.env.EXPO_PUBLIC_GAME_URL || "https://demonanic.pages.dev";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  return (
    <View style={styles.root}>
      <WebView
        source={{ uri: GAME_URL }}
        style={styles.web}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        originWhitelist={["https://*"]}
        onLoadStart={() => {
          setFailed(false);
          setLoading(true);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
      />

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#00f3ff" />
          <Text style={styles.title}>DEMONANIC</Text>
          <Text style={styles.subtitle}>LOADING CASTLE...</Text>
        </View>
      )}

      {failed && (
        <View style={styles.error}>
          <Text style={styles.title}>CONNECTION LOST</Text>
          <Text style={styles.message}>
            The Demonanic web game could not be loaded.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  web: { flex: 1, backgroundColor: "#07080d" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#07080d",
  },
  error: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#07080d",
  },
  title: {
    marginTop: 14,
    color: "#ff007f",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 5,
  },
  subtitle: {
    marginTop: 8,
    color: "#00f3ff",
    fontSize: 12,
    letterSpacing: 3,
  },
  message: {
    marginTop: 16,
    color: "#cbd5e1",
    textAlign: "center",
    fontSize: 15,
  },
});
