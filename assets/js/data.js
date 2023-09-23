"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var skillsElm = document.querySelector("#skills");
  var jobsElm = document.querySelector("#jobs");
  loadSkills(skillsElm);
  loadJobs(jobsElm);
});

var loadJsonData = function loadJsonData(file) {
  return fetch(file).then(function (response) {
    if (!response.ok) {
      throw new FetchError(response);
    }

    return response.json();
  });
};

var loadSkills = function loadSkills(el) {
  return loadJsonData('../../data/skills.json').then(function (data) {
    data.forEach(function (skill) {
      var skillItem = document.createElement("LI");
      var skillItemContent = "<strong>".concat(skill.section, "</strong><br/>").concat(skill.objects.join(', '));
      skillItem.innerHTML = skillItemContent;
      el.appendChild(skillItem);
    });
  });
};

var loadJobs = function loadJobs(el) {
  return loadJsonData('../../data/jobs.json').then(function (data) {
    data.forEach(function (job) {
      var jobItem = document.createElement("LI");
      var jobItemContent = "<div class=\"card\">\n                    <h3 class=\"card__title\">".concat(job.jobTitle, "</h3>\n                    <div class=\"card__meta\">\n                        ").concat(job.dateStart !== null ? '<span class="date--start">' + job.dateStart + '</span>' : '', "\n                        ").concat(job.dateEnd !== null ? '<span class="date--end">' + job.dateEnd + '</span>' : '<span class="date--end">En poste</span>', "\n                        <span class=\"relative-time\" ").concat(job.dateStart !== null ? 'data-start="' + job.dateStart + '"' : '', " ").concat(job.dateEnd !== null ? 'data-end="' + job.dateEnd + '"' : '', ">").concat(relativeTime(job.dateStart, job.dateEnd), "</span>\n                    </div>\n                    <div class=\"card__description\">").concat(job.description, "</div>\n                </div>");
      jobItem.innerHTML = jobItemContent;
      el.appendChild(jobItem);
    });
  });
};

var relativeTime = function relativeTime(start, end) {
  var lang = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'fr';

  if (end === null) {
    end = new Date();
  } else {
    end = new Date(Date.parse(end + 'T00:00:00'));
  }

  start = new Date(Date.parse(start + 'T00:00:00'));
  var labelYear = lang === 'fr' ? 'an' : 'year';
  var labelMonth = lang === 'fr' ? 'mois' : 'month';
  var labelAnd = lang === 'fr' ? 'et' : 'and';
  var yearInMs = 1000 * 60 * 60 * 24 * 365;
  var monthInMs = 1000 * 60 * 60 * 24 * 30;
  var distance = end.getTime() - start.getTime();
  var years = Math.floor(distance / yearInMs);
  var months = Math.floor(distance / monthInMs);
  var string = '';

  if (years > 0) {
    string += years + ' ' + labelYear + (years > 1 ? 's' : '');
    var delta = Math.floor(distance % yearInMs);
    months = Math.round(delta / monthInMs);

    if (months > 0) {
      string += ' ' + labelAnd + ' ' + months + ' ' + labelMonth + (months > 1 && lang !== 'fr' ? 's' : '');
    }
  } else {
    string += months + ' ' + labelMonth + (months > 1 && lang !== 'fr' ? 's' : '');
  }

  return string;
};