import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

function housePathFromNotification(notification: Notifications.Notification) {
  const href = notification.request.content.data?.href
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') ? href : ''
}

export function pathFromNotificationResponse(response: Notifications.NotificationResponse | null) {
  if (!response) return ''
  return housePathFromNotification(response.notification)
}

export async function setHouseBadge(count: number) {
  await Notifications.setBadgeCountAsync(Math.max(0, count)).catch(() => undefined)
}

export async function registerHousePush() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('word', {
      name: 'Word from the house',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#1B1714',
    })
    await Notifications.setNotificationChannelAsync('plate', {
      name: 'This week’s still',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#1B1714',
    })
    await Notifications.setNotificationChannelAsync('left', {
      name: 'A cut has left',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#1B1714',
    })
  }

  const existing = await Notifications.getPermissionsAsync()
  let status = existing.status
  if (status !== 'granted') {
    const asked = await Notifications.requestPermissionsAsync()
    status = asked.status
  }
  if (status !== 'granted') return ''

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId
  if (!projectId) return ''

  const token = await Notifications.getExpoPushTokenAsync({ projectId })
  return token.data
}
