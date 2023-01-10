import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  BackHandler,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import {
  NavigationContainer,
  useLinkProps,
  useNavigation
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchResult from './SearchResult';
import styles from '../appStyles/homeScreenStyles';
import homeScreenImages from '../appStyles/homeScreenImages';
import * as Font from 'expo-font';
import Svg, { Path, Rect } from 'react-native-svg';
import { AntDesign, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';

class Home extends React.Component {
  constructor(props) {
    super(props);
    (this.state = {
      search: '',
      language: 'English',
      fontsLoaded: false,
      fontName: 'test',
      data: [],
      isLoading: true,
      timer: null
    }),
      (this.loadFonts = this.loadFonts.bind(this));
  }

  componentDidMount() {
    this.loadFonts();
    this.getLanguage();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );
  }

  loadFonts = async () => {
    await Font.loadAsync({
      englishFont: require('../assets/fonts/english/Roboto-Regular.ttf'),
      arabicFont: require('../assets/fonts/arabic/NotoKufiArabic-Regular.ttf'),
      arabicBold: require('../assets/fonts/arabic/NotoKufiArabic-Bold.ttf')
    });

    this.setState({ fontsLoaded: true });
    console.log('fonts loaded');
  };

  backAction = () => {
    const { language } = this.state;
    const mesasage =
      language == 'English' ? 'Please Confirm Exit' : 'يرجى تأكيد الخروج';
    const cancel = language == 'English' ? 'Cancel' : 'إلغاء';
    const ok = language == 'English' ? 'OK' : 'موافق';
    const exit = language == 'English' ? 'Exit' : 'خروج';

    Alert.alert(exit, mesasage, [
      {
        text: cancel,
        onPress: () => null,
        style: 'cancel'
      },
      { text: ok, onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  onSearch = () => {
    const { search, language } = this.state;
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this.props.navigation.navigate('SearchResult', {
      search,
      language,
      data: this.state.data
    });
  };

  switchLanguage = async () => {
    if (this.state.language === 'English') {
      this.setState({ language: 'Arabic' });
      try {
        await AsyncStorage.setItem('medlebLanguage', 'Arabic');
      } catch (e) {
        // saving error
      }
    } else {
      this.setState({ language: 'English' });
      try {
        await AsyncStorage.setItem('medlebLanguage', 'English');
      } catch (e) {
        // saving error
      }
    }
  };

  openBarcode = () => {
    const { language } = this.state;
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this.props.navigation.navigate('Barcode', {
      language: language,
      screen: 'Home',
      data: this.state.data
    });
  };

  getLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem('medlebLanguage');
      if (value !== null) {
        this.setState({ language: value });
      } else {
        this.setState({ language: 'English' });
      }
    } catch (e) {
      // error reading value
    }
  };

  onChangeText = (text) => {
    this.setState({ search: text });
    clearTimeout(this.state.timer);

    const newTimer = setTimeout(() => {
      Keyboard.dismiss();
    }, 2000);

    this.setState({ timer: newTimer });
  };

  render() {
    const { search, language, fontsLoaded } = this.state;

    const imageToDisplay =
      language === 'English'
        ? homeScreenImages.englishToArabic
        : homeScreenImages.switchToEnglish;
    const priceListImage =
      language === 'English'
        ? 'Lebanese Medication Pricelist'
        : 'لائحة اسعار الادوية في لبنان';
    const placeHolderText =
      language === 'English' ? 'Find your medicine' : 'البحث عن دواء';
    const qrCodeText = language === 'English' ? 'Scan Code' : 'مسح الكود ';
    const priceListWithText =
      language === 'English'
        ? homeScreenImages.logo
        : homeScreenImages.priceListArabic;
    const backgroundColor = language === 'Arabic' ? '#0E5042' : '#273E7C';
    const textDirection = language === 'English' ? 'ltr' : 'rtl';
    const headerMarginTop = Platform.OS === 'ios' ? 0 : 20;
    const svgImage = require('../assets/adaptive-icon.png');
    const textInputAlignment = language === 'English' ? 'left' : 'right';
    const betaImage =
      language === 'English'
        ? homeScreenImages.betaEnglish
        : homeScreenImages.betaArabic;
    const searchIcon =
      language === 'Arabic'
        ? homeScreenImages.imageUrl
        : homeScreenImages.imageUrlArabic;

    var fontToAdd;
    var marginTop;

    if (fontsLoaded) {
      if (language === 'English') {
        fontToAdd = 'englishFont';
        marginTop = 10;
      } else {
        fontToAdd = 'arabicFont';
        marginTop = 10;
      }
    } else {
      const fontToAdd = null;
    }
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: backgroundColor, minHeight: 100 }
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled={false}
          style={styles.container}
        >
          <View style={[styles.header, { marginTop: headerMarginTop }]}>
            <TouchableOpacity
              onPress={this.switchLanguage}
              style={styles.languageSwitcher}
            >
              <Image source={imageToDisplay} style={styles.imageLanguage} />
            </TouchableOpacity>
            <Image
              source={homeScreenImages.moho}
              style={styles.headerImage}
              resizeMode="cover"
              
            />
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -100,
              marginBottom: 20
            }}
          >
            <Image
              source={priceListWithText}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.inputContainer}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 10,
                    width: 25,
                    height: 25
                  }}
                >
                  <FontAwesome5
                    name="history"
                    size={24}
                    color={backgroundColor}
                    onPress={() =>
                      this.props.navigation.navigate('History', {
                        language: language,
                        data: this.state.data
                      })
                    }
                  />
                </View>
                <TextInput
                  autoCorrect={false}
                  returnKeyType="search"
                  onSubmitEditing={this.onSearch}
                  style={[
                    styles.input,
                    {
                      writingDirection: textDirection,
                      textAlign: textInputAlignment,
                      fontFamily: fontToAdd,
                      alignSelf: 'center',
                      //marginLeft: 10
                    }
                  ]}
                  placeholder={placeHolderText}
                  onChangeText={(te) => this.onChangeText(te)}
                  value={search}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {search ? (
                  <AntDesign
                    name="close"
                    size={24}
                    color="red"
                    onPress={() => this.setState({ search: '' })}
                  />
                ) : null}
                <TouchableOpacity onPress={this.onSearch}>
                  <View style={{ marginRight: 10 }}>
                    <Ionicons
                      name="search-sharp"
                      size={26}
                      color={backgroundColor}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.searchQr}>
              {language == 'English' ? (
                <>
                  <Text        //HomeScreen QR text & icon Style English Version
                    style={[
                      styles.text,
                      {
                        fontFamily: fontToAdd, //fontFamily: "arabicBold",
                        backgroundColor: '#FFFFFF', 
                        color: "#00366f", 
                        fontSize:16, 
                        fontWeight: "bold",             
                        padding: 8, //paddingVertical: 8,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        height: 40,
                        marginTop: -5,
                        marginLeft: 35,
                        alignItems: 'center'
                        
                      }
                    ]}
                    onPress={this.openBarcode}
                  >
                    {qrCodeText}
                  </Text>
                  <TouchableOpacity 
                  onPress={this.openBarcode}>
                    
                    <Image
                      source={homeScreenImages.qrLogo}
                      style={styles.qrCode}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={this.openBarcode}
                    style={{
                      flexDirection: 'row',
                      height: 40,
                      marginTop: 0,
                      alignItems: 'center'
                      
                    }}
                  >
                    <Image
                      source={homeScreenImages.qrLogo}
                      style={styles.qrCodear}
                    />
                  </TouchableOpacity>


                  <Text            //HomeScreen QR text & icon Style Arabic Version
                    style={[styles.text, { 
                      fontFamily: fontToAdd,// 'arabicBold', 
                      backgroundColor: '#FFFFFF', 
                      color: "#1ea282", 
                      fontSize: 15,
                      paddingVertical: 4,
                      paddingHorizontal: 5,
                      borderRadius: 10,
                      height: 38,
                      marginTop: -5,
                      marginLeft: -5,
                      alignItems: 'center'

                  }]}
                    onPress={this.openBarcode}
                  >
                    {qrCodeText}
                  </Text>
                </>
              )}
            </View>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 'auto',
              bottom: 20
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Review')}
            >
              <Image
                source={betaImage}
                style={{ width: 100, height: 50, marginBottom: 6 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Image
              source={homeScreenImages.ommalImage}
              style={{
                width: '100%',
                height: 40,
                position: 'relative',
                bottom: 8
              }}
              resizeMode="contain"
            />
          </View>

          <StatusBar style="auto" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default Home;
