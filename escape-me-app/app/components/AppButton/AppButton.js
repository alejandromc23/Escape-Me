import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
const styles = require('./style')

function AppButton({ title, onPress, color = '#fc5c65' }) {
    return (
        <TouchableOpacity activeOpacity={0.8} style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>

    )
}

export default AppButton