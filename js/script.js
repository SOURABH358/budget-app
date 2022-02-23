const expenseTitle = document.querySelector("#expense-title");
const expenseValue = document.querySelector("#expense-value");
const incomeTitle = document.querySelector("#income-title");
const incomeValue = document.querySelector("#income-value");
const expenseAdd = document.querySelector(".expense-add");
const incomeAdd = document.querySelector(".income-add");
const expenseList = document.querySelector('#expense');
const incomeList = document.querySelector('#income');
const allList = document.querySelector('.all ul');
const tabs = document.querySelector('.tabs');
const income = document.querySelector('.income-value');
const outcome = document.querySelector('.outcome-value');
const balance = document.querySelector('.value');
const root = document.querySelector(':root');
const p = getComputedStyle(root).getPropertyValue('--p');

let editFlag = false;
let editExpense ;
let editIncome ;

// display on load

window.addEventListener('DOMContentLoaded',()=>{
    // display expense list
    let arr1 = localStorage.getItem('expense')?JSON.parse(localStorage.getItem('expense')):[];
    arr1.forEach(item=>{
        displayExpense(item.id,item.title,item.value)
    })
    // display income list
    let arr2 = localStorage.getItem('income')?JSON.parse(localStorage.getItem('income')):[];
    arr2.forEach(item=>{
        displayIncome(item.id,item.title,item.value);
    })
    // display All list
    displayAll();
    // display balance
    displayBalance();
    // change background
    changeBackground();
})
// display list

tabs.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
        Array.from(e.currentTarget.children).forEach(element => {
            element.classList.remove("active");
        });
        document.querySelector(`[data-id = ${e.target.dataset.id}]`).classList.add('active');
        document.querySelector('.expense').classList.remove('show');
        document.querySelector('.income').classList.remove('show');
        document.querySelector('.all').classList.remove('show');

        document.querySelector(`.${e.target.dataset.id}`).classList.add('show');

    }
})
// add to expense List

expenseAdd.addEventListener('click', () => {
    
    if (expenseTitle.value.length && expenseValue.value.length&&!editFlag) {
        const id = generateId();
        const element = document.createElement('li');
        element.className = "item";
        element.setAttribute('data-id', id);
        element.innerHTML = `<p style = "color: #FF5F1F;">${expenseTitle.value}</p>
        <p style = "color: #FF5F1F;">$${expenseValue.value}</p>
        <div class="icons">
            <i class="fa-solid fa-pen-to-square" id="edit"></i>
            <i class="fa-solid fa-trash" id="delete"></i>
        </div>`;
        expenseList.append(element);

// add to local storage
        
        addToLocalStorage(expenseTitle.value, expenseValue.value, id, 'expense');
        
        expenseTitle.value = "";
        expenseValue.value = "";
        
// display all
        displayAll();
        displayBalance();
        changeBackground();

// delete the element
        element.querySelector('#delete').addEventListener('click', () => {
            deleteFromLocalStorage(element.dataset.id, 'expense');
            deleteFromLocalStorage(element.dataset.id,'all');
            element.remove();
            displayAll();
            displayBalance()
            changeBackground();
        })

// edit the element
        element.querySelector('#edit').addEventListener('click',editExpenseList)
    }
    else if(expenseTitle.value.length && expenseValue.value.length&&editFlag){
        editExpense.children[0].innerHTML = expenseTitle.value;
        editExpense.children[1].innerHTML = '$' + expenseValue.value;
        editLocalStorage(editExpense.dataset.id,'expense',expenseTitle.value,expenseValue.value);
        expenseTitle.value = "";
        expenseValue.value = "";
        editFlag = false;
        editExpense = null;
        displayAll();
        displayBalance();
    }
    else {
        alert('fields cannot be empty');
    }

})
// add to income list

incomeAdd.addEventListener('click', () => {
    if (incomeTitle.value.length && incomeValue.value.length&&!editFlag) {
        const id = generateId();
        const element = document.createElement('li');
        element.setAttribute('data-id', id);
        element.className = "item";
        element.innerHTML = `<p>${incomeTitle.value}</p>
        <p>$${incomeValue.value}</p>
        <div class="icons">
            <i class="fa-solid fa-pen-to-square" id="edit"></i>
            <i class="fa-solid fa-trash" id="delete"></i>
        </div>`;
        incomeList.append(element);

// add to local storage

        addToLocalStorage(incomeTitle.value, incomeValue.value, id, 'income');

// display all

        displayAll();
        displayBalance();
        changeBackground();
        incomeTitle.value = "";
        incomeValue.value = "";
// delete the element
        element.querySelector('#delete').addEventListener('click', () => {
            deleteFromLocalStorage(element.dataset.id, 'income');
            deleteFromLocalStorage(element.dataset.id,'all')
            element.remove();
            displayAll();
            displayBalance();
            changeBackground();
        })
        element.querySelector('#edit').addEventListener('click',editIncomeList);
    }
    else if(incomeTitle.value.length && incomeValue.value.length&&editFlag){
        editIncome.children[0].innerHTML = incomeTitle.value;
        editIncome.children[1].innerHTML = '$'+incomeValue.value;
        editLocalStorage(editIncome.dataset.id,'income',incomeTitle.value,incomeValue.value);
        incomeTitle.value = "";
        incomeValue.value = "";
        editFlag = false;
        editIncome = null;
        displayAll();
        displayBalance();
        
    }
    else {
        alert('fields cannot be empty');
    }

})

function displayAll(){
    let arr = localStorage.getItem('all')?JSON.parse(localStorage.getItem('all')):[];
    allList.innerHTML = '';
    arr.forEach(item=>{
        if(item.check==='income'){
            const element = document.createElement('li');
            element.setAttribute('data-id', item.id);
            element.className = "item";
            element.innerHTML = `<p>${item.title}</p>
            <p>$${item.value}</p>`;
            allList.append(element);
        }
        else{
            const element = document.createElement('li');
            element.setAttribute('data-id', item.id);
            element.className = "item";
            element.innerHTML = `<p  style = "color: #FF5F1F;">${item.title}</p>
            <p  style = "color: #FF5F1F;">$${item.value}</p>`;
            allList.append(element);
        }
    })
}
function displayExpense(id,title,value){
    const element = document.createElement('li');
        element.className = "item";
        element.setAttribute('data-id', id);
        element.innerHTML = `<p style = "color: #FF5F1F;">${title}</p>
        <p style = "color: #FF5F1F;">$${value}</p>
        <div class="icons">
            <i class="fa-solid fa-pen-to-square" id="edit"></i>
            <i class="fa-solid fa-trash" id="delete"></i>
        </div>`;
        expenseList.append(element);


        expenseTitle.value = "";
        expenseValue.value = "";
        


// delete the element
        element.querySelector('#delete').addEventListener('click', () => {
            deleteFromLocalStorage(element.dataset.id, 'expense');
            deleteFromLocalStorage(element.dataset.id,'all');
            element.remove();
            displayAll();
            displayBalance();
        })

// edit the element
        element.querySelector('#edit').addEventListener('click',editExpenseList)
}
function displayIncome(id,title,value){
        const element = document.createElement('li');
        element.setAttribute('data-id', id);
        element.className = "item";
        element.innerHTML = `<p>${title}</p>
        <p>$${value}</p>
        <div class="icons">
            <i class="fa-solid fa-pen-to-square" id="edit"></i>
            <i class="fa-solid fa-trash" id="delete"></i>
        </div>`;
        incomeList.append(element);

// add to local storage


        incomeTitle.value = "";
        incomeValue.value = "";
// delete the element
        element.querySelector('#delete').addEventListener('click', () => {
            deleteFromLocalStorage(element.dataset.id, 'income');
            deleteFromLocalStorage(element.dataset.id,'all')
            element.remove();
            displayAll();
            displayBalance();
        })
        element.querySelector('#edit').addEventListener('click',editIncomeList);
}


function generateId() {
    const str = '123456789abcdefghijklmnopqrstuvwxyz';
    return '#' + str[Math.floor(str.length * Math.random())] + str[Math.floor(str.length * Math.random())] +
        str[Math.floor(str.length * Math.random())] + str[Math.floor(str.length * Math.random())]
        + str[Math.floor(str.length * Math.random())] + str[Math.floor(str.length * Math.random())] +
        str[Math.floor(str.length * Math.random())] + str[Math.floor(str.length * Math.random())];
}


function editExpenseList(e){
    editExpense = e.target.parentElement.parentElement;
    editFlag = true;
    expenseTitle.value = editExpense.children[0].innerHTML;
    expenseValue.value = editExpense.children[1].innerHTML.slice(1);
}

function editIncomeList(e){
    editIncome = e.target.parentElement.parentElement;
    editFlag = true;
    incomeTitle.value = editIncome.children[0].innerHTML;
    incomeValue.value = editIncome.children[1].innerHTML.slice(1);
}

// display changes

function displayBalance(){
        let arr = localStorage.getItem('all')?JSON.parse(localStorage.getItem('all')):[];
        let out =0;
        let inc = 0;
        arr.forEach(item =>{
            if(item.check === "expense"){
                out+=parseFloat(item.value);
            }
            else{
                inc += parseFloat(item.value);
            }
        })
        let sum = out+inc;
        balance.innerText = inc<out?'-$' + (out-inc):'$'+(inc-out);
        outcome.innerText = '$' + out;
        income.innerText = '$' + inc;
        root.style.setProperty('--p', Math.floor((sum?out/sum:0)*100).toString());
}

function changeBackground(){
    if(expenseList.children.length){
        expenseList.style.background = "white";
    }
    else{
        expenseList.style.background = 'url(/images/grey-plus.png) no-repeat';
        expenseList.style.backgroundSize = '10%';
        expenseList.style.backgroundPosition = 'center';

    }
    if(incomeList.children.length){
        incomeList.style.background = "white";
    }
    else{
        incomeList.style.background = 'url(/images/grey-plus.png) no-repeat';
        incomeList.style.backgroundSize = '10%';
        incomeList.style.backgroundPosition = 'center';

    }
    if(allList.children.length){
        allList.style.background = "white";
    }
    else{
        allList.style.background = 'url(/images/grey-plus.png) no-repeat';
        allList.style.backgroundSize = '10%';
        allList.style.backgroundPosition = 'center';
    }
}
// adding to local storage

function addToLocalStorage(title, value, id, check) {
    if (check === 'expense') {
        let arr = localStorage.getItem('expense') ? JSON.parse(localStorage.getItem('expense')) : [];
        arr.push({
            id, title, value
        })
        localStorage.setItem('expense', JSON.stringify(arr));
        let array = localStorage.getItem('all') ? JSON.parse(localStorage.getItem('all')) : [];
        array.push({
            id, title, value,check
        })
        localStorage.setItem('all', JSON.stringify(array));
    }
    else if (check === 'income') {
        let arr = localStorage.getItem('income') ? JSON.parse(localStorage.getItem('income')) : [];
        arr.push({
            id, title, value
        })
        localStorage.setItem('income', JSON.stringify(arr));
        let array = localStorage.getItem('all') ? JSON.parse(localStorage.getItem('all')) : [];
        array.push({
            id, title, value,check
        })
        localStorage.setItem('all', JSON.stringify(array));
    }
}

// deleting from local storage

function deleteFromLocalStorage(id, check) {
    if (check === 'expense') {
        let arr = JSON.parse(localStorage.getItem('expense'));
        arr = arr.filter(item => {
            if (item.id === id) {
                return false;
            }
            else {
                return true;
            }
        })
        localStorage.setItem('expense', JSON.stringify(arr));
    }
    else if (check === 'income') {
        let arr = JSON.parse(localStorage.getItem('income'));
        arr = arr.filter(item => {
            if (item.id === id) {
                return false;
            }
            else {
                return true;
            }
        })
        localStorage.setItem('income', JSON.stringify(arr));
    }
    else if (check === 'all') {
        let arr = JSON.parse(localStorage.getItem('all'));
        arr = arr.filter(item => {
            if (item.id === id) {
                return false;
            }
            else {
                return true;
            }
        })
        localStorage.setItem('all', JSON.stringify(arr));
    }
}
// edit local storage
function editLocalStorage(id,check,title,value){
    if(check === 'expense'){
        let arr = JSON.parse(localStorage.getItem('expense'));
        arr = arr.map(item => {
            if (item.id === id) {
                item.title = title;
                item.value = value;
                return item;
            }
            else {
                return item;
            }
        })
        localStorage.setItem('expense', JSON.stringify(arr));
    
        let array = JSON.parse(localStorage.getItem('all'));
        array = array.map(item => {
            if (item.id === id) {
                item.title = title;
                item.value = value;
                return item;
            }
            else {
                return item;
            }
        })
        localStorage.setItem('all', JSON.stringify(array));
    }
    else if(check === 'income'){
        let arr = JSON.parse(localStorage.getItem('income'));
        arr = arr.map(item => {
            if (item.id === id) {
                item.title = title;
                item.value = value;
                return item;
            }
            else {
                return item;
            }
        })
        localStorage.setItem('income', JSON.stringify(arr));
    
        let array = JSON.parse(localStorage.getItem('all'));
        array = array.map(item => {
            if (item.id === id) {
                item.title = title;
                item.value = value;
                return item;
            }
            else {
                return item;
            }
        })
        localStorage.setItem('all', JSON.stringify(array));
    }
}
