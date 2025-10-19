/*==================================================
src/components/AccountBalance.js

Reusable balance display component.
Shows the provided accountBalance rounded to 2 decimal places.
==================================================*/
import React, {Component} from 'react';

class AccountBalance extends Component {
  // Display account balance
  render() {
    return (
      <div>
        Balance: ${Number(this.props.accountBalance).toFixed(2)}
      </div>
    );
  }
}

export default AccountBalance;