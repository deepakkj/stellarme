import React from "react";

export default class SenderAccountHistory extends React.Component {
  constructor(props) {
    super(props);
  }
  renderAccountHistory = () => {
      // console.log('this.props.accountHistory', this.props.accountHistory);
    if (
      this.props.accountHistory &&
      this.props.accountHistory.records &&
      this.props.accountHistory.records.length
    ) {
      return this.props.accountHistory.records.map((item, index) => (
        <li key={index}>
          {item.fee_paid} on {item.created_at}
        </li>
      ));
    }
  };
  render() {
    return <ul>{this.renderAccountHistory()}</ul>;
  }
}
