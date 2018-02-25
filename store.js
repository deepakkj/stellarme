import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import StellarSdk from "stellar-sdk";

const stellarMeInitialState = {
  senderAccountDetails: {},
  receiverAccountDetails: {
    receiverPublicAddress: "",
    receiverAmount: "1",
    receiverAssetType: "XLM"
  },
  loaderInfo: {
    loaderStatus: false,
    loaderText: ""
  }
};

export const actionTypes = {
  GET_RECEIVER_DETAILS: "GET_RECEIVER_DETAILS",
  LOADER_START: "LOADER_START",
  LOADER_END: "LOADER_END",
  GET_SENDER_ACCOUNT_DETAILS: "GET_SENDER_ACCOUNT_DETAILS"
};

// REDUCERS
export const reducer = (state = stellarMeInitialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECEIVER_DETAILS:
      return Object.assign({}, state, {
        receiverAccountDetails: {
          ...action.payload.receiverAccountDetails
        }
      });
    case actionTypes.GET_SENDER_ACCOUNT_DETAILS:
      return {
        ...state,
        senderAccountDetails: action.payload.senderAccountDetails
      };
    case actionTypes.LOADER_START:
      return {
        ...state,
        loaderInfo: {
          loaderStatus: true,
          loaderText: action.payload.loaderText
        }
      };
    case actionTypes.LOADER_END:
      return {
        ...state,
        loaderInfo: {
          loaderStatus: false,
          loaderText: ""
        }
      };
    default:
      return state;
  }
};

// ACTIONS
export const getReceiverAccountDetails = (
  receiverUsername,
  receiverAmount
) => dispatch => {
  const stellarTestAccounts = [
    {
      username: "sudu",
      publicKey: "GB75YERUNUZVVIDVEZ4XICJMZNX6VESSRYRQNI6ZZJ5QVIGN5DJPSD5W"
    },
    {
      username: "madhu",
      publicKey: "GBAWHX3GPP3SYUZ5AWNAYUL6AMCUYYSRROONNR4JISQ34KWCSLN3GNV5"
    }
  ];
  const receiverObject = stellarTestAccounts.filter(
    item => receiverUsername === item.username
  );
  const receiverPublicAddress = receiverObject.length ? receiverObject[0].publicKey : '';
  console.log("receiverObject", receiverObject);
  return dispatch({
    type: actionTypes.GET_RECEIVER_DETAILS,
    payload: {
      receiverAccountDetails: {
        receiverPublicAddress,
        receiverAmount: receiverAmount,
        receiverAssetType: "XLM"
      }
    }
  });
};

export const getSenderAccountDetails = sourceSecretKey => dispatch => {
  var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
  var sourcePublicKey = sourceKeypair.publicKey();
  var receiverPublicKey =
    "GBAWHX3GPP3SYUZ5AWNAYUL6AMCUYYSRROONNR4JISQ34KWCSLN3GNV5";
  var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

  server
    .accounts()
    .accountId(receiverPublicKey)
    .call()
    .then(function(senderAccountDetails) {
      // console.log(senderAccountDetails);
      return dispatch({
        type: actionTypes.LOADER_END
      }).then(
        dispatch({
          type: actionTypes.GET_SENDER_ACCOUNT_DETAILS,
          payload: { senderAccountDetails }
        })
      );
    })
    .catch(function(err) {
      console.error(err);
    });
};

export const loaderStart = loaderText => dispatch => {
  return dispatch({
    type: actionTypes.LOADER_START,
    payload: { loaderText: loaderText }
  });
};

export const loaderEnd = () => dispatch => {
  return dispatch({
    type: actionTypes.LOADER_END,
    payload: { loaderText: loaderText }
  });
};

export const initStore = (initialState = stellarMeInitialState) => {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};
