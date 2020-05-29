import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import './App.css';
import {Input, Button} from 'antd';

import {connect} from 'react-redux';

function ScreenHome(props) {
  const [logIn, setLogIn] = useState(false);

  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpErrorMessage, setSignUpErrorMessage] = useState('');

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInErrorMessage, setSignInErrorMessage] = useState('');

  var handleSubmitSignUp = async () => {
    var checkSignUpRaw = await fetch('/sign-up', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `usernameFromFront=${signUpUsername}&emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}`
    })
    var checkSignUp = await checkSignUpRaw.json();

    setSignUpErrorMessage(checkSignUp.errorMessage);

    if (checkSignUp.result === true) {
      props.savingToken(checkSignUp.token);
      setLogIn(true);
    } 
  }

  var handleSubmitSignIn = async () => {
    var checkSignInRaw = await fetch('/sign-in', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `&emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`
    });
    var checkSignIn = await checkSignInRaw.json();

    setSignInErrorMessage(checkSignIn.errorMessage);

    if (checkSignIn.result === true) {
      props.savingToken(checkSignIn.token);
      setLogIn(true);
    }
  }

  if (logIn === true) {
    return (
      <Redirect to='/screensource' />
    )
  } else {
    return (
      <div className="Login-page" >
  
            {/* SIGN-IN */}
            <div className="Sign">     
              <Input className="Login-input" placeholder="Email" onChange={(e) => setSignInEmail(e.target.value)} value={signInEmail} required="required" />
              <Input.Password className="Login-input" placeholder="Password" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
              {signInErrorMessage}
              <Button onClick={() =>handleSubmitSignIn()} style={{width:'80px'}} type="primary">Sign-in</Button>
            </div>
  
            {/* SIGN-UP */}
            <div className="Sign">       
              <Input className="Login-input" placeholder="Username" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
              <Input className="Login-input" placeholder="Email" onChange={(e) => setSignUpEmail(e.target.value)} value={signUpEmail} />
              <Input.Password className="Login-input" placeholder="Password" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
              {signUpErrorMessage}
              <Button onClick={() => handleSubmitSignUp()} style={{width:'80px'}} type="primary">Sign-up</Button>
            </div>
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    savingToken: function(token) {
      dispatch( {type: 'storeToken', token: token} )
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
) (ScreenHome);
