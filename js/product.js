const api = new API('http://localhost:5000/api/v1');
const spinner = '<img src="../media/loader.gif" style="width: 50px" />';
const errors = document.getElementById('errors');
const bform = document.getElementById('bform');
const select = document.getElementById('category_id');
const pList = document.getElementById('p-list');

api.get('/products/category').then(data => {
  const { categories } = data;
  let dropdown;
  if (categories) {
    dropdown = categories.map((category, key) => {
      return `
        <option key=${key} value=${category.id}>${
        category.category_name
      }</option>
    `;
    });
    select.innerHTML = dropdown;
  }
});

api.get('/products').then(data => {
  const { msg, products } = data;
  let productList = [];
  if (products) {
    let counter = 1;
    products.forEach(product => {
      productList += `
        <tr>
            <td>${counter}</td>
            <td>${product.product_name}</td>
            <td>${product.category_name}</td>
            <td class="align-right">${product.product_price.toLocaleString()}</td>
            <td class="align-center">
              <i class="fas fa-trash-alt trash tooltip">
                <span class="tooltiptext">Delete</span>
              </i>
              <a href="edit-product.html">
                <i class="fas fa-edit tooltip">
                  <span class="tooltiptext">Edit</span>
                </i>
              </a>
            </td>
        </tr>
        `;
      counter++;
    });
    pList.innerHTML = productList;
  }
});

if (bform) {
  bform.addEventListener('submit', event => {
    event.preventDefault();
    const category_id = document.getElementById('category_id').value;
    const product_name = document.getElementById('product_name').value;
    const product_price = document.getElementById('product_price').value;
    const newProduct = {
      category_id: Number(category_id),
      product_name,
      product_price: Number(product_price)
    };
    console.log(newProduct);
    errors.innerHTML = spinner;
    api.privatePost('/products', newProduct).then(data => {
      const { msg, product } = data;
      errors.style = 'color: red; padding: 10px;';
      if (msg === 'Success') {
        window.location.href = 'admin-dashboard.html';
      } else if (msg === 'Product already exists' || msg === 'Server error') {
        errors.innerHTML = msg;
      } else {
        console.log(msg);
        errors.innerHTML = 'Some fields are missing';
      }
    });
  });
}
