const API = require('./api');
const api = new API();
const token =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDMzMjI3OTQsIm5iZiI6MTU0MzMyMjc5NCwianRpIjoiZTkyOTVhOTQtMjE2YS00MzZiLTgzNWMtNjlkODliOThjODEzIiwiZXhwIjoxNTQzOTI3NTk0LCJpZGVudGl0eSI6ImFkbWluIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIiwidXNlcl9jbGFpbXMiOnsiaWQiOjEsImZ1bGxuYW1lIjoiQmFrZXIgU2VraXRvbGVrbyIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlcyI6ImFkbWluIn19.k9ghcagJ3CCsSGON_bGpb8GOeieJMt2p-oMumchwSrk';

describe('loginUser', () => {
  let user;
  beforeEach(() => {
    user = {
      username: 'admin',
      password: 'admin'
    };
  });
  it('should output the access token', () => {
    expect(user.username).toBe('admin');
    expect(user.password).toBe('admin');
    return api
      .publicPost('/login', user)
      .then(data => {
        const { token, success } = data;
        expect(success).toBe(true);
      })
      .catch(err => console.log(err));
  });
  it('Wrong username', () => {
    user.username = 'Baker';
    return api
      .publicPost('/login', user)
      .then(data => {
        const { msg } = data;
        expect(msg).toBe('Username not found');
      })
      .catch(err => console.log(err));
  });
  it('Wrong password', () => {
    user.password = 'Baker';
    return api
      .publicPost('/login', user)
      .then(data => {
        const { msg } = data;
        expect(msg).toBe('Wrong password');
      })
      .catch(err => console.log(err));
  });
  it('Empty fields', () => {
    user.username = '';
    user.password = '';
    return api
      .publicPost('/login', user)
      .then(data => {
        expect(data.username[0]).toBe('unallowed value ');
        expect(data.password[0]).toBe('unallowed value ');
      })
      .catch(err => console.log(err));
  });
  it('Non-existent fields', () => {
    return api
      .publicPost('/login', {})
      .then(data => {
        expect(data.username[0]).toBe('required field');
        expect(data.password[0]).toBe('required field');
      })
      .catch(err => console.log(err));
  });
});

describe('getUserData', () => {
  it('should output user data', () => {
    const user = api.getUserData(token);
    expect(user.username).toBe('admin');
  });
});
