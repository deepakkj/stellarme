import React from "react";
import { bindActionCreators } from "redux";
import {
  initStore,
  getSenderAccountDetails,
  loaderStart,
  getReceiverAccountDetails
} from "../store";
import withRedux from "next-redux-wrapper";

import Layout from "../components/layout";

class StellarMe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secretKey: "SAVWL4JNTNYFAYESU7IKN5S3UDI4OROFZR3EK5UUH4EZNBIJDVV7I5KX",
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
    const receiverUsername = this.props.url.query.cProps.reqParams.username
      ? this.props.url.query.cProps.reqParams.username
      : "";
    const receiverAmount = this.props.url.query.cProps.reqParams.amount
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
  };

  handleAccountView = () => {
    console.log("in account view");
    // var sourceSecretKey = this.state.secretKey;
    this.props.loaderStart("Getting Account details");
    this.props.getSenderAccountDetails(this.state.secretKey);
  };

  render() {
    return (
      <Layout>
        <div>{this.props.loaderInfo.loaderText}</div>
        <input
          type="text"
          onChange={this.handleSecretKey}
          value={this.state.secretKey}
        />
        <button onClick={this.handleAccountView}>Show</button>
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
          </div>
          <div>
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
    getReceiverAccountDetails: bindActionCreators(
      getReceiverAccountDetails,
      dispatch
    )
  };
}
function mapStateToProps(state) {
  return {
    loaderInfo: state.loaderInfo,
    senderAccountDetails: state.senderAccountDetails,
    receiverAccountDetails: state.receiverAccountDetails
  };
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  StellarMe
);
