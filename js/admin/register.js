const registerUser = (user, spinner) => {
  document.getElementById('errors').innerHTML = spinner;
  fetch('http://localhost:5000/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('jwtToken')
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then(data => {
      const { msg } = data;
      if (msg === 'Success') {
        window.location.href = 'attendant.html';
      }
      document.getElementById('errors').style = 'color: red; padding: 10px;';
      if (msg === 'User already exists' || msg === 'Failure') {
        document.getElementById('errors').innerHTML = msg;
      } else {
        document.getElementById('errors').innerHTML = 'Some fields are missing';
      }
    })
    .catch(err => console.log(err));
};

const getUsers = () => {
  fetch('http://localhost:5000/api/v1/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('jwtToken')
    }
  })
    .then(res => res.json())
    .then(data => {
      const { msg, users } = data;
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
                date.getMonth() +
                '/' +
                date.getFullYear()}</td>
              <td class='align-center'>
                <i class="fas fa-trash-alt trash tooltip">
                  <span class="tooltiptext">Delete</span>
                </i>
                <i class="fas fa-edit tooltip">
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
};

window.onload = () => {
  const regForm = document.getElementById('aform');
  getUsers();

  if (regForm) {
    regForm.addEventListener('submit', event => {
      event.preventDefault();
      const spinner = '<img src="../media/loader.gif" style="width: 50px" />';
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
      registerUser(newUser, spinner);
    });
  }
};
