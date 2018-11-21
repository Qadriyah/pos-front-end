const api = new API('http://localhost:5000/api/v1');
const select = document.getElementById('category_id');

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
