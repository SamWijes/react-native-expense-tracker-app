

import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login'
import Register from './src/screens/Register'
import ExpenseDash from './src/screens/ExpenseDash'
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';

export default function App() {

  const Stack = createStackNavigator()


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <PortalProvider>
        <BottomSheetModalProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='login'>
              <Stack.Screen name='login' component={Login} />
              <Stack.Screen name='register' component={Register} />
              <Stack.Screen name='expenseDash' component={ExpenseDash} />
            </Stack.Navigator>
          </NavigationContainer>
        </BottomSheetModalProvider>
        </PortalProvider>
      </PaperProvider>

    </GestureHandlerRootView>
  )
}
