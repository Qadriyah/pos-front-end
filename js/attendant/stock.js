const api = new API('http://localhost:5000/api/v1');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const stockLevels = document.getElementById('stock-levels');

// Get stock levels
errors.innerHTML = spinner;
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
    errors.innerHTML = null;
    stockLevels.innerHTML = items;
  }
});
