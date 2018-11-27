const api = new API();
const user = api.getUserData(localStorage.jwtToken);
if (user.roles !== 'admin') {
  window.location.href = '../attendant/attendant-dashboard.html';
}
const spinner = '<img src="../media/loader.gif" style="width: 50px" />';
const errors = document.getElementById('errors');
const regForm = document.getElementById('aform');

api
  .get('/users')
  .then(data => {
    const { msg, users } = data;
    if (msg === 'Token has been revoked') {
      localStorage.removeItem('jwtToken');
      window.location.href = '../index.html';
    }
    let activeUsers = [];
    if (users) {
      let counter = 1;
      users.forEach(user => {
        let date = new Date(user.created_at);
        activeUsers += `
        <tr>
          <td>${counter}</td>
          <td>${user.fullname}</td>
          <td>${user.username}</td>
          <td>${user.roles}</td>
          <td>${date.getDate() +
            '/' +
            String(date.getMonth() + 1) +
            '/' +
            date.getFullYear()}</td>
          <td class='align-center'>
            <i class="fas fa-trash-alt trash tooltip" id=${user.id}>
              <span class="tooltiptext">Delete</span>
            </i>
            <i class="fas fa-edit tooltip" id=${user.id}>
              <span class="tooltiptext">Edit</span>
            </i>
          </td>
        </tr>
      `;
        counter += 1;
      });
    }
    document.getElementById('user-list').innerHTML = activeUsers;
  })
  .catch(err => console.log(err));

if (regForm) {
  regForm.addEventListener('submit', event => {
    event.preventDefault();
    const fullname = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password1').value;
    const roles = document.getElementById('roles').value;
    newUser = {
      fullname: fullname,
      username: username,
      password: password,
      password2: password2,
      roles: roles
    };
    errors.innerHTML = spinner;
    api
      .privatePost('/register', newUser)
      .then(data => {
        const { msg } = data;
        if (msg === 'Token has been revoked') {
          localStorage.removeItem('jwtToken');
          window.location.href = '../index.html';
        }
        errors.style = 'color: red; padding: 10px;';
        if (msg === 'Success') {
          window.location.href = 'attendant.html';
        } else if (msg === 'User already exists' || msg === 'Failure') {
          errors.innerHTML = msg;
        } else {
          errors.innerHTML = 'Some fields are missing';
        }
      })
      .catch(err => console.log(err));
  });
}

// Delete user from database
const timerId = setInterval(() => {
  const trashIt = document.getElementsByClassName('fa-trash-alt');
  for (let i = 0; i < trashIt.length; i++) {
    trashIt[i].addEventListener('click', event => {
      event.preventDefault();
      const action = confirm('Deleting User...\nDo you want to continue?');
      if (action) {
        const user_id = event.target.id;
        const endpoint = '/users/delete/' + user_id;
        api.deleteItem(endpoint, 'attendant.html');
      }
    });
  }
}, 1000);

setTimeout(() => {
  clearInterval(timerId);
}, 1000);

// Edit user event listener
const editTimer = setInterval(() => {
  const editIt = document.getElementsByClassName('fa-edit');
  for (let i = 0; i < editIt.length; i++) {
    editIt[i].addEventListener('click', event => {
      event.preventDefault();
      const user_id = event.target.id;
      localStorage.setItem('uid', user_id);
      window.location.href = 'edit-user.html';
    });
  }
}, 1000);

setTimeout(() => {
  clearInterval(editTimer);
}, 1000);
