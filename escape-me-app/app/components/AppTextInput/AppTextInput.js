import React from 'react'
import { View, TextInput } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
const styles = require('./style')

export default function ({ icon, ...otherProps }) {
    return (
        <View style={styles.container}>
            {icon && <MaterialCommunityIcons name={icon} size={20} color={'#fc5c65'} style={styles.icon} />}
            <TextInput style={styles.textInput} {...otherProps} />
        </View>
    )
}