// ===============================
// 0) Authorization
// ===============================
let editMode = false;

import { initAuthUI, requireAuthOrBlockPage, logout } from "./auth-ui.js";

document.addEventListener("DOMContentLoaded", () => {
    initAuthUI(); // MUST run first

    if (!requireAuthOrBlockPage()) {
        throw new Error("Authentication required");
    }

    window.logout = logout;

    loadResourceDropdown();
    loadReservations();
});

// ===============================
// 1) DOM Elements
// ===============================

const form = document.getElementById("reservationForm");
const messageBox = document.getElementById("formMessage");
const listContainer = document.getElementById("reservationList");
const clearBtn = document.getElementById("clearReservationForm");

// Form fields
const fieldId = document.getElementById("reservationId");
const fieldResource = document.getElementById("resourceId");
const fieldStart = document.getElementById("reservationStart");
const fieldEnd = document.getElementById("reservationEnd");
const fieldNote = document.getElementById("reservationNote");
const fieldStatus = document.getElementsByName("reservationStatus");

// ===============================
// 2) Helpers
// ===============================

function showMessage(type, text) {
    messageBox.classList.remove("hidden");
    messageBox.textContent = text;

    messageBox.className =
        type === "success"
            ? "mt-6 rounded-2xl border border-green-400 bg-green-50 px-4 py-3 text-sm"
            : "mt-6 rounded-2xl border border-red-400 bg-red-50 px-4 py-3 text-sm";
}

function getSelectedStatus() {
    for (const r of fieldStatus) {
        if (r.checked) return r.value;
    }
    return "pending";
}

function clearForm() {
    fieldId.value = "";
    fieldResource.value = "";
    fieldStart.value = "";
    fieldEnd.value = "";
    fieldNote.value = "";
    fieldStatus[0].checked = true; // pending
    showMessage("success", "Form cleared");
}

// ===============================
// 3) Load resources into dropdown
// ===============================

async function loadResourceDropdown() {
    try {
        const res = await fetch("/api/resources");
        const json = await res.json();

        if (!json.ok) return;

        fieldResource.innerHTML = "";

        json.data.forEach(resource => {
            const opt = document.createElement("option");
            opt.value = resource.id;
            opt.textContent = resource.name;
            fieldResource.appendChild(opt);
        });

    } catch (err) {
        console.error("Failed to load resources:", err);
    }
}

// ===============================
// 4) Load reservations list
// ===============================

async function loadReservations() {
    try {
        const res = await fetch("/api/reservations");
        const json = await res.json();

        if (!json.ok) return;

        listContainer.innerHTML = "";

        json.data.forEach(r => {
            const item = document.createElement("div");
            item.className =
                "rounded-2xl border border-black/10 p-4 cursor-pointer hover:bg-black/5 transition";

            item.innerHTML = `
                <div class="font-semibold">${r.resource_name}</div>
                <div class="text-xs text-black/60">${r.start_time.split("T")[0]} → ${r.end_time.split("T")[0]}
                <div class="text-xs text-black/50">${r.status}</div>
            `;

            item.onclick = () => loadIntoForm(r);
            listContainer.appendChild(item);
        });

    } catch (err) {
        console.error("Failed to load reservations:", err);
    }
}

// ===============================
// 5) Load reservation into form
// ===============================

function loadIntoForm(r) {
    fieldId.value = r.id;
    fieldResource.value = r.resource_id;
    fieldStart.value = r.start_time.split("T")[0];
    fieldEnd.value = r.end_time.split("T")[0];
    fieldNote.value = r.note || "";

    for (const radio of fieldStatus) {
        radio.checked = radio.value === r.status;
    }

    // Switch to edit mode
    editMode = true;
    btnCreate.classList.add("hidden");
    btnClear.classList.add("hidden");
    btnUpdate.classList.remove("hidden");
    btnDelete.classList.remove("hidden");

    showMessage("success", "Loaded reservation into form");
}

// ===============================
// 6) Submit form (Create or Update)
// ===============================

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = fieldId.value;
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/reservations/${id}` : "/api/reservations";

    const payload = {
        resourceId: fieldResource.value,
        startTime: fieldStart.value,
        endTime: fieldEnd.value,
        note: fieldNote.value,
        status: getSelectedStatus()
    };

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload)
        });

        const json = await res.json();

        if (!json.ok) {
            showMessage("error", json.error || "Failed to save reservation");
            return;
        }

        showMessage("success", id ? "Reservation updated" : "Reservation created");

        clearForm();
        loadReservations();

    } catch (err) {
        console.error("Save failed:", err);
        showMessage("error", "Network or server error");
    }
});

// ===============================
// 7) Delete reservation
// ===============================

async function deleteReservation() {
    const id = fieldId.value;
    if (!id) {
        showMessage("error", "No reservation selected");
        return;
    }

    try {
        const res = await fetch(`/api/reservations/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!res.ok) {
            showMessage("error", "Failed to delete reservation");
            return;
        }

        showMessage("success", "Reservation deleted");
        clearForm();
        loadReservations();

    } catch (err) {
        console.error("Delete failed:", err);
        showMessage("error", "Network or server error");
    }
}

// ===============================
// 8) Clear button
// ===============================

clearBtn.addEventListener("click", clearForm);