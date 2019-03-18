import React, { Component } from 'react'
import axios from '../../../axios-orders'

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.css'
import Input from '../../../components/UI/Input/Input'

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Email'
                },
                value: ''
            }
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true})
        const order = {
            ...this.props.ingredients,
            price: this.props.price,
            customer: {
                name: "Benjamin Juarez",
                email: 'test@test.com'
            }
        }
        axios.post('/orders', order)
            .then(response => {
                this.setState({loading: false})
                this.props.history.push('/')})
            .catch(error => this.setState({loading: false}))
    }

    render = () => {
        const formElementsArray = []
        for(let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
            <form>
                {formElementsArray.map(formElement => (
                    <Input 
                        key = {formElement.id}
                        elementType = {formElement.config.elementType}
                        elementConfig = {formElement.config.elementConfig}
                        value = {formElement.config.value}/>))}
                <Button btnType = "Success" clicked = {this.orderHandler}>ORDER</Button>
            </form>
        );
        if(this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className = {classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;