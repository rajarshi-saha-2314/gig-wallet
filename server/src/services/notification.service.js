// TODO: hook up to an actual delivery channel (email/push) once notification
// requirements are defined.
export function notifyOverspend(user, details) {
  console.log(`[notification] ${user.email} overspend alert:`, details);
}
