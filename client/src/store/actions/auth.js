import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    }
}

export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    // localStorag.remoteItem('expirationTiem');
    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = '/login'
        if(!isSignup){
            url = '/register'
        }
        axios.post(url,authData)
        .then(res => {
            console.log(res)
            localStorage.setItem('token', res.data.token)
            // localStorage.setItem(expirationDate', response.data.exprirationDate)
            dispatch(authSuccess(res.data.token, res.data.userId))
        })
        .catch(err => {
            console.log(err.response.data)
            dispatch(authFailed(err.response.data.error))
        })
    }
}

export const setAuthRedirect = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}