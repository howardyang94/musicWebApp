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
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  }

  render() {
    const { login, email, password, name } = this.state
    return (
        <Container>
        <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
          {!login && (
            <Row>
              <input
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
                type="text"
                placeholder="Your name"
              />
            </Row>
          )}
          <Row className="search-fields">
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Email Address"
          />
          </Row>
          <Row className="search-fields">
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
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
                <Button className="search-button" onClick={mutation}>
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
