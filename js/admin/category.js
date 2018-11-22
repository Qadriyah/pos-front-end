const api = new API('http://localhost:5000/api/v1');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const fform = document.getElementById('fform');
const pcategories = document.getElementById('categories');

// Get product categories
api.get('/products/category').then(data => {
  const { categories } = data;
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
