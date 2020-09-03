import React, { useState } from "react";
import {
    StyleSheet,
    View,
    ImageBackground,
} from "react-native";
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppButton from '../components/AppButton'
import AppTextInput from '../components/AppTextInput'
import Feedback from '../components/Feedback'
import { registerUser } from 'escape-me-client-logic'

const validationSchema = Yup.object().shape({
    username: Yup.string().required().label('Username'),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(8).label('Password')
})

export default function Register({ onLogin, handleGuest }) {
    const [error, setError] = useState()

    function handleRegister(values) {
        const { name, surname, username, email, password } = values
        try {
            return registerUser(name, surname, username, email, password)
                .then(() => onLogin())
                .catch(error => setError(error.message))
        } catch ({ message }) {
            setError(message)
        }
    }

    return (
        <ImageBackground style={styles.container} source={require('../assets/puzzle.jpg')}>
            <View style={styles.buttonsContainer}>
                <Formik
                    initialValues={{ name: '', surname: '', username: '', email: '', password: '' }}
                    onSubmit={(values) => handleRegister(values)}
                    validationSchema={validationSchema}>
                    {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
                        <>
                            <AppTextInput placeholder="Name"
                                onChangeText={handleChange('name')} />
                            <AppTextInput placeholder="Surname"
                                onChangeText={handleChange('surname')} />
                            <AppTextInput placeholder="Username" autoCapitalize="none"
                                onChangeText={handleChange('username')}
                            />
                            {touched.username && <Feedback error={errors.username} />}
                            <AppTextInput placeholder="Email" icon="email" autoCapitalize="none"
                                keyboardType="email-address" textContentType="emailAddress"
                                onChangeText={handleChange('email')}
                                onBlur={() => setFieldTouched('email')} />
                            {touched.email && <Feedback error={errors.email} />}
                            <AppTextInput placeholder="Password"
                                autoCapitalize="none"
                                autoCorrect={false} icon="lock" secureTextEntry
                                textContentType="password"
                                onChangeText={handleChange('password')}
                                onBlur={() => setFieldTouched('password')} />
                            {touched.password && <Feedback error={errors.password} />}
                            <AppButton style={styles.register} title='Register'
                                color='#4ecdc4' onPress={handleSubmit} />
                        </>
                    )}
                </Formik>
                {error && <Feedback error={error} />}
                <AppButton title="Login" onPress={onLogin}></AppButton>
                <AppButton title='Join as a Guest' color='#47d7' onPress={handleGuest} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        padding: 20,
        width: '100%'
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    logo: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 20
    },
    register: {
        position: 'absolute',
        bottom: 10
    }
});