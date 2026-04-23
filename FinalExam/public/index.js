async function loadCustomers() {
  const container = document.getElementById("customer-list");

  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    container.innerHTML = "";

    let selectedCard = null;

    if (data.length === 0) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    data.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      div.addEventListener("click", () => {
        // remove previous selection
        if (selectedCard) {
          selectedCard.classList.remove("selected");
        }

        // set new selection
        selectedCard = div;
        div.classList.add("selected");

        loadCustomerIntoForm(person);
      });
      container.appendChild(div);
    });


  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}


// ---------------------------
// LOAD CUSTOMER INTO FORM
// ---------------------------
function loadCustomerIntoForm(person) {
  document.getElementById("customer-id").value = person.id;
  document.getElementById("first_name").value = person.first_name;
  document.getElementById("last_name").value = person.last_name;
  document.getElementById("email").value = person.email;
  document.getElementById("phone").value = person.phone || "";
  document.getElementById("birth_date").value =
    person.birth_date ? person.birth_date.substring(0, 10) : "";

  document.getElementById("save-btn").textContent = "Update Customer";
  document.getElementById("delete-btn").disabled = false;
}


// ---------------------------
// CLEAR FORM
// ---------------------------
document.getElementById("clear-btn").addEventListener("click", () => {
  document.getElementById("customer-id").value = "";
  document.getElementById("customerForm").reset();

  document.getElementById("save-btn").textContent = "Add Customer";
  document.getElementById("delete-btn").disabled = true;

  // remove highlight
  document.querySelectorAll(".customer-card").forEach(card => {
    card.classList.remove("selected");
  });

  selectedCard = null;

});


// ---------------------------
// CREATE OR UPDATE CUSTOMER
// ---------------------------
document.getElementById("customerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("customer-id").value;

  const customer = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    birth_date: document.getElementById("birth_date").value || null
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `/api/persons/${id}` : "/api/persons";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer)
  });

  if (!res.ok) {
    alert("Error saving customer");
    return;
  }

  await loadCustomers();

  document.getElementById("customerForm").reset();
  document.getElementById("customer-id").value = "";
  document.getElementById("save-btn").textContent = "Add Customer";
  document.getElementById("delete-btn").disabled = true;
});


// ---------------------------
// DELETE CUSTOMER
// ---------------------------
document.getElementById("delete-btn").addEventListener("click", async () => {
  const id = document.getElementById("customer-id").value;
  if (!id) return;

  if (!confirm("Delete this customer?")) return;

  const res = await fetch(`/api/persons/${id}`, { method: "DELETE" });
  if (selectedCard) {
    selectedCard = null;
  }

  if (!res.ok) {
    alert("Error deleting customer");
    return;
  }

  await loadCustomers();

  document.getElementById("customerForm").reset();
  document.getElementById("customer-id").value = "";
  document.getElementById("save-btn").textContent = "Add Customer";
  document.getElementById("delete-btn").disabled = true;
});


// ---------------------------
// INITIAL LOAD
// ---------------------------
loadCustomers();
