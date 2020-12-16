import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class Login extends Component {
  state = {
    login: true, // true == Login and false == SignUp
    email: '',
    password: '',
    name: '',
    loginValid: false,
    signUpValid: false,
    formErrors: ''
  }
  handleInput(e) {
    const name = e.target.id
    const value = e.target.value
    this.setState({[name]: value}, this.validateLogin)
  }
  validateLogin() {
    this.setState({ loginValid: this.state.password.length > 0 && this.state.email.length > 0 }, this.validateSignup)    
  }
  validateSignup() {
    this.setState({ signUpValid: this.state.loginValid && this.state.name.length > 0 })
  }
  handleError(error) {
    // change error message provided to remove unneccessary text?
    const errorMessage = error.message.substring(error.message.indexOf(':')+1)
    this.setState({formErrors: errorMessage})
    document.getElementById('email').value = ''
    document.getElementById('password').value = ''
  }
  render() {
    // if user is already logged in redirect to home page
    if(localStorage.getItem(AUTH_TOKEN)) this.props.history.push('/home')

    const { login, email, password, name, loginValid, signUpValid} = this.state
    return (
      <Container>       
        <Row>
          <h3 className="mv3">{login ? 'Login' : 'Sign Up'}</h3>
        </Row>
        <Row>
          <div className="error">
            {this.state.formErrors}
          </div>
        </Row>   
          {!login && (
            <Row>
              <input
                id="name"
                value={name}
                onChange={e => this.handleInput(e)}
                type="text"
                placeholder="Your name"
              />
          </Row>
        )}
        <Row className="search-fields">
          <input
            id="email"
            value={email}
            onChange={e => this.handleInput(e)}
            type="text"
            placeholder="Email Address"
          />
        </Row>
        <Row className="search-fields">
          <input
            id="password"
            value={password}
            onChange={e => this.handleInput(e)}
            type="password"
            placeholder="Password"
          />
        </Row>
        <Row className="searchButtons search-fields">
            <Mutation
                mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                variables={{ email, password, name }}
                onCompleted={data => this._confirm(data)}
                onError={error => this.handleError(error)}
            >
                {mutation => (
                <Button disabled={(!loginValid && login) || (!signUpValid && !login)} className="search-button" onClick={mutation}>
                    {login ? 'login' : 'create account'}
                </Button>
                )}
            </Mutation>
            <span
            className="no-underline blue pointer ml12 mt10"
            onClick={() => this.setState({ login: !login })}
            >
                {login
                  ? 'Create account'
                  : 'Login to existing account'}
            </span>
        </Row>
      </Container>
    )
  }

  _confirm = async data => {
    const { token } = this.state.login ? data.login : data.signup
    this._saveUserData(token)
    this.props.history.push(`/home`)
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}
export default Login
