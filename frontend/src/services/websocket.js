// TODO: connect to AWS API Gateway WebSocket / IoT Core

/** Placeholder WS manager — no network in mock mode */
export function createShrimpMonitorSocket(/* url, handlers */) {
  return {
    connect() {},
    disconnect() {},
    send() {},
  }
}
