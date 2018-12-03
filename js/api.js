// const fetch = require('node-fetch');
// const atob = require('atob');

class API {
  constructor() {
    this.url = 'http://localhost:5000/api/v1';
  }

  getUserData(token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.user_claims;
    } catch (e) {
      print(e);
      return e;
    }
  }

  // Public route
  async publicPost(endpoint, data) {
    const res = await fetch(this.url + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return res.json();
  }

  // Private route
  async privatePost(endpoint, data) {
    const res = await fetch(this.url + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.jwtToken
      },
      body: JSON.stringify(data)
    });

    return res.json();
  }

  // Private route
  async get(endpoint) {
    const res = await fetch(this.url + endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.jwtToken
      }
    });

    return res.json();
  }

  // Private route
  async update(endpoint, data) {
    const res = await fetch(this.url + endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.jwtToken
      },
      body: JSON.stringify(data)
    });

    return res.json();
  }

  // Private route
  async delete(endpoint) {
    const res = await fetch(this.url + endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.jwtToken
      }
    });

    return res.json();
  }

  logoutUser() {
    this.delete('/logout')
      .then(data => {
        const { revoked } = data;
        if (revoked) {
          localStorage.removeItem('jwtToken');
          window.location.href = '../index.html';
        }
      })
      .catch(err => console.log(err));
  }

  deleteItem(endpoint, href) {
    this.delete(endpoint)
      .then(data => {
        const { msg } = data;
        if (msg === 'Success') {
          window.location.href = href;
        }
      })
      .catch(err => console.log(err));
  }

  getShortDate(date) {
    return (
      date.getDate() +
      '/' +
      String(date.getMonth() + 1) +
      '/' +
      date.getFullYear()
    );
  }
}

module.exports = API;
