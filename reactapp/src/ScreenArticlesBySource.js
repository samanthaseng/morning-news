import React, {useState, useEffect} from 'react';
import { Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import { Card, Icon, Modal } from 'antd';
import './App.css';
import Nav from './Nav'

const { Meta } = Card;

function ScreenArticlesBySource(props) {
  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    async function loadData(){
      var rawResponse = await fetch(`https://newsapi.org/v2/top-headlines?sources=${props.match.params.id}&apiKey=9b8f941c03494d18bbea85de09105201`);
      var response = await rawResponse.json();
      setArticleList(response.articles)
    }
    loadData()
  }, []);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [visible, setVisible] = useState(false);
  
    var showModal = (title, content) => {
      setVisible(true);
      setTitle(title);
      setContent(content);
    };
  
    var handleOk = e => {
      setVisible(false);
    };
  
    var handleCancel = e => {
      setVisible(false);
    };

    var addArticleToDatabase = async function(article) {
      await fetch('/wishlist', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `tokenFromFront=${props.token}&title=${article.title}&content=${article.content}&description=${article.description}&image=${article.urlToImage}`
      })
    }

  var articleTab = articleList.map((article) => {
    return (
      <Card
        style={{ 
          width: 300, 
          margin:'15px', 
          display:'flex',
          flexDirection: 'column',
          justifyContent:'space-between',
        }}
        cover={
          <img alt="article picture" src={article.urlToImage} style={{height:'200px'}} />
        }
        actions={[
          <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title, article.content)} />,
          <Icon type="like" key="ellipsis" onClick={() => {
            props.addToWishList(article.title, article.content, article.description, article.urlToImage);
            addArticleToDatabase(article);
          }} />
        ]}
      >
        <Meta title={article.title} description={article.description} />
      </Card>
    )
  });

  if (props.token === null) {
    return <Redirect to="/" />
  } else {
    return (
      <div>
        <Nav/>

        <div className="Banner"/>
          <div className="Card">
            <div style={{display:'flex',justifyContent:'center', flexWrap:'wrap'}}>
              {articleTab}

              <Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel}>
                {content}
              </Modal>
          </div>
        </div> 
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addToWishList: function(title, content, description, image) {
      dispatch( {type: 'addArticle', likedArticle: {articleTitle: title, articleContent: content, articleDesc: description, articleImage: image}} )
    }
  }
}

function mapStateToProps(state) {
  return {token: state.token}
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ScreenArticlesBySource);
