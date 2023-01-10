import * as React from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import SearchResult from './Screens/SearchResult';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarcodeScan from './Screens/Barcode';
import History from './Screens/History';
import Review from './Screens/Review';
import Splash from './Screens/Splash';
import Details from './Screens/Details';




const Stack = createNativeStackNavigator();

function App() {


 const [language, setLanguage] = React.useState('');

  React.useEffect(() => {
    const getLanguage = async () => {
      try {
        const value = await AsyncStorage.getItem('medlebLanguage');
        if (value !== null) {
          setLanguage(value);
          console.log(value);
        } else {
          setLanguage('English');
        }
      } catch (e) {
        // error reading value
      }
    };
    getLanguage();
    console.log(language);
  }, []);

  return (
     <NavigationContainer>
       <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Splash" >
         <Stack.Screen  name="Home" component={Home} initialParams={{language: language}} />
         <Stack.Screen name="SearchResult" component={SearchResult} />
         <Stack.Screen name="Barcode" component={BarcodeScan} />
         <Stack.Screen name="History" component={History} />
         <Stack.Screen name='Review' component={Review}/>
          {/* <Stack.Screen name='Splash' component={Splash}/> */}
          <Stack.Screen name='Details' component={Details}/>
       </Stack.Navigator>
     </NavigationContainer>
   
  );
}

export default App;