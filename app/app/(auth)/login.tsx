import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/api/client';
import { useAuthStore } from '../../src/stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicToken, setMagicToken] = useState('');
  const [step, setStep] = useState<'email' | 'token'>('email');

  const handleRequestMagicLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.requestMagicLink(email);
      Alert.alert('Success', 'Check the server console for your magic link token');
      if (response.devToken) {
        setMagicToken(response.devToken);
        setStep('token');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!magicToken) {
      Alert.alert('Error', 'Please enter the token from the console');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.verifyMagicLink(magicToken);
      await login(response.token);
      router.replace('/(auth)/onboarding');
    } catch (error) {
      Alert.alert('Error', 'Invalid or expired token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>🌱 SELLERY</Text>
        <Text style={styles.subtitle}>Your emotional garden</Text>

        {step === 'email' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleRequestMagicLink}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Sending...' : 'Get Magic Link'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.info}>
              Check the server console for your token, then enter it below:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Paste token from console"
              value={magicToken}
              onChangeText={setMagicToken}
              autoCapitalize="none"
              multiline
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerifyToken}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Verifying...' : 'Continue'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('email')}>
              <Text style={styles.linkText}>← Back</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#558B2F',
    textAlign: 'center',
    marginBottom: 40,
  },
  info: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});
