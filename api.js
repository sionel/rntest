import * as CryptoJS from 'crypto-js';
import {Platform} from 'react-native';

export const getToken = async accessUrl => {
  try {
    const url = `https://api0.wehago.com/get_token/?url=${accessUrl}`;
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    };
    const response = await fetch(url, data);

    return response.json();
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getRK = async userPw => {
  try {
    const date = new Date().getTime();
    const url = `/auth/login/rk/?rand=${date}`;
    const getTokenResult = await getToken(url);
    const encText = url + getTokenResult.cur_date + getTokenResult.token;
    // NOTE 토큰 -> SHA256 -> Base64 String
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        signature,
      },
    };
    const response = await fetch(`https://api0.wehago.com${url}`, data);
    const result = await response.json();

    const key = result.resultData.random_key;
    const encPw = CryptoJS.AES.encrypt(userPw, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    const obj = {
      encPw,
      key,
    };
    return encPw.includes('+') ? getRK(userPw) : obj;
  } catch (err) {
    return false;
  }
};

export const login = async (id, pw) => {
  try {
    const {encPw, key} = await getRK(pw);
    const date = new Date().getTime(); // January 1, 1970 로 부터의 시간 (밀리초)
    const url = `/auth/login/mobile?timestamp=${date}`;
    const getTokenResult = await getToken(url);
    const encText = url + getTokenResult.cur_date + getTokenResult.token;
    // NOTE 토큰 -> SHA256 -> Base64 String
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        signature: signature,
      },
      body: serialize({
        access_type: 'meet',
        access_pass: 'T',
        random_key: key,
        portal_id: id,
        portal_password: encPw,
        login_os: Platform.OS,
        login_device: Platform.OS,
        login_ip: await getIp(),
        login_browser: 'WEHAGO-APP',
        login_type: 'MOBILE',
      }),
    };

    const response = await fetch(`https://api0.wehago.com${url}`, data);
    const result = await response.json();
    return result;
  } catch (err) {
    return {resultCode: null, resultMsg: err};
  }
};

export const serialize = obj => {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(p + '=' + obj[p]);
    }
  return str.join('&');
};

const getIp = async () => {
  try {
    let login_ip = await fetch('https://api.ipify.org?format=json');
    // login_ip = await login_ip.json();
    return login_ip.ip;
  } catch (error) {
    return error;
  }
};
