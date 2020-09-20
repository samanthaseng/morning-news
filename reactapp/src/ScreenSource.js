import React,{useState, useEffect} from 'react';
import {Link, Redirect} from 'react-router-dom';
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'

import {connect} from 'react-redux';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  var frBorder;
  var enBorder;
  if (selectedLanguage === 'fr') {
    frBorder = '2px solid #ffffff';
    enBorder = '';
  } else {
    frBorder = '';
    enBorder = '2px solid #ffffff';
  }

  useEffect(() => {
    const loadData = async() => {
      var rawResponse = await fetch('/user-informations', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `tokenFromFront=${props.token}`
      })
      var response = await rawResponse.json();
      setSelectedLanguage(response.language);

      var wishlistData = await fetch(`/wishlist?tokenFromFront=${props.token}`);
      wishlistData = await wishlistData.json();
      props.getWishlist(wishlistData.wishlist);
    }
    loadData();
  }, [])

  useEffect(() => {
    async function loadData(){
      var rawResponse = await fetch(`https://newsapi.org/v2/sources?country=${selectedLanguage}&apiKey=9b8f941c03494d18bbea85de09105201`);
      var response = await rawResponse.json();
	  setSourceList(response.sources);
	  
	  await fetch('/update-language', {
		method: 'POST',
		headers: {'Content-Type':'application/x-www-form-urlencoded'},
		body: `tokenFromFront=${props.token}&languageFromFront=${selectedLanguage}`
	  })
    }
    loadData();

  }, [selectedLanguage]);

  if (props.token === null) {
    return <Redirect to="/" />
  } else {
    return (
      <div>
        <Nav/>
         
        <div className="Banner" style={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>
          <img src="./images/fr-flag.png" onClick={() => setSelectedLanguage('fr')} style={{width: '50px', height: '50px', marginRight: '5px', marginLeft: '5px', cursor: 'pointer', border: frBorder}} />
          <img src="./images/uk-flag.png" onClick={() => setSelectedLanguage('gb')} style={{width: '50px', height: '50px', marginRight: '5px', marginLeft: '5px', cursor: 'pointer', border: enBorder}} />
        </div>

        <div className="HomeThemes">
          
          <List
              itemLayout="horizontal"
              dataSource={sourceList}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={`./images/${item.category}.png`} />}
                    title={<Link to={`/screenarticlesbysource/${item.id}`}>{item.name}</Link>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />

          </div>             
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {token: state.token, selectedLang: state.language}
}

function mapDispatchToProps(dispatch){
  return {
    getWishlist: function(wishlist) {
      dispatch( {type: 'getWishlist', wishlist: wishlist} )
    },
    changeLang: function(selectedLang){
      dispatch({type: 'changeLang', selectedLang: selectedLang})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)
