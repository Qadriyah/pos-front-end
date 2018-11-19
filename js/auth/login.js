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
      } else if (getRole(token) === 'attendant') {
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

window.onload = () => {
  const myform = document.getElementById('myform');
  const logout = document.getElementById('logout');
  if (localStorage.jwtToken) {
    if (getRole(localStorage.jwtToken) === 'admin') {
      window.location.href = './admin/admin-dashboard.html';
    }

    if (getRole(localStorage.jwtToken) === 'attendant') {
      window.location.href = './attendant/attendant-dashboard.html';
    }
  }

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
};
