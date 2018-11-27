const openDrawer = options => {
  document.getElementById('drawer').style = options.style;
  document.getElementById('open').style.display = options.open;
  document.getElementById('close').style.display = options.close;
};

const toggle_button = (open, close) => {
  if (open && close) {
    open.addEventListener('click', event => {
      openDrawer({
        style: 'width: 150px; position: fixed; top: 50px; z-index: 1;',
        open: 'none',
        close: 'block'
      });
    });

    close.addEventListener('click', event => {
      openDrawer({
        style: 'width: 0;',
        open: 'block',
        close: 'none'
      });
    });
  }
};

window.onload = () => {
  const api = new API();
  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const logout = document.getElementById('logout');
  const profile = document.getElementById('profile');
  toggle_button(open, close);

  if (logout) {
    logout.addEventListener('click', event => {
      event.preventDefault();
      api.logoutUser();
    });
  }

  if (localStorage.jwtToken && profile) {
    console.log('ONE');
    const user = api.getUserData(localStorage.jwtToken);
    if (!isTokenExpired) {
      localStorage.removeItem('jwtToken');
      window.location.href = '../index.html';
    }
    profile.innerHTML = user.fullname;
  } else {
    if (!/index/.test(window.location.href)) {
      window.location.href = 'index.html';
    }
  }
};

window.addEventListener('resize', () => {
  const drawer = document.getElementById('drawer');
  if (drawer) {
    if (this.window.innerWidth > 615) {
      openDrawer({
        style: 'width: 150px;',
        open: 'none',
        close: 'none'
      });
    } else {
      openDrawer({
        style: 'width: 0;',
        open: 'block',
        close: 'none'
      });
    }
  }
});

const isTokenExpired = userClaims => {
  const currentTime = Date.now() / 1000;
  if (userClaims.exp < currentTime) {
    return false;
  }
  return true;
};
