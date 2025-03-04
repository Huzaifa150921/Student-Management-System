import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { API_KEY } from '../constants'; // Your API key or Firebase configuration

export default function RegisteredStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`https://useradmin-6ea7a-default-rtdb.firebaseio.com/users.json?key=${API_KEY}`);
        const result = await response.json();

        if (result) {
          const studentsArray = Object.keys(result).map(key => ({
            id: key,
            ...result[key],
          }));
          setStudents(studentsArray);
        } else {
          setError('No data found');
        }
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>Email: {item.email}</Text>
      <Text style={styles.itemText}>Student ID: {item.studentId}</Text>
      {/* Add more fields as needed */}
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
      <Text style={styles.header}>Registered Students</Text>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list} 
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
    flexGrow: 1, 
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
    elevation: 4
  },
  itemText: {
    fontSize: 18,
    color: '#2c3e50',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
