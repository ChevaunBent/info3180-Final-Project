const register = {
    name: 'register',
    template:
    /*html*/    
    `
    <div>
        <h1 class="page-header"> 
            Add New User
        </h1>

        <!--Displays Messages-->
        <div class="form_response">
          <div>
            <div v-if="has_message" class="alert alert-success">{{ messages }}</div>
            <ul v-if="has_error" class="alert alert-danger pl-4">
              <h5> The following errors prohibited the form from submitting: </h5>
              <li v-for="error in errors" class="pl-2">{{ error }}</li>
            </ul>
          </div>
        </div>

        <form @submit.prevent='register' id ="registrationform" method = 'POST' enctype="multipart/form-data">
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
                <div class="col-12">
                    <button class='btn btn-primary' type='submit'> Submit </button>
                </div>
            </div>
        </form>
    </div>
    `,
    data() {
      return {
        messages: "",
        errors: [],
        has_error: false,
        has_message: false
      }
    },
    methods: {
      register() {
        let self = this;
        let registration_form = document.getElementById('registrationform');
        let form_data = new FormData(registration_form);

        fetch('/api/register', {
          method: 'POST',
          body: form_data,
          headers: {
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
        .then(function(response) {
          return response.json()
        })
        .then(function(jsonResponse) {
          if (jsonResponse.hasOwnProperty("errors")) {
            self.errors = jsonResponse.errors
            self.has_error = true
            console.log(jsonResponse.errors)
          } else { 
            self.messages = jsonResponse.messages
            self.has_message = true
            self.has_error = false
            console.log(jsonResponse.messages)
            sessionStorage.message =jsonResponse.messages
            setTimeout( () => router.push('/login'), 3000)
          }  
        })
        .catch(function(error) {
          console.log(error)
        });
      }
    }
};

const login = {
    name: 'login',
    template:
    /*html*/
    `
      <div class="login-form center-block">
          <h2>Please Log in</h2>

          <!--Displays Messages-->
          <div v-if='hasMessage || smessage'>
              <div v-if="!hasError && hasMessage">
                  <div class="alert alert-success" >
                          {{ message }}
                  </div>
              </div>
              <div v-else-if="!hasError && smessage">
                <div class="alert alert-success" >
                    {{smessage}}
                </div>
              </div>
              <div v-else >
                  <ul class="alert alert-danger">
                      <h5> The following errors prohibited the form from submitting: </h5>
                      <li v-for="error in message">
                          {{ error }}
                      </li>
                  </ul>
              </div>
          </div>

          <form @submit.prevent='login' id = 'login' method = 'POST' enctype="multipart/form-data">
          <div class="col-12 form-group">
              <label for = 'username'> Username </label>
              <input type="text" name="username" id="username" class="form-control mb-2 mr-sm-2" placeholder="Enter Username here">
          </div>
          <div class="col-12 form-group">
              <label for = 'password'> Password </label>
              <input type="password" name="password" id="password" class="form-control mb-2 mr-sm-2">
          </div>
          <button type="submit" name="submit" class="btn btn-primary btn-block">Log in</button>
          </form>
      </div>    
    `,
    data() {
      return {
        hasMessage: false,
        hasError: false, 
        message: "",
        smessage: sessionStorage.message,
        errors: []        
      }
    },
    methods: {
    login: function() {
      let self = this;
      let login = document.getElementById('login');
      let form_data = new FormData(login);

      fetch('/api/auth/login', {
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
        // display messages
        self.hasMessage = true;
        sessionStorage.removeItem('message')
        //Error Message
        if (jsonResponse.hasOwnProperty("errors")) {
            self.hasError = true;
            self.message = jsonResponse.errors;
            console.log(jsonResponse.errors);
            //Success Message
        } else {
          self.hasError = false;
          self.message = jsonResponse.message;
          //Stores information on current user
          currentuser = { "token": jsonResponse.token, "user_name":jsonResponse.user_name ,id: jsonResponse.user_id };
          localStorage.current_user = JSON.stringify(currentuser);
          console.log(currentuser);
          setTimeout( () => router.push('/explore'), 2000)
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  }
};

const logout = {
    name: "logout",
    created: function() {
      let self = this;

      fetch("/api/auth/logout", {
        method: "GET",
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(jsonResponse) {
        hasMessage = true;
        localStorage.removeItem("current_user");
        self.message = jsonResponse.message;
        console.log(jsonResponse.message);
        router.push('/');
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    data() {
      return {
        hasMessage: false
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
            <li class="nav-item" v-if="authenticated_user">
              <router-link to="/explore" class="nav-link">Explore</router-link>
            </li>
            <li class="nav-item" v-if="authenticated_user">
              <router-link to="/cars/new" class="nav-link">Add Car</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="nav-link">Register</router-link>
            </li>
          </ul>
            <div v-if ="authenticated_user">
              <ul class="navbar-nav">
                <li class="nabar-nav" style="color:white">Welcome: {{current_user_name}} </li>
              </ul>
              <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link to="/auth/logout" class="nav-link">Logout</router-link>
                </li>
              </ul>
            </div>
            <div v-else>
              <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link to="/auth/login" class="nav-link">Login</router-link>
                </li>
              </ul>
          </div>
        </div>
      </nav>
    </header>    
  `,
  data: function() {
    return {
      authenticated_user: localStorage.hasOwnProperty("current_user"),
      current_user_id: localStorage.hasOwnProperty("current_user") ? JSON.parse(localStorage.current_user).id : null,
      current_user_name: localStorage.hasOwnProperty("current_user") ? JSON.parse(localStorage.current_user).user_name : null
    };
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
            <router-link class="btn btn-primary col-md-3" style="margin: 10px" to="/auth/login">Login</router-link>
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
        <div class="container">
          <div class="col-md-6 card-body justify-content-center">
            <h1>{{welcome}}</h1>
            <p>{{Header}}</p>
            <div class="form-group has-feedback">
              <input type="search" class="form-control input-lg" v-model="searchTerm"
                placeholder="Search for a car" :name="name">
              <span class="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>
            </div>
            <div class="card">

            </div>
          </div>
        </div>
      </div>
      `,
    data() {
        return {
            welcome: 'This will be for Exploring/Viewing all posts by users',
            Header: "Search Box",
            cars: [
              {
                
              }
            ]
        }
    },
    methods: {
      viewAllCars(){
        
      }
    }
};

const new_car = {
    name: 'cars-new',
    template:
    `
      <h1 class="page-header mb-3"><strong>Add New Car</strong></h1>
      <!--Displays Messages-->
      <div class="form_response">
        <div>
          <div v-if="has_message" class="alert alert-success">{{ message }}</div>
          <ul v-if="has_error" class="alert alert-danger pl-4">
            <h5> The following errors prohibited the form from submitting: </h5>
            <li v-for="error in errors" class="pl-2">{{ error }}</li>
          </ul>
        </div>
      </div>
      <div class="card lift">
        <div class="card-body">
          <form id="new_car_form" @submit.prevent="new_car" enctype="multipart/form-data">
            <div class="row mb-3">
              <div class="col">
                <label for='make'>Make</label>
                <input type='make' id='make' name='make' class='form-control'>
              </div>   
              <div class="col">
                <label for='model'>Model</label>
                <input type='model' id='model' name='model' class='form-control'>
              </div>   
            </div>
 
            <div class="row mb-3">
              <div class="col">
                <label for='colour'>Colour</label>
                <input type='colour' id='colour' name='colour' class='form-control'/>
              </div>   
              <div class="col">
                <label for='year'>Year</label>
                <input type='number' id='year' name='year' class='form-control'/>
              </div>   
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for='price'>Price</label>
                <input type='price' id='price' name='price' class='form-control'/>
              </div>   
              <div class="col">
                <label for='car_type'>Car Type</label>
                <select for="car_type" name='car_type' class="form-control">
                  <option>SUV</option>
                  <option>Sedan</option>
                  <option>Hatchback</option>
                  <option>Subaru</option>
                </select>
              </div>   
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for='transmission'>Transmission</label>
                <select for="transmission" name='transmission' class="form-control">
                  <option>Automatic</option>
                  <option>Standard</option>
                </select>
              </div>
            </div>     
            <div class="mb-3 p-0">
              <label for='description'>Description</label>
              <textarea type='description' id='description' name='description' class='form-control' rows="3"/>
            </div>   
            <div class="col-md-6 mb-3 p-0">
              <label for='photo'>Upload Photo</label>
              <input type='file' id='photo' name='photo' class='form-control'>
            </div>  
            <button type="submit" class="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    `,
    data() {
      return {
        message: "",
        errors: [],
        has_error: false,
        has_message: false
      }
    },
    methods: {

      new_car() {
        let self = this;
        let new_car_form = document.getElementById('new_car_form');
        let form_data = new FormData(new_car_form);

        fetch('/api/cars', {
          method: 'POST',
          body: form_data,
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.current_user).token}`,
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
        .then(function(response) {
          return response.json()
        })
        .then(function(jsonResponse) {
          if (jsonResponse.hasOwnProperty("errors")) {
            self.errors = jsonResponse.errors
            self.has_error = true
            console.log(jsonResponse.errors)
          } else { 
            self.message = jsonResponse.message
            self.has_message = true
            self.has_error = false
            console.log(jsonResponse.message)
            setTimeout( () => router.push('/'), 3000)
          }  
        })
        .catch(function(error) {
          console.log(error)
        });
      }
    }
};


app.component('app-footer', {
    name: 'AppFooter',
    template: 
    /*html*/`
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
        { path: '/explore', 
          component: Explore, 
          beforeEnter(to, from, next) {
            let current_user = (localStorage.current_user);
            if (current_user) {
              next();
            } else {
              next('/auth/login');
            }
          },
         },
        { 
          path: '/cars/new', 
          component: new_car,
          beforeEnter(to, from, next) {
            let current_user = (localStorage.current_user);
            if (current_user) {
              next();
            } else {
              next('/login');
            }
          },
         },
        { path: '/auth/login', component: login },
        { 
          path: '/auth/logout', 
          component: logout,  
          beforeEnter(to, from, next) {
            let current_user = (localStorage.current_user);
            if (current_user) {
              next();
            } else {
              next('/auth/login');
            }
          },
        },
        // This is a catch all route in case none of the above matches
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
    ]
});

app.use(router)
app.mount('#app');