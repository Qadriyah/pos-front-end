const getRole = token => {
  try {
    decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.user_claims.roles;
  } catch (e) {
    return null;
  }
};

const loginUser = (username, password, spinner) => {
  document.getElementById('errors').innerHTML = spinner;
  fetch('http://localhost:5000/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username, password: password })
  })
    .then(res => res.json())
    .then(data => {
      const { token } = data;
      localStorage.setItem('jwtToken', 'Bearer ' + token);
      if (getRole(token) === 'admin') {
        window.location.href = './admin/admin-dashboard.html';
      } else if (getRole(token) === 'admin') {
        window.location.href = './attendant/attendant-dashboard.html';
      } else {
        document.getElementById('errors').style = 'color: red; padding: 10px;';
        document.getElementById('errors').innerHTML =
          'Wrong username or password';
      }
    })
    .catch(err => console.log(err));
};

const logoutUser = () => {
  fetch('http://localhost:5000/api/v1/logout', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('jwtToken')
    }
  })
    .then(res => res.json())
    .then(data => {
      const { revoked } = data;
      if (revoked) {
        localStorage.removeItem('jwtToken');
        window.location.href = '../index.html';
      }
    })
    .catch(err => console.log(err));
};

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
        document.getElementById('errors').innerHTML = 'User added successfully';
        setInterval((window.location.href = 'attendant.html'), 3000);
      }
      document.getElementById('errors').style = 'color: red; padding: 10px;';
      if (msg === 'User already exists' || msg == 'Failure') {
        document.getElementById('errors').innerHTML = msg;
      } else {
        document.getElementById('errors').innerHTML = 'Some fields are missing';
      }
    })
    .catch(err => console.log(err));
};

window.onload = () => {
  const myform = document.getElementById('myform');
  const logout = document.getElementById('logout');
  const regForm = document.getElementById('aform');
  const profile = document.getElementById('user-name');
  if (myform) {
    myform.addEventListener('submit', event => {
      event.preventDefault();
      const spinner = '<img src="./media/loader.gif" style="width: 50px" />';
      const username = document.getElementById('name').value;
      const password = document.getElementById('password').value;
      loginUser(username, password, spinner);
    });
  }

  if (logout) {
    logout.addEventListener('click', event => {
      event.preventDefault();
      logoutUser();
    });
  }

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
