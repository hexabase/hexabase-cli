import EventSource from 'eventsource'

export class SSEClient {
  source: EventSource | null

  constructor(public baseUrl: string) {
    this.source = null
  }

  connect(url: string) {
    this.source = new EventSource(`${this.baseUrl}${url}`)
  }
}
