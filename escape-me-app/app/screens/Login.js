import React, { useState } from "react";
import {
    StyleSheet,
    View,
    ImageBackground,
    Image,
} from "react-native";
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppButton from '../components/AppButton'
import AppTextInput from '../components/AppTextInput'
import Feedback from '../components/Feedback'
import { loginUser } from 'escape-me-client-logic'

const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(8).label('Password')
})

export default function Login({ onRegister, onHome, handleGuest }) {
    const [error, setError] = useState()

    function handleLogin(values) {
        const { email, password } = values
        try {
            return loginUser(email, password)
                .then(() => onHome())
                .catch(error => setError(error.message))
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <ImageBackground style={styles.container} source={require('../assets/puzzle.jpg')}>
            <Image style={styles.logo} source={require('../assets/logo.svg')}></Image>
            <Formik initialValues={{ email: '', password: '' }}
                onSubmit={(values) => handleLogin(values)}
                validationSchema={validationSchema}>
                {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
                    <>
                        <View style={styles.buttonsContainer}>
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

                            <AppButton title="Login" onPress={handleSubmit} />

                            {error && <Feedback error={error} />}
                            <AppButton style={styles.register} title='Register' color='#4ecdc4' onPress={onRegister} />
                            <AppButton title='Join as a Guest' color='#47d7' onPress={handleGuest} />

                        </View>
                    </>
                )}
            </Formik>

        </ImageBackground >
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
        marginTop: 50,
        marginBottom: 20
    },
    register: {
        position: 'absolute',
        bottom: 10
    }
});