import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const attendanceUrl = "https://useradmin-6ea7a-default-rtdb.firebaseio.com/attendance.json";
const usersUrl = "https://useradmin-6ea7a-default-rtdb.firebaseio.com/users.json";

function MarkAttendance() {
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const navigation = useNavigation(); 

  useEffect(() => {
    if (studentId) {
      checkAttendance();
    }
  }, [studentId]);

  const fetchStudentDetails = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      const response = await fetch(usersUrl);
      const data = await response.json();
      const user = Object.values(data).find(user => user.email === email);

      if (user) {
        setStudentId(user.studentId);
        setStudentName(user.email.split('@')[0]);
        Alert.alert("Success", "Student details fetched successfully.");
      } else {
        Alert.alert("Error", "No matching user found.");
      }
    } catch (error) {
      console.log("Failed to fetch student details", error);
      Alert.alert("Error", "Failed to fetch student details. Please try again.");
    }
  };

  const checkAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch(attendanceUrl);
      const data = await response.json();

      if (data && data[studentId] && data[studentId][today]) {
        setAttendanceMarked(true);
        Alert.alert("Attendance", "You have already marked your attendance for today.");
      }
    } catch (error) {
      console.error("Failed to check attendance:", error);
    }
  };

  const markAttendance = async () => {
    if (!studentId) {
      Alert.alert("Error", "Student ID not found.");
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch(attendanceUrl);
      const data = await response.json();

      if (data && data[studentId] && data[studentId][today]) {
        Alert.alert("Attendance", "You have already marked your attendance.");
        setAttendanceMarked(true);
        setLoading(false);
        return;
      }

      const newAttendanceData = {
        [studentId]: {
          name: studentName,
          ...(data[studentId] || {}),
          [today]: { status: 'Present' }
        }
      };

      const updateResponse = await fetch(attendanceUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAttendanceData),
      });

      if (updateResponse.ok) {
        Alert.alert("Success", "Attendance marked as present successfully.");
        setAttendanceMarked(true);
        navigation.navigate('ViewAttendance', { studentId }); // Navigate to ViewAttendance
      } else {
        const errorText = await updateResponse.text();
        Alert.alert("Error", `Failed to mark attendance. ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      Alert.alert("Error", "Failed to mark attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <TouchableOpacity style={styles.button} onPress={fetchStudentDetails}>
        <Text style={styles.buttonText}>Fetch Student Details</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Student ID"
        value={studentId}
        editable={false}
      />
      
      <TouchableOpacity
        style={[styles.button, loading || !studentId || attendanceMarked ? styles.buttonDisabled : null]}
        onPress={markAttendance}
        disabled={loading || !studentId || attendanceMarked}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : attendanceMarked ? "Attendance Marked" : "Mark Attendance"}
        </Text>
      </TouchableOpacity>

      {attendanceMarked && (
        <Text style={styles.attendanceMessage}>You have already marked your attendance for today.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0ffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#7fffd4',
    borderWidth: 1,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#7fffd4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#b2dfdb',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  attendanceMessage: {
    marginTop: 16,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
});

export default MarkAttendance;
