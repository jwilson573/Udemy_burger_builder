import React, { Component } from 'react';
import axios from '../../../axios-orders';

import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            zipCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Jon Wilson',
                address: {
                    street: 'TestStreet 1',
                    zipCode: '23421',
                    country: 'United States'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(res => {
                this.setState({ loading: false, checkoutReady: false });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ loading: false, checkoutReady: false })
            })    
        }

    render () {
        let form = (
            <form>
                <input className={classes.Input} type='text' name="name" placeholder="Your Name" />
                <input className={classes.Input} type='email' name="email" placeholder="Your Email" />
                <input className={classes.Input} type='text' name="street" placeholder="Street" />
                <input className={classes.Input} type='text' name="zipcode" placeholder="Zip Code" />
                <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
            </form>
        );
        if (this.state.loading){
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Information:</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;