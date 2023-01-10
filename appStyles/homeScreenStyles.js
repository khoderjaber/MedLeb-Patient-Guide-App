import React from "react";
import { StyleSheet } from "react-native";




const styles = StyleSheet.create({
    container: {
      flex: 1,

    },
    input: {
      borderColor: '#777',
      padding: 8,
      width: "70%",
        
      
    },
    image: {
      width: 50,
      height: 50,
    
    },
    inputContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      width: '85%',
      borderRadius: 10,
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: -6,
      height:45
    },
    header: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      width: '80%',
      borderRadius: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    imageLanguage: {
        width: 40,
        height: 50,
        resizeMode: 'cover',
        marginTop: 10,
    },
    qrCode: {
        width: 60,
        height: 40,
        resizeMode: 'cover',
        marginTop: 0,
        
    },
    qrCodear: {
        width: 60,
        height: 50,
        resizeMode: 'cover',
        marginTop: -1,
    },
    headerImage: {
        width: "50%",
        height: 80,
        marginLeft:40,
        marginTop: -70,
        marginBottom: 60,
        paddingBottom: 70,
        alignSelf: 'center',
    },
    header:{
        width: '80%',
        borderRadius: 10,
        marginLeft: 20,
       
    },

    logo:{
        width: 200,
        height: 150,
    },
    web:{
        width: "80%",
        height: 30,
        marginLeft: 30,
        alignSelf: 'center',
    },
    text: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '300',
    },
    searchQr: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 25,
        alignContent: 'center',
       
    },
    priceListText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
        paddingTop: 5,
        alignSelf: 'center',
        marginLeft: 30
    },
    ocr: {
        width: 35,
        height: 36,
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 10,
    },
    languageSwitcher: {
        width: 50,
        height: 80,
        borderRadius: 100,
        resizeMode: 'contain',
        left: 0,
        top: 0,
       
    }
  });

export default styles;