const api = new API('http://localhost:5000/api/v1');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const salesView = document.getElementById('sales');
const sform = document.getElementById('sform');
const salesTable = document.getElementById('sales-tb');

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
      const { orders } = data;
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
        salesTable.classList.remove('hide-contents');
        sform.reset();
      } else {
        errors.style = 'color: red; padding: 10px;';
        errors.innerHTML = 'Please select a range of dates';
      }
    });
  });
}
