import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useUser } from '../UserContext';

const attendanceUrl = "https://useradmin-6ea7a-default-rtdb.firebaseio.com/attendance.json";

function ViewAttendance() {
  const { user } = useUser(); // Get the user data from context
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceData();
  }, [user]);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(attendanceUrl);
      const data = await response.json();

      // Ensure that data for the user exists and is structured correctly
      if (data && data[user.studentId]) {
        setAttendanceData(data[user.studentId]);
      } else {
        Alert.alert("Error", "No attendance records found for this user.");
      }
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
      Alert.alert("Error", "Failed to fetch attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading attendance data...</Text>
      </View>
    );
  }

  if (!attendanceData) {
    return (
      <View style={styles.container}>
        <Text>No attendance data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Attendance Records</Text>
      {Object.keys(attendanceData).map((date) => (
        <View key={date} style={styles.recordContainer}>
          <Text style={styles.recordDate}>{date}</Text>
          <Text style={styles.recordStatus}>
            {typeof attendanceData[date] === 'object' ? JSON.stringify(attendanceData[date]) : attendanceData[date]}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0ffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  recordContainer: {
    padding: 16,
    backgroundColor: '#7fffd4',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  recordDate: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2c3e50',
  },
  recordStatus: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
    color: '#3498db',
  },
});

export default ViewAttendance;

