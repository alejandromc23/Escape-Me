import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        padding: 10
    },
    text: {
        fontSize: 20,
        fontFamily: Platform.OS === 'android' ? "Roboto" : 'Avenir',
    }
})