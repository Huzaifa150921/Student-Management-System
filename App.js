import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './Welcome';
import AdminLogin from './AdminLogin';
import UserOptions from './UserOptions';
import UserLogin from './UserLogin';
import Signup from './Signup';
import Home from './components/Home';
import MarkAttendance from './components/MarkAttendance';
import ViewAttendance from './components/ViewAttendance';
import { UserProvider } from './UserContext'; // Import UserProvider
import LeaveRequest from './components/LeaveRequest'
import AdminHome from './components/AdminHome';
import RegisteredStudents from './components/RegisteredStudents'
import StudentLeaves from './components/StudentLeaves'

const Stack = createStackNavigator();
function App() {
  return (
    <UserProvider> {/* Wrap the NavigationContainer with UserProvider */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MarkAttendance" component={MarkAttendance} />
          <Stack.Screen name="ViewAttendance" component={ViewAttendance} />
          <Stack.Screen name="LeaveRequest" component={LeaveRequest} />
          <Stack.Screen name="AdminLogin" component={AdminLogin} />
           <Stack.Screen name="AdminHome" component={AdminHome} />
            <Stack.Screen name="RegisteredStudents" component={RegisteredStudents} />
            <Stack.Screen name="StudentLeaves" component={StudentLeaves} />
          <Stack.Screen name="UserOptions" component={UserOptions} />
          <Stack.Screen name="UserLogin" component={UserLogin} />
          <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
