const api = new API();

const myform = document.getElementById('myform');
if (localStorage.jwtToken) {
  if (api.getUserData(localStorage.jwtToken).roles === 'admin') {
    window.location.href = './admin/admin-dashboard.html';
  }

  if (api.getUserData(localStorage.jwtToken).roles === 'attendant') {
    window.location.href = './attendant/attendant-dashboard.html';
  }
}

if (myform) {
  myform.addEventListener('submit', event => {
    event.preventDefault();
    const spinner = '<img src="./media/loader.gif" style="width: 50px" />';
    const errors = document.getElementById('errors');
    const data = {
      username: document.getElementById('name').value,
      password: document.getElementById('password').value
    };
    errors.innerHTML = spinner;
    api
      .publicPost('/login', data)
      .then(data => {
        const { token, success } = data;
        if (success) {
          localStorage.setItem('jwtToken', 'Bearer ' + token);
          if (api.getUserData(token).roles === 'admin') {
            window.location.href = './admin/admin-dashboard.html';
          } else {
            window.location.href = './attendant/attendant-dashboard.html';
          }
        } else {
          const { msg } = data;
          errors.style = 'color: red; padding: 10px;';
          if (msg === 'Username not found' || msg === 'Wrong password') {
            errors.innerHTML = msg;
          } else {
            errors.innerHTML = 'Wrong username or password';
          }
        }
      })
      .catch(err => console.log(err));
  });
}
