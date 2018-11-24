const api = new API('http://localhost:5000/api/v1');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const productList = document.getElementById('product');
const cart = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');
const tbody = document.getElementById('tbody');

// Get a product menu
api.get('/products').then(data => {
  const { products } = data;
  let menu;
  if (products) {
    menu = products.map((product, key) => {
      return `
                <option key=${key} value=${product.id}>${
        product.product_name
      }</option>
            `;
    });
    productList.innerHTML = menu;
  }
});

// Display cart items
errors.innerHTML = spinner;
api.get('/sales/cart').then(data => {
  const { cart, msg } = data;
  let items = [];
  if (msg === 'Success') {
    let total = 0;
    cart.forEach(item => {
      total += item.total;
      items += `
            <tr>
                <td>${item.product_name}</td>
                <td class="align-center">${item.quantity}</td>
                <td class="align-right">${item.unit_price.toLocaleString()}</td>
                <td class="align-right">${item.total.toLocaleString()}</td>
                <td class="align-center">
                <i class="fas fa-trash-alt trash tooltip" id=${item.id}>
                    <span class="tooltiptext">Delete</span>
                </i>
                </td>
            </tr>
            `;
    });
    items += `
        <tr class='totals'>
            <td colspan='3'>Total</td>
            <td>${total.toLocaleString()}</td>
            <td class="align-center">
                <i class="fas fa-check-circle tooltip">
                    <span class="tooltiptext">Create</span>
                </i>
            </td>
        </tr>
    `;
    errors.innerHTML = null;
    tbody.innerHTML = items;
    cartItems.classList.remove('hide-contents');
  } else {
    errors.style = 'color: red; padding: 10px;';
    errors.innerHTML = msg;
  }
});

// Add items to the shopping cart
if (cart) {
  cart.addEventListener('submit', event => {
    event.preventDefault();
    const pid = document.getElementById('product').value;
    const qty = document.getElementById('qty').value;
    const cartItem = {
      product_id: Number(pid),
      quantity: Number(qty)
    };
    errors.innerHTML = spinner;
    api.privatePost('/sales/cart', cartItem).then(data => {
      const { cart, msg } = data;
      let items = [];
      if (msg === 'Success') {
        let total = 0;
        cart.forEach(item => {
          total += item.total;
          items += `
            <tr>
                <td>${item.product_name}</td>
                <td class="align-center">${item.quantity}</td>
                <td class="align-right">${item.unit_price.toLocaleString()}</td>
                <td class="align-right">${item.total.toLocaleString()}</td>
                <td class="align-center">
                <i class="fas fa-trash-alt trash tooltip" id=${item.id}>
                    <span class="tooltiptext">Delete</span>
                </i>
                </td>
            </tr>
            `;
        });
        items += `
            <tr class='totals'>
                <td colspan='3'>Total</td>
                <td>${total.toLocaleString()}</td>
                <td class="align-center">
                    <i class="fas fa-check-circle tooltip">
                        <span class="tooltiptext">Create</span>
                    </i>
                </td>
            </tr>
        `;
        errors.innerHTML = null;
        tbody.innerHTML = items;
        cartItems.classList.remove('hide-contents');
      } else {
        errors.style = 'color: red; padding: 10px;';
        errors.innerHTML = msg;
      }
    });
  });
}

// Delete user from database
const timerId = setInterval(() => {
  const trashIt = document.getElementsByClassName('fa-trash-alt');
  for (let i = 0; i < trashIt.length; i++) {
    trashIt[i].addEventListener('click', event => {
      event.preventDefault();
      const action = confirm('Deleting Cart Item...\nDo you want to continue?');
      if (action) {
        const cart_id = Number(event.target.id);
        const endpoint = '/sales/cart/delete/' + cart_id;
        api.deleteItem(endpoint, 'attendant-dashboard.html');
      }
    });
  }
}, 1000);

setTimeout(() => {
  clearInterval(timerId);
}, 1000);
