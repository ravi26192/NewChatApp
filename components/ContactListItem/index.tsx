import React from 'react';
import { Text, View, Image, TouchableWithoutFeedback } from 'react-native';
// import Avatar from 'react-avatar';
import { User } from '../../types';
import styles from './styles';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

export type ContactListItemProps = {
    user: User;
}

const ContactListItem = (props: ContactListItemProps) => {
    const { user } = props;

    const navigation = useNavigation();

    const onClick = () => {
        // navigate to chat room with the contact selected
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