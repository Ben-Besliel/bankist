'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// // Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const account5 = {
//   owner: 'Ben Besliel',
//   movements: [530, 7500, 600, 500, 190],
//   interestRate: 1,
//   pin: 5555,
// };

// const accounts = [account1, account2, account3, account4, account5];

// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2022-05-30T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-06-03T10:14:17.929Z',
    '2022-06-02T05:01:36.790Z',
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

const account3 = {
  owner: 'Ben Besliel',
  movements: [4000, 3440, -1050, -700, -210, -100, 800, 30],
  interestRate: 1.5,
  pin: 3333,

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
  currency: 'INR',
  locale: 'en-GB',
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const errorApp = document.querySelector('.errorContainer');
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

/**************************************************************** */
// FUNCTIONS

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**DISPLAYING MOVEMENTS */
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // console.log(movs);
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// console.log(containerMovements.innerHTML);

/**DISPLAYING BALANCE */
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

/**CALCULATION OF TOTAL DEPOSITS AND WITHDRAWAL : SUMMARY */
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, intrest) => acc + intrest, 0);
  labelSumInterest.textContent = formatCur(intrest, acc.locale, acc.currency);
};

/**CREATING USERNAMES FOR EACH ACCOUNT */
const createUsernames = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// LOGOUT TIMERS

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = time % 60;
    // console.log(sec);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // decrease 1s
    time--;
  };
  // set timer to 5 min
  let time = 120;

  // call the timer every sec
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// EVENT HANDLERS
// LOGIN FUNCTIONALITY
let currentAccout, timer;

// // FAKE ALWAYS LOGGED IN
// currentAccout = account1;
// updateUI(currentAccout);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // prevent from submitting
  e.preventDefault();
  currentAccout = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccout);

  if (currentAccout?.pin === Number(inputLoginPin.value)) {
    // Removing error messages if present
    errorApp.style.opacity = 0;
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccout.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time

    // EXPERIMENTING API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccout.locale,
      options
    ).format(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    //UpdateUI
    updateUI(currentAccout);
  } else {
    displayWrongCredentials();
  }
});

const displayWrongCredentials = function () {
  errorApp.style.opacity = 100;
  containerApp.style.opacity = 0;
};

// AMOUNT TRANSFER FUNCTIONALITY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // console.log(amount, receiverAcc);
  // Clear the input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccout.balance >= amount &&
    receiverAcc?.username !== currentAccout.username
  ) {
    // doing tranfer
    currentAccout.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccout.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //UpdateUI
    updateUI(currentAccout);

    //Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// LOAN FUNCTIONALITY
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccout.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccout.movements.push(amount);

      // Add loan date
      currentAccout.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccout);

      //Reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});
// CLOSE ACCOUNT FUNCTONALITY
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccout.username &&
    Number(inputClosePin.value) === currentAccout.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccout.username
    );
    console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// SORT FUNCTIONALITY
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccout, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EU()R', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());

// // SPLICE
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);

// // JOIN
// console.log(letters.join(' - '));

// const arr = [23, 45, 58];
// console.log(arr[0]);
// console.log(arr.at(0));

// // getting last Element
// console.log(arr.at(arr.length - 1));
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('Ben'.at(-1));

// // LOOPING ARRAYS: FOREACH
// /**continue and break statements do not work in foreach loop */

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} You withdraw ${Math.abs(movement)}`);
//   }
// }
// console.log('---- FOREACH ----');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1} You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1} You withdraw ${Math.abs(mov)}`);
//   }
// });

// // FOREACH WITH MAPS AND SETS

// // map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${_}: ${value}`);
// });

// // CODING CHALLANGE

// const julias = [3, 5, 2, 12, 7];
// const kates = [4, 1, 15, 8, 3];

// const checkDogs = function (arr1, arr2) {
//   const correctArr = arr1.slice();
//   correctArr.splice(0, 1);
//   correctArr.splice(-2);

//   console.log(correctArr);
//   console.log(arr2);

//   const finalArr = correctArr.concat(arr2);

//   const print = function (ele, i) {
//     const type = ele > 3 ? 'adult' : 'puppy';
//     console.log(` DOg number ${i + 1} is an ${type}, and is ${ele} years old`);
//   };

//   finalArr.forEach(print);
// };

// checkDogs(julias, kates);

// // DATA TRANSFORMATIONS WITH MAP, FILTER AND REDUCE
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// const converter = mov => mov * eurToUsd;
// const movementsUSD = movements.map(converter);

// console.log(movements, movementsUSD);

// const movementsUSDfor = [];

// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUsd);
// }
// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map((mov, i) => {
//   return `Movement ${i + 1} You ${
//     mov > 0 ? 'deposited' : 'withdraw'
//   } ${Math.abs(mov)}`;
// });

// console.log(movementsDescriptions);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) {
//   if (mov > 0) depositsFor.push(mov);
// }
// console.log(depositsFor);

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrawals);

// console.log(movements);

// // accumulator -> SNOWBALL
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + curr;
// }, 0);
// // const balance = movements.reduce((acc, curr) => acc + curr, 0);

// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) {
//   balance2 += mov;
// }
// console.log(balance2);

// // Maxium value
// const max = movements.reduce(function (acc, curr) {
//   // if (acc < curr) {
//   //   acc = curr;
//   // }

//   return acc < curr ? curr : acc;
// }, movements[0]);
// console.log(max);

// // CODING CHALLANGE 2

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(function (age) {
//     return age <= 2 ? 2 * age : 16 + age * 4;
//   });
//   // console.log(humanAges);
//   const age18 = humanAges.filter(function (age) {
//     return age >= 18;
//   });
//   let avgAge = age18.reduce(function (acc, age) {
//     return acc + age;
//   }, 0);

//   avgAge = avgAge / age18.length;
//   console.log(`Average age is ${avgAge} years`);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// // THE MAGIC OF CHAINING METHODS

// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// // CODNG CHALLANGE 3
// const calcAverageHumanAgeArr = ages => {
//   const avgAge = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => {
//       // console.log(arr);
//       return acc + age / arr.length;
//     }, 0);

//   console.log(avgAge);
// };

// calcAverageHumanAgeArr([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAgeArr([16, 6, 10, 5, 6, 1, 4]);

// // THE FIND METHOD
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// let acc;
// for (const acnt of accounts) {
//   if (acnt.owner === 'Jessica Davis') {
//     acc = acnt;
//   }
// }
// console.log(acc);

// // SOME AND EVERY METHODS
// console.log(movements);

// // EQUAITY
// console.log(movements.includes(-130));

// // CONDITION
// const anyDeposits = movements.some(mov => mov > 5000);
// console.log(anyDeposits);

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Seperate Callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// // FLAT AND FLAT MAP
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat());

// // const accountMovements = accounts.map(acc => acc.movements);
// // console.log(accountMovements);
// // const allMovements = accountMovements.flat();
// // console.log(allMovements);
// // const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// // console.log(overalBalance);

// // flat
// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// // flatMap
// const overalBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);

// // SORTING ARRAYS

// // Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// // Numbers
// console.log(movements);

// // return < 0 A,B (keep order)
// // return > 0 B,A (switch order)

// // Ascending
// // movements.sort((a, b) => {
// //   if (a > b) {
// //     return 1;
// //   }
// //   if (b > a) {
// //     return -1;
// //   }
// // });
// movements.sort((a, b) => a - b);
// console.log(movements);

// // Descending
// // movements.sort((a, b) => {
// //   if (a > b) {
// //     return -1;
// //   }
// //   if (b > a) {
// //     return 1;
// //   }
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);

// // MORE WAYS OF CREATING AND FILLING ARRAYS

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // Empty arrays + fill method
// const x = new Array(7);
// console.log(x);

// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// // Array.from()
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// // const dices = Array.from({ length: 100 }, () =>
// //   Math.trunc(1 + Math.random() * 6)
// // );
// // console.log(dices);

// const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementsUI);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );

//   console.log(movementsUI);
// });

// // ARRAY METHODS PRACTICE

// // 1.
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);

// console.log(bankDepositSum);

// // 2.
// // const numDeposits1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov >= 1000).length;

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);

// console.log(numDeposits1000);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// // 4.
// // this is a nice title -> This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLocaleLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

/***************************SECTION 12******************************* */
// // CONVERTING AND CHECKING NUMBERS
// console.log(23 === 23.0);
// console.log(0.1 + 0.2 === 0.3);

// // Conversion
// console.log(Number('23'));
// console.log(+'23');

// // Parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e23', 10));

// console.log(Number.parseInt('2.5rem', 10));
// console.log(Number.parseFloat('2.5rem', 10));

// // Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20rem'));
// console.log(Number.isNaN(23 / 0));

// // CHecking if a value is Number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20rem'));
// console.log(Number.isFinite(23 / 0));

// // MATH AND ROUNDING
// console.log(Math.sqrt(64));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 10, 25, 56, 21));
// console.log(Math.max(5, 10, 25, '56', 21));
// console.log(Math.max(5, 10, 25, '56px', 21));

// console.log(Math.min(5, 10, 25, 56, 21));
// console.log(Math.PI);
// console.log(Math.trunc(Math.random() * 6) + 1);

// // Generating a random number within a given range
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(10, 20));

// // Rounding numbers
// console.log(Math.trunc(23.3));

// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(-2.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(-3.3));
// console.log(Math.floor(23.9));

// // Rounding decimals
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.7123).toFixed(2));
// console.log(+(2.7452).toFixed(2));

// // THE REMAINDER OPERATOR
// console.log(5 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(9));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'orangered';
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor = 'blue';
//     }
//   });
// });

// // 287,460,000,000
// const diameter = 287_460_000_000;
// console.log(diameter);

// const priceCents = 345_99;
// console.log(priceCents);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.14_15;
// console.log(PI);

// console.log(Number('230000'));
// console.log(parseInt('230_000'));

// // WORKING WITH BIG INT

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(5465436549843547876412313213446523n);
// console.log(BigInt(546543654984354787));

// // Operations
// console.log(10000n + 20000n);
// const huge = 543648653748367456345n;
// const num = 23;
// console.log(huge * BigInt(num));
// console.log(typeof 20n);
// console.log(20n == 20);

// console.log(huge + 'is REALLY big!!');

// console.log(11n / 3n);
// console.log(10 / 3);

// CREATING DATES
// // Create a date
// const now = new Date();
// console.log(now);

// console.log(new Date('Jun 04 2022 12:07:43'));
// console.log(new Date('December 25, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 10, 31, 15, 23, 5));
// // (year,month,date,hr,min,sec)

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// // Workng with dates
// const future = new Date(2037, 10, 19, 15, 23, 5);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay()); // day of the week
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142237185000));

// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);

// const future = new Date(2037, 10, 19, 15, 23, 5);
// console.log(+future);
// console.log(future.getTime());

// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));
// console.log(days1);

// // INTERNATIONALIZING NUMBERS
// const num = 3636546.15;

// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'EUR',
//   // useGrouping: false,
// };

// console.log('US:    ', new Intl.NumberFormat('en-US', options).format(num));
// console.log('Germany:   ', new Intl.NumberFormat('de-DE', options).format(num));
// console.log('Syria:   ', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );

// TIMERS: SETTIMEOUT AND SETINTERVAL

// // setTimeout
// const ingredients = ['olives', 'spinach'];

// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting...');

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// // setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 5000);
