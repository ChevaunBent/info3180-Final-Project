const register = {
    name: 'register',
    template: `
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
                        setTimeout(() => router.push('/auth/login'), 3000)
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
          <div v-if='hasMessage || smessage!= "undefined"'>
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
            <div v-else-if="hasError" >
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
                        currentuser = { "token": jsonResponse.token, "user_name": jsonResponse.user_name, id: jsonResponse.user_id };
                        localStorage.current_user = JSON.stringify(currentuser);
                        sessionStorage.message = jsonResponse.message;
                        setTimeout(() => history.go(), router.push('/explore'), 2000)
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
                localStorage.clear();
                sessionStorage.clear();
                self.message = jsonResponse.message;
                console.log(jsonResponse.message);
                setTimeout(() => history.go(), router.push('/'), 200);
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

const Explore = {
    name: 'Explore',
    template:
    /*html*/
    `
        <h1 class="page-header py-5">Explore</h1>
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <label class='pr-2'>Make</label>
                <input type="text" name="makesearch" v-model="makesearch" class="form-control" v-model="searchMake">
              </div>
              <div class="col-md-4">
                <label class='pr-2'>Model</label>
                <input type="text" name="modelsearch" v-model="modelsearch" class="form-control" v-model="searchModel">
              </div>
              <div class="col-md-4">
                <a class="btn btn-success text-white search-button" @click="exploreSearch">Search</a>
              </div>
            </div>
          </div>
        </div>

        <div class="card-group py-5">
            <div v-for="car in cars" class="col-4 mb-4 pl-0">
                <div class="card">
                  <div class="card-img-top img-responsive img-responsive-16by9" v-bind:style="{ backgroundImage: 'url( ../static/uploads/' + car.photo + ')' }"></div>
                  <div class="card-body">
                    <div class="header row m-0">
                        <p class="card-title">Card with top image</p>
                        <div class="bg-success text-white badge ms-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2 text-muted" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M11 3l9 9a1.5 1.5 0 0 1 0 2l-6 6a1.5 1.5 0 0 1 -2 0l-9 -9v-4a4 4 0 0 1 4 -4h4" />
                              <circle cx="9" cy="9" r="2" />
                            </svg>
                            {{ car.price }}
                        </div>
                    </div>
                    <p>{{ car.model }}</p>
                    <div class="card-text mt-4">
                      <router-link :to="{ name: 'view_car', params: { car_id: car.id } }" class="btn btn-primary w-100">View car details</router-link>
                    </div>
                  </div>
                </div>
            </div>
        </div>

        <div v-if="!cars" class="alert alert-warning" role="alert">
          No cars found
        </div>
    `,
    data: function() {
        return {
            hasError: false,
            errors: [],
            cars: [],
            searchMake: '',
            searchModel: ''

        }
    },
    created() {
        let self = this;

        fetch('/api/cars', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.current_user).token}`
            },
        })
        .then(function(response) {
           return response.json();
        })
        .then(function(jsonResponse) {

            if (jsonResponse.hasOwnProperty("errors")) {
                self.hasError = true;
                console.log(jsonResponse.errors)
            } else {
                console.log(jsonResponse.cars)
                self.cars = jsonResponse.cars
                console.log(self.cars)
            }
        });
    }, 
    methods: {
        exploreSearch() {
            let self = this;
            fetch('/api/search?make=' + self.searchMake + '&model=' + self.searchModel, {
                    method: 'GET',
                    headers: 
                    { 
                      'Authorization': `Bearer ${JSON.parse(localStorage.current_user).token}`, 
                      'X-CSRFToken': token 
                    },
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    self.cars = jsonResponse.cars
                    console.log(jsonResponse);
                })
                .catch(function(error) {
                    console.log(error);
                });

        }
    }
};

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

const new_car = {
    name: 'cars-new',
    template: `
    <h1 class="page-header mb-3 py-5"><strong>Add New Car</strong></h1>
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
            <textarea type='description' id='description' name='description' class='form-control' style="min-height: 75px;" rows="3"/>
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
                        setTimeout(() => router.push('/explore'), 2000)
                    }
                })
                .catch(function(error) {
                    console.log(error)
                });
        }
    }
};

const view_car = {
    name: 'view_car',
    template:
    /*html*/
        ` 
      <div class="col-12 py-5">
        <!--Displays Messages-->
        <div class="form_response">
          <div>
            <div v-if="has_message" class="alert alert-success">{{ message }}</div>
            <ul v-if="has_error" class="alert alert-danger pl-4">
              <div v-for="error in errors" class="pl-2">{{ error }}</div>
            </ul>
          </div>
        </div>

        <div class="card">
          <div class="row">
            <div class="col-6">
              <img :src="'../static/uploads/'+car.photo" class="w-100 h-100 object-cover" alt="photo-of-{{car.model}}">
            </div>
            <div class="col">
              <div class="card-body">
                <h3 class="card-title font-weight-bold">{{ car.year }} {{ car.make }}</h3>
                <h4 class="font-weight-bold text-muted">{{ car.model }}</h4> 
                
                <div>{{ car.description }}</div>
                <div class="row m-0 mt-4 mb-4">
                  <div class="card-text d-flex align-items-center me-4">
                    <div class="">
                      <p class="font-weight-bold col pl-0"><span class="text-muted">Color</span> <span class="ml-2">{{ car.colour }}</span> </p> 
                      <p class="font-weight-bold col pl-0"><span class="text-muted">Color</span> <span class="ml-2">{{ car.colour }}</span> </p> 
                      
                    </div>
                    <div>
                      <p class="font-weight-bold col pl-0"><span class="text-muted">Color</span> <span class="ml-2">{{ car.colour }}</span> </p> 
                      <p class="font-weight-bold col pl-0"><span class="text-muted">Color</span> <span class="ml-2">{{ car.colour }}</span> </p> 
                    </div>
                  </div>
                </div><!--/.row-->
                <div class="">
                  <div class="d-flex">
                    <a href="#" class="btn btn-primary">Email Owner</a>
                    <a v-on:click="favourite(car)" class="btn btn-circle ms-auto btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-heart" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                       <path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                    </svg>
                   </a>
                  </div>
                </div>
              </div><!--/.card-body-->
            </div>
          </div>
        </div><!--/.card-->
      </div>
    `,
    data() {
        return {
            car: "",
            errors: [],
            has_error: false,
            has_message: false,
            message: ""
        }
    },
    created() {
        let self = this;
        fetch(`/api/cars/${self.$route.params.car_id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.current_user).token}`,
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                if (jsonResponse.hasOwnProperty("errors")) {
                    self.errors = jsonResponse.errors
                    self.has_error = true
                    console.log(jsonResponse.errors)
                } else {
                    console.log(jsonResponse);
                    self.car = jsonResponse.car
                    self.has_error = false
                }
            })
            .catch(function(error) {
                console.log(error)
            });
    },
    methods: {
        favourite(car) {
            let self = this;
            fetch(`/api/cars/${car.id}/favourite`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.current_user).token}`,
                        'X-CSRFToken': token
                    },
                    credentials: 'same-origin',
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    if (jsonResponse.hasOwnProperty("errors")) {
                        self.errors = jsonResponse.errors
                        self.has_error = true
                        console.log(jsonResponse.errors)
                    } else {
                        console.log(jsonResponse);
                        self.message = jsonResponse.message
                        self.has_error = false
                        self.has_message = true
                    }
                })
                .catch(function(error) {
                    console.log(error)
                });
        }
    }
};


const Profile = ("profile", {
    name: "profile",
    template:
    /*html*/
        `
  <div>
    <div class="card row" style="width:100%">
        <div class="card-body row profile-haeder" style="padding: 0;" >
            <strong><label>{{ user}}</label></strong>
          <div id="favourites" class="col-sm-3" style="padding-left:  0; padding-right:  0;">
            <p>To be completed</p>
          </div>
        </div>
    </div>
  </div>
  `,
    created() {
        let self = this;

        fetch(`/api/users/${self.$route.params.user_id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.current_user).token}`
                },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                self.user = jsonResponse.user_data
                console.log(jsonResponse.user_data)



            }).catch(function(error) {
                console.log(error)
            });
    },
    data: function() {
        return {
            user: null,
            cu_id: (this.$route.params.user_id == JSON.parse(localStorage.current_user).id) ? true : false
        }
    }
});




/* Add your Application JavaScript */
const app = Vue.createApp({
    data() {
        return {}
    },
    components: {
        'register': register,
        'login': login,
        'explore': Explore,
        'home': Home,
        'new_car': new_car
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template:
    /*html*/
        `
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <a class="navbar-brand pl-3 d-flex justify-content-center" href="/">      
            <img :src="image" alt="Icon of United Auto Sales" class="mr-2">
            United Auto Sales
        </a>
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
            <li class="nav-item" v-if="!authenticated_user">
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
            current_user_name: localStorage.hasOwnProperty("current_user") ? JSON.parse(localStorage.current_user).user_name : null,
            image: "static/images/directions_car_white_24dp.svg"
        };
    }
});

app.component('app-footer', {
    name: 'AppFooter',
    template:
    /*html*/
        `
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
        { path: "/users/:user_id", name: "users", component: Profile },
        {
          path: '/explore',
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
          path: '/cars/:car_id',
          component: view_car,
          name: "view_car",
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
                  next('/auth/login');
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