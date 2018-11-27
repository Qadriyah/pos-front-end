const api = new API();
const user = api.getUserData(localStorage.jwtToken);
if (user.roles !== 'admin') {
  window.location.href = '../attendant/attendant-dashboard.html';
}
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const fform = document.getElementById('fform');
const pcategories = document.getElementById('categories');

// Get product categories
api.get('/products/category').then(data => {
  const { categories, msg } = data;
  if (msg === 'Token has been revoked') {
    localStorage.removeItem('jwtToken');
    window.location.href = '../index.html';
  }
  let product_categories = [];
  if (categories) {
    let counter = 1;
    categories.forEach(category => {
      product_categories += `
        <tr>
            <td>${counter}</td>
            <td>${category.category_name}</td>
            <td class="align-center">
                <i class="fas fa-trash-alt trash tooltip" id=${category.id}>
                    <span class="tooltiptext">Delete</span>
                </i>
                <i class="fas fa-edit tooltip" id=${category.id}>
                    <span class="tooltiptext">Edit</span>
                </i>
            </td>
        </tr>
        `;
      counter++;
    });
    pcategories.innerHTML = product_categories;
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
      if (msg === 'Token has been revoked') {
        localStorage.removeItem('jwtToken');
        window.location.href = '../index.html';
      }
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

// Delete product categories
const categoryId = setInterval(() => {
  const trashIt = document.getElementsByClassName('fa-trash-alt');
  for (let i = 0; i < trashIt.length; i++) {
    trashIt[i].addEventListener('click', event => {
      event.preventDefault();
      const action = confirm('Deleting category...\nDo you want to continue?');
      if (action) {
        const category_id = event.target.id;
        const endpoint = '/products/category/delete/' + category_id;
        api.deleteItem(endpoint, 'category.html');
      }
    });
  }
}, 1000);

setTimeout(() => {
  clearInterval(categoryId);
}, 1000);

// Edit product event listener
const editTimer = setInterval(() => {
  const editIt = document.getElementsByClassName('fa-edit');
  for (let i = 0; i < editIt.length; i++) {
    editIt[i].addEventListener('click', event => {
      event.preventDefault();
      const category_id = event.target.id;
      localStorage.setItem('cid', category_id);
      window.location.href = 'edit-category.html';
    });
  }
}, 1000);

setTimeout(() => {
  clearInterval(editTimer);
}, 1000);
