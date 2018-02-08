import React from 'react';
import classes from './Order.css';

const order = (props) => {
    const ingredients = [];
    for (let igName in props.ingredients){
        ingredients.push({name: igName, amount: props.ingredients[igName]});
    }
    
    const newIngredients = ingredients.map(newIg => {
        return <span 
                    style={{ 
                        textTransform: 'capitalize',
                        display: 'inline-block',
                        margin: '0 5px',
                        padding: '5px',
                        border: '1px solid #ccc'}}
                    key={newIg.name}>{newIg.name} ({newIg.amount}) </span>
    })

    return (
        <div className={classes.Order}>
            <p>Ingredients: {newIngredients} </p>
            <p>Price: <strong>{props.price.toFixed(2)}</strong> </p>
            
        </div>

    )
};

export default order;