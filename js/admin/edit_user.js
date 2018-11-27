const api = new API();
const user = api.getUserData(localStorage.jwtToken);
if (user.roles !== 'admin') {
  window.location.href = '../attendant/attendant-dashboard.html';
}
const select = document.getElementById('roles');
let fname = document.getElementById('name');
let uname = document.getElementById('username');
const uform = document.getElementById('uform');
const spinner = '<img src="../media/loader.gif" style="width: 100px" />';
const errors = document.getElementById('errors');

// Get user by id
api.get('/users/' + Number(localStorage.uid)).then(data => {
  const { users, msg } = data;
  if (msg === 'Token has been revoked') {
    localStorage.removeItem('jwtToken');
    window.location.href = '../index.html';
  }
  const roles = [
    `<option selected='selected' value=${users[0].roles}>${
      users[0].roles
    }</option>`,
    `<option value='attendant'>Attendant</option>`,
    `<option value='admin'>Admin</option>`
  ];
  if (users) {
    fname.value = users[0].fullname;
    uname.value = users[0].username;
    select.innerHTML = roles;
  }
});

// Edit user details
if (uform) {
  uform.addEventListener('submit', event => {
    event.preventDefault();
    user = {
      fullname: document.getElementById('name').value,
      username: document.getElementById('username').value,
      roles: document.getElementById('roles').value
    };
    errors.innerHTML = spinner;
    api.update('/users/edit/' + Number(localStorage.uid), user).then(data => {
      const { msg } = data;
      if (msg === 'Token has been revoked') {
        localStorage.removeItem('jwtToken');
        window.location.href = '../index.html';
      }
      localStorage.removeItem('cid');
      errors.style = 'color: red; padding: 10px;';
      if (msg === 'Success') {
        window.location.href = 'attendant.html';
      } else if (msg === 'User not found' || msg === 'Failure') {
        errors.innerHTML = msg;
      } else {
        errors.innerHTML = 'Some fields are missing';
      }
    });
  });
}
