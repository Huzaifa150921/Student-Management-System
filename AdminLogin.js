import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { API_KEY } from './constants';

export default function AdminLogin() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const buttonHandler = async () => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: username,
            password: password,
            returnSecureToken: true,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Login Failed',
          text2: result.error.message,
        });
      } else {
        if (result.idToken) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Login Successful',
            text2: 'You have successfully logged in.',
          });
          navigation.navigate('AdminHome'); // Redirect to Admin Home page
        }
      }
    } catch (error) {
      console.error('Error Occurred', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'An unexpected error occurred.',
      });
    }
  };

  const showHint = () => {
    Toast.show({
      type: 'info',
      position: 'top',
      text1: 'Hint',
      text2: 'Use admin as email & admin with first 3 digits as password',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://fjwp.s3.amazonaws.com/blog/wp-content/uploads/2023/12/11174413/Work-from-Home-Equipment-What-Employers-Typically-Provide-Other-Home-Office-Essentials-1024x512.jpg' }}
        style={styles.backgroundImage}
      >
        <Text style={styles.header}>Admin Login</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            placeholder="Enter your password"
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.hintButton} onPress={showHint}>
            <Text style={styles.hintButtonText}>Hint</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={buttonHandler}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </ImageBackground>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0ffff',
  },
  backgroundImage: {
    flex: 1,
    opacity: 0.9,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    marginBottom: 40,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  inputWrapper: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#3498db',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  hintButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#95a5a6',
    borderRadius: 8,
    alignItems: 'center',
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  button: {
    marginTop: 40,
    paddingVertical: 16,
    backgroundColor: '#7fffd4',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
