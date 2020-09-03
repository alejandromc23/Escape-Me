import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
const styles = require('./style')

export default function ({ label, onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    )
}