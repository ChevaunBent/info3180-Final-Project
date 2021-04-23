/* Add your Application JavaScript */
const app = Vue.createApp({
  data() {
    return {
      welcome: 'Hello World! Welcome to INFO3180-Final Project',
      components: {
        'home': Home,

      }
    }
  },
});

app.component('app-header', {
  name: 'AppHeader',
  template:
    /*html*/
    `
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <a class="navbar-brand" href="#">INFO3180-Final Project</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/explore" class="nav-link">Explore</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/newcar" class="nav-link">Add Car</router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/register" class="nav-link">Register</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/login" class="nav-link">Login</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </header>    
  `,
  data: function () {
    return {};
  }
});

const Home = {
  name: 'Home',
  template:
    /*html*/
    `
  <div class="home">
    <div class="container">
      <div class="row justify-content-center" style="box-shadow: 2px 2px 10px grey;">
        <div class="col-md-6 card-body justify-content-center">
          <h1>{{Header}}</h1>
          <p>{{welcome}}</p>
          <div>
            <router-link class="btn btn-success col-md-3" to="/register">Register</router-link>
            <router-link class="btn btn-primary col-md-3" style="margin: 10px" to="/login">Login</router-link>
          </div>
        </div>
        <div class="col-md-6 landing-container-child float-clear">
          <div class= "card">
            <img class="card-img-top" :src="image" alt="Image of a car" style="margin: 0 auto;">
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      Header: "Buy and Sell Cars Online",
      welcome: "United Auto Sales provides the fastest, easiest and most user friendly way to buy or sell cars online. Find a great price on the vehicle you want",
      image: "static/images/home.jpeg"
    }
  }
};

const login = {
  name: 'login',
  template: 
  /*html*/
      `
      <div class="register">
      <h1>{{ welcome }}</h1>
      </div>
      `,
    data() {
      return {
        welcome: 'This will be for login'
      }
    }
  };


const Register = {
  name: 'Register',
  template:
    /*html*/
    `
    <div class="register">
    <h1>{{ welcome }}</h1>
    </div>
    `,
  data() {
    return {
      welcome: 'This will be for registration'
    }
  }
};

const Explore = {
  name: 'Explore',
  template:
    /*html*/
    `
      <div class="explore">
      <h1>{{ welcome }}</h1>
      </div>
      `,
  data() {
    return {
      welcome: 'This will be for Exploring/Viewing all posts by users'
    }
  }
};

const NewCar = {
  name: 'newcar',
  template:
    /*html*/
    `
        <div class="newcar">
        <h1>{{ welcome }}</h1>
        </div>
        `,
  data() {
    return {
      welcome: 'This will be for Adding a new Car'
    }
  }
};


app.component('app-footer', {
  name: 'AppFooter',
  template: `
      <footer>
          <div class="container">
              <p>Copyright &copy {{ year }} Flask Inc.</p>
          </div>
      </footer>
  `,
  data: function () {
    return {
      year: (new Date).getFullYear()
    }
  }
})

const NotFound = {
  name: 'NotFound',
  template: 
  /*html*/
  `
  <div>
      <h1>404 - Not Found</h1>
  </div>
  `,
  data() {
      return {}
  }
};

// Define Routes
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/register', component: Register },
    { path: '/explore', component: Explore },
    { path: '/newcar', component: NewCar },
    { path: '/login', component: login },
    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
});

app.use(router)
app.mount('#app');