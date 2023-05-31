'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = 
                `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                  <div class="movements__value">${mov}€</div>
                </div>`
    containerMovements.insertAdjacentHTML('afterbegin',html);

  })
}

const createUsername = function(accounts) {
  accounts.forEach(function(acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(function(name) {
        return name[0]
    }).join('')
  })
}

const calcAndDisplayBalance = function(acc) {
  const balance = acc.movements.reduce(function(acc, mov) {
    return acc + mov;
  },0)

  acc.balance = balance;
  labelBalance.textContent = `${acc.balance}€`;
}

const calcDisplaySummary = function(account) {

  const income = movements.filter(function(mov) {
    return account.mov > 0;
  }).reduce(function(acc, mov) {
    return acc + mov;
  },0)

  const out = account.movements.filter(function(mov) {
    return mov < 0;
  }).reduce(function(acc, mov) {
    return acc + mov;
  },0)

  const interest = account.movements.filter(function(mov) {
    return mov > 0;
  }).map(function(deposit) {
    return deposit * account.interestRate / 100;
  }).filter(function(int) {
      return int > 1;
  }).reduce(function(acc, int) {
    return acc + int;
  }, 0)

  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`
}

const updateUI = function(acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcAndDisplayBalance(acc)

  // Display summary
  calcDisplaySummary(acc)
}

createUsername(accounts)

let currentAccount;

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  currentAccount = accounts.find(function(acc) {
    return acc.username === inputLoginUsername.value
  })

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display welcome message and make visible
    labelWelcome.textContent = `Welcome ${currentAccount.owner}`
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value ='' 
    inputLoginPin.value = '';
    inputLoginPin.blur()

    updateUI(currentAccount)
  }
})

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault()

  const amount = Number(inputTransferAmount.value);
  const to = inputTransferTo.value;

  const receiverAcc = accounts.find(function(acc) {
    return acc.username === to;
  })

  if(amount > 0 && receiverAcc?.username !== currentAccount.username && currentAccount.balance >= amount && receiverAcc){
    receiverAcc.movements.push(amount)
    currentAccount.movements.push(-amount)
    updateUI(currentAccount)
  }

  inputTransferAmount.value = inputTransferTo.value = ''
  inputTransferAmount.blur()
  
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault()
  console.log( Number(inputClosePin) === currentAccount.pin)
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
 
    const index = accounts.findIndex(function(acc) {
      return acc.username === currentAccount.username
    })
    
    accounts.splice(index,1)
  }
  containerApp.style.opacity = 0
})

btnLoan.addEventListener('click', function(e) {
  e.preventDefault()
  const amount = Number(inputLoanAmount.value)
  if(amount >= 0 && currentAccount.movements.some(function(mov) {
      return mov >= amount * 0.1
  })){
    currentAccount.movements.push(amount)
    updateUI(currentAccount)
  }
  inputLoanAmount.value = ''
})


