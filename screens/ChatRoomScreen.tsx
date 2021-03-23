import React from 'react';
import { FlatList, ImageBackground, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import chatRoomData from '../data/Chats';
import ChatMessage from '../components/ChatMessage';
import BG from '../assets/images/BG.png';

const ChatRoomScreen = () => {

    const route = useRoute();

    //console.log(route.params);
    return (
        <ImageBackground source={BG} style={{width:'100%', height:'100%'}}>
            
        </ImageBackground>
    )
}

export default ChatRoomScreen;