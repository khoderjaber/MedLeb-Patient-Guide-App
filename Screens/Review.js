import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  BackHandler
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation, StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const Review = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLanguage = async () => {
      const value = await AsyncStorage.getItem('medlebLanguage');
      setLanguage(value);
    };
    getLanguage();
  }, []);

  const nameLabel = language == 'English' ? 'Name *' : 'الاسم *';
  const phoneLabel = language == 'English' ? 'Phone Number *' : 'رقم الهاتف *';
  const emailLabel =
    language == 'English' ? 'Email (optional)' : 'البريد الإلكتروني (اختياري)';
  const messageLabel =
    language == 'English' ? 'Write Your Review: *' : 'اكتب مراجعتك: *';
  const submitLabel = language == 'English' ? 'Send Review' : 'إرسال ';
  const title = language == 'English' ? 'Review' : 'ملاحظات حول التطبيق';
  const namePlaceholder =
    language == 'English' ? 'Enter your name' : 'يرجى إدخال الإسم';
  const phonePlaceholder =
    language == 'English' ? 'Enter your phone number' : 'يرجى إدخال رقم الهاتف';
  const emailPlaceholder =
    language == 'English' ? 'Enter your email' : 'يرجى إدخال البريد الإلكتروني';
  const messagePlaceholder =
    language == 'English'
      ? 'Enter your review'
      : 'يرجى كتابة الملاحظات حول التطبيق';
  const textAlign = language == 'English' ? 'left' : 'right';
  const writingDirection = language == 'English' ? 'ltr' : 'rtl';
  const toastMessage =
    language == 'English' ? 'Review Submitted' : 'تم إرسال المراجعة';

  const navigation = useNavigation();

  const submitForm = async () => {
    setLoading(true);
    const phoneNumberWithCode = '+961' + phoneNumber;
    ToastAndroid.show(toastMessage, ToastAndroid.SHORT);
    await navigation.dispatch(StackActions.replace('Home'));
  };

  useEffect(() => {
    const backAction = () => {
      navigation.dispatch(StackActions.replace('Home'));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const headerTop = () => (
    <View style={styles.headerTop}>
      <View style={styles.headerTopLeft}>
        <Icon
          name="arrow-back"
          type="material"
          color="#1ea282"
          size={30}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.headerTopCenter}>
        <Text style={styles.headerTopCenterText}>{title}</Text>
      </View>
    </View>
  );

  const formContainer = () => (
    <View style={styles.formContainer}>
      <View style={styles.formContainerInput}>
        <Text
          style={[
            styles.label,
            { textAlign: textAlign, fontFamily: 'arabicBold' }
          ]}
        >
          {nameLabel}
        </Text>

        <TextInput
          style={[
            styles.formContainerInputText,
            {
              textAlign: textAlign,
              fontFamily: 'arabicFont',
              fontSize: 15,
              writingDirection: writingDirection
            }
          ]}
          placeholder={namePlaceholder}
          onChangeText={(text) => setName(text)}
          value={name}
          autoCorrect={false}
        />
      </View>
      <View style={styles.formContainerInput}>
        <Text
          style={[
            styles.label,
            { textAlign: textAlign, fontFamily: 'arabicBold' }
          ]}
        >
          {phoneLabel}
        </Text>
        <View style={styles.phoneNumberContainer}>
          <View style={styles.phoneNumberContainerLeft}>
            <Text style={styles.phoneNumberContainerLeftText}>+961</Text>
          </View>
          <TextInput
            style={[
              styles.phoneNumber,
              {
                textAlign: textAlign,
                fontFamily: 'arabicFont',
                fontSize: 15,
                right: 5,
                writingDirection: writingDirection
              }
            ]}
            placeholder={phonePlaceholder}
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
            keyboardType="numeric"
            autoCorrect={false}
          />
        </View>
      </View>
      <View style={styles.formContainerInput}>
        <Text
          style={[
            styles.label,
            { textAlign: textAlign, fontFamily: 'arabicBold' }
          ]}
        >
          {emailLabel}
        </Text>
        <TextInput
          style={[
            styles.formContainerInputText,
            {
              textAlign: textAlign,
              fontFamily: 'arabicFont',
              fontSize: 15,
              
              writingDirection: writingDirection
            }
          ]}
          placeholder={emailPlaceholder}
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCorrect={false}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.formContainerInput}>
        <Text
          style={[
            styles.label,
            { textAlign: textAlign, fontFamily: 'arabicBold',  }
          ]}
        >
          {messageLabel}
        </Text>
        <TextInput
          style={[
            styles.formContainerInputText,
            {
              height: 200,
              textAlignVertical: 'top',
              padding: 10,
              textAlign: textAlign,
              writingDirection: writingDirection,
              fontFamily: 'arabicFont',
              fontSize: 15
            }
          ]}
          placeholder={messagePlaceholder}
          onChangeText={(text) => setMessage(text)}
          value={message}
          multiline={true}
          autoCorrect={false}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView>
      {headerTop()}
      {formContainer()}
      {!loading ? (
        <>
          <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
            <Text style={styles.submitText}>{submitLabel}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color="#000" />
        </>
      )}
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTop: {
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: Platform.OS === 'android' ? 30 : 0
  },
  headerTopText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerTopLeft: {
    position: 'absolute',
    left: 10,
    top: 10
  },
  headerTopCenter: {
    position: 'absolute',
    top: 10
  },
  headerTopCenterText: {
    fontSize: 20,
    //fontWeight: 'bold',
    fontFamily: "arabicFont"
  },
  headerTopRight: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  formContainer: {
    padding: 10,
    marginTop: 20
  },
  formContainerInput: {
    marginBottom: 15
  },
  formContainerInputText: {
    fontSize: 18,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    paddingBottom: 10,
    marginLeft: 5,
    width: '98%'
  },
  phoneNumberContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    flexDirection: 'row'
  },
  phoneNumber: {
    fontSize: 18,
    width: '85%',
    marginLeft: 10
  },

  phoneNumberContainerLeft: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd'
  },
  phoneNumberContainerLeftText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  submitButton: {
    backgroundColor: '#1ea282',
    height: 40,
    width: '50%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 7,
    justifyContent: 'center'
  },
  submitText: {
    fontFamily: "arabicFont",
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    alignContent: 'center',
    color: 'white'
  }
});

export default Review;
