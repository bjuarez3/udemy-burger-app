import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}

export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    }
}

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart())
        axios.post('/login',{
            email: email,
            password: password
        })
        .then(res => {
            console.log(res)
            dispatch(authSuccess())
        })
        .catch(err => {
            console.log(err)
            dispatch(authFailed(err))
        })
    }
}