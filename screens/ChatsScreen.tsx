import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import ChatListItem from '../components/ChatListItem';
import chatRooms from '../data/ChatRooms';
import NewMessageButton from '../components/NewMessageButton';
import { useEffect } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getUser } from './queries';
import { useState } from 'react';

export default function ChatsScreen() {

  const [chatRooms, setChatRooms] = useState([]);

  useEffect( () => {
    const fetchChatRooms = async () => {
      try{
        const userInfo = await Auth.currentAuthenticatedUser();
        const userData = await API.graphql(
          graphqlOperation(
            getUser, {
              id: userInfo.attributes.sub,
            }
          )
        )

        setChatRooms(userData.data.getUser.chatRoomUser.items);
        //console.log(userData.data.getUser.chatRoomUser.items);

      } catch (e){
        console.log(e);
      }
    }
    fetchChatRooms();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={{width:'100%'}}
        data={chatRooms}
        renderItem={({item}) => <ChatListItem chatRoom={item.ChatRoom}/>}
        keyExtractor={(item) => item.id}
      />
      <NewMessageButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});