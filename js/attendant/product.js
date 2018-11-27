const api = new API();
const user = api.getUserData(localStorage.jwtToken);
if (user.roles !== 'attendant') {
  window.location.href = '../admin/admin-dashboard.html';
}
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const productList = document.getElementById('product');
const productView = document.getElementById('pview');
const pform = document.getElementById('pform');

// Get product list
errors.innerHTML = spinner;
api.get('/products').then(data => {
  const { msg, products } = data;
  if (msg === 'Token has been revoked') {
    localStorage.removeItem('jwtToken');
    window.location.href = '../index.html';
  }
  if (msg === 'Success') {
    let menu = [
      `<option selected='selected' value='0'>All Products...</option>`
    ];
    let view = [];
    let counter = 1;
    products.forEach(product => {
      menu += `
            <option value=${product.id}>${product.product_name}</option>
          `;
      view += `
        <tr>
            <td>${counter}</td>
            <td>${product.product_name}</td>
            <td>${product.category_name}</td>
            <td class="align-right">${product.product_price.toLocaleString()}</td>
        </tr>
        `;
      counter++;
    });
    errors.innerHTML = null;
    productList.innerHTML = menu;
    productView.innerHTML = view;
  }
});

// Get a specific product
if (pform) {
  pform.addEventListener('submit', event => {
    event.preventDefault();
    const product_id = Number(document.getElementById('product').value);
    errors.innerHTML = spinner;
    api.get('/products/' + product_id).then(data => {
      const { products, msg } = data;
      if (msg === 'Token has been revoked') {
        localStorage.removeItem('jwtToken');
        window.location.href = '../index.html';
      }
      if (msg === 'Success') {
        let view = [];
        let counter = 1;
        products.forEach(product => {
          view += `
            <tr>
                <td>${counter}</td>
                <td>${product.product_name}</td>
                <td>${product.category_name}</td>
                <td class="align-right">${product.product_price.toLocaleString()}</td>
            </tr>
            `;
          counter++;
        });
        errors.innerHTML = null;
        productView.innerHTML = view;
      }
    });
  });
}
