/*==================================================
src/components/Credits.js

Credits page view.
Responsibilities for Assignment 3:
- Display the current Account Balance
- List all credits (from API + user-added)
- Provide a form to add a new credit with current date
==================================================*/
import {Link} from 'react-router-dom';
import AccountBalance from './AccountBalance';

const Credits = (props) => {
  // Render the list of Credit items
  const creditsView = () => {
    const { credits } = props;
    return (credits || []).map((credit) => {
      const date = (credit.date || '').slice(0, 10);
      const amount = Number(credit.amount || 0).toFixed(2);
      return (
        <li key={credit.id}>
          {credit.description} - ${amount} - {date}
        </li>
      );
    });
  }

  return (
    <div>
      <h1>Credits</h1>
      {/* Show the derived account balance (sum credits - sum debits) */}
      <AccountBalance accountBalance={props.accountBalance} />

      <ul>
        {creditsView()}
      </ul>

      {/* Submit uses props.addCredit provided by App.js */}
      <form onSubmit={props.addCredit}>
        <div>
          <label>Description: </label>
          <input type="text" name="description" required />
        </div>
        <div>
          <label>Amount: </label>
          <input type="number" name="amount" step="0.01" required />
        </div>
        <button type="submit">Add Credit</button>
      </form>

      <br/>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

export default Credits;