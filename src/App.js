import React ,{ useState,useRef,useEffect }from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import { useCookies } from 'react-cookie';
import { signIn } from './views/pages/login/auth';
import AuthRoute from './views/pages/login/AuthRoute';
import Logout from './views/pages/login/Logout';


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

function App(){
    
 /** 로그인 처리 부분 */
 const [cookies] = useCookies(['token']);  
 const token = cookies.TocToken;
 const [user, setUser] = useState(token);
 const authenticated = user != null;  

 const [userinfo] = useState(cookies)  // 쿠키 복호화


 //let location = useLocation();
 

 const login = ({ userId, token }) => setUser(signIn({ userId, token })); 

    return (
      <BrowserRouter >
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login authenticated={authenticated} login={login} {...props}/>} />
              <Route exact path="/logout" name="Logout" component={Logout}/>
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route  path="/" name="Home" render={props => <AuthRoute authenticated={authenticated} admininfo={userinfo}  component={TheLayout} {...props}/>} />              
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );
  
}

export default App;
