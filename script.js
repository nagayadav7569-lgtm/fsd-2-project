// CampusConnect - Event Data

const events = [
    {
        title: "Tech Fest 2026",
        date: "November 15, 2026",
        description: "Explore technology, coding competitions and innovative projects.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700"
    },
    {
        title: "Cultural Fest",
        date: "November 20, 2026",
        description: "Enjoy music, dance, performances and cultural activities.",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700"
    },
    {
        title: "Web Development Workshop",
        date: "November 25, 2026",
        description: "Learn website development and improve your technical skills.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700"
    }
];

// Load saved registrations
let registrations = JSON.parse(
    localStorage.getItem("campusRegistrations") || "[]"
);

// Display Events
const eventContainer = document.getElementById("eventContainer");

if (eventContainer) {
    eventContainer.innerHTML = "";

    events.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.className = "event-card";

        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <div class="event-info">
                <span class="event-date">📅 ${event.date}</span>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <button class="register-btn">Register Now →</button>
            </div>
        `;

        eventCard.querySelector("button").addEventListener("click", () => {
            openRegistration("Event", event.title);
        });

        eventContainer.appendChild(eventCard);
    });
}

// Add My Registrations Section
const clubsSection = document.getElementById("clubs");

if (clubsSection && !document.getElementById("myRegistrations")) {
    const registrationSection = document.createElement("section");

    registrationSection.className = "registrations-section";
    registrationSection.id = "myRegistrations";

    registrationSection.innerHTML = `
        <div class="section-heading">
            <p class="small-heading">YOUR CAMPUS JOURNEY</p>
            <h2>My Registrations</h2>
            <p>Check the events and clubs you have joined.</p>
        </div>
        <div id="myRegistrationsList"></div>
    `;

    clubsSection.insertAdjacentElement("afterend", registrationSection);
}

// Add My Registrations navigation link
const navLinks = document.querySelector(".nav-links");

if (navLinks && !document.querySelector('a[href="#myRegistrations"]')) {
    const navItem = document.createElement("li");
    const navLink = document.createElement("a");

    navLink.href = "#myRegistrations";
    navLink.textContent = "My Registrations";

    navItem.appendChild(navLink);
    navLinks.appendChild(navItem);
}

// Create Registration Form
const modal = document.createElement("div");

modal.id = "registrationModal";
modal.className = "modal";

modal.innerHTML = `
    <div class="modal-content">
        <button type="button" class="close-btn">&times;</button>

        <h2 id="modalTitle">Registration</h2>
        <p id="modalDescription"></p>

        <form id="registrationForm">
            <input type="text" id="studentName"
                placeholder="Enter your name" required>

            <input type="email" id="studentEmail"
                placeholder="Enter your email" required>

            <input type="text" id="studentId"
                placeholder="Enter your student ID" required>

            <button type="submit" class="primary-btn">
                Confirm Registration
            </button>
        </form>

        <p id="successMessage"></p>
    </div>
`;

document.body.appendChild(modal);

// Open Registration Form
function openRegistration(type, itemName) {
    modal.style.display = "flex";

    document.getElementById("modalTitle").textContent =
        type + " Registration";

    document.getElementById("modalDescription").textContent =
        "Enter your details to join " + itemName;

    document.getElementById("registrationForm").dataset.item =
        type + ": " + itemName;

    document.getElementById("successMessage").textContent = "";
}

// Close Registration Form
function closeModal() {
    modal.style.display = "none";
}

modal.querySelector(".close-btn").addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Make Existing Club Links Work
document.querySelectorAll(".club-card").forEach((clubCard) => {
    const exploreLink = clubCard.querySelector("a");
    const clubName = clubCard.querySelector("h3");

    if (exploreLink && clubName) {
        exploreLink.addEventListener("click", (event) => {
            event.preventDefault();
            openRegistration("Club", clubName.textContent.trim());
        });

        exploreLink.textContent = "Join Club →";
    }
});

// Submit Registration
document.getElementById("registrationForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const name = document.getElementById("studentName").value.trim();
        const email = document.getElementById("studentEmail").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const selectedItem = this.dataset.item;

        const alreadyRegistered = registrations.some((item) =>
            item.email.toLowerCase() === email.toLowerCase() &&
            item.selectedItem === selectedItem
        );

        if (alreadyRegistered) {
            document.getElementById("successMessage").textContent =
                "You have already registered for this!";
            return;
        }

        registrations.push({
            name,
            email,
            studentId,
            selectedItem,
            registeredAt: new Date().toLocaleDateString()
        });

        localStorage.setItem(
            "campusRegistrations",
            JSON.stringify(registrations)
        );

        document.getElementById("successMessage").textContent =
            "Registration successful! 🎉";

        this.reset();
        displayRegistrations();

        setTimeout(closeModal, 1500);
    }
);

// Display My Registrations
function displayRegistrations() {
    const list = document.getElementById("myRegistrationsList");

    if (!list) return;

    list.innerHTML = "";

    if (registrations.length === 0) {
        list.textContent = "No registrations yet. Explore events and clubs!";
        return;
    }

    registrations.forEach((item) => {
        const card = document.createElement("div");
        card.className = "registration-card";

        const heading = document.createElement("h3");
        heading.textContent = item.selectedItem;

        const student = document.createElement("p");
        student.textContent = "Student: " + item.name;

        const date = document.createElement("p");
        date.textContent = "Registered: " + item.registeredAt;

        card.append(heading, student, date);
        list.appendChild(card);
    });
}

// Load Existing Registrations
displayRegistrations();