const api = new API();
const user = api.getUserData(localStorage.jwtToken);
if (user.roles !== 'admin') {
  window.location.href = '../attendant/attendant-dashboard.html';
}
const select = document.getElementById('category_id');
let pname = document.getElementById('product_name');
let pprice = document.getElementById('product_price');
const cform = document.getElementById('cform');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');

api.get('/products/' + Number(localStorage.pid)).then(data => {
  const { products, msg } = data;
  if (msg === 'Token has been revoked') {
    localStorage.removeItem('jwtToken');
    window.location.href = '../index.html';
  }
  if (products) {
    pname.value = products[0].product_name;
    pprice.value = products[0].product_price;
    api.get('/products/category').then(data => {
      const { categories } = data;
      let dropdown = [
        `<option selected='selected' value=${products[0].cid}>${
          products[0].category_name
        }</option>`
      ];
      if (categories) {
        categories.forEach(category => {
          dropdown += `
                <option value=${category.id}>${category.category_name}</option>
            `;
        });
        select.innerHTML = dropdown;
      }
    });
  }
});

if (cform) {
  cform.addEventListener('submit', event => {
    event.preventDefault();
    category_id = select.value;
    product_id = localStorage.pid;
    product_name = pname.value;
    product_price = pprice.value;
    product = {
      category_id: Number(category_id),
      product_name,
      product_price: Number(product_price)
    };
    errors.innerHTML = spinner;
    api.update('/products/edit/' + Number(product_id), product).then(data => {
      const { msg } = data;
      if (msg === 'Token has been revoked') {
        localStorage.removeItem('jwtToken');
        window.location.href = '../index.html';
      }
      errors.style = 'color: red; padding: 10px;';
      localStorage.removeItem('pid');
      if (
        msg === 'Product does not exist' ||
        msg === 'Category does not exist' ||
        msg === 'Failure'
      ) {
        errors.innerHTML = msg;
      } else if (msg === 'Success') {
        window.location.href = 'admin-dashboard.html';
      } else {
        errors.innerHTML = 'Some fields are missing';
      }
    });
  });
}
