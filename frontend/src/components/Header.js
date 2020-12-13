import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'

class Header extends Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)
        return (
          <div className="d-flex flex-row header">
          {authToken && 
            (<Link to="/home" className="p-2 header-title no-underline black">
                Howie's Music WebApp
            </Link>)
          }
          {!authToken && 
            (
              <div className="p-2 header-title no-underline black">
                Howie's Music WebApp
              </div>
            )
          }
            {authToken && 
            (<div className="p-2">
              <Link to="/home" className="p-2 ml1 no-underline black">
                home
              </Link>
              <Link to="/search" className="p-2 ml1 no-underline black">
                search
              </Link>
              <Link to="/create" className="p-2 ml1 no-underline black">
                submit
              </Link>
            </div>
            )}
            <div className="p-2 ml-auto">
              {authToken ? (
                <div
                  className="ml1 pointer black"
                  onClick={() => {
                    localStorage.removeItem(AUTH_TOKEN)
                    this.props.history.push(`/`)
                  }}
                >
                  logout
                </div>
              ) : (
                <Link to="/login" className="ml1 no-underline black">
                  login
                </Link>
              )}
            </div>
          </div>
        )
      }
    }

export default withRouter(Header)