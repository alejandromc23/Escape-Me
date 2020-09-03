import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, Text } from 'react-native'
import Card from '../components/Card'
import { suggestEscapeRooms, retrieveEscapeIds } from 'escape-me-client-logic'
import { useRoute } from '@react-navigation/native'
import Feedback from '../components/Feedback'

export default function ({ navigation }) {
    const route = useRoute()
    let guest
    if (route.params) guest = route.params['guest']
    const [escapeRooms, setEscapeRooms] = useState([])
    const [escapes, setEscapes] = useState()
    const [error, setError] = useState()

    const handleEscapeLists = async () => {
        const { participated = [], pending = [], favorites = [] } = await retrieveEscapeIds()
        setEscapes({ participated, pending, favorites })
    }

    let escapeList
    useEffect(() => {
        try {
            const reload = navigation.addListener('focus', async () => {
                if (!guest) {
                    const _escapes = await retrieveEscapeIds()
                    setEscapes(_escapes)
                }

                if (!escapeRooms.length) {
                    escapeList = await suggestEscapeRooms('pending')
                    setEscapeRooms(escapeList)
                }
            });
            // Return the function to reload from the event so it gets removed on unmount
            return reload;
        } catch (error) {
            setError(error.message)
        }
    }, [navigation]);

    return (
        <SafeAreaView style={{
            backgroundColor: '#f8f4f4',
            padding: 10,
            paddingTop: 30,
        }}>
            <ScrollView>
                {escapeRooms.length ?
                    escapeRooms.map(({ id, genre, image: _image, name, playersMax, playersMin, priceMax, priceMin, rating }) => {
                        return (<Card
                            key={id}
                            title={name.toUpperCase()}
                            rating={rating}
                            escapeId={id}
                            people={`${playersMin}-${playersMax}`}
                            genre={genre} price={`${priceMin}-${priceMax}€`} image={{ uri: _image }}
                            participated={!guest && escapes.participated.includes(id)}
                            pending={!guest && escapes.pending.includes(id)}
                            favorites={!guest && escapes.favorites.includes(id)}
                            onEscapes={!guest ? handleEscapeLists : () => { }}
                            guest={guest}
                        />)
                    })
                    :
                    <Text></Text>
                }
            </ScrollView>
            {error && <Feedback error={error} />}

        </SafeAreaView>
    )
}