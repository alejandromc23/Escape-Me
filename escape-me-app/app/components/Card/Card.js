import React, { useState } from 'react'
import { View, Image, ImageBackground, Text, TouchableOpacity, Modal, SafeAreaView, Button } from 'react-native'
import { MaterialCommunityIcons, MaterialIcons, SimpleLineIcons, Entypo, AntDesign, Feather, Foundation } from '@expo/vector-icons'
import { toggleEscapeRoom } from 'escape-me-client-logic'
import CardDetails from '../../screens/CardDetails'

const styles = require('./style')

function Card({ title, rating, people, genre, price, image, participated, pending, favorites, escapeId, onEscapes, guest }) {
    const [modalVisible, setModalVisible] = useState(false)
    const [rate, setRate] = useState(rating)

    function handleToggle(tag) {
        (async () => {
            await toggleEscapeRoom(escapeId, tag)
            await onEscapes()
        })()
    }

    function handleRate(rating) {
        setRate(rating)
    }

    return (
        <View style={styles.card}>

            <View style={styles.header}>
                <Text style={[styles.text, styles.title]}>{title}</Text>
                <MaterialIcons name="playlist-add" size={24}
                    color="white" style={styles.icon} />
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setModalVisible(true)} >
                <ImageBackground style={styles.image} source={image} resizeMode={'contain'} >
                    {!guest && <View style={styles.icons}>
                        {favorites ? <AntDesign name="heart" size={24}
                            color="tomato" style={styles.icon} onPress={() => handleToggle('favorites')} />
                            :
                            <SimpleLineIcons name="heart" size={24}
                                color="tomato" style={styles.icon} onPress={() => handleToggle('favorites')} />}
                        {participated ? <Feather name="check-square" size={24}
                            color="black" style={styles.icon} onPress={() => handleToggle('participated')} />
                            :
                            <MaterialIcons name="check-box-outline-blank" size={24}
                                color="black" style={styles.icon} onPress={() => handleToggle('participated')} />}
                        {pending ? <MaterialIcons name="playlist-add-check" size={24}
                            color="black" style={styles.icon} onPress={() => handleToggle('pending')} />
                            :
                            <MaterialIcons name="playlist-add" size={24}
                                color="black" style={styles.icon} onPress={() => handleToggle('pending')} />}
                    </View>}
                </ImageBackground>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="slide">
                <Button title="Close" onPress={() => setModalVisible(false)} />
                <CardDetails key={escapeId} escapeId={escapeId} onEscapes={onEscapes} pending={pending} favorites={favorites} participated={participated} handleRate={handleRate} rate={rate} guest={guest} />
            </Modal>
            <View style={styles.info}>
                <View style={styles.pair}>
                    <Text style={styles.text}>{rate}</Text>
                    <MaterialCommunityIcons name="star" size={24} color="yellow" />
                </View>
                <View style={styles.pair}>
                    <Text style={styles.text}>{people}</Text>
                    <MaterialIcons name="people" size={24} color="black" />
                </View>
                <Text style={styles.text}>{price}</Text>
                <Text style={styles.text}>{genre}</Text>
            </View>
        </View >
    )
}

export default Card