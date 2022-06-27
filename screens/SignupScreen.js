import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';

import { createUser } from '../util/auth';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      if (error.response.data.error.message === 'EMAIL_EXISTS'){
        showAlert('The email entered is registered. Please proceed to login screen')
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
      <LoadingOverlay message="Creating User..." />
    );
  }

  return (
    <AuthContent onAuthenticate={signupHandler} />
  );
}

export default SignupScreen;