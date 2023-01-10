import  React, {useEffect} from 'react';
import { View, StyleSheet, Button, Pressable } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useNavigation, StackActions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, AntDesign } from '@expo/vector-icons';

export default function App() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [mute, setMute] = React.useState(false);
 

  const navigation = useNavigation();

  const videoSource = require('../assets/oummal.mp4');

  useEffect(() => {
    video.current.playAsync();

  }, []);

  useEffect(() => {
    
    if (status.didJustFinish) {
      video.current.pauseAsync();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    


    return () => {
      video.current.pauseAsync();
    }

    }

  }, [status.didJustFinish]);

  const goHome = () => {
    video.current.pauseAsync();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }


  

  const topLeftIcon = () => (

    <Pressable onPress={() => setMute(!mute)}>
    <Ionicons name={ !mute ? "ios-volume-high-outline" : "volume-mute-outline"} size={24} color="black" />
    </Pressable>
  )

  const topRightIcon = () => (
      <Pressable  onPress={goHome} style={{paddingTop: 10}}>
      <AntDesign name="stepforward" size={24} color="black" />
      </Pressable>
  )

  
  return (
    <View style={styles.container}>
      <View style={styles.topRightIcon}>
      {topLeftIcon()}
      {topRightIcon()}
      </View>
      <Video
        ref={video}
        style={styles.video}
        source={videoSource}
        resizeMode="stretch"
        onPlaybackStatusUpdate={status => setStatus(() => status)}
        isMuted={mute}
        
       
      />
      <StatusBar style="light"></StatusBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: "100%",
    height: "100%",
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeftIcon: {
    position: 'absolute',
    top: 43,
    left: 5,
    margin: 20,
    zIndex: 100,
  },
  topRightIcon: {
    position: 'absolute',
    top: 43,
    right: 5,
    margin: 20,
    zIndex: 100,
  },

});