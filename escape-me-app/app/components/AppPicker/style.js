import { StyleSheet, Platform } from 'react-native'


module.exports = StyleSheet.create({
    container: {
        backgroundColor: '#f8f4f4',
        flexDirection: 'row',
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderRadius: 25,
        alignItems: 'center'
    },
    icon: {
        marginHorizontal: 10
    },
    textInput: {
        fontSize: 18,
        fontFamily: Platform.OS === 'android' ? "Roboto" : 'Avenir',
        marginLeft: 10
    },
    text: {
        flex: 1,
        fontSize: 18,
        fontFamily: Platform.OS === 'android' ? "Roboto" : 'Avenir',
    }
})