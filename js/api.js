class API {
  constructor() {
    this.url = 'https://pos-api-v1.herokuapp.com';
  }

  getUserData(token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.user_claims;
    } catch (e) {
      return null;
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
}
