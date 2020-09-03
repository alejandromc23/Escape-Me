import React, { useState } from 'react'
import { View, Image, Text, Modal, SafeAreaView, Button } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { toggleFollowUser } from 'escape-me-client-logic'
import { TouchableOpacity } from 'react-native-gesture-handler';
import OthersProfile from '../../screens/OthersProfile'

const styles = require('./style')

function UserItem({ name, surname, email, image, main = false, following, userId, onEscapes, onFollowing }) {
    const [modalVisible, setModalVisible] = useState(false)

    function handleFollowUser(userId) {
        (async () => {
            await toggleFollowUser(userId)
            onFollowing()
        }
        )()
    }

    return (
        <View style={main ? styles.container : [styles.container, styles.containerItem]}>
            <TouchableOpacity onPress={!main ? () => setModalVisible(true) : () => { }} >
                <Image style={main ? styles.image : styles.littleImage} source={image} />
            </TouchableOpacity>
            {!main && <Modal visible={modalVisible} animationType="slide">
                <SafeAreaView style={{ marginBottom: 20 }}>
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                    <OthersProfile _userId={userId} onEscapes={onEscapes} />
                </SafeAreaView>
            </Modal>}
            <View>
                <Text style={main ? styles.username : styles.littleUsername}>{email}</Text>
                <Text style={main ? styles.name : styles.littleName}>{name} {surname}</Text>
            </View>
            {!main && (following ?
                <Feather style={styles.follow} name="user-x" size={24} color="black" onPress={() => handleFollowUser(userId)} />
                :
                <Feather style={styles.follow} name="user-plus" size={24} color="black" onPress={() => handleFollowUser(userId)} />)
            }
        </View>
    )
}

export default UserItem