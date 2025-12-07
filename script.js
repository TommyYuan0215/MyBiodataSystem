fetch('./data/biodata.json')
    .then(response => response.json())
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
    document.getElementById('profileImage').src = `./assets/${data.profile.image}`;
    document.getElementById('profileName').textContent = data.profile.name;
    document.getElementById('profileTitle').textContent = data.profile.title;
    document.getElementById('profileBio').textContent = data.profile.bio;
}

function populateAbout(data) {
    document.getElementById('infoName').textContent = data.profile.name;
    document.getElementById('infoPhone').textContent = data.contact.phone;
    document.getElementById('infoBirth').textContent = data.contact.birthDate;
    document.getElementById('infoPhoneAlt').textContent = data.contact.phoneAlt;
    document.getElementById('infoEmail').innerHTML = `<a href="mailto:${data.contact.email}">${data.contact.email}</a>`;
    document.getElementById('infoEmailAlt').textContent = data.contact.emailAlt.join(' / ');
    document.getElementById('infoAddress').textContent = data.contact.address;
}

function populateSkills(data) {
    const skillsList = document.getElementById('skillsList');
    data.skills.technical.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `
            <div class="skill-name">
                <span>${skill.name}</span>
                <span>${skill.percentage}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.percentage}%"></div>
            </div>
        `;
        skillsList.appendChild(skillCard);
    });

    const basicSkillsList = document.getElementById('basicSkillsList');
    data.skills.basic.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        basicSkillsList.appendChild(li);
    });
}

function populateEducation(data) {
    const educationList = document.getElementById('educationList');
    data.education.forEach(edu => {
        const eduItem = document.createElement('div');
        eduItem.className = 'timeline-item';
        let courseHTML = '';
        if (edu.coursework) {
            courseHTML = `<ul>${edu.coursework.map(c => `<li>${c}</li>`).join('')}</ul>`;
        }
        eduItem.innerHTML = `
            <h3>${edu.school}</h3>
            <div class="timeline-period">${edu.period}</div>
            <p><strong>${edu.degree}</strong></p>
            ${edu.cgpa ? `<p>CGPA: ${edu.cgpa}</p>` : ''}
            ${courseHTML}
        `;
        educationList.appendChild(eduItem);
    });
}

function populateExperience(data) {
    const experienceList = document.getElementById('experienceList');
    data.experience.forEach(exp => {
        const expItem = document.createElement('div');
        expItem.className = 'timeline-item';
        expItem.innerHTML = `
            <h3>${exp.company}</h3>
            <div class="timeline-period">${exp.period}</div>
            <p><strong>${exp.position}</strong></p>
            <ul>${exp.duties.map(d => `<li>${d}</li>`).join('')}</ul>
        `;
        experienceList.appendChild(expItem);
    });
}

function populateInterests(data) {
    const interestsList = document.getElementById('interestsList');
    const hobbiesList = document.getElementById('hobbiesList');
    
    data.interests.forEach(interest => {
        const li = document.createElement('li');
        li.textContent = interest;
        interestsList.appendChild(li);
    });

    data.hobbies.forEach(hobby => {
        const li = document.createElement('li');
        li.textContent = hobby;
        hobbiesList.appendChild(li);
    });
}

function populateSocial(data) {
    document.getElementById('fbLink').href = data.social.facebook;
    document.getElementById('instaLink').href = data.social.instagram;
    document.getElementById('githubLink').href = data.social.github;
    document.getElementById('whatsappLink').href = data.social.whatsapp;
    document.getElementById('linkedinLink').href = data.social.linkedin;
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});