import React from 'react';
import { Text, View, Image, TouchableWithoutFeedback } from 'react-native';
// import Avatar from 'react-avatar';
import { User } from '../../types';
import styles from './styles';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import API, { graphqlOperation } from '@aws-amplify/api';
import { createChatRoom, createChatRoomUser } from '../../src/graphql/mutations';
import Auth from '@aws-amplify/auth';

export type ContactListItemProps = {
    user: User;
}

const ContactListItem = (props: ContactListItemProps) => {
    const { user } = props;

    const navigation = useNavigation();

    const onClick = async () => {
        //console.warn("Hello");
        try{
            const newChatRoomData = await API.graphql(
                graphqlOperation(
                    createChatRoom, {
                        input: { }
                    }
                )
            )
            
            if (!newChatRoomData.data){
                console.log("Failed creating chat room");
                return;
            }

            const newChatRoom = newChatRoomData.data.createChatRoom;
            //console.log(newChatRoom);

            await API.graphql(
                graphqlOperation(
                    createChatRoomUser, {
                        input: {
                            userID: user.id,
                            chatRoomID: newChatRoom.id
                        }                        
                    }
                )
            )

            const userInfo = await Auth.currentAuthenticatedUser();
            await API.graphql(
                graphqlOperation(
                    createChatRoomUser, {
                        input: {
                            userID: userInfo.attributes.sub,
                            chatRoomID: newChatRoom.id
                        }
                    }
                )
            )

            navigation.navigate('ChatRoom', {
                id: newChatRoom.id,
                name: "Chat Room 1",
            })

        } catch(e){
            console.log(e);
        }
    } 

    return (
        <TouchableWithoutFeedback onPress={onClick}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Image source={{ uri: user.imageUri }} style={styles.avatar} />

                    <View style={styles.midContainer}>
                        <Text style={styles.username}> {user.name} </Text>
                        <Text numberOfLines={1} style={styles.status}> {user.status} </Text>
                    </View>    
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
};

export default ContactListItem;