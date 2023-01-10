import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import searchImages from '../appStyles/searchImages';
import ListComponent from '../Components/ListComponent';
import { color } from 'react-native-elements/dist/helpers';

const Details = (navigation) => {
  const [subtitutePressed, setSubtitutePressed] = React.useState(null);
  const [item, setItem] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadedData, setLoadedData] = React.useState(null);

  useEffect(() => {
    const { params } = navigation.route;
    setItem(params.item);
  }, []);

  const nav = useNavigation();

  const getSubstitutes = async () => {
    const url = `https://medleb.org/api/medications?limit=100&medications_atc=${item.atc}&medications_seq=${item.seq}`;
    const response = await fetch(url);
    const data = await response.json();
    const sortedData = data.records.sort(
      (a, b) => a.public_price - b.public_price
    );
    setLoadedData(sortedData);
    if (data.records.length > 0) {
      setSubtitutePressed(true);
    } else {
      setSubtitutePressed(false);
      Alert.alert('No substitutes found');
    }
  };

  const route = useRoute();
  const { language, fontToBeUsed, fontsLoaded } = route.params;

  const displayedSubtituteImage =
    language === 'English'
      ? searchImages.subtituteImage
      : searchImages.subtituteImageArabic;

  const topBar = () => {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather
            name="arrow-left"
            size={24}
            color="#1ea282"
            
            onPress={() =>
              subtitutePressed ? setSubtitutePressed(false) : nav.goBack()
            }
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginLeft: 10,
              textTransform: 'capitalize',
              alignSelf: 'center',
              maxWidth: 200
              
            }}
          >
            {item.brand_name}
          </Text>
        </View>
        <Pressable onPress={() => getSubstitutes()}>
          <Image
            source={displayedSubtituteImage}
            style={{ width: 110, height: 70 ,}}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    );
  };

  const header = () => {
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
        
        fontSize: 20,
        color:"#1ea282",
        fontFamily: "arabicBold", //fontWeight: "bold"
      }
    ];
    const detailsStyles = [
      styles.textHeader,
      {
        fontFamily: fontToBeUsed, 
        textAlign: 'left',
        fontSize: 15,
        maxWidth: 200,
        
        
      }
    ];
    let noDecimal = Math.floor(item.public_price);
    let formatedPrice = noDecimal
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // let formatedPrice=noDecimal.toLocaleString();
    return (
      <>

        {/* /*Details Page Header Text Styling (Ingredients & Price)*/ }
        <View style={{ width: '100%', marginTop: 20 }}>
          <View
            style={[
              styles.textHeaderContainer, { marginLeft: 12, marginTop: -15 , alignItems:"center"}
            ]}
          >
            <Text style={textStyles}>{dosage}</Text>
            <Text style={textStyles}>{price}</Text>
          </View>
          <View
            style={[
              styles.textHeaderContainer,
              { marginLeft: -30, marginBottom: 20, paddingRight: 0, paddingLeft: 0, }
            ]}
          >
            <Text style={{detailsStyles, color:"#2196F3",fontWeight:"bold",/*marginRight: 10, marginLeft:10,*/ paddingHorizontal: 50,}}>{item.ingredients}</Text>
            <Text style={{detailsStyles, color:"red",fontWeight:"bold", ppaddingRight: 0, paddingLeft: 0,}}>{formatedPrice}</Text>
          </View>
        </View>
      </>
    );
  };

  const headerSubstitude = () => {
    const fontToBeUsed2 = language === 'English' ? 'englishFont' : 'arabicFont';
    const details = language === 'English' ? 'Details' : 'التفاصيل';
    const brandName = language === 'English' ? 'Brand Name' : 'اسم الدواء';
    const price = language === 'English' ? 'Price (LBP)' : 'السعر (ل.ل)';
    const dosage = language === 'English' ? 'Ingredients' : 'المكونات';

    return (
      <>
        <View style={{ width: '100%' }}>
          <View style={[styles.textHeaderContainer, { marginLeft: 12, alignItems: "center" }]}>
            <Text style={[styles.detailsItemText, { fontFamily:"arabicBold" ,}]}>
              {details}
            </Text>
            <Text style={[styles.detailsItemText, { fontFamily:"arabicBold" }]}>
              {brandName}
            </Text>
            <Text style={[styles.detailsItemText, { fontFamily:"arabicBold" }]}>
              {dosage}
            </Text>
            <Text style={[styles.detailsItemText, { fontFamily:"arabicBold" }]}>
              {price}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const changeItemDetails = (item) => {
    setItem(item);
    setSubtitutePressed(false);
  };

  const renderItemDetails = (item) => {
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
    const flexDirection = language === 'English' ? 'row' : 'row-reverse';
    const locallyManufactured =
      language === 'English' ? 'Made in Lebanon' : 'صنع في لبنان';

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
              marginTop: 0
            }}
          >
            <Text
              style={{ fontFamily: "arabicBold" , textAlign: 'center', color: 'red' }}
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold", fontSize: 15.3 }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold" ,fontSize: 15.3 }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold" ,fontSize: 15.3 }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold",fontSize: 15.3  }]}>
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
          <Text style={[styles.detailsItemText, { fontFamily: "arabicBold" ,fontSize: 15.3 }]}>
            {countryOfOrigin}
          </Text>
          <Text style={styles.detailsItemText}> {item.country} </Text>
        </View>
      </>
    );
  };

  const ListItems = ({ item }) => {
    return (
      <>
        <View style={{ marginTop: 20, }}>
          <ListComponent
            data={loadedData}
            englishFont={fontToBeUsed}
            
            onPress={(j) => changeItemDetails(j)}
          />
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {topBar()}
      {!subtitutePressed ? header() : headerSubstitude()}
      {!subtitutePressed ? (
        <ScrollView>{renderItemDetails(item)}</ScrollView>
      ) : (
        ListItems(loadedData)
      )}
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(252,245,243)'
  },
  header: {
    width: '100%',
    maxWidth: '100%',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingTop: 0, //padding: 10,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 85
  },
  logo: {
    width: 200,
    height: 130,
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 5
  },
  textHeader: {
    fontSize: 15,
    color: 'black'
  },
  textHeaderContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    //paddingLeft: 10,
    
  },
  itemDetailsTextContainer: {
    //alignItems: "center",
    width: '90%',
    paddingTop: 5,
    paddingBottom: 5,
    //marginTop: 10,
    marginLeft: 0,
  },
  // detailsItemText: {
  //   fontSize: 15,
  //   color: 'black',
  //   textAlign: 'left',
  //   marginTop: 15,
  //   height: 42,
  //   marginLeft: 1,
  //   maxWidth: 210
  // },
  detailsItemText: { 
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    alignContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    height: 50,
    marginLeft: 5,
    maxWidth: 220,
    //paddingTop: 5,
    // paddingBottom: 5,
    // paddingRight: 10
  },
  separator: {
    width: '90%',
    height: 1,
    backgroundColor: '#ccc',
    marginLeft: 10,
    marginBottom: 2
  }
});



// componentDidMount() 
// {
//   this.loadFonts();
//   this.getLanguage();
//   this.getData();
//   this.getLocalData();

//   BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
// }

// resetRoute = () => {
//   this.props.navigation.dispatch(
//     StackActions.replace('Barcode', { screen: 'SearchResult' })
//   );
// };