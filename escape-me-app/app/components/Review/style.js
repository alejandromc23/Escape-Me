import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 15,
        padding: 5,
        marginVertical: 5
    },
    comment: {
        marginTop: 5,
        fontSize: 16,
        marginLeft: 10
    },
    date: {
        position: "absolute",
        right: 5,
        top: 5,
        color: 'white',
        backgroundColor: '#4ecdc4',
        borderRadius: 10,
    },
    dateText: {
        color: 'white',
        padding: 3
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10
    },
})