import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
const styles = require('./style')

export default function ({ username, names, rating, comment, date }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.username}>{username}</Text>
                <Text >{rating}</Text>
                <MaterialCommunityIcons name="star" size={24} color="#FFD300" />
            </View>
            <Text style={styles.comment}>{comment}</Text>
            <View style={styles.date}>
                <Text style={styles.dateText}>{date}</Text>
            </View>
        </View>
    )
}
