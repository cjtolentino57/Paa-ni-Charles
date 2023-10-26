$(document).ready(() => {
  // Regex
  var regex = /[₱,]/g;

  // Slide-over panel, show/hide based on slide-over state.
  toggleCart();
  cartCounter();
  isEmpty();

  // toaster notification
  toastr.options = {
    'closeButton': true,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-bottom-left',
    'preventDuplicates': false,
    'showDuration': '1000',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut',
  }

  // Add item to cart.
  var addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }

  // if card-box is empty, show your cart is empty message and hide the payments.
  function isEmpty() {
    if ($('.cart-box').children().length == 0) {
      $("#isEmpty").html(`
        <div class="flex flex-col text-center bg-yellow-500 rounded-lg w-full py-4 mt-5 mb-16">
          <div class = "px-8 font-semibold text-gray-100">
            <p class="text-base xl:text-lg">Your cart is empty!</p>
          </div>
        </div>`);
      $("#paymentfield").hide();
    } else {
      $("#isEmpty").html("");
      $("#paymentfield").show();
    }
  }

  function toggleCart() {
    $('.slide-over-panel').on('click', () => {
      $(".shopping-cart").animate({
        width: "toggle",
        opacity: "toggle",
      }, "slow");
    });
  }

  //Remove items in the Cart
  function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.closest('.cart-box').remove();
    updatetotal();
    cartCounter();
    isEmpty();
  }

  //Quantity Change
  function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updatetotal();
  }

  // Add item to cart.
  function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var title2 = shopProducts.getElementsByClassName("product-title-2")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, title2, price, productImg);
    updatetotal();
    cartCounter();
    isEmpty();
  }

  // cart counter
  function cartCounter() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    return (cartBoxes.length == 0) ? $(".cart-items-count").text("0") : $(".cart-items-count").text(cartBoxes.length);
  }

  // Add item to cart.
  function addProductToCart(title, title2, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    var cartItemsModel = cartItems.getElementsByClassName("cart-product-model");

    for (var i = 0; i < cartItemsNames.length; i++) {
      if (cartItemsNames[i].innerText == title && cartItemsModel[i].innerText == title2) {
        toastr.warning("Item already added to cart!");
        return;
      }
    }
    var cartBoxContent = `
        <li class="py-6 flex">
        <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
          <img src="${productImg}"
            alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
            class="w-full h-full object-center object-cover cart-img">
        </div>
    
        <div class="ml-4 flex-1 flex flex-col">
          <div class="detail-box">
            <div class="flex justify-between text-base font-medium text-gray-900">
              <h3>
                <div class="cart-product-title">${title}</div>
              </h3>
              <p class="cart-price ml-4">${price}</p>
            </div>
            <p class="cart-product-model mt-1 text-sm text-gray-500">${title2}</p>
          </div>
          <div class="mt-4 ml-4 flex justify-between text-base text-gray-900 italic">
            <div class="flex justify-center w-1/5">
              <p class="text-gray-500">Qty</p>
              <input id="cart-quantity" class="cart-quantity mx-2 border text-center w-12 rounded" type="number" value="1">
            </div>
              <p class="each-subtotal font-medium text-lg">${price}</p>
            </div>
          <div class="mt-4 flex-1 flex items-end justify-between text-sm">
            <div class="flex">
              <button type="button"
                class="cart-remove font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
            </div>
          </div>
        </div>
      </li>
        `;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox
      .getElementsByClassName("cart-remove")[0]
      .addEventListener("click", removeCartItem);
    cartShopBox
      .getElementsByClassName("cart-quantity")[0]
      .addEventListener("change", quantityChanged);
  }

  //Update total
  function updatetotal() {
    // calculate subtotal, tax, shipping, and total

    // subtotal = qty * price
    // Subtotal
    $(".each-subtotal").each(function () {
      var qty = $(this).closest(".cart-box").find(".cart-quantity").val();
      var price = parseFloat($(this).closest(".cart-box").find(".cart-price").text().replace(regex, ""));
      var subtotal = qty * price;
      $(this).text(subtotal.toLocaleString("en-US", { style: "currency", currency: "PHP" }));
    });

    // Subtotal of all items
    $(".sub-total-price").each(function () {
      var subtotal = 0;
      $(".each-subtotal").each(function () {
        subtotal += parseFloat($(this).text().replace(regex, ""));
      });
      $(this).text(subtotal.toLocaleString("en-US", { style: "currency", currency: "PHP" }));
    });

    // Tax
    $(".tax").each(function () {
      var subtotal = parseFloat($(".sub-total-price").text().replace(regex, ""));
      var tax = subtotal * 0.20;
      $(this).text(tax.toLocaleString("en-US", { style: "currency", currency: "PHP" }));
    });

    // Shipping fee
    $(".shipping-fee").each(function () {
      var subtotal = parseFloat($(".sub-total-price").text().replace(regex, ""));
      var shipping = subtotal * 0.02;
      $(this).text(shipping.toLocaleString("en-US", { style: "currency", currency: "PHP" }));
    });

    // Grand total
    $(".grand-total").each(function () {
      var subtotal = parseFloat($(".sub-total-price").text().replace(regex, ""));
      var tax = parseFloat($(".tax").text().replace(regex, ""));
      var shipping = parseFloat($(".shipping-fee").text().replace(regex, ""));
      var grandtotal = subtotal + tax + shipping;
      $(this).text(grandtotal.toLocaleString("en-US", { style: "currency", currency: "PHP" }));
    });
  }

  // validate form cash on delivery
  $("#form").validate({
    rules: {
      payment: {
        required: true,
      }
    }, message: {
      payment: {
        required: "Payment is required",
      }
    },
    errorElement: "span",
    errorPlacement: (error, element) => {
      error.addClass("text-red-500 text-xs italic");
      error.insertAfter(element);
    },
    highlight: (element, errorClass, validClass) => {
      $(element).addClass("border border-red-500");
    },
    unhighlight: (element, errorClass, validClass) => {
      $(element).removeClass("border border-red-500");
    },
    submitHandler: (form) => {
      if (!$('.cart-box').children().length == 0) {
        var grandtotal = parseFloat($(".grand-total").text().replace(regex, ""));
        var payment = parseFloat($(".payment").val().replace(regex, ""));
        var change = payment - grandtotal;
        let message = "";
        if (payment === grandtotal) {
          message = "You paid the exact amount.";
        } else {
          message = change.toLocaleString("en-US", { style: "currency", currency: "PHP" }) + " is your change.";
        }
        if (payment >= grandtotal) {
          $("#isEmpty").html(`
          <div class="flex flex-col text-center bg-green-500 rounded-lg w-full py-4 mt-5 mb-5">
            <div class="px-8 font-semibold text-gray-100">
                <p class="text-base xl:text-xl">Payment successful!</p>
                <p class="text-base xl:text-xl">${message}</p>
                <p class="text-base xl:text-xl">Thank you for shopping with us.</p>
            </div>
          </div>
          `);
          setTimeout(() => { form.submit(), window.location.replace('https://paa-ni-elots.netlify.app/src/pages/products.html') }, 2400);
        } else {
          toastr.error("Insufficient payment!");
        }
      } else {
        toastr.warning("Your cart is empty!");
        return;
      }
    }
  });
});

$("input[data-type='currency']").on({
  keyup: function () {
    formatCurrency($(this));
  },
  blur: function () {
    formatCurrency($(this), "blur");
  }
});

function formatPayment(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") { return; }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.prop("selectionStart");

  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatPayment(left_side);

    // validate right side
    right_side = formatPayment(right_side);

    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "₱" + left_side + "." + right_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatPayment(input_val);
    input_val = "₱" + input_val;

    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }

  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}