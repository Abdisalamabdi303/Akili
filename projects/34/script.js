document.addEventListener('DOMContentLoaded', () => {
  console.log('App initialized');

  // Sample data for products
  const products = [
    { id: 1, name: 'Golden Retriever', price: '$500', image: 'https://via.placeholder.com/300' },
    { id: 2, name: 'Siamese Cat', price: '$400', image: 'https://via.placeholder.com/300' },
    // Add more products as needed
  ];

  // Function to render products
  function renderProducts() {
    const productsContainer = document.getElementById('products');
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card bg-white p-4 rounded-lg shadow-md';

      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.alt = product.name;
      productImage.className = 'product-image mb-4';

      const productName = document.createElement('h3');
      productName.textContent = product.name;
      productName.className = 'product-name text-lg font-bold mb-2';

      const productPrice = document.createElement('p');
      productPrice.textContent = product.price;
      productPrice.className = 'product-price text-gray-600';

      productCard.appendChild(productImage);
      productCard.appendChild(productName);
      productCard.appendChild(productPrice);

      productsContainer.appendChild(productCard);
    });
  }

  // Render products on page load
  renderProducts();

  // Event listener for search button
  document.getElementById('searchBtn').addEventListener('click', () => {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = ''; // Clear existing products

    if (filteredProducts.length > 0) {
      renderProducts(filteredProducts);
    } else {
      const noResults = document.createElement('p');
      noResults.textContent = 'No results found.';
      noResults.className = 'text-center text-gray-600';
      productsContainer.appendChild(noResults);
    }
  });
});