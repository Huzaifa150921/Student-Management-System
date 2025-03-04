import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUser } from '../UserContext'; // Import useUser
import { API_KEY } from '../constants'; // Import your API key if needed for Firebase

export default function LeaveRequest() {
  const { user } = useUser(); // Get the user data from context
  const [leaveType, setLeaveType] = useState('');
  const [description, setDescription] = useState('');

  // Default descriptions for each leave type
  const leaveTemplates = {
    'Sick Leave': 'I am [name] and I am requesting sick leave due to health issues.',
    'Urgent Piece of Work': 'I am [name] and I need urgent leave to complete an important task.',
    'Casual Leave': 'I am [name] and I am requesting casual leave for personal reasons.',
  };

  // Update description when leaveType changes
  useEffect(() => {
    if (leaveType) {
      setDescription(leaveTemplates[leaveType].replace('[name]', user.name));
    }
  }, [leaveType, user.name]);

  const handleSubmit = async () => {
    if (!leaveType || !description) {
      Alert.alert('Error', 'Please select a leave type and provide a description.');
      return;
    }

    try {
      // Replace this URL with your actual Firebase URL or endpoint
      const response = await fetch(
        `https://useradmin-6ea7a-default-rtdb.firebaseio.com/leaveRequests.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            leaveType,
            description,
            userId: user.id, // Use the user ID from context
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit leave request.');
      }

      Alert.alert('Success', 'Your leave request has been submitted.');
      setLeaveType('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Leave Type</Text>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setLeaveType('Sick Leave')}
      >
        <Text style={styles.buttonText}>Sick Leave</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setLeaveType('Urgent Piece of Work')}
      >
        <Text style={styles.buttonText}>Urgent Piece of Work</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setLeaveType('Casual Leave')}
      >
        <Text style={styles.buttonText}>Casual Leave</Text>
      </TouchableOpacity>

      {leaveType && (
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder="Enter your description here..."
          />
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0ffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  optionButton: {
    padding: 16,
    backgroundColor: '#7fffd4',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
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
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 40,
    paddingVertical: 16,
    backgroundColor: '#00ffff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
