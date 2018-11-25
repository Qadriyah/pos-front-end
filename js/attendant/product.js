const api = new API('http://localhost:5000/api/v1');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const productList = document.getElementById('product');
const productView = document.getElementById('pview');

// Get product list
errors.innerHTML = spinner;
api.get('/products').then(data => {
  const { msg, products } = data;
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

// Get
