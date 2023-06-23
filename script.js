'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-06-20T17:01:17.194Z',
    '2023-06-22T23:36:17.929Z',
    '2023-06-23T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const formatDateMovement = function(date){
  const calcDayspassed = function(date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 *24));
  }
  const daysPassed = calcDayspassed(new Date(), date);
  console.log(daysPassed)
  
  if(daysPassed === 0){
    return 'Today';
  }

  if(daysPassed === 1) {
    return 'Yesterday';
  }

  if(daysPassed <= 7) {
    return `${daysPassed} days ago`
  }
  else {
    const day = `${date.getDate()}`.padStart(2,0);
    const month = `${date.getMonth() + 1}`.padStart(2,0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}


const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? account.movements.slice().sort(function(a,b) {
    return a - b
  }) : account.movements

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const date = new Date(account.movementsDates[i]);
    const displayDate = formatDateMovement(date);
    console.log(displayDate);
    const html = 
                `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                  <div class="movements__date">${displayDate}</div>
                  <div class="movements__value">${mov.toFixed(2)}€</div>
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
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
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
  labelSumInterest.textContent = `${interest.toFixed(2)}€`
}

const updateUI = function(acc, sorted) {
  // Display movements
  displayMovements(acc,sorted);

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
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2,0);
  const month = `${now.getMonth() + 1}`.padStart(2,0);
  const year = now.getFullYear();
  const hours = `${now.getHours()}`.padStart(2,0);
  const min = `${now.getMinutes()}`.padStart(2,0);
  labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;

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

  if(amount > 0 && receiverAcc?.username !== currentAccount.username && currentAccount.balance >= amount && receiverAcc) {
    // Doing transfer
    receiverAcc.movements.push(amount)
    currentAccount.movements.push(-amount)

    // Add date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    
    // Update UI
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
  const amount = Math.floor(inputLoanAmount.value)
  if(amount >= 0 && currentAccount.movements.some(function(mov) {
      return mov >= amount * 0.1
  })){
    // Add movement
    currentAccount.movements.push(amount)

    // Add date
    currentAccount.movementsDates.push(new Date());

    // Update UI
    updateUI(currentAccount)
  }
  inputLoanAmount.value = ''
})

let sorted = false
btnSort.addEventListener('click', function(e) {
  e.preventDefault()
  displayMovements(currentAccount, !sorted)
  sorted = !sorted

})