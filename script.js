const form = document.getElementById('form');
const productNameInput = document.getElementById('product-name');
const productQuantityInput = document.getElementById('product-quantity');
const productPriceInput = document.getElementById('product-price');
const productTableBody = document.getElementById('product-table-body');
const totalPriceElement = document.getElementById('total-price');
const submitButton = document.getElementById('submit-button');

let products = JSON.parse(localStorage.getItem('products')) || [];
let editingIndex = null;

// Calcula o valor total do estoque
function calculateTotal() {
  const total = products.reduce((sum, product) => sum + product.quantity * product.price, 0);
  totalPriceElement.textContent = total.toFixed(2);
}

// Renderiza a lista de produtos
function renderProducts() {
  productTableBody.innerHTML = '';
  products.forEach((product, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>${(product.quantity * product.price).toFixed(2)}</td>
      <td>
        <button class="edit-btn" onclick="editProduct(${index})">Editar</button>
        <button class="delete-btn" onclick="confirmDelete(${index})">Remover</button>
      </td>
    `;
    productTableBody.appendChild(row);
  });
  calculateTotal();
  localStorage.setItem('products', JSON.stringify(products));
}

// Adiciona ou edita um produto
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = productNameInput.value.trim();
  const quantity = parseInt(productQuantityInput.value);
  const price = parseFloat(productPriceInput.value);

  if (name && quantity && price) {
    if (editingIndex !== null) {
      products[editingIndex] = { name, quantity, price };
      editingIndex = null;
      submitButton.textContent = 'Salvar';
    } else {
      products.push({ name, quantity, price });
    }
    renderProducts();
    form.reset();
  }
});

// Edita um produto
function editProduct(index) {
  const product = products[index];
  productNameInput.value = product.name;
  productQuantityInput.value = product.quantity;
  productPriceInput.value = product.price;
  editingIndex = index;
  submitButton.textContent = 'Atualizar';
}

// Confirma e exclui um produto
function confirmDelete(index) {
  if (confirm('Tem certeza de que deseja excluir este produto?')) {
    products.splice(index, 1);
    renderProducts();
  }
}

// Inicializa a tabela
renderProducts();
