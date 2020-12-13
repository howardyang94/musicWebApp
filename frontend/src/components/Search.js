import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String, $title: String, $artist: String, $tags: String, $match: String, $desc: String) {
    feed(filter: $filter title: $title artist:$artist tags:$tags match:$match description:$desc) {
      links {
        id
        title
        artist
        tags
        url
        description
        createdAt
        postedBy {
          id
          name
        }
      }
      count
    }
  }
`
class Search extends Component {

  state = {
    links: [],
    filter: '',
    title:'',
    artist:'',
    tags:'',
    match:'',
    desc:'',
    showAdv: false,
    search:false
  }

  render() {
    return (
      <Container>
        <Row className="search-title">
            Search In All Fields
        </Row>
        <Row>
          <Col xs sm md lg xl ="auto">
          <input
            id="search"
            type='text'
            onChange={e => this.setState({ filter: e.target.value })}
          />
          </Col>
          <Col>
            <Button variant="outline-primary" className="button" onClick={() => this.showSearch()}>{this.state.showAdv?'Hide':'Show'} Advanced Search</Button>
          </Col>
        </Row>
        
        {/* {this.state.showAdv && ( */}
        {/* use 'hidden' attribute to persist any data that may be entered */}
          <div id="advancedSearch" hidden={!this.state.showAdv}>
          <hr></hr>
          <Row className="search-title">
            Search By Field
          </Row>

          <Row className="search-fields">
            <Col xs sm = "12" md lg xl ="1">Title</Col>
            <Col>
              <input
                id='title'
                type='text'
                onChange={e => this.setState({ title: e.target.value })}
              />
            </Col>

            <Col xs sm = "12" md lg xl ="1">Artist</Col>
            <Col>
              <input
                id='artist'
                type='text'
                onChange={e => this.setState({ artist: e.target.value })}
              />
            </Col>
          </Row>

          <Row className="search-fields">
            <Col xs sm = "12" md lg xl ="1">Tags</Col>            
            <Col>
              <input
                id='tags'
                type='text'
                onChange={e => this.setState({ tags: e.target.value })}
              />
            </Col>
            
            <Col xs sm = "12" md lg xl ="1">Match</Col>
            <Col>
              <select
                id='match'
                onChange={e => this.setState({ match: e.target.value })}
              >
                <option value="any">Any</option>
                <option value="all">All</option>
              </select>
              <span className="tab">Tags</span>
            </Col>
          </Row>
          
          <Row className="search-fields">
            <Col xs sm = "12" md lg xl ="1">Info</Col>
            <Col>
              <input
                id='description'
                type='textarea'
                onChange={e => this.setState({ desc: e.target.value })}
              />
            </Col>
          </Row>
          </div>
          {/* <Button className="search-button" onClick={() => this._executeSearch()}>Search</Button> */}
          <div className="search-buttons">
            <Button className="search-button" onClick={() => this.executeSearch()}>Search</Button>
            <Button variant="secondary" onClick={() => this.clearSearch()}>Clear</Button>
          </div>
          {this.state.search && this.state.links.length === 0 ? <p>your search returned no results</p>
          : this.state.links.map((link, index) => (
            <Link 
              key={link.id}
              link={link}
              index={index}
              // updateCacheAfterRemove={this._updateCacheAfterRemove}
              />
          ))}
      </Container>
    )
  }
  _updateCacheAfterRemove = (store, remove, linkId) => {
    const data = store.readQuery({ query: FEED_SEARCH_QUERY})
    // remove is Link that is being removed
    const removeIndex = data.feed.links.findIndex(link => linkId === link.id)
    data.feed.links.splice(removeIndex, 1)

    store.writeQuery({ query: FEED_SEARCH_QUERY, data })
}
  showSearch() {
    this.setState({showAdv: !this.state.showAdv})
  }
  clearSearch() {
    document.getElementById('search').value = ''
    // will not clear advanced fields if they are not shown
    if(this.state.showAdv) {
        document.getElementById('title').value = ''
        document.getElementById('artist').value = ''
        document.getElementById('tags').value = ''
        document.getElementById('match').value = 'any'
        document.getElementById('description').value = ''
    }
  }

  executeSearch = async () => {
    const { filter, title, artist, tags, match, desc } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter, title, artist, tags, match, desc },
    })
    const links = result.data.feed.links
    this.setState({ links, search: true})
  }
}

export default withApollo(Search)