export interface PresentationResponse {
    statusCode: number
    body?: any
}

export interface PresentationRequest {
    request?: {
      verb: string
      path: string
      route: string
    }
    body?: any
    query?: any
    params?: any
    headers?: any
    currentUser?: string
  }