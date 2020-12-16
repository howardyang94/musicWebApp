import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
// import { AUTH_TOKEN } from '../constants'

export const FEED_QUERY = gql `
{
  feed (orderBy: {createdAt: desc}){
      links {
        id
        createdAt
        title
        artist
        tags
        url
        description
        postedBy {
          id
          name
        }
      }
      count
  }
}`

class LinkList extends Component {
    _updateCacheAfterRemove = (store, remove, linkId) => {
        const data = store.readQuery({ query: FEED_QUERY})
        // remove is Link that is being removed
        const removeIndex = data.feed.links.findIndex(link => linkId === link.id)
        data.feed.links.splice(removeIndex, 1)
        store.writeQuery({ query: FEED_QUERY, data })
    }
    render() {
        // prevents access to home page unless logged in
        // if(!localStorage.getItem(AUTH_TOKEN)) this.props.history.push('/')
        return (
            <Query query={FEED_QUERY}> 
                {({ loading, error, data, subscribeToMore}) => {
                    if(loading) return <div>Fetching</div>
                    if(error) return <div>Error</div>
                    const linksToRender = data.feed.links
                    window.count = data.feed.count
                    return (
                        <div className="link-list">{linksToRender.map((link, index) => (
                            <Link 
                                key={link.id}
                                link={link}
                                index={index}
                                updateCacheAfterRemove={this._updateCacheAfterRemove}
                                />
                            ))} 
                            <div className="page-bottom "> 
                                <a className="no-underline" href="#top">Back to Top</a>
                            </div>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default LinkList