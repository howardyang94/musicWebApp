import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
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
    signUpValid: false
  }
  handleInput(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({[name]: value}, this.validateLogin)
  }
  validateLogin() {
    this.setState({ loginValid: this.state.password.length > 0 && this.state.email.length > 0 }, this.validateSignup)    
  }
  validateSignup() {
    this.setState({ signUpValid: this.state.name.length > 0 && this.state.password.length > 0 && this.state.email.length > 0 })
  }
  render() {
    // if user is already logged in redirect to home page
    if(localStorage.getItem(AUTH_TOKEN)) this.props.history.push('/home')

    const { login, email, password, name, loginValid, signUpValid} = this.state
    return (
        <Container>
        <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
          {!login && (
            <Row>
              <input
                name="name"
                value={name}
                onChange={e => this.handleInput(e)}
                type="text"
                placeholder="Your name"
              />
            </Row>
          )}
          <Row className="search-fields">
          <input
            name="email"
            value={email}
            onChange={e => this.handleInput(e)}
            type="text"
            placeholder="Email Address"
          />
          </Row>
          <Row className="search-fields">
          <input
            name="password"
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
            >
                {mutation => (
                <Button disabled={!loginValid && login || !signUpValid && !login} className="search-button" onClick={mutation}>
                    {login ? 'login' : 'create account'}
                </Button>
                )}
            </Mutation>
          <Button variant="secondary"
            className="pointer button"
            onClick={() => this.setState({ login: !login })}
          >
              {login
                ? 'Need to create an account?'
                : 'Already have an account?'}
          </Button>
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
