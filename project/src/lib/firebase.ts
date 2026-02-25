import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const env = import.meta.env as Record<string, unknown>

const firebaseConfig = {
  apiKey: (env.VITE_FIREBASE_API_KEY as string) || "your-api-key",
  authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN as string) || "zayia-app.firebaseapp.com",
  projectId: (env.VITE_FIREBASE_PROJECT_ID as string) || "zayia-app",
  storageBucket: (env.VITE_FIREBASE_STORAGE_BUCKET as string) || "zayia-app.appspot.com",
  messagingSenderId: (env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || "123456789",
  appId: (env.VITE_FIREBASE_APP_ID as string) || "1:123456789:web:abcdef"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app)

// Request permission and get token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: (env.VITE_FIREBASE_VAPID_KEY as string) || "your-vapid-key"
      })
      
      if (token) {
        console.log('FCM Token:', token)
        // Save token to your backend
        localStorage.setItem('fcm_token', token)
        return token
      }
    } else {
      console.log('Notification permission denied')
      return null
    }
  } catch (error) {
    console.error('Error getting notification permission:', error)
    return null
  }
}

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })