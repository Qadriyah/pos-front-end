const api = new API('http://localhost:5000/api/v1');
const category = document.getElementById('category');
const fform = document.getElementById('fform');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');

api.get('/products/category/' + Number(localStorage.cid)).then(data => {
  const { users } = data;
  if (users) {
    category.value = users[0].category_name;
  }
});

if (fform) {
  fform.addEventListener('submit', event => {
    event.preventDefault();
    const category_id = localStorage.cid;
    const category_name = category.value;
    errors.innerHTML = spinner;
    api
      .update('/products/category/edit/' + Number(category_id), {
        category_name
      })
      .then(data => {
        const { msg } = data;
        localStorage.removeItem("cid");
        errors.style = 'color: red; padding: 10px;';
        if (msg === 'Category does not exist' || msg === 'Failure') {
          errors.innerHTML = msg;
        } else if (msg === 'Success') {
          window.location.href = 'category.html';
        } else {
          errors.innerHTML = 'Some fields are missing';
        }
      });
  });
}
