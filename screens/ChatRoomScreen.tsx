import React, { useState } from 'react';
import { FlatList, Text, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import chatRoomData from '../data/Chats';
import ChatMessage from '../components/ChatMessage';
import BG from '../assets/images/BG.png';
import InputBox from '../components/InputBox';
import { useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { messagesByChatRoom } from '../src/graphql/queries';

const ChatRoomScreen = () => {

    const [ messages, setMessages] = useState([]);

    const route = useRoute();

    useEffect ( () => {
        const fetchMessages = async () => {
            const messagesData = await API.graphql(
                graphqlOperation(
                    messagesByChatRoom, {
                        chatRoomID: route.params.id,
                        sortDirection: "DESC",

                    }
                )
            )
            setMessages(messagesData.data.messagesByChatRoom.items);
        }
        fetchMessages();
    }, [])

    //console.log(route.params);
    return (
        <ImageBackground source={BG} style={{width:'100%', height:'100%'}}>
            <FlatList 
                data={messages}
                renderItem={({item}) => <ChatMessage message={item}/> }
                inverted
            />

            <InputBox chatRoomID={route.params.id}/>
        </ImageBackground>
    )
}

export default ChatRoomScreen;