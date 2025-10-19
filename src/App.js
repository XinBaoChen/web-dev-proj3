/*==================================================
src/App.js

Top-level component holding the application state and routes.
For Assignment 3, this file is responsible for:
- Storing credits, debits, and the derived account balance
- Fetching initial credits/debits from the provided APIs
- Providing handlers to add new credits (and later debits)
- Passing data and handlers down to page components via props
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import axios from 'axios';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      // Derived value: total credits - total debits (rounded to 2 decimals)
      accountBalance: 0.00,
      // Lists from API + user entries
      credits: [],
      debits: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

  // Helper to compute account balance to 2 decimals
  // Account Balance = sum(credits.amount) - sum(debits.amount)
  computeAccountBalance = (credits, debits) => {
    const totalCredits = (credits || []).reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const totalDebits = (debits || []).reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const balance = totalCredits - totalDebits;
    return Number(balance.toFixed(2));
  }

  // Lifecycle to fetch initial data
  async componentDidMount() {
    try {
      // Fetch both endpoints concurrently
      const [creditsRes, debitsRes] = await Promise.all([
        axios.get('https://johnnylaicode.github.io/api/credits.json'),
        axios.get('https://johnnylaicode.github.io/api/debits.json')
      ]);

  const credits = creditsRes.data || [];
  const debits = debitsRes.data || [];
  const accountBalance = this.computeAccountBalance(credits, debits);

  this.setState({ credits, debits, accountBalance });
    } catch (err) {
      // If API fails, keep defaults but log for debugging
      // eslint-disable-next-line no-console
      console.error('Failed fetching credits/debits:', err);
    }
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  // Add a new Credit from the Credits page form
  // Reads description and amount from the submitted form, appends to credits,
  // and recalculates the account balance.
  addCredit = (event) => {
    event.preventDefault();
    const form = event.target;
    const description = form.description.value.trim();
    const amountValue = Number(form.amount.value);
    if (!description || isNaN(amountValue)) return;

    const newCredit = {
      id: Date.now(),
      description,
      amount: Number(amountValue.toFixed(2)),
      date: new Date().toISOString(),
    };

    const credits = [...this.state.credits, newCredit];
    const accountBalance = this.computeAccountBalance(credits, this.state.debits);
    this.setState({ credits, accountBalance });

    // Reset the form fields
    form.reset();
  }

  // Temporary no-op to avoid errors on Debits page until part 3 is implemented
  addDebit = (event) => {
    if (event && event.preventDefault) event.preventDefault();
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (
      <Credits 
        credits={this.state.credits}
        addCredit={this.addCredit}
        accountBalance={this.state.accountBalance}
      />
    ) 
    const DebitsComponent = () => (
      <Debits 
        debits={this.state.debits}
        addDebit={this.addDebit}
        accountBalance={this.state.accountBalance}
      />
    ) 

    // Important: Include the "basename" in Router for GitHub Pages deployment
    return (
      <Router basename="/bank-of-react-starter-code">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;