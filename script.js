let allExams = [];

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    allExams = data;
    displayAll(allExams);

    checkReminders(); // 🔔 RUN REMINDER
  });

function filterExams() {
  const age = document.getElementById("age").value;
  const education = document.getElementById("education").value;
  const category = document.getElementById("categoryFilter").value;

  const filtered = allExams.filter(exam => {
    let ageCheck = true;

    if (exam.age_limit !== "No Limit") {
      const [min, max] = exam.age_limit.split("-").map(Number);
      ageCheck = age >= min && age <= max;
    }

    return (
      ageCheck &&
      (education === "" || exam.level === education) &&
      (category === "all" || exam.category === category)
    );
  });

  displayAll(filtered);
}
  

function displayAll(exams) {
  const list = document.getElementById("examList");

  if (exams.length === 0) {
    list.innerHTML = "<p>No exams found 😢</p>";
    return;
  }

  list.innerHTML = exams.map(exam => `
    <div class="main-card">

      <h2>${exam.name}</h2>

      <div class="info-grid">

        <div class="info-box">
          <h4>📅 Exam Info</h4>
          <p><b>Start:</b> ${exam.start_date}</p>
          <p><b>Deadline:</b> ${exam.deadline}</p>
        </div>

        <div class="info-box">
          <h4>🎯 Eligibility</h4>
          <p><b>Level:</b> ${exam.level}</p>
          <p><b>Age:</b> ${exam.age_limit}</p>
        </div>

        <div class="info-box">
          <h4>💼 Jobs</h4>
          <ul>
            ${exam.jobs.map(job => `<li>${job}</li>`).join("")}
          </ul>
        </div>

        <div class="info-box">
          <h4>🚀 Apply</h4>
          <a href="${exam.apply_link}" target="_blank">Apply Now</a>
        </div>

      </div>

    </div>
  `).join("");
}
function checkReminders() {
  const today = new Date();
  const box = document.getElementById("notification");

  let messages = [];

  allExams.forEach(exam => {
    const deadline = new Date(exam.deadline);

    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      messages.push(`⚠️ ${exam.name}: Last date tomorrow`);
    }

    if (diffDays === 0) {
      messages.push(`🚨 ${exam.name}: Last date TODAY`);
    }
  });

  if (messages.length > 0) {
    box.innerHTML = messages.join("<br>");
    box.style.display = "block";

    setTimeout(() => {
      box.style.display = "none";
    }, 5000);
  }
}