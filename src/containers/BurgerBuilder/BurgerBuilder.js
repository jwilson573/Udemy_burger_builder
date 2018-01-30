import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

import axios from '../../axios-orders';


const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...};
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        checkoutReady: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-my-burger-72a65.firebaseio.com/ingredients.json')
            .then(res => {
                this.setState({ingredients: res.data })
            })
            .catch(error => {
                this.setState({error: true})
            });
    }


    updatePurchase (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchaseable: sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};

        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchase(updatedIngredients);

    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {...this.state.ingredients};

        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchase(updatedIngredients);

        
    }
    purchaseHandler = () => {
        this.setState({checkoutReady: true});
        console.log("checkoutReady", this.state.checkoutReady);
    }

    purchaseCancelHandler = () => {
        this.setState({checkoutReady: false});
    }

    purchaseContinueHandler = () => {
        // alert('You Continued');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
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
                this.setState({ loading: false, checkoutReady: false })
            })
            .catch(error => {
                this.setState({ loading: false, checkoutReady: false })
            })
    }

    render () {
        const disableInfo = {
            ...this.state.ingredients
        }
        for (let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
        }

        //Logic to display loading spinner or checkout modal
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if(this.state.ingredients){
             burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                    ingAdd={this.addIngredientHandler}
                    ingRemove={this.removeIngredientHandler}
                    disabled={disableInfo}
                    purchaseable={this.state.purchaseable}
                    price={this.state.totalPrice}
                    order={this.purchaseHandler} />
                </Aux>
    
            )
            orderSummary = <OrderSummary 
            orderCancelled={this.purchaseCancelHandler}
            orderContinued={this.purchaseContinueHandler}
            price={this.state.totalPrice}
            ingredients={this.state.ingredients} />

        }
        if (this.state.loading){
            orderSummary = <Spinner />;
        }
        

        return (
            <Aux>
                <Modal show={this.state.checkoutReady} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);