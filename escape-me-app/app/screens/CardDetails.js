import React, { Component } from 'react'
import { ImageBackground, StyleSheet, SafeAreaView, View, Text, Linking, Button, TouchableOpacity, ScrollView, Platform, TextInput, KeyboardAvoidingView } from 'react-native'
import { FontAwesome, MaterialIcons, AntDesign, SimpleLineIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating'
import Review from '../components/Review/'
import Feedback from '../components/Feedback'
import { retrieveEscapeRoomDetails, toggleEscapeRoom, retrieveEscapeIds, rateEscapeRoom, retrieveUser, commentEscapeRoom } from 'escape-me-client-logic'

class CardDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            error: undefined,
            escapeRoom: {},
            userLists: {},
            starCount: 0,
            rating: this.props.rate,
            modalVisible: false,
            comment: '',
            reviews: []
        }

    }

    handleToggle(tag) {
        (async () => {
            await toggleEscapeRoom(this.props.escapeId, tag)
            await this.props.onEscapes()
        })()
    }

    componentDidMount() {
        try {
            let escape, lists
            (async () => {
                if (!this.props.guest) {
                    lists = await retrieveEscapeIds()
                    this.setState({ userLists: lists })
                }
                escape = await retrieveEscapeRoomDetails(this.props.escapeId)
                this.setState({ escapeRoom: escape })

                const { reviews } = escape

                this.setState({ reviews })


                if (!this.props.guest) {
                    const { username = '' } = await retrieveUser()

                    reviews.forEach(({ user, rating }) => {
                        if (user.username === username) {
                            this.setState({ starCount: rating })
                        }
                    })
                }
            })()
        } catch (error) {
            this.setState({ error: error.message })
        }

    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
                <ScrollView>
                    <ImageBackground style={styles.image} source={{ uri: this.state.escapeRoom.image }} >
                        {!this.props.guest && <View style={styles.personal}>
                            {this.props.favorites ? <AntDesign name="heart" size={24}
                                color="tomato" style={styles.profile} onPress={() => this.handleToggle('favorites')} />
                                :
                                <SimpleLineIcons name="heart" size={24}
                                    color="tomato" style={styles.profile} onPress={() => this.handleToggle('favorites')} />}
                            {this.props.participated ? <Feather name="check-square" size={24}
                                color="black" style={styles.profile} onPress={() => this.handleToggle('participated')} />
                                :
                                <MaterialIcons name="check-box-outline-blank" size={24}
                                    color="black" style={styles.profile} onPress={() => this.handleToggle('participated')} />}
                            {this.props.pending ? <MaterialIcons name="playlist-add-check" size={24}
                                color="black" style={styles.profile} onPress={() => this.handleToggle('pending')} />
                                :
                                <MaterialIcons name="playlist-add" size={24}
                                    color="black" style={styles.profile} onPress={() => this.handleToggle('pending')} />}
                        </View>}
                        <View style={styles.punctuation}>
                            <Text style={{ fontSize: 18 }}>{this.state.rating}</Text>
                            <MaterialCommunityIcons name="star" size={30} color="#FFD300" />
                        </View>
                    </ImageBackground>
                    <View style={styles.description}>
                        <View style={styles.interaction}>
                            <View style={styles.visit}>
                                <TouchableOpacity activeOpacity={0.8} style={styles.button}>
                                    <Button title='Visit Website' onPress={() => {
                                        (async () => {
                                            await Linking.openURL(this.state.escapeRoom.url)
                                        })()
                                    }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.header}>
                            <Text style={styles.title}>{this.state.escapeRoom.name && this.state.escapeRoom.name.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.introduction}>
                            {this.state.escapeRoom.description}
                        </Text>
                        <View style={styles.details}>
                            <View style={styles.pair}>
                                <Text style={styles.tag}>Difficulty:</Text>
                                <FontAwesome style={styles.icon} name="lock" size={24} color="white" />
                                {this.state.escapeRoom.difficulty > 1 && <FontAwesome style={styles.icon} name="lock" size={24} color="white" />}
                                {this.state.escapeRoom.difficulty > 2 && <FontAwesome style={styles.icon} name="lock" size={24} color="white" />}
                            </View>
                            <View style={styles.pair}>
                                <Text style={styles.tag}>Genre:</Text>
                                <Text style={styles.tag}>{this.state.escapeRoom.genre}</Text>
                            </View>
                            <View style={styles.pair}>
                                <Text style={styles.tag}>Price:</Text>
                                <Text style={styles.tag}>{`${this.state.escapeRoom.priceMin}-${this.state.escapeRoom.priceMax}€`}</Text>
                            </View>
                            <View style={styles.pair}>
                                <Text style={styles.tag}>{`${this.state.escapeRoom.playersMin}-${this.state.escapeRoom.playersMax}`}</Text>
                                <MaterialIcons style={styles.icon} name="people" size={24} color="white" />
                            </View>
                        </View>
                        {!this.props.guest && <View style={styles.rateHeader}>
                            <View style={styles.rate}>
                                <StarRating style={styles.star} starSize={25} maxStars={5}
                                    rating={this.state.starCount} fullStarColor={'yellow'} halfStarColor={'yellow'} emptyStarColor={'yellow'}
                                    selectedStar={rating =>
                                        (async () => {
                                            this.setState({ starCount: rating })
                                            await rateEscapeRoom(this.props.escapeId, Number(rating))
                                            escape = await retrieveEscapeRoomDetails(this.props.escapeId)
                                            this.setState({ rating: escape.rating })
                                            this.props.handleRate(escape.rating)
                                        })()} />
                            </View>
                        </View>}
                        <View style={styles.review}>
                            {
                                this.state.reviews.map(({ rating, comment, user }) => {
                                    if (comment) {
                                        return <Review key={user['username']} username={` @${user['username']}`} comment={comment.message} rating={rating} date={comment.date} />
                                    }
                                })}
                            {!this.props.guest && <View style={styles.commentSection}>
                                <TextInput style={styles.commentInput}
                                    onChangeText={text => this.setState({ comment: text })}
                                    placeholder='Add a comment...'
                                    value={this.state.comment} />
                                <TouchableOpacity style={styles.commentIcon} onPress={() => {
                                    return (async () => {
                                        await commentEscapeRoom(this.props.escapeId, this.state.comment)
                                        escape = await retrieveEscapeRoomDetails(this.props.escapeId)
                                        const { reviews } = escape
                                        this.setState({ reviews })
                                        this.setState({ comment: '' })
                                    })()
                                }}>
                                    <FontAwesome name="send" size={24} color="white" />
                                </TouchableOpacity>
                            </View>}
                        </View>
                    </View>
                </ScrollView>
                {this.state.error && <Feedback error={this.state.error} />}
            </KeyboardAvoidingView>
        );
    }
}

export default CardDetails

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4ecdc4',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        width: '40%',
        marginBottom: 10,
    },
    comment: {
        backgroundColor: '#4ecdc4',
        borderRadius: 20,
        padding: 5
    },
    commentSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    commentInput: {
        backgroundColor: 'white',
        width: '80%',
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    commentIcon: {
        marginRight: 20
    },
    container: {
        backgroundColor: '#f8f4f4'
    },
    description: {
        padding: 20,
    },
    details: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 20,
        backgroundColor: '#4ecdc4',
        width: '100%',
        padding: 5,
        borderRadius: 20
    },
    font: {
        color: 'white'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginHorizontal: 3
    },
    image: {
        width: '100%',
        height: 200,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    interaction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -5
    },
    introduction: {
        fontSize: 16,
        textAlign: 'justify'
    },
    pair: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5
    },
    personal: {
        flexDirection: 'row',
        margin: 10,
        backgroundColor: '#fff',
        width: '40%',
        justifyContent: 'space-around',
        borderRadius: 10
    },
    profile: {
        marginHorizontal: 5
    },
    punctuation: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '20%',
        backgroundColor: 'white',
        width: 'auto',
        borderRadius: 50,
        margin: 10,
        padding: 5
    },
    rate: {
        width: 'auto',
        backgroundColor: '#fc5c65',
        borderRadius: 20,
        marginVertical: 10,
        padding: 5
    },
    rateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    review: {
        backgroundColor: '#fc5c65',
        padding: 5,
        borderRadius: 20,
        marginBottom: 20
    },
    star: {
        color: 'yellow',
    },
    tag: {
        fontSize: 18,
        color: 'white',
        ...Platform.select({
            ios: {
                fontFamily: 'Avenir'
            },
            android: {
                fontFamily: 'Roboto'
            }
        }),
        fontWeight: 'bold',
        marginHorizontal: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fc5c65',
        marginVertical: 5
    },
    visit: {
        width: '100%',
        alignItems: 'center'
    }
})