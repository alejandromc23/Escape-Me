import React from 'react'
import { Text } from 'react-native'

const styles = require('./style')

export default function ({ error }) {
    if (!error) return null
    return (
        <Text style={styles.error}>
            {error}
        </Text>
    )
}