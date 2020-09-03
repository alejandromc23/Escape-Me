import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    containerItem: {
        borderRadius: 50,
        backgroundColor: 'white'
    },
    follow: {
        position: 'absolute',
        right: 20
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 10
    },
    littleImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10
    },
    littleName: {
        fontSize: 16
    },
    littleUsername: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    name: {
        fontSize: 16
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold'
    }
})