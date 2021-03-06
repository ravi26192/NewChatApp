import { Entypo, FontAwesome5, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createMessage, updateChatRoom } from '../../src/graphql/mutations';
import styles from './styles'; 

const InputBox = (props) => {

    const {chatRoomID} = props;

    const [message, setmessage] = useState('');
    const [ myUserID, setMyUserID ] = useState(null);

    useEffect (() => {
        const fetchUser = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setMyUserID(userInfo.attributes.sub);
        }
        fetchUser();
    }, [])

    const onMicrophonePress = () => {
        console.warn('Microphone');
    }

    const updateChatRoomLastMessage = async(messageId: String) => {
        try {
            await API.graphql(
                graphqlOperation(
                    updateChatRoom, {
                        input: {
                            id: chatRoomID,
                            lastMessageID: messageId,
                        }
                    }
                )
            )
        } catch(e) {
            console.log(e);
        }
    }

    const onSendPress = async () => {
        try {
            const newMessageData = await API.graphql(
                graphqlOperation(
                    createMessage, {
                        input: {
                            content: message,
                            userID: myUserID,
                            chatRoomID: chatRoomID,
                        }
                    }
                )
            )
            
            await updateChatRoomLastMessage(newMessageData.data.createMessage.id);

        } catch(e) {
            console.log(e);
        }
        setmessage('');
    }

    const onPress = () => {
        if (!message) {
            onMicrophonePress();
        } else {
            onSendPress();
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <FontAwesome5 name='laugh-beam' size={24} color='grey' />
                <TextInput 
                    placeholder={'Type a message'}
                    style={styles.textInput} 
                    multiline
                    value={message}
                    onChangeText={setmessage}
                />
                <Entypo name='attachment' size={24} color='grey' style={styles.icon} />
                { !message && <Fontisto name='camera' size={24} color='grey' style={styles.icon}/> }
            </View>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.buttonContainer}>
                    {!message 
                        ? <MaterialCommunityIcons name='microphone' size={28} color='#fff'/>
                        : <MaterialIcons name='send' size={28} color='#fff'/>
                    }
                </View>
            </TouchableOpacity>
            
        </View>
    )
}

export default InputBox;