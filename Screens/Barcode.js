import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  BackHandler,
  Modal,
  Platform
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import * as Font from 'expo-font';

class BarcodeScan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      type: Camera.Constants.Type.back,
      flash: Camera.Constants.FlashMode.off,
      data: '',
      zoom: 0,
      localData: [],
      language: '',
      modalVisible: null,
      modal2Visible: null,
      fontsLoaded: false
    };
  }

  promptUser = async () => {
    const value = await AsyncStorage.getItem('qrcodeaccepted');

    if (!value || value < 2) {
      this.setState({ modalVisible: true });
    }
  };

  loadFonts = async () => {
    await Font.loadAsync({
      englishFont: require('../assets/fonts/english/Roboto-Regular.ttf'),
      arabicFont: require('../assets/fonts/arabic/NotoKufiArabic-Regular.ttf'),
      arabicBold: require('../assets/fonts/arabic/NotoKufiArabic-Bold.ttf')
    });

    this.setState({ fontsLoaded: true });
  };

  updateUserClicked = async () => {
    const value = await AsyncStorage.getItem('qrcodeaccepted');

    if (!value) {
      await AsyncStorage.setItem('qrcodeaccepted', '1');
    } else {
      await AsyncStorage.setItem('qrcodeaccepted', '2');
    }
  };

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === 'granted' });
    this.getLanguage();
    this.getLocalData();
    this.promptUser();
    this.overRideBackButton();
    this.loadFonts();
  }

  getLanguage = async () => {
    const { language } = this.state;
    const value = await AsyncStorage.getItem('medlebLanguage');
    if (value) {
      this.setState({ language: value });
    }
  };

  zoomIn = () => {
    const { zoom } = this.state;
    if (zoom < 0.5) {
      this.setState({ zoom: zoom + 0.1 });
    }
  };

  zoomOut = () => {
    const { zoom } = this.state;
    if (zoom > 0) {
      this.setState({ zoom: zoom - 0.1 });
    }
  };

  componentWillUnmount() {
    this.setState({ scanned: false });
  }

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ scanned: true });
    this.setState({ data: data });

    let removeFirstTwo = data.substring(4);
    if(Platform.OS === 'ios'){
      removeFirstTwo = data.substring(3);
    }

    const takefirst14 = removeFirstTwo.substring(0, 13);

    // const removeFirstTwo = data.substring(3);
    // const takefirst14 = removeFirstTwo.substring(0, 14);

    const result = await this.fetchData(takefirst14);

    console.log('result', result);

    if (result == 'Page not found') {
      this.setState({ modal2Visible: true });
    } else if (result.record_count == 0) {
      this.setState({ modal2Visible: true });
    } else {
      this.saveDataLocally(result.records[0].brand_name);
      this.props.navigation.navigate('SearchResult', {
        search: result.records[0].brand_name
      });
    }
  };

  fetchData = async (data) => {
    const url = `https://medleb.org/api/medications/index/barcode_gtin/${data}`;
    const response = await fetch(url);
    const result = await response.json();

    // return result.records[0].brand_name;
    return result;
  };

  saveDataLocally = async (value) => {
    var { localData } = this.state;
    if (value) {
      localData.push({
        name: value,
        date: new Date().toLocaleString()
      });
    }

    try {
      await AsyncStorage.setItem(
        '@MySuperStore:key',
        JSON.stringify(localData)
      );
    } catch (error) {
      // Error saving data
    }
  };

  overRideBackButton = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  };

  handleBackButton = () => {
    const { screen } = this.props.route.params;

    this.props.navigation.navigate(screen);
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
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  renderTopBar = () => {
    const goBack = require('../assets/images/gobackqr.png');
    const history = require('../assets/images/history.png');
    const info = require('../assets/images/info.png');
    const { language, fontsLoaded } = this.state;

    const fontToBeUsed = fontsLoaded
      ? language === 'arabic'
        ? 'arabicFont'
        : 'englishFont'
      : null;
    return (
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarLeft}
          onPress={this.handleBackButton}
        >
          <Image source={goBack} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => this.props.navigation.navigate('History')}
        >
          <Image source={history} style={{ width: 25, height: 28 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
          <Image
            source={info}
            style={{ width: 30, height: 30, marginTop: 1 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderModal = () => {
    const { language } = this.state;

    const textToDisplay =
      language == 'English'
        ? 'If you search for a drug by scanning the Barcode, the result would often match the drug, but not always, So kindly, make sure to match the search results with the drug details on the package. You might encounter a drug package that does not contain a 2D barcode, In that case, kindly Search by drug name, or the active ingredients it contains.'
        : 'ان نتيجة البحث من خلال مسح الباركود هي غالباً مجدية لكن ليس دائماً, لذا يرجى مطابقة نتائج البحث مع تفاصيل الدواء الموجودة على العبوة. عند مصادفة عبوات أدوية لا تحتوي على باركود (2D Barcode)، يرجى البحث باسم الدواء، أو المكونات التي يحتويها.';
    const image = require('../assets/images/barcodes.jpg');
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({ modalVisible: false });
          this.updateUserClicked();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{textToDisplay}</Text>
            <Image source={image} style={{ width: 200, height: 200 }} />
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: '#1ea282' }}
              onPress={() => {
                this.setState({ modalVisible: false });
                this.updateUserClicked();
              }}
            >
              <Text style={styles.textStyle}>
                {language == 'English' ? 'Got It' : 'حسناً'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderModal2() {
    const { language } = this.state;
    const textToDisplay =
      language == 'English'
        ? 'This code could not be found, Try searching by Drug Name'
        : 'إن هذا الكود غير موجود يرجى, إعادة البحث من خلال كتابة إسم الدواء';
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modal2Visible}
        onRequestClose={() => {
          this.setState({ modal2Visible: false });
          this.updateUserClicked();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{textToDisplay}</Text>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                this.setState({ modal2Visible: false });
                // this.updateUserClicked();
                this.handleBackButton();
              }}
            >
              <Text style={styles.textStyle= {fontFamily: "arabicBold",color: "#ffffff"}}> 
                {language == 'English' ? 'Got It' : 'حسناً'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const { hasCameraPermission, scanned, zoom, flash } = this.state;

    const zoomIn = require('../assets/images/zoomin.png');
    const zoomOut = require('../assets/images/zoumout.png');

    const flashOn = require('../assets/images/flashon.png');
    const flashOff = require('../assets/images/flashoff.png');

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <SafeAreaView style={styles.container}>
        {this.renderTopBar()}
        {this.renderModal()}
        {this.renderModal2()}
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          flashMode={flash}
          autoFocus={Camera.Constants.AutoFocus.on}
          whiteBalance={Camera.Constants.WhiteBalance.auto}
          ratio={'16:9'}
          zoom={zoom}
        ></Camera>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.zoomIn} onPress={this.zoomIn}>
            <Image source={zoomIn} style={styles.zoomIn} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoomOut}
            onPress={() =>
              this.setState({
                flash:
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.torch
                    : Camera.Constants.FlashMode.off
              })
            }
          >
            <Image
              source={
                flash === Camera.Constants.FlashMode.off ? flashOff : flashOn
              }
              style={styles.flash}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomOut} onPress={this.zoomOut}>
            <Image source={zoomOut} style={styles.zoomOut} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingTop: 40
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    paddingBottom: 10
  },
  zoomIn: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 20
  },
  zoomOut: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    backfaceVisibility: 'hidden',
    backgroundColor: 'transparent'
  },
  flash: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 15,
    alignSelf: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    backfaceVisibility: 'hidden'
  },
  title: {
    fontSize: 20,
    alignSelf: 'center'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'baseline',

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
    width: 50
    
    
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
  },
  topBarRight: {
    position: 'absolute',
    right: 0
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
      
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    //padding: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 4,
    marginTop: 40
    
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    fontSize: 15,
    fontFamily: "arabicBold",
    textAlign: 'center'
    
  }
});

export default BarcodeScan;
