import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';
import { initAdmin } from './admin';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

//--------------------------------------------------------------------

// Update cart
function updateCart(pizza) {
    axios.post('/updateCart', pizza).then(res => {
        // console.log(res);
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            layout: 'bottomLeft',
            text: 'item added to cart'
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            layout: 'topLeft',
            text: 'Something went wrong'
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
        // console.log(pizza);
    })
})

// ----------------------------------------------------------------------


// Remove order placed msg
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

// ---------------------------------------------------------------------

// Update status order
let statusline = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order)

let time = document.createElement('small');

function updateStatus(order) {

    statusline.forEach( (curr) => {
        curr.classList.remove('step-completed')
        curr.classList.remove('current')
    })

    let stepCompleted = true;

    statusline.forEach((curr) => {
        let currstatus = curr.dataset.status;
        if (stepCompleted) {
            curr.classList.add('step-completed')
        }
        if (currstatus === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            curr.appendChild(time)
            if (curr.nextElementSibling) {
                curr.nextElementSibling.classList.add('current')
            }
        }
    })

}

updateStatus(order)

//---------------------------------------------------------------------

// Socket
let socket = io();
initAdmin(socket);

// Join
if (order) {
    socket.emit('join', `order_${order._id}`)  // creating a room
}

let adminPath = window.location.pathname // getting the url
if(adminPath.includes('admin')){
    socket.emit('join', `adminRoom`) // creating a room
}

// control is coming from server.js
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        progressBar: false,
        layout: 'bottomLeft',
        text: 'Order updated'
    }).show();
})
