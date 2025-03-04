import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { API_KEY } from './constants';
import { useUser } from './UserContext'; // Import useUser

export default function UserLogin() {
  const navigation = useNavigation();
  const { setUser } = useUser(); // Get setUser from context
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

      if (!response.ok || result.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      if (result.idToken) {
        // Fetch user data from your database
        const userResponse = await fetch(
          `https://useradmin-6ea7a-default-rtdb.firebaseio.com/users/${result.localId}.json`
        );
        const userData = await userResponse.json();

        if (userData) {
          setUser({ ...userData, email: username, idToken: result.idToken }); // Store user email and data in context

          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Login Successful',
            text2: 'You have successfully logged in.',
          });
          navigation.navigate('Home'); // Redirect to User Home page
        } else {
          throw new Error('Failed to fetch user data');
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: error.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://www.universitiesuk.ac.uk/sites/default/files/styles/content_banner_on_desktop/public/image-upload/getti/students-AdobeStock_428930939.jpeg?h=5cce16ed&itok=YS4W1rsp' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} /> {/* Overlay for increased opacity */}
        <View style={styles.content}>
          <Text style={styles.header}>User Login</Text>
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
          </View>
          <TouchableOpacity style={styles.button} onPress={buttonHandler}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    marginBottom: 40,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff', 
  },
  inputWrapper: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff', 
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
    color: '#34495e', 
  },
});
