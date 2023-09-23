document.addEventListener('DOMContentLoaded', () => {
    let skillsElm = document.querySelector("#skills");
    let jobsElm = document.querySelector("#jobs");
    loadSkills(skillsElm);
    loadJobs(jobsElm);
});

const loadJsonData = (file) => {
    return fetch(file)
        .then((response) => {
            if (!response.ok) {
                throw new FetchError(response);
            }
            return response.json();
        });
}


const loadSkills = (el) => {
    return loadJsonData('../../data/skills.json')
        .then(data => {
            data.forEach(skill => {
                let skillItem = document.createElement("LI");
                let skillItemContent = `<strong>${skill.section}</strong><br/>${skill.objects.join(', ')}`;
                skillItem.innerHTML = skillItemContent;
                el.appendChild(skillItem);
            })
        });
}

const loadJobs = (el) => {
    return loadJsonData('../../data/jobs.json')
        .then(data => {
            data.forEach(job => {
                let jobItem = document.createElement("LI");
                let jobItemContent = `<div class="card">
                    <h3 class="card__title">${job.jobTitle}</h3>
                    <div class="card__meta">
                        ${(job.dateStart !== null ? '<span class="date--start">' + job.dateStart + '</span>' : '')}
                        ${(job.dateEnd !== null ? '<span class="date--end">' + job.dateEnd + '</span>' : '<span class="date--end">En poste</span>')}
                        <span class="relative-time" ${(job.dateStart !== null ? 'data-start="' + job.dateStart + '"' : '')} ${(job.dateEnd !== null ? 'data-end="' + job.dateEnd + '"' : '')}>${relativeTime(job.dateStart, job.dateEnd)}</span>
                    </div>
                    <div class="card__description">${job.description}</div>
                </div>`;
                jobItem.innerHTML = jobItemContent;
                el.appendChild(jobItem);
            })
        });
}

const relativeTime = (start, end, lang = 'fr') => {

    if (end === null) {
        end = new Date();
    } else {
        end = new Date(Date.parse(end + 'T00:00:00'));
    }
    start = new Date(Date.parse(start + 'T00:00:00'));

    const labelYear = lang === 'fr' ? 'an' : 'year';
    const labelMonth = lang === 'fr' ? 'mois' : 'month';
    const labelAnd = lang === 'fr' ? 'et' : 'and';

    const yearInMs = 1000 * 60 * 60 * 24 * 365;
    const monthInMs = 1000 * 60 * 60 * 24 * 30;

    let distance  = end.getTime() - start.getTime();
    let years = Math.floor(distance / yearInMs);
    let months = Math.floor(distance / monthInMs);

    let string = '';

    if (years > 0) {
        string += years + ' ' + labelYear + (years > 1 ? 's' : '');

        let delta = Math.floor(distance % yearInMs);
        months = Math.round(delta / monthInMs);

        if (months > 0) {
            string += ' ' + labelAnd + ' ' + months + ' ' + labelMonth + (months > 1 && lang !== 'fr' ? 's' : '');
        }
    } else {
        string += months + ' ' + labelMonth + (months > 1 && lang !== 'fr' ? 's' : '');
    }

    return string;
}