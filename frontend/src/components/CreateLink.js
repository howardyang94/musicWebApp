import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import FormErrors from './FormErrors'
import { FEED_QUERY } from './LinkList'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { AUTH_TOKEN } from '../constants'

const POST_MUTATION = gql`
    mutation PostMutation($title: String!, $artist: String!, $tags: String, $description: String, $url: String) {
        post(title: $title, artist: $artist, tags: $tags, description: $description, url: $url) {
            id
            createdAt
            title
            artist
            tags
            description
            url
        }
    }
`
const EDIT_MUTATION = gql`
    mutation EditMutation($id:ID!, $title: String, $artist: String, $tags: String, $description: String, $url: String) {
        edit(id: $id, title: $title, artist: $artist, tags: $tags, description: $description, url: $url) {
            id
            createdAt
            title
            artist
            tags
            description
            url
        }
    }
`

class CreateLink extends Component {
    state = {
        id: this.props.id,
        title: this.props.title || '',
        artist: this.props.artist || '',
        tags: this.props.tags || '',
        description: this.props.description || '',
        url: this.props.url || '',
        titleValid: this.props.id ? true : false,
        artistValid: this.props.id ? true : false,
        formValid: this.props.id ? true : false,
        formErrors: {title:'', artist:''},
        edit: this.props.id ? true : false,
    }
    handleInput(e, req = false) {
        const name = e.target.name
        const value = e.target.value
        if(req) {
            this.setState({ [name]: value })
            this.validateField(name, value.trim())
        } else {
            this.setState({ [name]: value })

        }
    }
    validateField(name, value) {
        let titleValid = this.state.titleValid
        let artistValid = this.state.artistValid
        let formErrors = this.state.formErrors
        switch(name) {
            case 'title':
                titleValid = value === '' ? false : true
                formErrors.title = titleValid ? '' : 'Please enter a Title'
                break;
            case 'artist':
                artistValid = value === '' ? false : true
                formErrors.artist = artistValid ? '' : 'Please enter an Artist'
                break;
            default: 
            //     console.warn('need to create validation case for ', name)
        }
        this.setState({
            titleValid: titleValid,
            artistValid: artistValid,
            formErrors: formErrors,
            formValid: titleValid && artistValid,
        })
    }
    trimTag() {
        document.getElementById('tags').value = document.getElementById('tags').value.trim()
    }

    complete(action) {
        if(action === 'cancel') {
            this.setState({
                id: this.props.id,
                title: this.props.title || '',
                artist: this.props.artist || '',
                tags: this.props.tags || '',
                description: this.props.description || '',
                url: this.props.url || '',
                titleValid: this.props.id ? true : false,
                artistValid: this.props.id ? true : false,
                formValid: this.props.id ? true : false,
                formErrors: {title:'', artist:''},
                edit: this.props.id ? true : false,
            })
        }
        this.props.editCallback(false)
    }

    render () {
        const { id, title, artist, tags, description, url } = this.state
        return(
            <Container className="createLink">
                <div>
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                    <Row>
                        <Col className="edit-link-fieldname" xs sm = "12" md lg = "2" xl = "1">
                            Title
                        </Col>
                        <Col>
                            <input
                                className="item"
                                name="title"
                                value={title}
                                onChange={e => this.handleInput(e, true)}
                                type="text"
                                required
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="edit-link-fieldname" xs sm = "12" md lg = "2" xl = "1">
                            Artist
                        </Col>
                        <Col>
                            <input
                                className="item"
                                name="artist"
                                value={artist}
                                onChange={e => this.handleInput(e, true)}
                                type="text"
                                required
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="edit-link-fieldname" xs sm = "12" md lg = "2" xl = "1">
                            Tags
                        </Col>
                        <Col>
                            <input id="tags"
                                className="item"
                                name="tags"
                                value={tags}
                                onChange={e => this.handleInput(e)}
                                // onBlur={this.trimTag}
                                type="text"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="edit-link-fieldname" xs sm = "12" md lg = "2" xl = "1">
                            Links
                        </Col>
                        <Col>
                            <input
                                className="item"
                                name="url"
                                value={url}
                                onChange={e => this.handleInput(e)}
                                type="text"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="edit-link-fieldname" xs sm = "12" md lg = "2" xl = "1">
                            Info
                        </Col>
                        <Col>
                        <textarea
                            // onInput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
                            className="item"
                            name="description"
                            value={description}
                            onChange={e => this.handleInput(e)}
                            type="text"
                        />
                        </Col>
                    </Row>
                {!this.state.edit && (
                    <Mutation
                        mutation={POST_MUTATION}
                        variables={{title,artist,tags,description,url}}
                        onCompleted={() => this.props.history.push('/home')}
                        update={(store, { data: { post } }) => {
                            post.tags = post.tags.trim()
                            const data = store.readQuery({ query: FEED_QUERY })
                            data.feed.links.unshift(post)
                            store.writeQuery({
                                query: FEED_QUERY,
                                data
                            })
                        }}
                    >
                        {postMutation => <Button className="submit-link" disabled={!this.state.formValid} onClick={this.trimTag, postMutation}>Submit</Button>}
                    </Mutation>
                )}
                {this.state.edit && (
                    <ButtonGroup>
                        <Button variant="outline-secondary" onClick={() => this.complete('close')}>Close</Button>
                        <Button variant="outline-info" onClick={() => this.complete('cancel')}>Discard Changes</Button>
                        <Mutation
                            mutation={EDIT_MUTATION}
                            variables={{id,title,artist,tags,description,url}}
                            onCompleted={() => this.complete('save')}
                        >
                            {editMutation => (
                                <Button variant="primary" 
                                    disabled={!this.state.formValid} 
                                    onClick={editMutation}>
                                    Save
                                </Button>
                            )}
                        </Mutation>
                    </ButtonGroup>
                )}            
            </Container>
        )
    }
}

export default CreateLink