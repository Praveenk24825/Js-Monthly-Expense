let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editingIndex = -1;

const form = document.getElementById('entry');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('select');
const entriesList = document.querySelector('.value');

const totalIncome = document.getElementById('total1');
const totalExpense = document.getElementById('total2');
const balance = document.getElementById('total3');

const resetFormButton = document.getElementById('resetForm');
const resetAllButton = document.getElementById('resetAll');
const filterRadios = document.getElementsByName('rotate');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const entry = {
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value.toLowerCase()
  };

  if (editingIndex === -1) {
    entries.push(entry);
  } else {
    entries[editingIndex] = entry;
    editingIndex = -1;
  }

  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries();
  form.reset();
});

if (resetFormButton) {
  resetFormButton.addEventListener('click', () => {
    form.reset();
    editingIndex = -1;
  });
}

if (resetAllButton) {
  resetAllButton.addEventListener('click', () => {
    entries = [];
    localStorage.removeItem('entries');
    editingIndex = -1;
    form.reset();
    entriesList.innerHTML = '';
    totalIncome.textContent = '0.00';
    totalExpense.textContent = '0.00';
    balance.textContent = '0.00';
  });
}

filterRadios.forEach(radio => {
  radio.addEventListener('change', renderEntries);
});

function renderEntries() {
  const selectedFilter = document.querySelector('input[name="rotate"]:checked').value;
  entriesList.innerHTML = '';

  let income = 0;
  let expense = 0;

  entries.forEach((entry, index) => {
    if (selectedFilter === 'all' || selectedFilter === entry.type) {
      const li = document.createElement('li');
      li.classList.add('final-list'); 
      li.innerHTML = `
        ${entry.description} - $${entry.amount.toFixed(2)} (${entry.type})
        <span>
          <button onclick="editEntry(${index})">Edit</button>
          <button onclick="deleteEntry(${index})">Delete</button>
        </span>
      `;
      entriesList.appendChild(li);
    }

    if (entry.type === 'income') {
      income += entry.amount;
    } else if (entry.type === 'expense') {
      expense += entry.amount;
    }
  });

  totalIncome.textContent = income.toFixed(2);
  totalExpense.textContent = expense.toFixed(2);
  balance.textContent = (income - expense).toFixed(2);
}

window.editEntry = function(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  editingIndex = index;
}

window.deleteEntry = function(index) {
  entries.splice(index, 1);
  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries();
}

renderEntries();
