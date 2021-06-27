//const max = 100;

var zilliqa;
var utils;
var contract;
var currentHash;



// Todo Placeholder Contract Address
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

 
});

function connect() {
  return zilPay.wallet.connect();
}

function testZilPay() {
  if (!window.zilPay) {
    $('#zilpayModal > div > div > div.modal-body').html(`
    <div class="row justify-content-md-center">
      <h1 class="text-center text-warning">Please install <a href="https://zilpay.xyz/">ZilPay</a></h1>
      <img src="/img/home.png">
    </div>
    `);
    $('#zilpayModal').modal();
    return false;
  } else if (!window.zilPay.wallet.isEnable) {
    $('.modal-body').html(`
      <div class="row justify-content-md-center">
        <h1 class="text-center text-warning">Please unlock <a href="https://zilpay.xyz/">ZilPay</a></h1>
        <img src="/img/lock.png">
      </div>
    `);
    $('#zilpayModal').modal();
    return 'lock';
  } else if (zilPay.wallet.net !== 'testnet') {
    $('#zilpayModal > div > div > div.modal-body').html(`
    <div class="row justify-content-md-center">
      <h1 class="text-center text-warning">Please change network</h1>
      <img src="/img/network.png">
    </div>
    `);
    $('#zilpayModal').modal();
  }
  return true;
}


async function redeem() {
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
  let state = await contract.getState();
  console.log(state);
  let projectId = '1';
  const tx = await contract.call(
    'redeem', [{
      vname: "key",
      type: "String",
      value: projectId
    }],
    {
     gasPrice: gasPrice,
      gasLimit: utils.Long.fromNumber(9000)
    }
  );

  console.log(tx);
  

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


