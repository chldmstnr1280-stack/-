import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌱</Text>
      <Text style={styles.title}>Welcome to SELLERY!</Text>
      <Text style={styles.description}>
        Record your emotions daily and watch your mascot Selly grow with you.
      </Text>

      <View style={styles.features}>
        <Text style={styles.feature}>📝 Track your emotions</Text>
        <Text style={styles.feature}>🌿 Grow your mascot</Text>
        <Text style={styles.feature}>📊 See weekly insights</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Let's Start!</Text>
      </TouchableOpacity>

      <Text style={styles.privacy}>
        Your data is private and secure. We value your emotional wellbeing.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#558B2F',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    fontSize: 18,
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  privacy: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 30,
  },
});
