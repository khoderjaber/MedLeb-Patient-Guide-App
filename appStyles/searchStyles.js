import React from "react";
import { StyleSheet } from "react-native";
import * as Font from 'expo-font';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fcf5f3"
    },
    imageLanguage: {
        width: 50,
        height: 50,
       
         },
    headerImage: {
        width: "70%",
        height: 40,
        marginLeft:30,
        alignSelf: 'center',
     },
     header:{
        width: '95%',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    
        alignSelf: 'center',
    },
    logo:{
        width: 200,
        height: 130,
        alignSelf: 'center',
        marginTop:2,
        marginBottom:5,
        
    },
    medicationText:{
        width: "80%",
        height: 30,
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '400',
    },
    text: {
        fontSize:14,
        marginTop: 10,
        marginBottom: -10,
        color: 'black',
        textAlign: 'center',
    },
    input: {
        borderColor: '#777',
        padding: 0,
        height: 40,
        width: "100%",
      },
      image: {
        width: 28,
        height: 28,
      },
      inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '95%',
        borderRadius: 20,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#0F7053',
        height:50,
        marginHorizontal: 10,
        marginTop:30,
       
       
      },
      qrCode: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        marginTop:1,
        marginRight: 8
        },
        goBack: {
            width: 50,
            height: 50,
        },
        everythingContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
            alignItems: "center",
            alignContent: "center",
        },
        textHeaderContainer: {
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
            // padding: 10,
            // paddingLeft: 10,
            
        },
        textHeader: {
            fontSize: 15,
            color: 'black',
           
         
        },
        itemContainer: {
            width: '90%',
            flexDirection: 'row',
            marginTop: 5,
            alignItems: 'center',
        },
        itemImage: {
            width: 40,
            height: 40,
            marginLeft:10,
            marginRight: 10,
        },
        subtituteImage: {
            width: 90,
            height: 70,
        },
        itemImageContainer: {
            width: '20%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 20
        },
        itemText: {
            fontSize: 15,
            color: 'black',
            textAlign: 'left',
        
            maxWidth: 200,
        },
        itemText2: {
            fontSize: 15,
            color: '#1ea282',
            fontWeight: "900",
            textAlign: 'left',
        },
        itemDetailsContainer: {
            width: '90%',
            justifyContent: "space-around",
             alignSelf: 'center',
            backgroundColor: '#fff',
            borderRadius: 10,
            
        },
        test:{
            width: '90%',
             alignSelf: 'center',
            backgroundColor: '#fff',
            borderRadius: 10,
            height:220
            },
        detailsItemText: {
            fontSize: 15,
            color: 'black',
            textAlign: 'left',
            height: 42,
            marginLeft: 10,
            maxWidth: 210,
    
        },
        detailsSeparator: {
            width: '90%',
            height:1,
            backgroundColor: 'black',
            marginLeft: 10,
           
        },
        detailsHeaderText: {
            fontSize: 15,
            color: 'black',
            textAlign: 'left',
            height: 35,
            fontWeight: 'bold',
            textTransform: 'capitalize'
        },
        itemDetailsTextContainer: {
            width: '90%',
            marginTop: 15,
            marginLeft: 10,

        },
        separator: {
            width: '90%',
            height:1,
            backgroundColor: '#ccc',
            marginLeft: 10,
            marginBottom:2,
        },

        separatorvertical: {
            width: '90%',
            height:1,
            backgroundColor: '#ccc',
            marginLeft: 10,
            marginBottom:2,
        },

        feedback: {
            width: 40,
            height: 40,
            marginTop:5,
            marginRight: 10,
        },
        subtituteFixedContainer: {
            alignSelf: 'flex-start',
            left: 0,
            top: 0,
        },
        itemTextContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 35,
            padding: 10,
        },
        count: {
            width: "90%",
            borderRadius: 15,
            marginTop:3
        },
        textCount: {
            fontSize: 15,
            color: 'red',
        },
})

export default styles;