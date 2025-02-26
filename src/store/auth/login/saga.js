import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
// import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  // postFakeLogin,
  postJwtLogin,
  // postSocialLogin,
} from "../../../helpers/fakebackend_helper";

function* loginUser({ payload: { user, history } }) {
  try {
    // if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
    //   const fireBaseBackend = getFirebaseBackend();
    //   const response = yield call(
    //     fireBaseBackend.loginUser,
    //     user.email,
    //     user.password
    //   );
    //   if (response) {
    //     yield put(loginSuccess(response));
    //     history('/dashboard');
    //   } else {
    //     yield put(apiError(response));
    //   }
    // } 
    
    if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      });
      //save response to sesseion storage
      console.log(JSON.stringify(response))
      sessionStorage.setItem("authUser", JSON.stringify(response));
      if (response) {
        yield put(loginSuccess(response));
        history('/');
      } else {
        yield put(apiError(response));
      }
    } 
    
    // else if (process.env.REACT_APP_API_URL) {
    //   const response = yield call(postFakeLogin, {
    //     email: user.email,
    //     password: user.password,
    //   });
    //   if (response.status === "success") {
    //     yield put(loginSuccess(response));
    //     history('/dashboard');
    //     sessionStorage.setItem("authUser", JSON.stringify(response));
    //   } else {
    //     yield put(apiError(response));
    //   }
    // }

  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser() {
  try {
    sessionStorage.removeItem("authUser");
    // if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
    //   const fireBaseBackend = getFirebaseBackend();
    //   const response = yield call(fireBaseBackend.logout);
    //   yield put(logoutUserSuccess(LOGOUT_USER, response));
    // } else {
    yield put(logoutUserSuccess(true));
    // }
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

// function* socialLogin({ payload: { data, history, type } }) {
//   try {
//     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//       const fireBaseBackend = getFirebaseBackend();
//       const response = yield call(fireBaseBackend.socialLoginUser, type);
//       if (response) {
//         history("/dashboard");
//       } else {
//         history("/login");
//       }
//       sessionStorage.setItem("authUser", JSON.stringify(response));
//       yield put(loginSuccess(response));
//     } else {
//       const response = yield call(postSocialLogin, data);
//       sessionStorage.setItem("authUser", JSON.stringify(response));
//       yield put(loginSuccess(response));
//     }
//     history('/dashboard');
//   } catch (error) {
//     yield put(apiError(error));
//   }
// }

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  // yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
