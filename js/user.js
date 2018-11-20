const api = new API('http://localhost:5000/api/v1');
const spinner = '<img src="../media/loader.gif" style="width: 50px" />';
const errors = document.getElementById('errors');
const regForm = document.getElementById('aform');

api
  .get('/users')
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
