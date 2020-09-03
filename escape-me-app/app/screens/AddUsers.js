import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

import { SearchBar } from 'react-native-elements';
import { searchUsers, retrieveFollowingIds } from 'escape-me-client-logic'

import UserItem from '../components/UserItem'
import Feedback from '../components/Feedback'

export default function ({ navigation }) {
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [following, setFollowing] = useState()
    const [searched, setSearched] = useState(false)
    const [error, setError] = useState()
    let _users

    const handleFollowingIds = async () => {
        const following = await retrieveFollowingIds()
        setFollowing(following)
    }

    useEffect(() => {
        const reload = navigation.addListener('focus', async () => {
            (async () => {
                const following = await retrieveFollowingIds()
                setFollowing(following)
            })()
        });

        // Return the function to reload from the event so it gets removed on unmount
        return reload;
    }, [navigation])

    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <SearchBar
                    searchIcon={false}
                    containerStyle={styles.bar}
                    inputContainerStyle={styles.inputContainer}
                    placeholder="Search Users"
                    onChangeText={text => {
                        setQuery(text)
                    }}
                    value={query}
                    platform="ios"
                />
                <TouchableOpacity>
                    <AntDesign name="search1" size={26} color={'black'}
                        onPress={async () => {
                            try {
                                _users = await searchUsers(query)
                                setUsers(_users)
                                setSearched(true)
                                setError()
                            } catch (error) {
                                setError(true)
                            }
                        }} />
                </TouchableOpacity>
            </View>
            <ScrollView >
                {
                    searched ?
                        users.length ?
                            users.map(({ name, surname, username, id }) => {
                                return (<UserItem key={id}
                                    name={name ? name : ''}
                                    surname={surname ? surname : ''}
                                    email={`@${username}`}
                                    image={require('../assets/user.jpg')}
                                    following={following.includes(id)}
                                    userId={id}
                                    onEscapes={() => { }}
                                    onFollowing={handleFollowingIds}
                                />)
                            })
                            :
                            <Text>No results found.</Text>
                        :
                        <View />
                }
            </ScrollView>
            {error && <Feedback error={'Cannot make an empty search of users.'} />}
        </View>
    )
}

const styles = StyleSheet.create({
    bar: {
        height: 30,
        width: '90%',
        marginBottom: 10
    },
    inputContainer: {
        height: 20,
        borderRadius: 50,
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    container: {
        padding: 20
    }
})