import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Landing from './app/screens/Landing'
import Login from './app/screens/Login'
import Register from './app/screens/Register'
import Manager from './app/screens/Manager'

import { context, isUserLoggedIn } from 'escape-me-client-logic'

context.storage = AsyncStorage

export default function () {
  console.disableYellowBox = true

  const [view, setView] = useState('landing')
  const [guest, setGuest] = useState(false)

  const handleGuest = () => {
    setGuest(true)
    setView('home')
  }

  const handleGoToLogin = () => {
    setView('login')
  }

  const handleGoToRegister = () => {
    setView('register')
  }

  const handleGoToHome = () => {
    setGuest(false)
    setView('home')
  }

  const handleLogOut = () => {
    (async () => { await AsyncStorage.removeItem('token') })()
    setView('login')
  }

  useEffect(() => {
    (async () => {
      if (await isUserLoggedIn()) {
        setGuest(false)
        setView('home')
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      {view === 'landing' && <Landing onLogin={handleGoToLogin} onRegister={handleGoToRegister} handleGuest={handleGuest} />}
      {view === 'login' && <Login onRegister={handleGoToRegister} onHome={handleGoToHome} handleGuest={handleGuest} />}
      {view === 'register' && <Register onLogin={handleGoToLogin} handleGuest={handleGuest} />}
      {view === 'home' && <Manager onLogOut={handleLogOut} guest={guest} />}
    </View>

  );

}

const styles = StyleSheet.create({
  appheader: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#4ecdc4',
  },
  container: {
    flex: 1
  },
  logOut: {
    position: 'absolute',
    right: 20
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold'
  }
})