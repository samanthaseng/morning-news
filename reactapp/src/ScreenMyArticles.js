import React, {useState, useEffect} from 'react';
import { Redirect} from 'react-router-dom';
import './App.css';
import { Card, Icon, Modal } from 'antd';
import Nav from './Nav'

// Redux
import {connect} from 'react-redux';

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visible, setVisible] = useState(false);

  // Modal
  var showModal = (title, content) => {
    setVisible(true);
    setTitle(title);
    setContent(content);
  };

  var handleOk = e => {
    console.log(e);
    setVisible(false);
  };

  var handleCancel = e => {
    console.log(e);
    setVisible(false);
  };

  if (props.myArticles === null) {
    var wishlistTab = 'No articles';
  } else {
    var wishlistTab = props.myArticles.map((article) => {
      return (
        <Card 
          style={{ width: 300, margin:'15px', display:'flex', flexDirection: 'column', justifyContent:'space-between' }}
          cover={ <img alt="Article image" src={article.articleImage} style={{height:'200px'}} /> }
          actions={[
            <Icon type="read" key="ellipsis2" onClick={() => showModal(article.articleTitle, article.articleContent)} />,
            <Icon type="delete" key="ellipsis" onClick={async () => {
              props.deleteToWishList(article.articleTitle);
              await fetch('/wishlist', {
                method: 'DELETE',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `tokenFromFront=${props.token}&articleTitleFromFront=${article.articleTitle}`
              })
            }} />
          ]}
        >
          <Meta title={article.articleTitle} description={article.articleDesc} />
        </Card>
      )
    })
  }

  if (props.token === null) {
    return <Redirect to="/" />
  } else {
    return (
      <div>
        <Nav/>
        <div className="Banner"/>

        <div className="Card">
          <div style={{display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
            {wishlistTab}

            <Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel}>
              {content}
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { 
    myArticles: state.wishlist,
    token: state.token
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    deleteToWishList: function(title) {
      dispatch( {type: 'deleteArticle', articleTitle: title})
    } 
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);
