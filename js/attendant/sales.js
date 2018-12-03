const api = new API();
const user = api.getUserData(localStorage.jwtToken);
if (user.roles !== 'attendant') {
  window.location.href = '../admin/admin-dashboard.html';
}
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const salesView = document.getElementById('sales');
const sform = document.getElementById('sform');
const salesTable = document.getElementById('sales-tb');
const model = document.getElementById('model');
const receipt = document.getElementById('receipt');
const items = document.getElementById('items');
const orderNumber = document.getElementById('order-no');
const orderDate = document.getElementById('order-date');
const attendant = document.getElementById('attendant');

// Get sales for a particular sales attendant
if (sform) {
  sform.addEventListener('submit', event => {
    event.preventDefault();
    const user = api.getUserData(localStorage.jwtToken);
    const dateRange = {
      fro: document.getElementById('fro').value,
      to: document.getElementById('to').value
    };
    errors.innerHTML = spinner;
    const user_id = Number(user.id);
    api.privatePost('/sales/user/' + user_id, dateRange).then(data => {
      const { orders, msg } = data;
      if (msg === 'Token has been revoked') {
        localStorage.removeItem('jwtToken');
        window.location.href = '../index.html';
      }
      let items = [];
      let total_sales = 0;
      if (orders) {
        orders.forEach(order => {
          order.items.forEach(item => {
            total_sales += item.total;
            items += `
                <tr>
                  <td>${order.order_number}</td>
                  <td>${api.getShortDate(new Date(order.order_date))}</td>
                  <td>${item.product_name}</td>
                  <td class="align-center">${item.quantity}</td>
                  <td class="align-right">${item.unit_price.toLocaleString()}</td>
                  <td class="align-right">${item.total.toLocaleString()}</td>
                  <td class="align-center">
                    <i class="fas fa-receipt tooltip" id=${order.id}>
                        <span class="tooltiptext">Receipt</span>
                    </i>
                  </td>
                </tr>
                `;
          });
        });
        items += `
          <tr class="totals">
            <td colspan='5'>Total Sales</td>
            <td>${total_sales.toLocaleString()}</td>
            <td></td>
          </tr>
        `;
        errors.innerHTML = null;
        sales.innerHTML = items;
        salesTable.classList.remove('hide-contents');
      } else {
        errors.style = 'color: red; padding: 10px;';
        errors.innerHTML = 'Please select a range of dates';
      }
    });
    sform.reset();
  });
}

window.addEventListener('click', event => {
  const id = Number(event.target.id);
  if (id > 0) {
    api.get('/sales/' + id).then(data => {
      const { orders } = data;
      let salesItems = [];
      let total = 0;
      orderNumber.innerText = 'Order No. ' + orders[0].order_number;
      orderDate.innerText =
        'Date: ' + api.getShortDate(new Date(orders[0].order_date));
      attendant.innerText = 'Sold by: ' + orders[0].sold_by;
      orders[0].items.forEach(item => {
        total += item.total;
        salesItems += `
          <tr>
            <td>${item.product_name}</td>
            <td class="align-center">${item.quantity}</td>
            <td class="align-right">${item.unit_price.toLocaleString()}</td>
            <td class="align-right">${item.total.toLocaleString()}</td>
          </tr>
        `;
      });
      salesItems += `
        <tr class="totals">
          <td colspan="3">Total Items</td>
          <td>${total.toLocaleString()}</td>
        </tr>
      `;
      items.innerHTML = salesItems;
    });
    model.style.display = 'block';
  }

  if (event.target === model) {
    model.style.display = 'none';
  }
});
