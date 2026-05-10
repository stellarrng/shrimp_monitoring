// TODO: replace with Cognito/OAuth session

export const mockUser = {
  farmName: 'Coastal Hatchery Labs',
  email: 'ops@shrimp-monitor.local',
  emailAlerts: true,
  browserNotifications: false,
}

export function getCurrentUser() {
  return mockUser
}
