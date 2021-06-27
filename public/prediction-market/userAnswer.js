var contractAddress = '0xf4175af5f6f77dc7f1457be3fd5f03b9698d61fe';
window.addEventListener("load", async () => {
    const test = testZilPay();
   if (!test) {
      return null;
    }
    zilliqa = window.zilPay;
    utils = zilPay.utils;
    console.log(utils);
    contract = zilliqa.contracts.at(contractAddress);
   if (!zilPay.wallet.isConnect) {
      const status = await connect();
      console.log('status', status);
    }
  
    if (zilPay.wallet.isConnect) {
      window.zilPay.wallet.observableAccount().subscribe(account => {
        $('#myaddress').text(account.bech32);
      });
    }
  
    window.zilPay.wallet.observableNetwork().subscribe(() => {
      testZilPay();
    });
  
    await getQuestion();
   
  });
async function getQuestion() {
  console.log("abc");
    contract = zilliqa.contracts.at(contractAddress);
    let state = await contract.getState();
    let question = state['projectMapping']['1']['arguments'][0];
   
    $('#questionDetails').text(question);
    $('#oracleQuestion').text(question);
 }

 async function onPredict(getAnswer,projectId) {
    const test = testZilPay();
  
    if (!test) {
      return null;
    } else if (test == 'lock') {
      return null;
    }
   const gasPrice = utils.units.toQa(
      '1000', utils.units.Units.Li
    );
    contract = zilliqa.contracts.at(contractAddress);
    const tx = await contract.call(
      'userAnswer', [{
        vname: "projectId",
        type: "String",
        value: projectId
      },{
        vname: "response",
        type: "String",
        value: getAnswer
      }],
      {
     //   amount: amount,
       amount: 1000000000000,
        gasPrice: gasPrice,
        gasLimit: utils.Long.fromNumber(9000)
      }
    );
  
    $('body > div.container.mt-5 > div > div > div.form-group > button').hide();
    $('#spiner').show();
    currentHash = tx.TranID;
    console.log(tx);
  
    let int = setInterval(async () => {
      let utils = zilPay.utils;
  
      window.zilPay.blockchain
             .getTransaction(currentHash)
             .then(tx => {
                $('body > div.container.mt-5 > div > div > div.form-group > button').show();
                $('#spiner').hide();
  
            
                $('#zilpayModal').modal();
                clearInterval(int);
             })
             .catch(err => console.log(err));
    }, 4000);
  }