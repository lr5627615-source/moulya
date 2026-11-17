
/* ==========================================
   TRENDY BOUTIQUE
   FINAL COMPLETE JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. GET HTML ELEMENTS
    // ==========================================

    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    const shopNowButton = document.getElementById("shop-now");
    const productsSection = document.getElementById("products");

    const cartIcon = document.getElementById("cart-icon");
    const cartSection = document.getElementById("cart-section");

    const productContainer = document.querySelector(".product-container");


    // ==========================================
    // 2. LOAD SAVED CART
    // ==========================================

    let cart = [];

    try {

        const savedCart = JSON.parse(
            localStorage.getItem("boutiqueCart")
        );

        if (Array.isArray(savedCart)) {

            cart = savedCart.filter(function (item) {

                return (
                    item &&
                    typeof item.id === "string" &&
                    typeof item.name === "string" &&
                    Number.isFinite(Number(item.price)) &&
                    Number(item.price) >= 0 &&
                    Number.isInteger(item.quantity) &&
                    item.quantity > 0
                );

            }).map(function (item) {

                return {
                    id: item.id,
                    name: item.name,
                    price: Number(item.price),
                    image: typeof item.image === "string" ? item.image : "",
                    quantity: item.quantity
                };

            });

        }

    } catch (error) {

        console.error("Cart loading error:", error);

        cart = [];

    }


    // ==========================================
    // 3. SAVE CART TO LOCAL STORAGE
    // ==========================================

    function saveCart() {

        try {

            localStorage.setItem(
                "boutiqueCart",
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error("Unable to save cart:", error);

        }

    }


    // ==========================================
    // 4. UPDATE CART COUNT
    // ==========================================

    function updateCartCount() {

        const totalItems = cart.reduce(function (total, item) {

            return total + item.quantity;

        }, 0);

        if (cartCount) {

            cartCount.textContent = totalItems;

        }

    }


    // ==========================================
    // 5. ADD PRODUCT TO CART
    // ==========================================

    function addToCart(product) {

        const existingProduct = cart.find(function (item) {

            return item.id === product.id;

        });

        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1

            });

        }

        saveCart();

        updateCartCount();

        displayCart();

        alert(product.name + " added to your cart!");

    }


    // ==========================================
    // 6. GET PRODUCT DETAILS
    // ==========================================

    function getProductDetails(button) {

        const productCard = button.closest(".product-card");

        if (!productCard) {

            return null;

        }

        const nameElement =
            productCard.querySelector(".product-name");

        const priceElement =
            productCard.querySelector(".product-price");

        const imageElement =
            productCard.querySelector("img");

        if (!nameElement || !priceElement) {

            return null;

        }

        const id = productCard.dataset.id;

        const name = nameElement.textContent.trim();

        const price = parseFloat(
            priceElement.textContent.replace(/[^0-9.]/g, "")
        );

        const image = imageElement ? imageElement.src : "";

        if (
            !id ||
            !name ||
            !Number.isFinite(price) ||
            price < 0
        ) {

            return null;

        }

        return {

            id: id,
            name: name,
            price: price,
            image: image

        };

    }


    // ==========================================
    // 7. ADD TO CART BUTTON EVENTS
    // ==========================================

    document.querySelectorAll(".add-to-cart").forEach(function (button) {

        button.addEventListener("click", function () {

            const product = getProductDetails(this);

            if (!product) {

                alert("Unable to add product. Please check product details.");

                return;

            }

            addToCart(product);

        });

    });


    // ==========================================
    // 8. ESCAPE HTML FOR SAFE DISPLAY
    // ==========================================

    function escapeHTML(value) {

        return String(value).replace(/[&<>"']/g, function (character) {

            const entities = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"

            };

            return entities[character];

        });

    }


    // ==========================================
    // 9. DISPLAY CART ITEMS
    // ==========================================

    function displayCart() {

        if (!cartItems || !cartTotal) {

            return;

        }

        cartItems.innerHTML = "";

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <p class="empty-cart">
                    Your shopping cart is empty!
                    Start shopping today.
                </p>
            `;

            cartTotal.textContent = "₹0.00";

            return;

        }

        let total = 0;

        cart.forEach(function (item) {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `

                <img
                    src="${escapeHTML(item.image)}"
                    alt="${escapeHTML(item.name)}"
                    class="cart-product-image"
                >

                <div class="cart-product-details">

                    <h4>${escapeHTML(item.name)}</h4>

                    <p>₹${item.price.toFixed(2)}</p>

                    <div class="quantity-controls">

                        <button
                            type="button"
                            class="decrease-quantity"
                            data-id="${escapeHTML(item.id)}"
                        >-</button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            class="increase-quantity"
                            data-id="${escapeHTML(item.id)}"
                        >+</button>

                    </div>

                    <button
                        type="button"
                        class="remove-from-cart"
                        data-id="${escapeHTML(item.id)}"
                    >
                        Remove
                    </button>

                </div>

                <p>₹${itemTotal.toFixed(2)}</p>

            `;

            cartItems.appendChild(cartItem);

        });

        cartTotal.textContent = "₹" + total.toFixed(2);

    }


    // ==========================================
    // 10. CART QUANTITY AND REMOVE EVENTS
    // ==========================================

    if (cartItems) {

        cartItems.addEventListener("click", function (event) {

            const button = event.target.closest("button");

            if (!button) {

                return;

            }

            const productId = button.dataset.id;

            const product = cart.find(function (item) {

                return item.id === productId;

            });

            if (!product) {

                return;

            }

            // INCREASE QUANTITY

            if (button.classList.contains("increase-quantity")) {

                product.quantity++;

            }

            // DECREASE QUANTITY

            else if (button.classList.contains("decrease-quantity")) {

                product.quantity--;

                if (product.quantity <= 0) {

                    cart = cart.filter(function (item) {

                        return item.id !== productId;

                    });

                }

            }

            // REMOVE PRODUCT

            else if (button.classList.contains("remove-from-cart")) {

                cart = cart.filter(function (item) {

                    return item.id !== productId;

                });

            }

            else {

                return;

            }

            saveCart();

            updateCartCount();

            displayCart();

        });

    }


    // ==========================================
    // 11. PRODUCT SEARCH FUNCTIONALITY
    // ==========================================

    function searchProducts() {

        if (!searchInput || !productContainer) {

            console.error("Search elements not found!");

            return;

        }

        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        const products = productContainer.querySelectorAll(".product-card");

        let foundProducts = 0;

        products.forEach(function (product) {

            const name =
                product.querySelector(".product-name")
                    ?.textContent.toLowerCase() || "";

            const category =
                product.dataset.category?.toLowerCase() || "";

            const description =
                product.dataset.description?.toLowerCase() || "";

            const matches =
                name.includes(searchTerm) ||
                category.includes(searchTerm) ||
                description.includes(searchTerm);

            product.style.display = matches ? "" : "none";

            if (matches) {

                foundProducts++;

            }

        });


        // NO RESULTS MESSAGE

        let noResults = document.getElementById("no-results");

        if (!noResults) {

            noResults = document.createElement("p");

            noResults.id = "no-results";

            noResults.className = "no-results";

            productContainer.appendChild(noResults);

        }

        noResults.textContent = foundProducts === 0
            ? "Sorry! No products found. Try another search."
            : "";

        // Hide empty results message when products are found
        noResults.style.display = foundProducts === 0 ? "block" : "none";

        console.log("Search results:", foundProducts);

    }


    // ==========================================
    // 12. SEARCH BUTTON CLICK
    // ==========================================

    if (searchButton) {

        searchButton.addEventListener("click", function () {

            searchProducts();

        });

    }


    // ==========================================
    // 13. SEARCH WHILE TYPING + ENTER KEY
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            searchProducts();

        });

        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchProducts();

            }

        });

    }


    // ==========================================
    // 14. SHOP NOW BUTTON
    // ==========================================

    if (shopNowButton && productsSection) {

        shopNowButton.addEventListener("click", function () {

            productsSection.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    }


    // ==========================================
    // 15. CART ICON CLICK
    // ==========================================

    if (cartIcon && cartSection) {

        cartIcon.addEventListener("click", function () {

            cartSection.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    }


    // ==========================================
    // 16. NEWSLETTER FORM
    // ==========================================

    const newsletterForm = document.getElementById("newsletter-form");

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const emailInput = newsletterForm.querySelector('input[type="email"]');

            if (emailInput && emailInput.value.trim()) {

                alert("Thank you for subscribing to Trendy Boutique!");

                newsletterForm.reset();

            }

        });

    }


    // ==========================================
    // 17. INITIALIZE WEBSITE
    // ==========================================

    updateCartCount();

    displayCart();

    console.log("================================");

    console.log("TRENDY BOUTIQUE WEBSITE LOADED");

    console.log("Shopping Cart: Connected");

    console.log("Product Search: Connected");

    console.log("Shop Now: Connected");

    console.log("================================");

});

