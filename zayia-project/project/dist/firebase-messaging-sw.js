// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

// Get Firebase config from localStorage (set by main app)
let firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
}

// Try to get real config from localStorage
try {
  const savedIntegrations = localStorage.getItem('zayia_integrations')
  if (savedIntegrations) {
    const integrations = JSON.parse(savedIntegrations)
    const firebaseIntegration = integrations.find(i => i.id === 'firebase')
    
    if (firebaseIntegration && firebaseIntegration.config) {
      firebaseConfig = {
        apiKey: firebaseIntegration.config.api_key,
        authDomain: firebaseIntegration.config.auth_domain,
        projectId: firebaseIntegration.config.project_id,
        storageBucket: firebaseIntegration.config.storage_bucket,
        messagingSenderId: firebaseIntegration.config.messaging_sender_id,
        appId: firebaseIntegration.config.app_id
      }
    }
  }
} catch (error) {
  console.log('Using default Firebase config')
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message received:', payload)
  
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/zayia-icon.png',
    badge: '/zayia-icon.png',
    tag: 'zayia-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open-app',
        title: 'Abrir ZAYIA'
      },
      {
        action: 'dismiss',
        title: 'Dispensar'
      }
    ]
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open-app') {
    event.waitUntil(
      clients.openWindow(self.location.origin)
    )
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow(self.location.origin)
    )
  }
})