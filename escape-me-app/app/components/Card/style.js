import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    card: {
        borderRadius: 15,
        backgroundColor: '#fff',
        marginBottom: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    image: {
        width: '100%',
        height: 200,
    },
    icon: {
        marginHorizontal: 5
    },
    icons: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 20,
        width: '50%',
        justifyContent: "space-around",
        position: 'absolute',
        bottom: '5%'
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    pair: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    rating: {
        position: "absolute",
        bottom: 5,
        left: 5
    },
    text: {
        fontSize: 18
    },
    title: {
        position: "absolute",
        top: 5,
        left: 5
    }
})
