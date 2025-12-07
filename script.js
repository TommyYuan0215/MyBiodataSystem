// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

// Check if user has saved preference
if (darkModeToggle && localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// Toggle dark mode
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// helper: map textual level to percent (used when JSON has "level" instead of "percentage")
function mapLevelToPercent(level) {
    if (!level) return 50;
    const l = String(level).toLowerCase();
    if (l.includes('adv')) return 90;
    if (l.includes('profi') || l.includes('expert')) return 80;
    if (l.includes('interm')) return 60;
    if (l.includes('basic') || l.includes('begin')) return 35;
    return 50;
}

// Load biodata
fetch('./data/biodata.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        populateHero(data);
        populateAbout(data);
        populateSkills(data);
        populateEducation(data);
        populateExperience(data);
        populateInterests(data);
        populateSocial(data);
    })
    .catch(error => console.error('Error loading biodata:', error));

function populateHero(data) {
    const img = document.getElementById('profileImage');
    if (img && data.profile && data.profile.image) img.src = `./assets/${data.profile.image}`;
    if (data.profile) {
        const nameEl = document.getElementById('profileName');
        const titleEl = document.getElementById('profileTitle');
        const bioEl = document.getElementById('profileBio');
        if (nameEl) nameEl.textContent = data.profile.name || '';
        if (titleEl) titleEl.textContent = data.profile.title || '';
        if (bioEl) bioEl.textContent = data.profile.bio || '';
    }
}

function populateAbout(data) {
    if (!data) return;
    const get = id => document.getElementById(id);
    if (get('infoName')) get('infoName').textContent = data.profile?.name || '';
    if (get('infoPhone')) get('infoPhone').textContent = data.contact?.phone || '';
    if (get('infoBirth')) get('infoBirth').textContent = data.contact?.birthDate || '';
    if (get('infoPhoneAlt')) get('infoPhoneAlt').textContent = data.contact?.phoneAlt || '';
    if (get('infoEmail')) {
        const email = data.contact?.email || '';
        get('infoEmail').innerHTML = email ? `<a href="mailto:${email}">${email}</a>` : '';
    }
    if (get('infoEmailAlt')) {
        const alt = data.contact?.emailAlt;
        get('infoEmailAlt').textContent = Array.isArray(alt) ? alt.join(' / ') : (alt || '');
    }
    if (get('infoAddress')) get('infoAddress').textContent = data.contact?.address || '';
}

function populateSkills(data) {
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) return;
    skillsList.innerHTML = '';

    const technical = data.skills?.technical || [];
    technical.forEach(skill => {
        const name = skill.name || skill.title || 'Skill';
        // get numeric percent: prefer explicit "percentage", else map from "level"
        const percent = (typeof skill.percentage === 'number')
            ? skill.percentage
            : mapLevelToPercent(skill.level || skill.levelname || skill.levels);

        // text to display at right: prefer explicit percentage if provided, else show level text
        const rightText = (typeof skill.percentage === 'number')
            ? `${skill.percentage}%`
            : (skill.level ? skill.level : `${percent}%`);

        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `
            <div class="skill-name">
                <span>${name}</span>
                <span>${rightText}</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${percent}%;"></div>
            </div>
        `;
        skillsList.appendChild(skillCard);
    });

    // basic / soft skills: support multiple possible keys in JSON
    const basicSkillsList = document.getElementById('basicSkillsList');
    if (!basicSkillsList) return;
    basicSkillsList.innerHTML = '';
    const basicArray = data.skills?.basic || data.skills?.soft || data.skills?.other || [];
    if (Array.isArray(basicArray)) {
        basicArray.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            basicSkillsList.appendChild(li);
        });
    }
}

function populateEducation(data) {
    const educationList = document.getElementById('educationList');
    if (!educationList) return;
    educationList.innerHTML = '';

    const eduArr = data.education || [];
    eduArr.forEach(edu => {
        const eduItem = document.createElement('div');
        eduItem.className = 'timeline-item';
        let courseHTML = '';
        if (edu.coursework && Array.isArray(edu.coursework)) {
            courseHTML = `<ul>${edu.coursework.map(c => `<li>${c}</li>`).join('')}</ul>`;
        }
        const highlightsHTML = (edu.highlights && Array.isArray(edu.highlights))
            ? `<div>${edu.highlights.map(h => `<h4>${h.title}</h4><p>${h.description || ''}</p>`).join('')}</div>`
            : '';
        eduItem.innerHTML = `
            <h3>${edu.school || ''}</h3>
            <div class="timeline-period">${edu.period || ''}</div>
            <p><strong>${edu.degree || ''}</strong></p>
            ${edu.cgpa ? `<p>CGPA: ${edu.cgpa}</p>` : ''}
            ${courseHTML}
            ${highlightsHTML}
        `;
        educationList.appendChild(eduItem);
    });
}

function populateExperience(data) {
    const experienceList = document.getElementById('experienceList');
    if (!experienceList) return;
    experienceList.innerHTML = '';

    const expArr = data.experience || [];
    expArr.forEach(exp => {
        const expItem = document.createElement('div');
        expItem.className = 'timeline-item';
        // prefer "responsibilities" or "duties"
        const dutiesSource = exp.responsibilities || exp.duties;
        const dutiesHTML = Array.isArray(dutiesSource) && dutiesSource.length > 0
            ? `<ul>${dutiesSource.map(d => `<li>${d}</li>`).join('')}</ul>`
            : '<p><em>Details not provided</em></p>';

        expItem.innerHTML = `
            <h3>${exp.company || ''}</h3>
            <div class="timeline-period">${exp.period || ''}</div>
            <p><strong>${exp.position || ''}</strong></p>
            ${dutiesHTML}
        `;
        experienceList.appendChild(expItem);
    });
}

function populateInterests(data) {
    const interestsList = document.getElementById('interestsList');
    const hobbiesList = document.getElementById('hobbiesList');
    if (interestsList) interestsList.innerHTML = '';
    if (hobbiesList) hobbiesList.innerHTML = '';

    (data.interests || []).forEach(interest => {
        if (!interestsList) return;
        const li = document.createElement('li');
        li.textContent = interest;
        interestsList.appendChild(li);
    });

    (data.hobbies || []).forEach(hobby => {
        if (!hobbiesList) return;
        const li = document.createElement('li');
        li.textContent = hobby;
        hobbiesList.appendChild(li);
    });
}

function populateSocial(data) {
    if (!data.social) return;
    const setHref = (id, url) => {
        const el = document.getElementById(id);
        if (el && url) el.href = url;
    };
    setHref('fbLink', data.social.facebook);
    setHref('instaLink', data.social.instagram);
    setHref('githubLink', data.social.github);
    setHref('whatsappLink', data.social.whatsapp);
    setHref('linkedinLink', data.social.linkedin);
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
if (navLinks) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
        });
    });
}