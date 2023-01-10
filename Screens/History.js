import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
  BackHandler,
  TouchableHighlight
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraType, FlashMode } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import { color } from 'react-native-elements/dist/helpers';

class History extends React.Component {
  state = {
    localData: [],
    language: '',
    fontsLoaded: false
  };

  componentDidMount() {
    this.loadFonts();
    this.getLocalData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.getLanguage();
  }

  loadFonts = async () => {
    await Font.loadAsync({
      englishFont: require('../assets/fonts/english/Roboto-Regular.ttf'),
      arabicFont: require('../assets/fonts/arabic/NotoKufiArabic-Regular.ttf'),
      arabicBold: require('../assets/fonts/arabic/NotoKufiArabic-Bold.ttf')
    });

    this.setState({ fontsLoaded: true });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.navigate('Home');
    return true;
  };

  getLocalData = async () => {
    const { localData } = this.state;
    var myArray = localData;

    try {
      const myArray = await AsyncStorage.getItem('@MySuperStore:key');
      if (myArray !== null) {
        var newArray = JSON.parse(myArray);
        this.setState({ localData: newArray });
        await this.sortArray();
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  getLanguage = async () => {
    const value = await AsyncStorage.getItem('medlebLanguage');
    if (value) {
      this.setState({ language: value });
    }
  };

  sortArray = () => {
    const { localData } = this.state;
    var filterArrayFromEmpty = localData.filter(function (el) {
      return el.name != null;
    });

    var sortedArray = filterArrayFromEmpty.sort(function (a, b) {
      const firstDate = new Date(a.date);
      const secondDate = new Date(b.date);
      return secondDate - firstDate;
    });

    this.setState({ localData: sortedArray });
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.date}
        style={styles.item}
        onPress={() =>
          this.props.navigation.navigate('SearchResult', { search: item.name })
        }
      >
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  deleteHistory = async () => {
    const { language, localData } = this.state;

    const title =
      language == 'English' ? 'Delete History' : 'حذف النتائج السابقة';
      
    const message =
      language == 'English'
        ? 'Are you sure you want to delete your history?'
        : 'هل انت متأكد من حذف النتائج السابقة؟';
        
        
    const buttons = [
      {
       
        text: language == 'English' ? 'Cancel' : 'كلاّ',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
        
      },
      {
        text: language == 'English' ? 'Delete' : 'نعم',
        onPress: () => this.deleteHistoryConfirmed(),
      }
    ];
    if (localData.length > 0) {
      Alert.alert(title, message, buttons);
    } else {
      Alert.alert('No History');
    }
  };

  deleteHistoryConfirmed = async () => {
    try {
      await AsyncStorage.removeItem('@MySuperStore:key');
      this.setState({ localData: [] });
    } catch (error) {
      // Error retrieving data
    }
  };

  renderTopBar = () => {
    const { language, fontsLoaded } = this.state;

    const fontToBeUsed = fontsLoaded
      ? language == 'English'
        ? 'englishFont'
        : 'arabicFont'
      : null;
    return (
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarLeft}
          onPress={() => this.props.navigation.navigate('Home')}
        >
          <Icon name="home" type="material" color="#1ea282" size={30} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Icon
            name="delete"
            type="material"
            size={30}
            color="red"
            onPress={() => this.deleteHistory()}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { fontFamily: 'arabicFont'}]}>
          {language == 'English' ? 'History' : 'نتائج بحث سابقة'}
        </Text>
      </View>
    );
  };

  goSearch = (data) => {
    this.props.navigation.navigate('SearchResult', { search: data });
  };

  render() {
    const { localData, language, fontsLoaded } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.renderTopBar()}

        <FlatList
          data={localData}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.date}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  item: {
    backgroundColor: '#ccc',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10
  },
  title: {
    fontSize: 20

  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  menuButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    color:'red'
  },
  menuIcon: {
    width: 20,
    height: 20
  },
  topBarLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50
  }
  
});

export default History;
