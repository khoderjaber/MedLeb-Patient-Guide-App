import { View, Text, Pressable, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import styles from '../appStyles/searchStyles'
import searchImages from '../appStyles/searchImages'

const ListComponent = ({data, onPress, englishFont}) => {

   // console.log("data", data)

    return (
        <>
            <ScrollView style={styless.listContainer}>
        {data.map((item, index) => {
              let noDecimal = Math.floor(item.public_price);
              let formatedPrice = noDecimal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");          
            return (
            <>
             <Pressable key={item.id} style={[styles.itemContainer, {marginLeft: 13, }]} onPress={() => onPress(item)}>
            <TouchableOpacity >
             <Image source={searchImages.plus} style={styles.itemImage} resizeMode='contain' />
             </TouchableOpacity>
             <View style={{flexDirection: "row", justifyContent: "space-evenly",  width: "80%", marginLeft:5}}>
                <Text style={[styles.itemText, {fontFamily: englishFont, width:80}]}>{item.brand_name}</Text>
                <Text style={[styles.itemText, {fontFamily: englishFont, width:70, alignSelf:"center"}]}>{item.ingredients}</Text>
                <Text style={[styles.itemText2, {fontFamily: englishFont}]}>{formatedPrice}</Text> 
              </View>
        </Pressable>
        <View style={styles.separator} />
        </>
            )
        })}
        </ScrollView>
</>
    )
}

const styless = StyleSheet.create({
    listContainer: {
        width: "100%",
        height: "100%",
       
       
       
       
        
    },
})

export default ListComponent