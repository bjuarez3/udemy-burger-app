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
    localStorage.removeItem('userId')
    // localStorage.remoteItem('expirationTime');
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
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userId', res.data.userId)
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

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token){
            dispatch(logout());
        }
        else {
            // const expirationDate = new Date(localStorage.getItem('expirationDate'))
            const userId = localStorage.getItem('userId')
            dispatch(authSuccess(token, userId))
            // dispatch(checkAuthTimeOut(expirationDate.getSeconds() - new Date().getSeconds()))
        }
    }
}