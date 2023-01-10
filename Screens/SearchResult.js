import React, { Component, useEffect, useRef } from 'react';
import {
  UIManager,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  LayoutAnimation,
  TouchableOpacity,
  ScrollView,
  Platform,
  BackHandler,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Pressable
} from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../appStyles/searchStyles';
import searchImages from '../appStyles/searchImages';
import data from './dummyData';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import DropDownPicker from 'react-native-dropdown-picker';
import { AntDesign, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      language: 'English',
      fontsLoaded: false,
      fontName: 'test',
      filteredData: [],
      defaultValue: '',
      disableScroll: true,
      originalData: [],
      subtitutePressed: false,
      keyboard: false,
      timer: null,
      localData: [],
      currentIndex: 0,
      openDosageDropdown: false,
      dosageValue: 'Dosage',
      dosageItems: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' }
      ],
      openFormDropdown: false,
      formValue: 'Form',
      formItems: [
        { label: 'Tablet', value: 'Tablet' },
        { label: 'Capsule', value: 'Capsule' },
        { label: 'Syrup', value: 'Syrup' },
        { label: 'Injection', value: 'Injection' }
      ]
    };
  }

  componentDidMount() {
    this.loadFonts();
    this.getLanguage();
    this.getData();
    this.getLocalData();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  resetRoute = () => {
    this.props.navigation.dispatch(
      StackActions.replace('Barcode', { screen: 'SearchResult' })
    );
  };

  openHistory = () => {
    const { language } = this.state;
    this.props.navigation.dispatch(
      StackActions.replace('History', { language: language })
    );
  };

  handleBackButton = () => {
    this.props.navigation.dispatch(StackActions.replace('Home'));
    return true;
  };

  loadFonts = async () => {
    await Font.loadAsync({
      englishFont: require('../assets/fonts/english/Roboto-Bold.ttf'),
      arabicFont: require('../assets/fonts/arabic/NotoKufiArabic-Regular.ttf'),
      arabicBold: require('../assets/fonts/arabic/NotoKufiArabic-Bold.ttf')
    });

    this.setState({ fontsLoaded: true });
    console.log('fonts loaded');
  };

  getLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem('medlebLanguage');
      if (value !== null) {
        this.setState({ language: value });
      }
    } catch (e) {
      // error reading value
    }
  };

  getData = async () => {
    const { filteredData } = this.state;
    const { search } = this.props.route.params;

    var url = `https://medleb.org/api/medications?limit=100&search=${search}`;

    var newArr = [];
    await this.setState({ search: search });
    if (search) {
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          var sorted = json.records.sort((a, b) =>
            a.public_price > b.public_price ? 1 : -1
          );
          sorted.map((item) => {
            newArr.push({
              id: item.id,
              atc: item.atc,
              seq: item.seq,
              bg: item.bg,
              ingredients: item.ingredients,
              code: item.code,
              reg_number: item.reg_number,
              brand_name: item.brand_name,
              strength: item.strength,
              presentation: item.presentation,
              form: item.form,
              dosage_lndi: item.dosage_lndi,
              presentation_lndi: item.presentation_lndi,
              form_lndi: item.form_lndi,
              route_lndi: item.route_lndi,
              agent: item.agent,
              manufacturer: item.manufacturer,
              country: item.country,
              public_price: item.public_price,
              stratum: item.stratum,
              subsidy_percentage: item.subsidy_percentage,
              pill_price: item.pill_price,
              barcode_gtin: item.barcode_gtin,
              added_date: item.added_date,
              modified_date: item.modified_date,
              modified_by: item.modified_by,
              isExpanded: false
            });
          });

          this.sortData(newArr);
          this.saveDataLocally(search);
        });
    }
  };

  onChangeText = (text) => {
    const { originalData } = this.state;
    this.setState({ search: text, subtitutePressed: false });
    var newArr = [];

    clearTimeout(this.state.timer);

    if (text) {
      fetch(`https://medleb.org/api/medications?limit=100&search=${text}`)
        .then((response) => response.json())
        .then((json) => {
          var sorted = json.records.sort((a, b) =>
            a.public_price > b.public_price ? 1 : -1
          );
          sorted.map((item) => {
            newArr.push({
              id: item.id,
              atc: item.atc,
              seq: item.seq,
              bg: item.bg,
              ingredients: item.ingredients,
              code: item.code,
              reg_number: item.reg_number,
              brand_name: item.brand_name,
              strength: item.strength,
              presentation: item.presentation,
              form: item.form,
              dosage_lndi: item.dosage_lndi,
              presentation_lndi: item.presentation_lndi,
              form_lndi: item.form_lndi,
              route_lndi: item.route_lndi,
              agent: item.agent,
              manufacturer: item.manufacturer,
              country: item.country,
              public_price: item.public_price,
              stratum: item.stratum,
              subsidy_percentage: item.subsidy_percentage,
              pill_price: item.pill_price,
              barcode_gtin: item.barcode_gtin,
              added_date: item.added_date,
              modified_date: item.modified_date,
              modified_by: item.modified_by,
              isExpanded: false
            });
          });

          this.sortData(newArr);
        });
    }
    const newTimer = setTimeout(() => {
      Keyboard.dismiss();
      this.setState({ keyboard: false });
      this.saveDataLocally(text);
    }, 2000);

    this.setState({ timer: newTimer });
  };

  saveDataLocally = async (value) => {
    var { localData } = this.state;
    localData.push({
      name: value,
      date: new Date()
    });

    try {
      await AsyncStorage.setItem(
        '@MySuperStore:key',
        JSON.stringify(localData)
      );
    } catch (error) {
      // Error saving data
    }
  };

  getLocalData = async () => {
    const { localData } = this.state;
    var myArray = localData;

    try {
      const myArray = await AsyncStorage.getItem('@MySuperStore:key');
      if (myArray !== null) {
        var newArray = JSON.parse(myArray);
        this.setState({ localData: newArray });
        // console.log("local data", this.state.localData);
      }
    } catch (error) {
      // Error retrieving data
    }

    this.retreiveLatestSearches();
  };

  switchLanguage = () => {
    const { language } = this.state;
    if (language === 'English') {
      this.setState({ language: 'Arabic' });
      try {
        AsyncStorage.setItem('medlebLanguage', 'Arabic');
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({ language: 'English' });
      try {
        AsyncStorage.setItem('medlebLanguage', 'English');
      } catch (error) {
        console.log(error);
      }
    }
  };

  onSubtitutePress = (item) => {
    const atc = item.atc;
    var newArr = [];
    fetch(
      `https://medleb.org/api/medications?limit=100&medications_atc=${atc}&medications_seq=${item.seq}`
    )
      .then((response) => response.json())
      .then((json) => {
        var sorted = json.records.sort((a, b) =>
          a.public_price > b.public_price ? 1 : -1
        );
        sorted.map((item) => {
          newArr.push({
            id: item.id,
            atc: item.atc,
            seq: item.seq,
            bg: item.bg,
            ingredients: item.ingredients,
            code: item.code,
            reg_number: item.reg_number,
            brand_name: item.brand_name,
            strength: item.strength,
            presentation: item.presentation,
            form: item.form,
            dosage_lndi: item.dosage_lndi,
            presentation_lndi: item.presentation_lndi,
            form_lndi: item.form_lndi,
            route_lndi: item.route_lndi,
            agent: item.agent,
            manufacturer: item.manufacturer,
            country: item.country,
            public_price: item.public_price,
            stratum: item.stratum,
            subsidy_percentage: item.subsidy_percentage,
            pill_price: item.pill_price,
            barcode_gtin: item.barcode_gtin,
            added_date: item.added_date,
            modified_date: item.modified_date,
            modified_by: item.modified_by,
            isExpanded: false
          });
        });
        this.sortData(newArr);
      });

    this.setState({ subtitutePressed: true });

    if (newArr.length == 1) {
      Alert.alert(
        'No Substitutes',
        'There are no substitutes for this medication',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  };

  retreiveLatestSearches = () => {
    const { localData } = this.state;
    var distinct = [...new Set(localData)];
    var notEmpty = distinct.map((item) => {
      if (item !== '') {
        return item;
      }
    });
    var filtered = notEmpty.filter(function (el) {
      return el != null;
    });
    this.setState({ localData: filtered });
    //   console.log("filtered", filtered);
  };

  setLatestSearches = () => {
    const { localData, currentIndex, search } = this.state;
    this.setState({ search: localData[currentIndex] });
    this.setState({ currentIndex: currentIndex + 1 });
    this.onChangeText(localData[currentIndex]);
    if (currentIndex === localData.length - 1) {
      this.setState({ currentIndex: 0 });
    }
  };

  clearAlert = () => {
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
        style: 'cancel'
      },
      {
        text: language == 'English' ? 'Delete' : 'نعم',
        onPress: () => this.clearHistory()
      }
    ];
    if (localData.length > 0) {
      Alert.alert(title, message, buttons);
    } else {
      Alert.alert('No History');
    }
  };

  clearHistory = () => {
    this.setState({ search: '' });
    this.setState({ localData: [] });
    try {
      AsyncStorage.removeItem('@search:key');
    } catch (error) {
      console.log(error);
    }
  };

  header = (fontToBeUsed) => {
    const { language, fontsLoaded, subtitutePressed, filteredData } =
      this.state;

    const details = language === 'English' ? 'Details' : 'التفاصيل';
    const subtitute = language === 'English' ? 'Substitute' : 'البديل';
    const brandName = language === 'English' ? 'Brand Name' : 'اسم الدواء';
    const price = language === 'English' ? 'Price (LBP)' : 'السعر (ل.ل)';
    const font2 = language === 'English' ? 'englishFont' : null;
    const dosage = language === 'English' ? 'Ingredients' : 'المكونات';

    const textStyles = [
      styles.textHeader,
      {
        fontFamily: fontToBeUsed,
        textAlign: language === 'English' ? 'left' : 'right',
        fontWeight: 'bold',
        
      }
    ];
    const countStyles = [
      styles.textCount,
      {
        fontFamily: font2,
        textAlign: language === 'English' ? 'left' : 'right',
        width: language === 'English' ? '100%' : '85%',
        marginLeft: 20
      }
    ];
    return (
      <>
        <View style={{ width: '100%' }}>
          <View style={[styles.textHeaderContainer, { marginLeft: 18, alignItems:"center" }]}>
            {/* <Text style={textStyles}>{details}</Text> */}
            <Text
              style={{ fontFamily: 'arabicBold',fontSize: 16, marginLeft:-10, marginRight: 10}} //fontWeight: 'arabicBold' }}
            >
              {details}
            </Text>

            {/*<Text style={textStyles}>{brandName}</Text>*/}
            <Text
              style={{ fontFamily: 'arabicBold', fontSize: 16, marginLeft:-7}} // fontWeight: 'arabicBold' }}
            >
              {brandName}
            </Text>
            {/*<Text style={textStyles}>{dosage}</Text>*/}
            <Text
              style={{ fontFamily: 'arabicBold', fontSize: 16,}}//fontWeight: 'arabicBold' }}
            >
              {dosage}
            </Text>
            {/*<Text style={textStyles}>{price}</Text>*/}
            <Text
              style={{ fontFamily: 'arabicBold', color: "#1ea282", fontSize: 16,marginLeft:0,marginRight:-10}}// fontWeight: 'arabicBold' }}
            >
              {price}
            </Text>
          </View>
        </View>
      </>
    );
  };

  sortData = (data) => {
    const { language } = this.state;
    // console.log(data);
    const convertStringToNumber = (string) => {
      return Number(string.replace(/[^0-9.-]+/g, ''));
    };
    const sorted = data.sort((a, b) =>
      convertStringToNumber(a.public_price) >
      convertStringToNumber(b.public_price)
        ? 1
        : -1
    );
    this.setState({ filteredData: sorted, originalData: sorted });
  };

  onPressItem = (item, font) => {
    this.props.navigation.navigate('Details', {
      item: item,
      language: this.state.language,
      fontToBeUsed: font
    });
  };

  renderItems = (item, index) => {
    const { language, fontsLoaded, subtitutePressed } = this.state;
    const displayedSubtituteImage =
      language === 'English'
        ? searchImages.subtituteImage
        : searchImages.subtituteImageArabic;
    const fontToBeUsed = fontsLoaded
      ? language === 'English'? 'englishFont': 'arabicFont'
      : null;

    let noDecimal = Math.floor(item.public_price);
    let formatedPrice = noDecimal
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    //  this.setState({filteredData: this.sortData(item)})

    return (
      <>
        <TouchableOpacity
          key={item.id}
          style={[styles.itemContainer, { marginLeft: 12 }]}
          onPress={() => this.onPressItem(item, fontToBeUsed)}
        >
          <Image
            source={item.isExpanded ? searchImages.minus : searchImages.plus}
            style={styles.itemImage}
            resizeMode="contain"
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '80%',
              marginLeft: 0
            }}
          >
            <Text
              style={[
                styles.itemText,
                { fontFamily: 'englishFont', width: 80 }
              ]}
            >
              {item.brand_name}
            </Text>
            <Text
              style={[
                styles.itemText,
                { fontFamily: 'englishFont', width: 80, alignSelf: 'center' }
              ]}
            >
              {item.ingredients}
            </Text>
            <Text style={[styles.itemText2, {  fontFamily: 'englishFont', color: '#1ea282', fontWeight: "bold", marginLeft:0 }]}>
              {formatedPrice}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
      </>
    );
  };

  renderItemDetails = (item, index) => {
    const { language, fontsLoaded } = this.state;
    const fontToBeUsed = fontsLoaded
      ? language === 'English'
        ? 'englishFont'
        : 'arabicFont'
      : null;
    const pillPrice =
      language === 'English' ? 'Pill Price (LBP):' : 'سعر الحبة (ل.ل):';
    const ingredients = language === 'English' ? 'Ingredients:' : 'المكونات:';
    const presentation = language === 'English' ? 'Presentation:' : 'العرض:';
    const form = language === 'English' ? 'Form:' : 'الشكل:';
    const route = language === 'English' ? 'Route:' : 'المسار:';
    const brand_generic =
      language === 'English' ? 'Brand/Generic:' : 'أساسي / جنيسي:';
    const subsidy_percentage =
      language === 'English' ? 'Subsidy Percentage:' : 'نسبة الدعم:';
    const statrum = language === 'English' ? 'Statrum:' : 'الشريحة:';
    const atc = language === 'English' ? 'ATC:' : 'الفئة العلاجية:';
    const agent = language === 'English' ? 'Agent:' : 'إسم الوكيل المستورد:';
    const code = language === 'English' ? 'Code:' : 'الرمز:';
    const registration_number =
      language === 'English' ? 'Registration Number:' : 'رقم التسجيل:';
    const manufacturer =
      language === 'English' ? 'Manufacturer:' : 'الشركة المصنعة:';
    const countryOfOrigin = language === 'English' ? 'Country:' : 'بلد المنشأ:';
    const locallyManufactured =
      language === 'English' ? 'Made in Lebanon' : 'صنع في لبنان';

    const flexDirection = language === 'English' ? 'row' : 'row-reverse';
    const formatPillPrice = (price) => {
      let noDecimal = Math.floor(price);
      let formatedPrice = noDecimal
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formatedPrice;
    };

    const formatedPillPrice = formatPillPrice(item.pill_price);
    const textPillToDisplay = formatedPillPrice ? formatedPillPrice : 'N/A';

    return (
      <>
        {item.country == 'Lebanon' ? (
          <View
            style={{
              flexDirection: flexDirection,
              alignSelf: 'center',
              marginTop: 10
              
            }}
          >
            <Text
              style={{fontWeight: 'bold', textAlign: 'center', color: 'red' }}
            >
              {locallyManufactured}
            </Text>
          </View>
        ) : null}
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {pillPrice}
          </Text>
          <Text style={styles.detailsItemText}> {textPillToDisplay} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {ingredients}
          </Text>
          <Text style={styles.detailsItemText}> {item.ingredients} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {presentation}
          </Text>
          <Text style={styles.detailsItemText}> {item.presentation} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {form}
          </Text>
          <Text style={styles.detailsItemText}> {item.form} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {route}
          </Text>
          <Text style={styles.detailsItemText}> {item.route_lndi} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {brand_generic}
          </Text>
          <Text style={styles.detailsItemText}> {item.bg} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {subsidy_percentage}
          </Text>
          <Text style={styles.detailsItemText}>
            {' '}
            {item.subsidy_percentage}{' '}
          </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {statrum}
          </Text>
          <Text style={styles.detailsItemText}> {item.stratum} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {atc}
          </Text>
          <Text style={styles.detailsItemText}> {item.atc} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {agent}
          </Text>
          <Text style={styles.detailsItemText}> {item.agent} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {code}
          </Text>
          <Text style={styles.detailsItemText}> {item.code} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {registration_number}
          </Text>
          <Text style={[styles.detailsItemText]}> {item.reg_number} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {manufacturer}
          </Text>
          <Text style={styles.detailsItemText}> {item.manufacturer} </Text>
        </View>
        <View style={styles.separator} />
        <View
          style={[
            styles.itemDetailsTextContainer,
            { flexDirection: flexDirection }
          ]}
        >
          <Text style={[styles.detailsItemText, { fontWeight: 'bold' }]}>
            {countryOfOrigin}
          </Text>
          <Text style={styles.detailsItemText}> {item.country} </Text>
        </View>
      </>
    );
  };

  renderFooter = () => {
    const { language, filteredData } = this.state;
    const font2 = language === 'English' ? 'englishFont' : null;

    const countStyles = [
      styles.textCount,
      {
        fontFamily: font2,
        textAlign: language === 'English' ? 'left' : 'right',
        width: language === 'English' ? '100%' : '85%',
        marginLeft: 20
      }
    ];

    return (
      <>
        {language === 'English' ? (
          <Text style={countStyles}>
            {filteredData.length > 1
              ? 'Number of results : ' + filteredData.length
              : filteredData.length + ' Result'}
          </Text>
        ) : (
          <>
            <Text style={countStyles}>
              <Text style={{ fontFamily: 'arabicFont' }}>عدد النتائج : </Text>
              <Text style={{ fontFamily: 'arabicFont' }}>
                {' '}
                {filteredData.length}{' '}
              </Text>
            </Text>
          </>
        )}
      </>
    );
  };

  updateLayout = (id) => {
    const { filteredData } = this.state;
    const array = [...filteredData];
    array.map((value, placeindex) =>
      value.id === id
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false)
    );
    this.setState(() => {
      return {
        filteredData: array
      };
    });
  };

  goBack = () => {
    const { search, originalData } = this.state;
    this.setState({ search: '', filteredData: [] });

    if (search === '') {
      this.setState({ subtitutePressed: false });
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } else {
      this.setState({ search: '' });
      this.setState({ subtitutePressed: false });
      this.setState({ filteredData: [] });
    }
  };

  componentWillUnmount() {
    this.setState({ language: 'English' });
    this.setState({ filteredData: [] });
    this.setState({ search: '' });
  }

  openBarcodeScanner = () => {
    this.resetRoute();
  };

  // openFeedback = () => {
  //   this.props.navigation.navigate('Review');
  // };

  dismissKeyboard = () => {
    console.log('dismissKeyboard');
    this.setState({ keyboard: false });
    Keyboard.dismiss();
  };

  renderFilters = () => {
    const {
      language,
      dosageItems,
      dosageValue,
      formItems,
      formValue,
      openDosageDropdown,
      openFormDropdown
    } = this.state;

    return (
      <View
        style={{
          width: '70%',
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
          alignSelf: 'center'
        }}
      >
        <DropDownPicker
          items={dosageItems}
          defaultValue={dosageValue}
          containerStyle={{ height: 40, width: '50%' }}
          style={{
            backgroundColor: 'rgb(22,75,170)',
            borderWidth: 0,
            borderRadius: 15,
            zIndex: 1000,
            alignContent: 'center'
          }}
          itemStyle={{
            justifyContent: 'flex-start'
          }}
          dropDownStyle={{
            backgroundColor: '#fff',
            zIndex: 1000,
            elevation: 1000
          }}
          onSelectItem={(item) =>
            this.setState({
              dosageValue: item.value
            })
          }
          placeholder={dosageValue}
          placeholderStyle={{
            textAlign: 'center',
            color: 'white',
            fontSize: 16
          }}
          open={openDosageDropdown}
          setOpen={(open) => this.setState({ openDosageDropdown: open })}
        />
        <View style={{ marginLeft: 10, width: '100%' }}>
          <DropDownPicker
            items={formItems}
            defaultValue={formValue}
            containerStyle={{ height: 40, width: '50%' }}
            style={{
              backgroundColor: 'rgb(17,115,85)',
              borderColor: '#fff',
              borderWidth: 0,
              borderRadius: 15,
              zIndex: 1000
            }}
            itemStyle={{
              justifyContent: 'flex-start'
            }}
            dropDownStyle={{
              backgroundColor: '#fff',
              zIndex: 1000,
              elevation: 1000
            }}
            placeholder={formValue}
            placeholderStyle={{
              textAlign: 'center',
              color: 'white',
              fontSize: 16
            }}
            open={openFormDropdown}
            setOpen={(open) => {
              this.setState({ openFormDropdown: open });
            }}
            onSelectItem={(item) => {
              this.setState({ formValue: item.value });
              console.log('item', item.value);
            }}
          />
        </View>
      </View>
    );
  };

  render() {
    const { language, search, filteredData, done, fontsLoaded, keyboard } =
      this.state;

    const imageToDisplay =
      language === 'English'
        ? searchImages.arabicImageUrl
        : searchImages.switchToEnglish;
    const fontToBeUsed = fontsLoaded
      ? language === 'English'
        ? 'englishFont'
        : 'arabicFont'
      : null;
    const fontToBeUsed2 = fontsLoaded
      ? language === 'English'
        ? 'englishFont'
        : 'arabicFont'
      : null;
    const description =
      language === 'English'
        ? 'Prices issued on '
        : 'الأسعار صادرة بتاريخ ';
    const placeHolderText =
      language === 'English'
        ? 'Search by Name or Ingredients'
        : 'البحث باسم الدواء أو المكوّنات';
    const medicationText =
      language === 'English'
        ? 'Lebanese Medication Pricelist'
        : 'لائحة اسعار الادوية في لبنان';
    const logo =
      language == 'English'
        ? searchImages.logoEnglish
        : searchImages.logoArabic;
    const textInputAlignment = language === 'English' ? 'left' : 'right';
    const textInputDirection = language === 'English' ? 'ltr' : 'rtl';
    const date = language === 'English' ? '04/01/2023' : '2023/01/04';
    const betaImage =
      language === 'English'
        ? searchImages.betaEnglish
        : searchImages.betaArabic;

    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[styles.header, { marginTop: Platform.OS === 'ios' ? 0 : 20 }]}
        >
          <TouchableOpacity onPress={this.switchLanguage}>
            <Image
              source={imageToDisplay}
              style={styles.imageLanguage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          {/* <Image source={searchImages.moho} style={styles.headerImage} resizeMode="cover" /> */}
          <TouchableOpacity onPress={this.openFeedback}>
            <Image
              source={searchImages.feedback}
              style={styles.feedback}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {/* <View>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        
        </View> */}
        <Text style={styles.text}>
          <Text style={{ fontFamily: fontToBeUsed, fontFamily: "arabicBold" , fontSize: 16, }}>{description}</Text>
          <Text style={{ fontFamily: fontToBeUsed, fontFamily: "arabicFont" , fontSize: 16, fontWeight: "bold", color: "red"}}>{date}</Text>
        </Text>
        <View style={styles.inputContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: 10
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('History', {
                  language: language
                })
              }
            >
              <Image
                style={styles.image}
                source={searchImages.history}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '60%'
            }}
          >
            <TextInput
              onFocus={() => this.setState({ keyboard: true })}
              autoCorrect={false}
              style={[
                styles.input,
                {
                  writingDirection: "ltr" | "rtl",
                  //textAlign: 'right',
                  fontFamily: fontToBeUsed,
                  
                }
              ]}
              placeholder={placeHolderText}
              onChangeText={(te) => this.onChangeText(te)}
              value={search}
              returnKeyType="search"
              onSubmitEditing={this.dismissKeyboard}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              
              
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

            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={this.openBarcodeScanner}>
                <Image
                  style={styles.qrCode}
                  source={searchImages.scaningblue}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* {this.renderFilters()} */}

        {this.header(fontToBeUsed2)}
        {/* <ScrollView scrollEnabled={this.state.disableScroll} nestedScrollEnabled={true}> */}
        {this.state.search && (
          <FlatList
            data={filteredData}
            renderItem={(item, index) => this.renderItems(item.item, index)}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
          />
        )}
        {/* </ScrollView> */}
        {this.renderFooter()}
        <StatusBar style="dark" />
        {!keyboard ? (
          <Image
            source={betaImage}
            resizeMode="contain"
            style={{
              width: 100,
              height: 30,
              marginTop: 'auto',
              alignSelf: 'center'
            }}
          />
        ) : null}
      </SafeAreaView>
    );
  }
}

export default SearchResult;