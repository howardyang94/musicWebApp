import React, { Component } from 'react'
import CreateLink from './CreateLink'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Media from 'react-bootstrap/Media'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle'
import { AUTH_TOKEN } from '../constants'
// import { timeDifferenceForDate } from '../utils'
const DELETE_MUTATION = gql`
mutation DeleteMutation($id: ID!) {
    remove(id: $id){
        id
        title
        artist
        tags
        description
        url
        postedBy {
            name
        }
        createdAt
    }
}
`
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      className="dropdownToggle"
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#8942;
    </button>
  ));
const timeOptions = {
    weekday: 'long',
    year:'numeric',
    month:'long',
    day:'numeric',
    hour:'numeric',
    minute:'numeric',
    // second:'numeric'
}

class Link extends Component {   
    state = {
        edit: false,
        showPosted: true,
        showDeleteModal: false,
        error:''
    }
    
    deleteModal() {
        const id = this.props.link.id
        const handleClose = () => this.setState({showDeleteModal: false});
        const handleShow = () => this.setState({showDeleteModal: true});
    
        return (
          <>
            <span onClick={handleShow}>
              Delete
            </span>
            <Modal
                show={this.state.showDeleteModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.link.title}&ensp;<i>{this.props.link.artist}</i></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this post?  This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Mutation 
                        mutation={DELETE_MUTATION}
                        variables={{id}}
                        update={(store, { data: { remove } }) => {
                            this.props.updateCacheAfterRemove(store, remove, id)
                        }}
                        onError={error => this.handleError(error)}
                    >
                        {deleteMutation => <Button variant="primary" onClick={handleClose, deleteMutation}>Delete</Button>}
                    </Mutation> 
                </Modal.Footer>
            </Modal>
          </>
        );
      }
    editCallback = (data) => {
        this.setState({edit: data})
    }    

    displayTags() {
        let arr = []
        const tagPropArr = this.props.link.tags.split(' ');
        for(let i = 0; i < tagPropArr.length; i++ ) {
            if(i > 0) {
                arr.push(<span key={i}> </span>)
            }
            arr.push(<span key={'tag'+i} className="ma1 pa1  ml0 f7 flex-wrap tag"> {tagPropArr[i]}</span>)
        }
        if(arr.length > 1) {
            return (
                <p className="f6 lh-copy mv0 flex-wrap">{arr}</p>
            )
        }
    }

    youtubePlayer() {
        let youtubeUrl = ''
        const otherUrls = []
        for(let url of this.props.link.url.split(' ')) {
            if(url.includes('youtube.com')) {
                const str = url.slice(url.indexOf('=')+1)
                youtubeUrl = "https://www.youtube.com/embed/" + str + '?showinfo=0&enablejsapi=1&origin=http://localhost:3000'
            } else {
                // validate url?
                otherUrls.push(url)
            }
        }
        if(youtubeUrl) {
            return (
            <iframe 
                id={'yp' + (this.props.index)}
                title={'yp' + (this.props.index)}
                width="440" height="360"
                src={youtubeUrl}
            ></iframe>
            )
        }       
    }
    postedBy() {
        return (
            <div className="f6 lh-copy gray mt3">
                    posted by {this.props.link.postedBy
                    ? this.props.link.postedBy.name
                    : 'Unknown'}{' '} 
                on {new Intl.DateTimeFormat('default', timeOptions).format(this.props.link.createdAt)}
            </div>
        )
    }
    handleError(error) {
        // change error message provided to remove unneccessary text?
        const errorMessage = error.message.substring(error.message.indexOf(':')+1)
        this.setState({formErrors: errorMessage, showDeleteModal: false})
    }
    render() {
        const { id, title, artist, tags, description, url } = this.props.link
        const postedBy = this.state.showPosted ? this.postedBy() : null
        return (
            <Media className="link">
                    <Container hidden = {this.state.edit} fluid="lg">
                        <Row>
                            <div className="error">
                                {this.state.formErrors}
                            </div>
                        </Row>   
                        <Row xs={1} s={1} md={1} lg={2} xl={2}>
                            <Col xs sm = "12" md lg xl="5">
                                {this.youtubePlayer()}
                            </Col>
                            <Col xs sm = "12" md lg xl="auto">
                                <h1 className="title">{this.props.link.title}</h1>
                                <h2 className="artist">{this.props.link.artist} </h2>
                                <p className="description">
                                    {this.props.link.description}
                                </p>
                                {this.displayTags()}
                                {postedBy}
                            </Col>
                            <Col xs sm ={{span: 'auto', order:'first'}} md lg xl={{span: 'auto', order:'last'}}>
                            {localStorage.getItem(AUTH_TOKEN) && (<Dropdown>
                                    <DropdownToggle  as={CustomToggle}/>
                                    <Dropdown.Menu className="dropdownMenu">
                                        <Dropdown.Item as="button" className="dropdownItem" onClick={() => this.setState({edit: !this.state.edit})}>
                                            Edit
                                        </Dropdown.Item>                
                                        <Dropdown.Item as="button" className="dropdownItem" >
                                            {this.deleteModal()}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>)}
                            </Col>
                        </Row>
                    
                </Container>
                {this.state.edit && 
                    <CreateLink
                        id={id}
                        title={title}
                        artist={artist}
                        description={description}
                        tags={tags}
                        url={url}
                        editCallback={this.editCallback}
                    />
                }
            </Media>
        )
    }
}

export default Link