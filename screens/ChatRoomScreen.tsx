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
import Auth from '@aws-amplify/auth';
import { onCreateMessage } from '../src/graphql/subscriptions';

const ChatRoomScreen = () => {

    const [ messages, setMessages ] = useState([]);
    const [ myId, setMyId ] = useState(null);
    const route = useRoute();

    useEffect (() => {
        const fetchMessages = async () => {
            const messagesData = await API.graphql(
                graphqlOperation(
                    messagesByChatRoom, {
                        chatRoomID: route.params.id,
                        sortDirection: "DESC",

                    }
                )
            )
            console.log("Fetch Message...")
            setMessages(messagesData.data.messagesByChatRoom.items);
        }
        fetchMessages();
    }, [])

    useEffect(() => {
        const getMyId = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setMyId(userInfo.attributes.sub);
        }
        getMyId();
    }, [])

    useEffect(() => {
        const subscription = API.graphql(
            graphqlOperation(
                onCreateMessage
            )
        ).subscribe({
            next: (data) => {
                const newMessage = data.value.data.onCreateMessage;
                if (newMessage.chatRoomID !== route.params.id){
                    console.log("Message is in another room...");
                    return;
                }

                fetchMessages();
            }
        });
        return () => subscription.unsubscribe();
    }, [])
    //console.log(route.params);

    return (
        <ImageBackground source={BG} style={{width:'100%', height:'100%'}}>
            <FlatList 
                data={messages}
                renderItem={({item}) => <ChatMessage myId={myId} message={item}/> }
                inverted
            />

            <InputBox chatRoomID={route.params.id}/>
        </ImageBackground>
    )
}

export default ChatRoomScreen;