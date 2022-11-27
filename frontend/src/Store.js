import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
    cart: {
        cartEvents: localStorage.getItem('cartEvents')
        ? JSON.parse(localStorage.getItem('cartEvents'))
        : [],
    },
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
};
function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_EVENT':
            const newEvent = action.payload;
            const existEvent = state.cart.cartEvents.find(
                (event) => event._id === newEvent._id
            );
            const cartEvents = existEvent
                ? state.cart.cartEvents.map((event) =>
                    event._id === existEvent._id ? newEvent : event
                )
                : [...state.cart.cartEvents, newEvent];
                localStorage.setItem('cartEvents', JSON.stringify(cartEvents));
            return { ...state, cart: { ...state.cart, cartEvents } };
        case 'CART_REMOVE_EVENT': {
            const cartEvents = state.cart.cartEvents.filter(
                (event) => event._id !== action.payload._id
            );
            localStorage.setItem('cartEvents', JSON.stringify(cartEvents));
            return { ...state, cart: { ...state.cart, cartEvents } };
        }
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };
        case 'USER_SIGNOUT':
            return {
                ...state,
                userInfo: null,
            };
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children} </Store.Provider>;
}

