import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import StellarSdk from "stellar-sdk";

const stellarMeInitialState = {
  senderAccountDetails: {},
  senderAccountHistory: {},
  paymentDetails: {},
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
  GET_SENDER_ACCOUNT_DETAILS: "GET_SENDER_ACCOUNT_DETAILS",
  LOAD_SENDER_ACCOUNT_HISTORY: "LOAD_SENDER_ACCOUNT_HISTORY",
  SEND_PAYMENT: "SEND_PAYMENT"
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
    case actionTypes.LOAD_SENDER_ACCOUNT_HISTORY:
      return {
        ...state,
        senderAccountHistory: action.payload.senderAccountHistory
      };
    case actionTypes.SEND_PAYMENT:
      return {
        ...state,
        paymentDetails: action.payload.paymentDetails
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
  const receiverPublicAddress = receiverObject.length
    ? receiverObject[0].publicKey
    : "";
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

export const sendPayment = (
  sourceSecretKey,
  receiverPublicKey,
  amount
) => dispatch => {
  console.log(sourceSecretKey, receiverPublicKey, amount);
  // Derive Keypair object and public key (that starts with a G) from the secret
  var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
  var sourcePublicKey = sourceKeypair.publicKey();

  // Configure StellarSdk to talk to the horizon instance hosted by Stellar.org
  // To use the live network, set the hostname to 'horizon.stellar.org'
  var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

  // Uncomment the following line to build transactions for the live network. Be
  // sure to also change the horizon hostname.
  // StellarSdk.Network.usePublicNetwork();
  StellarSdk.Network.useTestNetwork();

  // Transactions require a valid sequence number that is specific to this account.
  // We can fetch the current sequence number for the source account from Horizon.
  server
    .loadAccount(sourcePublicKey)
    .then(function(account) {
      var transaction = new StellarSdk.TransactionBuilder(account)
        // Add a payment operation to the transaction
        .addOperation(
          StellarSdk.Operation.payment({
            destination: receiverPublicKey,
            // The term native asset refers to lumens
            asset: StellarSdk.Asset.native(),
            // Specify 350.1234567 lumens. Lumens are divisible to seven digits past
            // the decimal. They are represented in JS Stellar SDK in string format
            // to avoid errors from the use of the JavaScript Number data structure.
            amount
          })
        )
        // Uncomment to add a memo (https://www.stellar.org/developers/learn/concepts/transactions.html)
        // .addMemo(StellarSdk.Memo.text('Hello world!'))
        .build();

      // Sign this transaction with the secret key
      // NOTE: signing is transaction is network specific. Test network transactions
      // won't work in the public network. To switch networks, use the Network object
      // as explained above (look for StellarSdk.Network).
      transaction.sign(sourceKeypair);

      // Let's see the XDR (encoded in base64) of the transaction we just built
      console.log("1", transaction.toEnvelope().toXDR("base64"));

      // Submit the transaction to the Horizon server. The Horizon server will then
      // submit the transaction into the network for us.
      server
        .submitTransaction(transaction)
        .then(function(transactionResult) {
          dispatch({
            type: actionTypes.SEND_PAYMENT,
            payload: { paymentDetails: transactionResult }
          })
          console.log(JSON.stringify(transactionResult, null, 2));
          console.log("\nSuccess! View the transaction at: ");
          console.log(transactionResult._links.transaction.href);
        })
        .catch(function(err) {
          console.log("An error has occured:");
          console.log(err);
        });
    })
    .catch(function(e) {
      console.error(e);
    });
};

export const getSenderAccountDetails = sourceSecretKey => dispatch => {
  var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
  var sourcePublicKey = sourceKeypair.publicKey();
  // var receiverPublicKey =
  //   "GBAWHX3GPP3SYUZ5AWNAYUL6AMCUYYSRROONNR4JISQ34KWCSLN3GNV5";
  var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

  server
    .accounts()
    .accountId(sourcePublicKey)
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

export const getSenderAccountHistory = sourcePublicKey => dispatch => {
  console.log("red. sourcePublicKey:", sourcePublicKey);
  var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

  server
    .transactions()
    .forAccount(sourcePublicKey)
    .call()
    .then(function(senderAccountHistory) {
      console.log("senderAccountHistory", senderAccountHistory);
      return dispatch({
        type: actionTypes.LOAD_SENDER_ACCOUNT_HISTORY,
        payload: { senderAccountHistory }
      });
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
