const api = new API();
const user = api.getUserData(localStorage.jwtToken);
if (user.roles !== 'attendant') {
  window.location.href = '../admin/admin-dashboard.html';
}
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');
const profileName = document.getElementById('profile-name');
const salesRecords = document.getElementById('sales-records');
const salesItems = document.getElementById('items');
const totalWorth = document.getElementById('amount');

api.get('/sales/user/' + user.id).then(data => {
  const { orders, msg } = data;
  if (msg === 'Token has been revoked') {
    localStorage.removeItem('jwtToken');
    window.location.href = '../index.html';
  }
  let total_items = 0;
  let total_worth = 0;
  const total_sales = orders.length;
  if (orders) {
    orders.forEach(order => {
      total_items += order.items.length;
      order.items.forEach(item => {
        total_worth += item.total;
      });
    });
    profileName.innerHTML = user.username + "'s Profile";
    salesRecords.innerHTML = total_sales;
    salesItems.innerHTML = total_items;
    totalWorth.innerHTML = total_worth.toLocaleString();
  }
});
