import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { API_KEY } from '../constants'; // Your API key or Firebase configuration

export default function StudentLeaves() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch(`https://useradmin-6ea7a-default-rtdb.firebaseio.com/leaveRequests.json?key=${API_KEY}`);
        const result = await response.json();

        if (result) {
          const leaveRequestsArray = Object.keys(result).map(key => ({
            id: key,
            ...result[key],
          }));
          setLeaveRequests(leaveRequestsArray);
        } else {
          setError('No leave requests found');
        }
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      // Fetch the specific leave request
      const response = await fetch(`https://useradmin-6ea7a-default-rtdb.firebaseio.com/leaveRequests/${id}.json?key=${API_KEY}`);
      const leaveRequest = await response.json();

      // Move the leave request to approvedRequests table
      await fetch(`https://useradmin-6ea7a-default-rtdb.firebaseio.com/approvedRequests/${id}.json?key=${API_KEY}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveRequest),
      });

      // Delete the leave request from leaveRequests table
      await fetch(`https://useradmin-6ea7a-default-rtdb.firebaseio.com/leaveRequests/${id}.json?key=${API_KEY}`, {
        method: 'DELETE',
      });

      // Update local state
      setLeaveRequests(prevRequests => prevRequests.filter(request => request.id !== id));

      Alert.alert('Success', 'Leave request approved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to approve leave request.');
    }
  };

  const handleReject = async (id) => {
    try {
      // Delete the leave request from leaveRequests table
      await fetch(`https://useradmin-6ea7a-default-rtdb.firebaseio.com/leaveRequests/${id}.json?key=${API_KEY}`, {
        method: 'DELETE',
      });

      // Update local state
      setLeaveRequests(prevRequests => prevRequests.filter(request => request.id !== id));

      Alert.alert('Success', 'Leave request rejected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to reject leave request.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>Email: {item.email}</Text>
      <Text style={styles.itemText}>Leave Type: {item.leaveType}</Text>
      <Text style={styles.itemText}>Description: {item.description}</Text>
      <Text style={styles.itemText}>Date: {item.date}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Student Leave Requests</Text>
      <FlatList
        data={leaveRequests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        style={styles.flatList} // Apply the style to ensure scrolling
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ffff',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  flatList: {
    flex: 1, // Ensures that FlatList can take full available space
    width: '100%', // Ensures full width of the FlatList
  },
  item: {
    padding: 16,
    backgroundColor: '#7fffd4',
    borderRadius: 8,
    borderColor: '#3498db',
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  itemText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  approveButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
