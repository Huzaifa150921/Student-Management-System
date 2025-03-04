import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = 'https://www.shutterstock.com/image-photo/administrator-business-man-financial-inspector-600nw-1081695596.jpg';

export default function AdminHome() {
  const navigation = useNavigation();

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Admin Home</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RegisteredStudents')}
        >
          <Text style={styles.buttonText}>Registered Students</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('StudentLeaves')}
        >
          <Text style={styles.buttonText}>Student Leaves</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire background
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(240, 255, 255, 0.3)',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#7fffd4',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    margin:10
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
