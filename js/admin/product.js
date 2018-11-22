const api = new API('http://localhost:5000/api/v1');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const bform = document.getElementById('bform');
const select = document.getElementById('category_id');
const pList = document.getElementById('p-list');
const dform = document.getElementById('dform');
const product_menu = document.getElementById('pid');
const stockLevels = document.getElementById('stock-levels');
const fform = document.getElementById('fform');
const pcategories = document.getElementById('categories');

// Get products menu
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
    product_menu.innerHTML = menu;
  }
});

// Get product categories
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

// Get a list of products
api.get('/products').then(data => {
  const { products } = data;
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
              <i class="fas fa-trash-alt trash tooltip" id=${product.id}>
                <span class="tooltiptext">Delete</span>
              </i>
              <i class="fas fa-edit tooltip" id=${product.id}>
                <span class="tooltiptext">Edit</span>
              </i>
            </td>
        </tr>
        `;
      counter++;
    });
    pList.innerHTML = productList;
  }
});

// Add product to database
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
    errors.innerHTML = spinner;
    api.privatePost('/products', newProduct).then(data => {
      const { msg } = data;
      errors.style = 'color: red; padding: 10px;';
      if (msg === 'Success') {
        window.location.href = 'admin-dashboard.html';
      } else if (msg === 'Product already exists' || msg === 'Server error') {
        errors.innerHTML = msg;
      } else {
        errors.innerHTML = 'Some fields are missing';
      }
    });
  });
}

// Delete product from database
const timerId = setInterval(() => {
  const trashIt = document.getElementsByClassName('fa-trash-alt');
  for (let i = 0; i < trashIt.length; i++) {
    trashIt[i].addEventListener('click', event => {
      event.preventDefault();
      const action = confirm('Deleting product...\nDo you want to continue?');
      if (action) {
        const product_id = event.target.id;
        const endpoint = '/products/delete/' + product_id;
        api.deleteItem(endpoint, 'admin-dashboard.html');
      }
    });
  }
}, 1000);

setTimeout(() => {
  clearInterval(timerId);
}, 1000);

// Edit product event listener
const editTimer = setInterval(() => {
  const editIt = document.getElementsByClassName('fa-edit');
  for (let i = 0; i < editIt.length; i++) {
    editIt[i].addEventListener('click', event => {
      event.preventDefault();
      const product_id = event.target.id;
      localStorage.setItem('pid', product_id);
      window.location.href = 'edit-product.html';
    });
  }
}, 1000);

setTimeout(() => {
  clearInterval(editTimer);
}, 1000);

// Add stock item
if (dform) {
  dform.addEventListener('submit', event => {
    event.preventDefault();
    const product_id = document.getElementById('pid').value;
    const quntity = document.getElementById('qty').value;
    const item = {
      product_id: Number(product_id),
      quantity: Number(quntity)
    };
    errors.innerHTML = spinner;
    api.privatePost('/products/stock', item).then(data => {
      const { msg } = data;
      errors.style = 'color: red; padding: 10px;';
      if (msg === 'Success') {
        window.location.href = 'stock.html';
      } else if (
        msg === 'Failure' ||
        msg === 'Quantity should be greater than zero'
      ) {
        errors.innerHTML = msg;
      } else {
        errors.innerHTML = 'Some fields are missing';
      }
    });
  });
}

// Get stock levels
api.get('/products/stock').then(data => {
  const { stock } = data;
  let items = [];
  if (stock) {
    let counter = 1;
    stock.forEach(product => {
      items += `
        <tr>
            <td>${counter}</td>
            <td>${product.product_name}</td>
            <td class="align-center">${product.quantity}</td>
            <td class="align-center">${product.stock_level}</td>
            <td class="align-center">${product.min_quantity}</td>
        </tr>
        `;
      counter++;
    });
    stockLevels.innerHTML = items;
  }
});

// Add product categories
if (fform) {
  fform.addEventListener('submit', event => {
    event.preventDefault();
    category_name = document.getElementById('category').value;
    errors.innerHTML = spinner;
    api.privatePost('/products/category', { category_name }).then(data => {
      const { msg } = data;
      errors.style = 'color: red; padding: 10px;';
      if (msg === 'Success') {
        window.location.href = 'category.html';
      } else if (msg === 'Category already exists' || msg === 'Failure') {
        errors.innerHTML = msg;
      } else {
        errors.innerHTML = 'Some fields are missing';
      }
    });
  });
}
