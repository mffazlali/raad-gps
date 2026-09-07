import LoginPage from '../../features/auth/login/LoginPage'
import {render} from 'test-utils'
import {fireEvent, waitFor} from '@testing-library/react'
import {act} from 'react-dom/test-utils'
import {AuthService} from '../../common/services/authService'

describe('login Page', () => {
  let container: HTMLElement
  const authServiceMock = {Login: jest.fn()}
  const setUserMock = jest.fn()
  const navigateMock = jest.fn()
  beforeAll(() => {
    console.log('before all')
  })

  beforeEach(() => {
    console.log('before each')
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    console.log('after each')
    document.body.removeChild(container)
    container.remove()
    jest.clearAllMocks()
  })

  afterAll(() => {
    console.log('after all')
  })

  test('render correctly initial document', () => {
    const {baseElement} = render(<LoginPage />)
    const title = document.querySelector('h2')
    expect(baseElement).toBeTruthy()
    expect(title!.textContent).toBe('اطلاعات کاربری خود را وارد کنید')
    const inputs = document.querySelectorAll('input')
    expect(inputs).toHaveLength(3)
  })

  test('pass credentials correctly', () => {
    render(<LoginPage />)
    const inputs = document.querySelectorAll('input')
    const loginInput = inputs[0]
    const passwordInput = inputs[1]
    const loginButton = inputs[2]
    act(() => {
      fireEvent.change(loginInput, {target: {value: 'admin'}})
      fireEvent.change(passwordInput, {target: {value: '123'}})
      fireEvent.click(loginButton)
      expect(navigateMock).toHaveBeenCalledWith('/')
      expect(authServiceMock.Login).toHaveBeenCalledWith('admin', '123', '')
    })

  })

  test('correctly handle login success', () => {
    render(<LoginPage />)
    authServiceMock.Login.mockResolvedValueOnce({email: 'admin', password: '123', code: ''})
    const inputs = document.querySelectorAll('input')
    const loginInput = inputs[0]
    const passwordInput = inputs[1]
    const loginButton = inputs[2]
    act(() => {
      fireEvent.change(loginInput, {target: {value: 'admin'}})
      fireEvent.change(passwordInput, {target: {value: '123'}})
      fireEvent.click(loginButton)
      expect(navigateMock).toHaveBeenCalledWith('/')
      expect(authServiceMock.Login).toHaveBeenCalledWith('admin', '123', '')

    })

  })

})

export {}
