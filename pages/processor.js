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
      loaderInfo: {},
      enableTransferButton: false
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
    const receiverUsername =
      this.props.url.query.cProps &&
      this.props.url.query.cProps.reqParams.username
        ? this.props.url.query.cProps.reqParams.username
        : "";
    const receiverAmount =
      this.props.url.query.cProps &&
      this.props.url.query.cProps.reqParams.amount
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

  handleEnableSignInButton = () =>
    this.setState({ enableTransferButton: true });

  handleAccountView = () => {
    console.log("in account view");
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
        <div className="row">
            <div>{this.props.loaderInfo.loaderText}</div>
            <div className="col-xs-12 col-md-offset-3 col-md-6">
              <div className="send-money-card">
                <div className="send-money-card-header">
                  <div className="profile-image-container">
                    <div className="profile-header-img current-profile-img">
                    </div>
                  </div>
                </div>
                <div className="send-money-card-body">
                <h4 className="text-center">Send money</h4>
                <div>
                  {this.state.receiverAccountDetails.receiverPublicAddress === "" ? (
                    <p className="receiver-address">
                      <input
                        type="text"
                        placeholder="Enter Receiver Address"
                        defaultValue={
                          this.state.receiverAccountDetails.receiverPublicAddress
                        }
                        class="form-control"
                      />
                    </p>
                  ) : (
                    <p className="receiver-address">
                      <span>Receiver Address: </span>
                      <span>{this.state.receiverAccountDetails.receiverPublicAddress}</span>
                    </p>
                  )}
                  <div className="amount-transfer text-center">
                    <label class="sr-only">Amount to transfer</label>
                    <input
                      type="number"
                      max={this.state.receiverAccountDetails.receiverAmount}
                      value={this.state.receiverAccountDetails.receiverAmount}
                      onChange={this.handleReceiverAmountChange}
                      class="form-control text-center"
                    />
                    <span>{this.state.receiverAccountDetails.receiverAssetType}</span>
                  </div>
                </div>
                {!this.state.enableTransferButton ? (
                  <button
                    onClick={this.handleEnableSignInButton}
                    className="btn btn-primary"
                  >
                    Let me Sign In
                  </button>
                ) : (
                  ""
                )}
                {this.state.enableTransferButton ? (
                  <div>
                    <p className="secret-key">
                      <span>Secret Key: </span>
                      <input
                        required
                        type="text"
                        onChange={this.handleSecretKey}
                        value={this.state.secretKey}
                        class="form-control text-center"
                      />
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={this.handleAccountView}
                      disabled={!this.state.secretKey.length}
                      className="btn btn-primary"
                    >
                      Sign In and Show Balance
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-md-offset-3 col-md-6">
            <div className="account-history-wrapper text-center">
              <h4>Account Balance</h4>
              <ul>
                {this.state.senderAccountDetails &&
                  this.state.senderAccountDetails.balances &&
                  this.state.senderAccountDetails.balances.length &&
                  this.state.senderAccountDetails.balances.map((item, index) => (
                    <li key={index} className="text-info">
                      <div className="balance-list-item">
                        <span className="asset-type">{item.asset_type} : </span><span className="item-balance">{item.balance} Lumens</span>
                      </div>
                    </li>
                  ))}
              </ul>
              <button
                onClick={this.handleTransaction}
                className="btn btn-primary"
              >
                Transfer Now
              </button>
              {this.props.paymentDetails &&
              this.props.paymentDetails.isPaymentSuccess ? (
                <p><img className="center-block" src="/static/success.svg" />Payment Success.</p>
              ) : this.props.paymentDetails &&
              this.props.paymentDetails.isPaymentSuccess === false ? (
                <p><img className="center-block" src="/static/failed.svg" />Failed</p>
              ) : (
                ""
              )}
            </div>
          </div>

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
    receiverAccountDetails: state.receiverAccountDetails,
    paymentDetails: state.paymentDetails
  };
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  StellarMe
);
