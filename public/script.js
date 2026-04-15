// ─── State ────────────────────────────────────────────────────
let token = localStorage.getItem("token");

// ─── DOM References ───────────────────────────────────────────
const authSection = document.getElementById("auth-section");
const cinemaSection = document.getElementById("cinema-section");
const logoutBtn = document.getElementById("logout-btn");

// ─── Helpers ──────────────────────────────────────────────────
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = `<p class="text-rose-400 text-sm mt-2 text-center">${message}</p>`;
    setTimeout(() => (el.innerHTML = ""), 5000);
}

function showSuccess(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = `<p class="text-emerald-400 text-sm mt-2 text-center">${message}</p>`;
    setTimeout(() => (el.innerHTML = ""), 5000);
}

// ─── Auth UI Toggle ───────────────────────────────────────────
function showCinema() {
    authSection.classList.add("hidden");
    cinemaSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    loadSeats();
}

function showAuth() {
    authSection.classList.remove("hidden");
    cinemaSection.classList.add("hidden");
    logoutBtn.classList.add("hidden");
}

// ─── On Load ──────────────────────────────────────────────────
if (token) {
    showCinema();
} else {
    showAuth();
}

// ─── Tab Toggle ───────────────────────────────────────────────
document.getElementById("show-login").addEventListener("click", () => {
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("register-form").classList.add("hidden");
});

document.getElementById("show-register").addEventListener("click", () => {
    document.getElementById("register-form").classList.remove("hidden");
    document.getElementById("login-form").classList.add("hidden");
});

// ─── Register ─────────────────────────────────────────────────
document.getElementById("register-btn").addEventListener("click", async () => {
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;

    if (!name || !email || !password) {
        showError("register-form-error", "Please fill in all fields");
        return;
    }

    const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        if (res.status === 409) {
            showError("register-form-error", "Email already registered. Please login instead");
        } else if (res.status === 400) {
            showError("register-form-error", data.error || "Invalid input. Please check your details");
        } else {
            showError("register-form-error", "Registration failed. Please try again");
        }
        return;
    }

    showSuccess("register-form-error", "Registered successfully! Please login");
    document.getElementById("show-login").click();
});

// ─── Login ────────────────────────────────────────────────────
document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        showError("login-form-error", "Please fill in all fields");
        return;
    }

    const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        if (res.status === 401) {
            showError("login-form-error", "Invalid email or password");
        } else if (res.status === 404) {
            showError("login-form-error", "User not found. Please register first");
        } else {
            showError("login-form-error", data.error || "Login failed. Please try again");
        }
        return;
    }

    token = data.data.accessToken;
    localStorage.setItem("token", token);
    showCinema();
});

// ─── Logout ───────────────────────────────────────────────────
document.getElementById("logout-action").addEventListener("click", () => {
    localStorage.removeItem("token");
    token = null;
    showAuth();
});

// ─── Load Seats ───────────────────────────────────────────────
async function loadSeats() {
    const tbl = document.getElementById("tbl");
    tbl.innerHTML = "";

    const res = await fetch("/api/v1/seats");
    const resArray = await res.json();
    const sortedSeatArray = resArray.data.sort((a, b) => a.id - b.id);

    let tr;
    for (let i = 0; i < sortedSeatArray.length; i++) {
        if (i % 8 === 0) tr = document.createElement("tr");

        const td = document.createElement("td");
        const baseClasses = "w-32 h-32 rounded-2xl text-center align-middle text-2xl font-bold transition-all duration-300 select-none relative group";

        if (sortedSeatArray[i].isBooked) {
            td.className = `${baseClasses} bg-rose-500/10 text-rose-500/60 border border-rose-500/20 cursor-not-allowed`;
            td.innerHTML = `
                <span class="relative z-10">${sortedSeatArray[i].id}</span>
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-slate-900 border border-slate-700 text-sm text-slate-300 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-2xl z-50 pointer-events-none font-normal">
                    Booked by: <span class="font-bold text-white ml-1">${sortedSeatArray[i].username}</span>
                </div>
            `;
        } else {
            td.className = `${baseClasses} bg-emerald-500 text-white border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer hover:bg-emerald-400 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(16,185,129,0.5)] active:scale-95`;
            td.innerHTML = `<span class="relative z-10">${sortedSeatArray[i].id}</span>`;
        }

        td.addEventListener("click", async () => {
            if (td.classList.contains("cursor-not-allowed")) return;

            const res = await fetch(`/api/v1/seats/book/${sortedSeatArray[i].id}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    showError("login-form-error", "Session expired. Please login again");
                    localStorage.removeItem("token");
                    token = null;
                    showAuth();
                } else {
                    alert(data.error || "Booking failed");
                }
                return;
            }

            alert("Seat booked successfully!");
            loadSeats();
        });

        tr.appendChild(td);
        tbl.appendChild(tr);
    }
}