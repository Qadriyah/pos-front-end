const api = new API('http://localhost:5000/api/v1');
const user = api.getUserData(localStorage.jwtToken);
if (user.roles !== 'attendant') {
  window.location.href = '../admin/admin-dashboard.html';
}
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const stockLevels = document.getElementById('stock-levels');

// Get stock levels
errors.innerHTML = spinner;
api.get('/products/stock').then(data => {
  const { stock, msg } = data;
  if (msg === 'Token has been revoked') {
    localStorage.removeItem('jwtToken');
    window.location.href = '../index.html';
  }
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
