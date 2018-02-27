import React from "react";
import { bindActionCreators } from "redux";
import { initStore, addNewPairtoDB, loaderStart } from "../store";
import withRedux from "next-redux-wrapper";

import Layout from "../components/layout";

class GetMyLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      publicKey: "",
      loaderInfo: {},
      addedNewPairInfo: {
        isNewPairAddSuccess: "",
        addedUsername: ""
      }
    };
  }
  componentDidMount() {
    console.log("cdm props", this.props);
  }
  componentWillReceiveProps(nextProps) {
    // console.log("cwrp:", this.props);
    // console.log("nextProps:", nextProps);
    if (this.props.addedNewPairInfo !== nextProps.addedNewPairInfo) {
      this.setState({ addedNewPairInfo: nextProps.addedNewPairInfo });
    }
  }

  handlePublicKeyChange = e => {
    this.setState({ publicKey: e.target.value });
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  handleSubmitNewPair = () => {
    console.log("submit");
    this.setState({ isNewPairAddSuccess: "" }, () =>
      this.props.addNewPairtoDB(this.state.username, this.state.publicKey)
    );
  };

  render() {
    return (
      <Layout>
        <div>{this.props.loaderInfo.loaderText}</div>
        <div>
          <input
            type="text"
            value={this.state.username}
            onChange={this.handleUsernameChange}
          />
          <input
            type="text"
            value={this.state.publicKey}
            onChange={this.handlePublicKeyChange}
          />
          <button onClick={this.handleSubmitNewPair}>Add this</button>
        </div>
        <div>
          {this.state.addedNewPairInfo.isNewPairAddSuccess ? (
            <p>
              You personal link created. Here's it is <a href={`/${this.state.addedNewPairInfo.addedUsername}`} >www.stellar.com/{
                this.state.addedNewPairInfo.addedUsername
              }</a>
            </p>
          ) : this.state.addedNewPairInfo.isNewPairAddSuccess === false ? (
            <p>Username already exists please use another name.</p>
          ) : (
            ""
          )}
        </div>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addNewPairtoDB: bindActionCreators(addNewPairtoDB, dispatch)
  };
}
function mapStateToProps(state) {
  return {
    loaderInfo: state.loaderInfo,
    addedNewPairInfo: state.addedNewPairInfo
  };
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  GetMyLink
);
