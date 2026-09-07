import axiosInstance from '../util/axiosConfig'

const SessionService = () => axiosInstance({
  method: 'get',
  url: '/api/session',
})

const LoginService = (email, password, code) => {
  const query = `email=${encodeURIComponent(
    email,
  )}&password=${encodeURIComponent(password)}`
  return axiosInstance({
    method: 'post',
    url: '/api/session',
    withCredentials: true,
    data: new URLSearchParams(
      code.length ? query + `&code=${code}` : query,
    ),
  })
}


const TokenService = (token) => axiosInstance({
  method: 'get',
  url: `/api/session?token=${encodeURIComponent(token)}`,
})

const GenerateTokenService = (expiration) => axiosInstance({
  method: 'post',
  url: '/api/session/token',
  data: new URLSearchParams(`expiration=${expiration}`),
})

const TimestampService = () => axiosInstance({
  method: 'get',
  url: '/api/timestamp/public',
  headers:{'Content-Type': 'application/json'}
})

export const AuthService = {
  SessionService, LoginService, TokenService, GenerateTokenService, TimestampService,
}



