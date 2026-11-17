/* The Review Complexity Check: 12 questions, then the result.
   Details are collected by the HubSpot form on the article before readers arrive here.
   Questions 1 to 10 score 0 to 3 each. Score = round(points / 3), minimum 1.
   Question 11 sets the check-again date. Question 12 adds the split advice. */
(function () {
  'use strict';
  var card = document.getElementById('rcc-card');
  var left = document.getElementById('rcc-left');
  if (!card) return;
  var intro = left.innerHTML;

  var Q = [
    { g: 'Your roles', q: 'How many different kinds of roles do you have?', o: ['A few similar roles', 'A handful, across a couple of teams', 'Many roles, across departments', 'Many specialist roles, with several levels in each'] },
    { g: 'Your roles', q: 'Do you have job levels or career paths?', o: ['No', 'Informally, in people’s heads', 'For some teams', 'Written down for most roles'] },
    { g: 'Your roles', q: 'How do you measure good work today?', o: ['Mostly turning up and getting tasks done', 'A few targets, for some people', 'Clear targets for each team', 'Goals and competencies for each role'] },
    { g: 'Your people', q: 'How many people will be reviewed?', o: ['Under 15', '15 to 50', '51 to 150', 'Over 150'] },
    { g: 'Your people', q: 'Where do most people work?', o: ['In the field or on the shop floor, on phones', 'A mix, mostly field', 'A mix, mostly office', 'In an office, on laptops'] },
    { g: 'Your people', q: 'How do your people feel about forms and written feedback?', o: ['They’d rather talk', 'Some are fine with it', 'Most are fine with it', 'They’re used to it and expect it'] },
    { g: 'Your people', q: 'How long have most people been with you?', o: ['Under a year', '1 to 2 years', '2 to 4 years', 'Over 4 years'] },
    { g: 'Your leaders', q: 'Have your managers run reviews before?', o: ['Never', 'A few have', 'Most have, but they need support', 'Yes, and they’re trained to'] },
    { g: 'Your leaders', q: 'How much time can a manager give each person per cycle?', o: ['Under 30 minutes', 'About an hour', 'A few hours', 'Half a day or more'] },
    { g: 'Your leaders', q: 'What do your leaders want reviews to do?', o: ['Keep good conversations going', 'Spot who needs help', 'Decide pay and bonuses', 'Drive promotions, levels and succession'] },
    { g: 'How things are moving', q: 'In the last six months, which of these happened?', hint: 'Tick all that apply.', multi: true, none: 4, o: ['New leaders', 'A big hiring push', 'A restructure', 'A funding change', 'None of these'] },
    { g: 'How things are moving', q: 'Do different groups need different reviews?', o: ['No, one review fits everyone', 'Yes, two groups (for example field and office)', 'Yes, several groups'] }
  ];

  var TOOLS = {
    pack: { name: 'Performance review pack', links: [
      ['Performance Review Form (Google Doc)', 'https://docs.google.com/document/d/1pNqeFVGgfPGsv5gPuhZ6qoVduIybNhRR78dSOR9Q_4g/copy'],
      ['Performance Review Scorecard (Google Sheet)', 'https://docs.google.com/spreadsheets/d/1xTOQAZkhBxUHwsR4VuKlc-VjjVNuLWS8bzhYPpszF1s/copy'],
      ['Role-specific question library (Google Sheet)', 'https://docs.google.com/spreadsheets/d/1sIT-lyqpqimPkJbx7f5Q4p36zj5Xm_PojTUoSR5xqvQ/copy']] },
    toolkit: { name: 'Performance review toolkit', links: [
      ['Performance Review Tracker, with the form builder (Google Sheet)', 'https://docs.google.com/spreadsheets/d/1ZrNDRdeRpzSjC3pRddAWEBWvP7GFwHjvcuPDTnmX9Go/copy'],
      ['Start here guide (Google Doc)', 'https://docs.google.com/document/d/1bbGHiP9FSaU6j71SOYee33O029RBwsZmc5ys-Al5WDI/copy']] }
  };

  var BANDS = [
    { max: 3, key: 'Simple', short: 'simple check-in', title: 'Keep it simple', sum: 'Your team needs a review that is quick to run and easy to take part in. A short, regular conversation will do more for you right now than a full framework.',
      what: ['A check-in every month or quarter', '3 to 5 questions, such as start, stop and keep', 'A real conversation and a note of what was agreed'],
      tool: 'pack', toolNote: 'Use just the review form, cut down to your 3 to 5 questions.',
      jalihr: 'JaliHR runs short check-ins on any schedule, on phone or laptop, and rolls them up into a running score.' },
    { max: 7, key: 'Middle', short: 'middle-weight review', title: 'A middle-weight review', sum: 'You have enough variety and enough manager support for some structure, but a full competency framework would turn into paperwork nobody finishes.',
      what: ['A self and manager review twice a year', '5 to 8 questions on a 1 to 5 rating, tied to each role', 'A few goals for managers', 'Monthly check-ins in between'],
      tool: 'pack', toolNote: 'Use the form with the role question library and the scorecard.',
      jalihr: 'JaliHR runs self and manager reviews from your own question bank, with reminders and a report each person can read and reply to.' },
    { max: 10, key: 'Complex', short: 'full framework review', title: 'Go for the full framework', sum: 'Your roles, people and leaders can carry a robust review. Structure here gives people a clear path to grow and gives leaders fair data for pay and promotion.',
      what: ['Full cycles on competencies, skills, goals and career levels', 'Peer reviews, and calibration across teams', 'Check-ins that roll up into the cycle score'],
      tool: 'toolkit', toolNote: 'Competency map, skill map, a form builder and an appraisal tracker.',
      jalihr: 'JaliHR runs 360 cycles on competencies, skills, goals, levels and calibration, with analytics for each cycle.' }
  ];

  var ans = Q.map(function (q) { return q.multi ? [] : null; });
  var step = 0; // 0..11 questions, 12 result

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function answered(i) { return Q[i].multi ? ans[i].length > 0 : ans[i] !== null; }
  function prog(n, label) { return '<div class="rcc-prog"><div class="bar"><i style="width:' + Math.round(n / 12 * 100) + '%"></i></div><span class="n">' + label + '</span></div>'; }

  function renderQ() {
    var q = Q[step];
    var h = prog(step, 'Question ' + (step + 1) + ' of 12') +
      '<div class="rcc-q"><p class="eyebrow">' + esc(q.g) + '</p><h2>' + esc(q.q) + '</h2>' + (q.hint ? '<p class="hint">' + esc(q.hint) + '</p>' : '<p class="hint">Pick the one closest to you.</p>') +
      '<div class="rcc-opts">' + q.o.map(function (o, i) {
        var on = q.multi ? ans[step].indexOf(i) > -1 : ans[step] === i;
        return '<button type="button" class="rcc-opt' + (q.multi ? ' multi' : '') + '" data-i="' + i + '" aria-pressed="' + on + '"><span class="mk"></span>' + esc(o) + '</button>';
      }).join('') + '</div></div>' +
      '<div class="rcc-nav">' + (step ? '<button type="button" class="rcc-back">← Back</button>' : '<span></span>') +
      '<button type="button" class="rcc-btn rcc-next"' + (answered(step) ? '' : ' disabled') + '>' + (step === 11 ? 'See my number' : 'Next') + ' →</button></div>';
    card.innerHTML = h;
    card.querySelectorAll('.rcc-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i');
        if (q.multi) {
          var a = ans[step];
          if (i === q.none) ans[step] = a.indexOf(i) > -1 ? [] : [i];
          else { a = a.filter(function (x) { return x !== q.none; }); var k = a.indexOf(i); if (k > -1) a.splice(k, 1); else a.push(i); ans[step] = a; }
          renderQ();
        } else { ans[step] = i; setTimeout(function () { go(step + 1); }, 180); renderQ(); }
      });
    });
    bindNav();
  }

  function addMonths(d, m) { var x = new Date(d); x.setMonth(x.getMonth() + m); return x; }
  function fmt(d) { return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }

  function renderResult() {
    var pts = 0; for (var i = 0; i < 10; i++) pts += ans[i] || 0;
    var score = Math.max(1, Math.round(pts / 3));
    var band = BANDS.filter(function (b) { return score <= b.max; })[0];
    var changes = ans[10].filter(function (x) { return x !== 4; }).length;
    var months = changes >= 2 ? 3 : 6;
    var again = fmt(addMonths(new Date(), months));
    var split = ans[11] > 0;
    var tool = TOOLS[band.tool];
    var cal = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Retake the Review Complexity Check') +
      '&details=' + encodeURIComponent('Last score: ' + score + '/10. https://jalihr.org/calculator/review-complexity-check/') +
      '&dates=' + (function () { var d = addMonths(new Date(), months); var s = d.toISOString().slice(0, 10).replace(/-/g, ''); var e = new Date(d.getTime() + 864e5).toISOString().slice(0, 10).replace(/-/g, ''); return s + '/' + e; })();

    left.innerHTML = '<p class="eyebrow">Your number</p>' +
      '<p class="rcc-num">' + score + '<small>/ 10</small></p>' +
      '<p class="desc">' + esc(band.title) + '</p>' +
      '<p class="lede">' + esc(band.sum) + '</p>' +
      '<div class="rcc-scale"><div class="track"><span class="pin" style="left:' + ((score - 1) / 9 * 100) + '%"></span></div><div class="lab"><span>1 Simple</span><span>10 Complex</span></div></div>';
    card.innerHTML = '<div class="rcc-res">' +
      '<div class="rcc-sec"><h3>What to run</h3><ul>' + band.what.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>' +
      (split ? '<div class="rcc-sec"><h3>One cycle, ' + (ans[11] === 1 ? 'two' : 'several') + ' experiences</h3><p>Give your field or frontline teams a short check-in and your managers a ' + band.short + ', in the same cycle.</p></div>' : '') +
      '<div class="rcc-sec"><h3>Your template</h3><p>' + esc(tool.name) + '. ' + esc(band.toolNote) + '</p><ul>' + tool.links.map(function (l) { return '<li><a href="' + l[1] + '" target="_blank" rel="noopener">' + esc(l[0]) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div class="rcc-sec"><h3>Check again</h3><p>' + (months === 3 ? 'Your scale is moving. ' : '') + 'Retake this on ' + again + '. <a href="' + cal + '" target="_blank" rel="noopener">Add it to my calendar</a></p></div>' +
      '<div class="rcc-sec"><h3>Where JaliHR fits</h3><p>' + esc(band.jalihr) + '</p><a class="rcc-btn dark" href="https://meetings-eu1.hubspot.com/cmirembe" target="_blank" rel="noopener">Book a setup call</a></div>' +
      '<div class="rcc-nav"><button type="button" class="rcc-back" id="rcc-redo">Retake the check</button><a class="rcc-link" href="/blog/start-with-the-scale/">Read the article \u2192</a></div></div>';
    document.getElementById('rcc-redo').addEventListener('click', function () { ans = Q.map(function (q) { return q.multi ? [] : null; }); go(0); });
  }

  function bindNav() {
    var b = card.querySelector('.rcc-back'); if (b) b.addEventListener('click', function () { go(step - 1); });
    var n = card.querySelector('.rcc-next'); if (n) n.addEventListener('click', function () { if (answered(step)) go(step + 1); });
  }
  function go(s) {
    step = Math.max(0, Math.min(12, s));
    if (step < 12 && left.innerHTML !== intro) left.innerHTML = intro;
    if (step < 12) renderQ(); else renderResult();
    var top = (step === 12 ? left : card).getBoundingClientRect().top + window.scrollY - 120;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }

  // Preview helper for reviews: ?demo=q5, ?demo=result&a=2,2,1,...
  var p = new URLSearchParams(location.search);
  if (p.get('demo')) {
    var a = (p.get('a') || '2,2,2,1,2,1,2,2,1,2,0|1,1').split(',');
    a.forEach(function (v, i) { if (i === 10) ans[10] = v.split('|').map(Number); else if (i < 12) ans[i] = +v; });
    var d = p.get('demo');
    go(d === 'result' ? 12 : Math.max(0, (+d.replace('q', '') || 1) - 1));
  } else go(0);
})();
