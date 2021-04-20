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
          <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
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
            <router-link to="/register" class="nav-link">Register</router-link>
            </li>
            <li class="nav-item">
            <router-link to="/explore" class="nav-link">Explore</router-link>
            </li>
            <li class="nav-item">
            <router-link to="/newcar" class="nav-link">Add Post</router-link>
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
  <img class="card" style="width: 18rem;" src="/static/images/logo.png" alt="Car Logo">
  <h1>{{ welcome }}</h1>
  </div>
  `,
  data() {
    return {
      welcome: 'Hello World! Welcome to our Final Project Implementation'
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

// Define Routes
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/explore', component: Explore },
  { path: '/newcar', component: NewCar }
  ]
 });

app.use(router)
app.mount('#app');