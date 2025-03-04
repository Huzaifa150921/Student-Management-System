import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const backgroundImage = 'https://primetraders.pk/wp-content/uploads/2023/09/Untitled-design-25.webp';

function Home({ navigation, route }) {
  const { studentId } = route.params || {};

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Your Portal</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MarkAttendance', { studentId })}
        >
          <Text style={styles.buttonText}>Mark Attendance</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ViewAttendance', { studentId })}
        >
          <Text style={styles.buttonText}>View Attendance</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LeaveRequest')}
        >
          <Text style={styles.buttonText}>Request Leave</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 255, 255)', 
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#34495e',
  },
  button: {
    backgroundColor: '#7fffd4',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Home;
