import React from "react";
import { bindActionCreators } from "redux";
import {
  initStore,
  getSenderAccountDetails,
  loaderStart,
  getSenderAccountHistory,
  getReceiverAccountDetails,
  sendPayment
} from "../store";
import withRedux from "next-redux-wrapper";

import Layout from "../components/layout";
import SenderAccountHistory from "../components/SenderAccountHistory";

class StellarMe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secretKey: "SAY7IXRUGERQHGJ6S6EVCHYTYBXXOCDGE22W5LG74T3RUAW5WXBBNXTL",
      senderAccountDetails: {},
      receiverAccountDetails: {
        receiverPublicAddress: "",
        receiverAmount: 1,
        receiverAssetType: "XLM"
      },
      loaderInfo: {}
    };
  }
  componentDidMount() {
    console.log("cdm props", this.props);
    // if (
    //     1
    //   this.props.url.query &&
    //   this.props.url.query.cProps &&
    //   this.props.url.query.cProps.reqParams &&
    //   this.props.url.query.cProps.reqParams.length
    // ) {
    console.log("inside cdm if");
    const receiverUsername = this.props.url.query.cProps && this.props.url.query.cProps.reqParams.username
      ? this.props.url.query.cProps.reqParams.username
      : "";
    const receiverAmount = this.props.url.query.cProps && this.props.url.query.cProps.reqParams.amount
      ? this.props.url.query.cProps.reqParams.amount
      : 1;
    this.props.getReceiverAccountDetails(receiverUsername, receiverAmount);
    // }
  }
  componentWillReceiveProps(nextProps) {
    // console.log("cwrp:", this.props);
    console.log("nextProps:", nextProps);
    if (this.props.senderAccountDetails !== nextProps.senderAccountDetails) {
      this.setState({ senderAccountDetails: nextProps.senderAccountDetails });
    }
    if (
      this.props.receiverAccountDetails !== nextProps.receiverAccountDetails
    ) {
      this.setState({
        receiverAccountDetails: nextProps.receiverAccountDetails
      });
    }
    if (this.props.senderAccountHistory !== nextProps.senderAccountHistory) {
      this.setState({
        senderAccountHistory: nextProps.senderAccountHistory
      });
    }
  }

  handleSecretKey = e => {
    this.setState({ secretKey: e.target.value });
  };

  handleReceiverAmountChange = e => {
    this.setState({
      receiverAccountDetails: {
        ...this.state.receiverAccountDetails,
        receiverAmount: e.target.value
      }
    });
  };

  handleTransaction = () => {
    console.log("in confirm trans");
    this.props.sendPayment(
      this.state.secretKey,
      this.state.receiverAccountDetails.receiverPublicAddress,
      this.state.receiverAccountDetails.receiverAmount
    );
  };

  handleAccountView = () => {
    console.log("in account view");
    // var sourceSecretKey = this.state.secretKey;
    this.props.loaderStart("Getting Account details");
    this.props.getSenderAccountDetails(this.state.secretKey);
  };

  handleViewAccountHistory = () => {
    console.log("acc his");
    if (
      this.state.senderAccountDetails &&
      this.state.senderAccountDetails.account_id
    ) {
      this.props.getSenderAccountHistory(
        this.state.senderAccountDetails.account_id
      );
    }
  };

  // renderAccountHistory = () => {
  //   if(this.state.senderAccountHistory && this.state.senderAccountHistory.records && this.state.senderAccountHistory.records.length){
  //     this.state.senderAccountHistory.records.map(item => <li>{item.fee_paid} on {item.created_at}</li>);
  //   }
  // };

  render() {
    return (
      <Layout>
        <div>{this.props.loaderInfo.loaderText}</div>

        <div>
          <h2>Send money</h2>
          <div>
            Receiver Address:
            {this.state.receiverAccountDetails.receiverPublicAddress === "" ? (
              <input
                type="text"
                defaultValue={
                  this.state.receiverAccountDetails.receiverPublicAddress
                }
              />
            ) : (
              this.state.receiverAccountDetails.receiverPublicAddress
            )}
            Amount:
            <input
              type="number"
              max={this.state.receiverAccountDetails.receiverAmount}
              value={this.state.receiverAccountDetails.receiverAmount}
              onChange={this.handleReceiverAmountChange}
            />
            {this.state.receiverAccountDetails.receiverAssetType}
          </div>
          <button onClick={this.handleTransaction}>Transfer Now</button>
        </div>
        <hr />
        <div>
          <input
            type="text"
            onChange={this.handleSecretKey}
            value={this.state.secretKey}
          />
          {this.state.senderAccountDetails &&
          this.state.senderAccountDetails.account_id ? (
            <button onClick={this.handleViewAccountHistory}>
              View History
            </button>
          ) : (
            <button onClick={this.handleAccountView}>Sign In</button>
          )}
        </div>
        <hr />
        <div>
          <h2>Account Balance</h2>
          <ul>
            {this.state.senderAccountDetails &&
              this.state.senderAccountDetails.balances &&
              this.state.senderAccountDetails.balances.length &&
              this.state.senderAccountDetails.balances.map((item, index) => (
                <li key={index}>
                  {item.asset_type} : {item.balance} Lumens
                </li>
              ))}
          </ul>
        </div>
        <hr />
        <div>
          <h2>Account History</h2>
          <SenderAccountHistory
            accountHistory={this.state.senderAccountHistory}
          />
        </div>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getSenderAccountDetails: bindActionCreators(
      getSenderAccountDetails,
      dispatch
    ),
    loaderStart: bindActionCreators(loaderStart, dispatch),
    getSenderAccountHistory: bindActionCreators(
      getSenderAccountHistory,
      dispatch
    ),
    getReceiverAccountDetails: bindActionCreators(
      getReceiverAccountDetails,
      dispatch
    ),
    sendPayment: bindActionCreators(sendPayment, dispatch)
  };
}
function mapStateToProps(state) {
  return {
    loaderInfo: state.loaderInfo,
    senderAccountDetails: state.senderAccountDetails,
    senderAccountHistory: state.senderAccountHistory,
    receiverAccountDetails: state.receiverAccountDetails
  };
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  StellarMe
);
