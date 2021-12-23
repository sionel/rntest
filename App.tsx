import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import DocumentPicker from 'react-native-document-picker';
import {getRK, login} from './api';

interface messageType {
  id: 'nahago';
  type: string;
  data: {};
}

const App = () => {
  const ref = useRef(null);

  const [isLogin, setIsLogin] = useState(false);
  const [auth, setAuth] = useState({});
  const [id, setId] = useState('sadb0101');
  const [pw, setPw] = useState('3307coo*@*');
  const _handleLogin = () => {
    login(id, pw).then(res => {
      setAuth(res.resultData);
      setIsLogin(true);
    });
  };
  const [message, setMessage] = useState<messageType>({
    data: {},
    id: 'nahago',
    type: '',
  });
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#faf'}}>
      <StatusBar barStyle={'light-content'} />
      <View style={{flexDirection: 'row', height: 50, width: '100%'}}>
        <TouchableOpacity
          style={{flex: 1, backgroundColor: '#055'}}
          onPress={() => {
            ref?.current.postMessage(JSON.stringify(message));
          }}
        />
        <TouchableOpacity
          style={{flex: 1, backgroundColor: '#af5'}}
          // onPress={async () => {}}
        />
      </View>
      {isLogin ? (
        <View style={{flex: 1, backgroundColor: '#faa'}}>
          <WebView
            source={{
              // uri: 'https://gallant-nobel-7d32c8.netlify.app/',
              uri: 'http://localhost:3000/',
            }}
            ref={ref}
            onMessage={e => {
              console.log(e.nativeEvent.data);
            }}
            javaScriptEnabled={true}
            onLoadEnd={() => {
              // const data = {
              //   type: 'auth',
              //   auth,
              // };
              // ref?.current.postMessage(JSON.stringify(data));
            }}
            // onNavigationStateChange={handleWebViewNavigationStateChange}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{margin: 10}}>{'아이디'}</Text>
          <TextInput
            style={{
              margin: 10,
              width: '50%',
              height: 30,
              backgroundColor: '#fff',
            }}
            value={id}
            onChangeText={setId}
          />
          <Text style={{margin: 10}}>{'비밀번호'}</Text>
          <TextInput
            style={{
              margin: 10,
              width: '50%',
              height: 30,
              backgroundColor: '#fff',
            }}
            value={pw}
            onChangeText={setPw}
            secureTextEntry={true}
            onSubmitEditing={_handleLogin}
          />
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#fff',
              borderColor: '#000',
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={_handleLogin}>
            <Text>{'로그인'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;

// const [state, setstate] = useState();
// useEffect(() => {
//   setTimeout(() => {
//     console.log(ref);
//     debugger;
//   }, 1000);
// if (ref !== null) {
//   ref?.current.postMessage('Post message from react native');
// }
// }, []);
// const handleWebViewNavigationStateChange = (newNavState: {
//   url?: string;
//   title?: string;
//   loading?: boolean;
//   canGoBack?: boolean;
//   canGoForward?: boolean;
// }) => {
//   // newNavState looks something like this:
//   // {
//   //   url?: string;
//   //   title?: string;
//   //   loading?: boolean;
//   //   canGoBack?: boolean;
//   //   canGoForward?: boolean;
//   // }
//   const {url} = newNavState;
//   if (!url) return;
//   // handle certain doctypes
//   if (url.includes('.pdf')) {
//     ref.current.stopLoading();
//     // open a modal with the PDF viewer
//   }
//   // one way to handle a successful form submit is via query strings
//   if (url.includes('?message=success')) {
//     ref.current.stopLoading();
//     // maybe close this view?
//   }
//   // one way to handle errors is via query string
//   if (url.includes('?errors=true')) {
//     ref.current.stopLoading();
//   }
//   // redirect somewhere else
//   if (url.includes('google.com')) {
//     const newURL = 'https://reactnative.dev/';
//     const redirectTo = 'window.location = "' + newURL + '"';
//     ref.current.injectJavaScript(redirectTo);
//   }
// };
