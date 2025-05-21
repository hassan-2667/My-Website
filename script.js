let classes = {};
let currentClass = '';
let rollNoCounter = {};

// Add a new class
function addClass() {
  const className = document.getElementById('classInput').value.trim();
  if (className && !classes[className]) {
    classes[className] = [];
    rollNoCounter[className] = 1;
    updateClassList();
    document.getElementById('classInput').value = '';
  }
}

// Show class buttons
function updateClassList() {
  const list = document.getElementById('classList');
  list.innerHTML = '';
  for (const cls in classes) {
    const btn = document.createElement('button');
    btn.textContent = cls;
    btn.onclick = () => openClass(cls);
    list.appendChild(btn);
  }
}

// Select a class
function openClass(cls) {
  currentClass = cls;
  document.getElementById('selectedClass').textContent = cls;
  document.getElementById('studentSection').style.display = 'block';
  updateStudentList();
}

// Open the form to add a student
function openStudentForm() {
  document.getElementById('studentForm').style.display = 'block';
}

// Add a new student
function addStudent() {
  const name = document.getElementById('studentName').value.trim();
  const father = document.getElementById('fatherName').value.trim();
  if (name && father && currentClass) {
    const rollNo = rollNoCounter[currentClass]++;
    classes[currentClass].push({ rollNo, name, father, attendance: {} });
    updateStudentList();
    document.getElementById('studentForm').style.display = 'none';
    document.getElementById('studentName').value = '';
    document.getElementById('fatherName').value = '';
  }
}

// Mark attendance for a student
function markAttendance(rollNo, status) {
  const today = new Date().toISOString().split('T')[0];
  const student = classes[currentClass].find(s => s.rollNo === rollNo);
  if (student) {
    student.attendance[today] = status;
    updateStudentList();
  }
}

// Delete a student
function deleteStudent(rollNo) {
  const confirmDelete = confirm("Are you sure you want to delete this student?");
  if (confirmDelete) {
    classes[currentClass] = classes[currentClass].filter(s => s.rollNo !== rollNo);
    updateStudentList();
  }
}

// Show student list with buttons and attendance
function updateStudentList() {
  const list = document.getElementById('studentList');
  list.innerHTML = '';
  const today = new Date().toISOString().split('T')[0];

  classes[currentClass].forEach(student => {
    const status = student.attendance[today] || '';
    const row = document.createElement('div');
    row.className = 'student-row';

    const presentClass = status === 'Present' ? 'selected' : '';
    const absentClass = status === 'Absent' ? 'selected' : '';
    const leaveClass = status === 'Leave' ? 'selected' : '';

    row.innerHTML = `
      ${student.rollNo}. ${student.name} (Father: ${student.father})
      <div class="status-btns">
        <button class="${presentClass}" onclick="markAttendance(${student.rollNo}, 'Present')">Present</button>
        <button class="${absentClass}" onclick="markAttendance(${student.rollNo}, 'Absent')">Absent</button>
        <button class="${leaveClass}" onclick="markAttendance(${student.rollNo}, 'Leave')">Leave</button>
        <button onclick="deleteStudent(${student.rollNo})" style="background-color: crimson; color: white;">Delete</button>
      </div>
    `;
    list.appendChild(row);
  });
}

// Display current date and day
function showCurrentDate() {
  const dateElem = document.getElementById('currentDate');
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElem.textContent = today.toLocaleDateString(undefined, options);
}

showCurrentDate();