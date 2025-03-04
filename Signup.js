import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_KEY } from "./constants";

export default function Signup() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignup = async () => {
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
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
      });

      const result = await response.json();

      if (response.ok && result.localId) {
        const studentId = Math.floor(Math.random() * 1000000000).toString();

        await fetch(`https://useradmin-6ea7a-default-rtdb.firebaseio.com/users/${result.localId}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId,
            email: username,
          }),
        });

        setModalVisible(true);
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        alert("Registration failed: " + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.log("Error Occurs", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLoginNavigation = () => {
    navigation.navigate('UserLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.backgroundImage}>
        <Text style={styles.header}>Create Account</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setUsername(text)}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setPassword(text)}
            placeholder="Enter your password"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}> Already have an account? </Text>
          <TouchableOpacity onPress={handleLoginNavigation}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <Modal animationType='slide' transparent={true} visible={modalVisible}>
        <View style={styles.centeredText}>
          <View style={styles.modalView}>
            <Text style={styles.paragraph}>Signup Successfully</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  loginLink: {
    color: '#00ffff',
    fontWeight: 'bold',
  },
  centeredText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 150,
    width: 150,
    borderRadius: 15,
  },
  paragraph: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "#34495e",
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#00ffff',
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
