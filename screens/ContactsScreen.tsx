import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
//import users from '../data/Users';
import NewMessageButton from '../components/NewMessageButton';
import ContactListItem from '../components/ContactListItem';
import { useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listUsers } from '../src/graphql/queries';
import { useState } from 'react';

export default function ContactsScreen() {

  const [users, setUsers] = useState([]);
  
  useEffect (() => {
    const fetchUsers = async () => {
      try{
        const userData = await API.graphql(
          graphqlOperation(
            listUsers
          )
        )
        //console.log(userData);
        setUsers(userData.data.listUsers.items);
      } catch (e) {
        console.log(e);
      }
    }
    fetchUsers();
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        style={{width:'100%'}}
        data={users}
        renderItem={({item}) => <ContactListItem user={item}/>}
        keyExtractor={(item) => item.id}
      />
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