const api = new API('http://localhost:5000/api/v1');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const productList = document.getElementById('product');
const cart = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');

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
        cart.forEach(item => {
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
        let table = `
            <thead>
                <tr>
                    <th>Product</th>
                    <th class="align-center">Qty</th>
                    <th class="align-right">Unit Price</th>
                    <th class="align-right">Line Total</th>
                    <th class="align-center">Action</th>
                </tr>
            </thead>
            <tbody>${items}</tbody>
        `;
        errors.innerHTML = null;
        cartItems.innerHTML = table;
      } else {
        errors.style = 'color: red; padding: 10px;';
        errors.innerHTML = msg;
      }
    });
  });
}
