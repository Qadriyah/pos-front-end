const api = new API('http://localhost:5000/api/v1');
const user = api.getUserData(localStorage.jwtToken);
if (user.roles !== 'admin') {
  window.location.href = '../attendant/attendant-dashboard.html';
}
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const attendant_menu = document.getElementById('attendant');
const eform = document.getElementById('eform');
const sales = document.getElementById('sales');

// Get attendats list
api.get('/attendants').then(data => {
  const { users, msg } = data;
  if (msg === 'Token has been revoked') {
    localStorage.removeItem('jwtToken');
    window.location.href = '../index.html';
  }
  let menu = [`<option selected='selected' value='0'>All Attendants</option>`];
  if (users) {
    users.forEach(user => {
      menu += `
            <option value=${user.id}>${user.fullname}</option>
        `;
    });
    attendant_menu.innerHTML = menu;
  }
});

// Get all sales records
errors.innerHTML = spinner;
api.get('/sales').then(data => {
  const { orders, msg } = data;
  if (msg === 'Token has been revoked') {
    localStorage.removeItem('jwtToken');
    window.location.href = '../index.html';
  }
  let items = [];
  let total_sales = 0;
  if (orders) {
    orders.forEach(order => {
      let date = new Date(order.order_date);
      order.items.forEach(item => {
        total_sales += item.total;
        items += `
          <tr>
              <td>${order.order_number}</td>
              <td>${date.getDate() +
                '/' +
                String(date.getMonth() + 1) +
                '/' +
                date.getFullYear()}</td>
              <td>${item.product_name}</td>
              <td class="align-center">${item.quantity}</td>
              <td class="align-right">${item.unit_price.toLocaleString()}</td>
              <td class="align-right">${item.total.toLocaleString()}</td>
          </tr>
          `;
      });
    });
    items += `
        <tr class="totals">
            <td colspan='5'>Total Sales</td>
            <td>${total_sales.toLocaleString()}</td>
        </tr>
    `;
    errors.innerHTML = null;
    sales.innerHTML = items;
  } else {
    errors.style = 'color: red; padding: 10px;';
    errors.innerHTML = 'Please select a range of dates';
  }
});

// Get sales records for a specific period of time
if (eform) {
  eform.addEventListener('submit', event => {
    event.preventDefault();
    user_id = document.getElementById('attendant').value;
    fro = document.getElementById('fro').value;
    to = document.getElementById('to').value;
    data = {
      user_id: Number(user_id),
      fro,
      to
    };
    errors.innerHTML = spinner;
    api.privatePost('/sales/records', data).then(data => {
      const { orders, msg } = data;
      if (msg === 'Token has been revoked') {
        localStorage.removeItem('jwtToken');
        window.location.href = '../index.html';
      }
      let items = [];
      let total_sales = 0;
      if (orders) {
        orders.forEach(order => {
          let date = new Date(order.order_date);
          order.items.forEach(item => {
            total_sales += item.total;
            items += `
            <tr>
                <td>${order.order_number}</td>
                <td>${date.getDate() +
                  '/' +
                  String(date.getMonth() + 1) +
                  '/' +
                  date.getFullYear()}</td>
                <td>${item.product_name}</td>
                <td class="align-center">${item.quantity}</td>
                <td class="align-right">${item.unit_price.toLocaleString()}</td>
                <td class="align-right">${item.total.toLocaleString()}</td>
            </tr>
            `;
          });
        });
        items += `
            <tr class="totals">
                <td colspan='5'>Total Sales</td>
                <td>${total_sales.toLocaleString()}</td>
            </tr>
        `;
        errors.innerHTML = null;
        sales.innerHTML = items;
      } else {
        errors.style = 'color: red; padding: 10px;';
        errors.innerHTML = 'Please select a range of dates';
      }
    });
  });
}
