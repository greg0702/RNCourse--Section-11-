import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';

import { AuthContext } from '../store/auth-context';
import { login } from '../util/auth';

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      if (error.response.data.error.message === 'EMAIL_NOT_FOUND'){
        showAlert('Your email is not found. Please sign up before logging in');
      }else if (error.response.data.error.message === 'INVALID_PASSWORD'){
        showAlert('The password entered is invalid. Please check your entered password');
      }else if (error.response.data.error.message === 'USER_DISABLED'){
        showAlert('Your account is disabled by admin. Please contact admin')
      }
      setIsAuthenticating(false);
    }
  }
  
  function showAlert(errMsg) {
    Alert.alert(
      'Authentication Failed!', 
      `${errMsg} or try again later.`
    );
  }

  if (isAuthenticating) {
    return (
      <LoadingOverlay message="Logging In..." />
    );
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;