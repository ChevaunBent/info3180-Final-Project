const register = ('register', {
    name: 'register',
    template:
    /*html*/
        `
    <div>
        <h1 class="page-header"> 
            Add New User
        </h1>
        <form @submit.prevent='register' id = 'register' method = 'POST' enctype="multipart/form-data">
            <div>
                <div class="col-12 form-group">
                    <label for = 'name'> Name </label>
                    <input type="text" name="name" id="name" class="form-control mb-2 mr-sm-2" placeholder="Enter Name here">
                </div>
                <div class="col-12 form-group">
                    <label for = 'email'> Email </label>
                    <input type="text" name="email" id="email" class="form-control mb-2 mr-sm-2" placeholder="Enter Email here">
                </div>
                <div class="col-12 form-group">
                    <label for = 'location'> Location </label>
                    <input type="text" name="location" id="location" class="form-control mb-2 mr-sm-2" placeholder="Enter Location here">
                </div>
                <div class="col-12 form-group">
                    <label for = 'biography'> Biography </label>
                    <textarea type="text" name="biography" id="biography" class="form-control mb-2 mr-sm-2" style='min-height: 10rem; height:10rem;' placeholder="Enter Biography here"></textarea>
                </div>
                <div class="col-12 form-group">
                    <label for = 'username'> Username </label>
                    <input type="text" name="username" id="username" class="form-control mb-2 mr-sm-2" placeholder="Enter Username here">
                </div>
                <div class="col-12 form-group">
                    <label for = 'password'> Password </label>
                    <input type="password" name="password" id="password" class="form-control mb-2 mr-sm-2">
                </div>
                <div class="form-group">
                    <div class="col-sm-6">
                        <label for = 'photo'> Select a photo: </label> <br>
                        <input type='file' name = 'photo'> <br>
                    </div>
                </div>
                <!--Displays Messages-->
                <div v-if='hasMessage'>
                    <div v-if="!hasError ">
                        <div class="alert alert-success" >
                                {{ message }}
                        </div>
                    </div>
                    <div v-else >
                        <ul class="alert alert-danger">
                            <li v-for="error in message">
                                {{ error }}
                            </li>
                        </ul>
                </div>
            </div>
                <div class="col-12">
                    <button class='btn bg-primary' type='submit'> Submit </button>
                </div>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            hasError: false,
            hasMessage: false
        }
    },
    methods: {
        register: function() {
            let self = this;
            let register = document.getElementById('register');
            let form_data = new FormData(register);

            fetch('/api/register', {
                    method: 'POST',
                    body: form_data,
                    headers: {
                        'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    // display a success message
                    self.hasMessage = true;
                    if (jsonResponse.hasOwnProperty("errors")) {
                        self.hasError = true;
                        self.message = jsonResponse.errors;
                        console.log(jsonResponse.errors);
                    } else if (jsonResponse.hasOwnProperty("message")) {
                        self.hasError = false;
                        self.message = jsonResponse.message;
                        console.log(jsonResponse.message);
                        setTimeout(function() { router.push('/login'); }, 2000);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
});

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

/* Add your Application JavaScript */
const app = Vue.createApp({
    data() {
        return {

        }
    },
    components: {
        'register': register,
        'login': login
    }
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
    data: function() {
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
    data: function() {
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
        { path: '/register', component: register },
        { path: '/explore', component: Explore },
        { path: '/newcar', component: NewCar },
        { path: '/login', component: login },
        // This is a catch all route in case none of the above matches
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
    ]
});

app.use(router)
app.mount('#app');