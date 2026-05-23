const dimensions = [
  {
    key: "rhythm",
    name: "节奏 Rhythm",
    shortName: "节奏",
    prompt: "判断：这段关系是否长期稳定？",
    questions: [
      "对方的回应频率经常忽快忽慢，让你难以预测。",
      "你经常因为对方突然冷淡而焦虑。",
      "你们的见面、联系、沟通安排经常临时变化。",
      "对方会突然热情，又突然疏远。",
      "你经常需要根据对方状态调整自己的表达。",
      "关系里有很多“不知道什么时候会好”的等待。",
      "你无法稳定判断自己在这段关系里的位置。",
      "对方消失或冷淡后，常常没有清楚解释。",
      "你经常复盘对方态度变化的原因。",
      "这段关系让你长期处在不确定感里。"
    ],
    advice: "观察对方冷淡或消失后，是否愿意解释、承担，并建立更稳定的沟通方式。"
  },
  {
    key: "investment",
    name: "投入 Investment",
    shortName: "投入",
    prompt: "判断：这段关系是不是长期单边？",
    questions: [
      "大多数联系、缓和、推进，都是你先开始。",
      "出现问题后，通常是你先解释、低头或修复。",
      "你付出的时间、精力、情绪明显多于对方。",
      "对方享受你的情绪价值，但很少反过来支持你。",
      "你明显疲惫时，对方很少主动接住你的节奏。",
      "对方很少为关系做现实协调或安排。",
      "你的付出经常没有被记住或反馈。",
      "关系能维持，很大程度上靠你一直撑着。",
      "你经常觉得自己像是在独自经营关系。",
      "如果你不主动，这段关系很可能自然停下来。"
    ],
    advice: "观察你停止主动补位后，对方是否会靠近、回应，并承担一部分修复成本。"
  },
  {
    key: "boundary",
    name: "边界 Boundary",
    shortName: "边界",
    prompt: "判断：你是否正在失去自己的边界？",
    questions: [
      "你越来越不敢直接表达不舒服。",
      "你经常把自己的需求往后放。",
      "你会为了不破坏关系而反复说“算了”。",
      "你经常替对方找理由，忽略自己的感受。",
      "你说“不”的时候，会担心对方不高兴或离开。",
      "你的时间和情绪经常被对方默认可用。",
      "你开始害怕提出正常需求。",
      "对方触碰你的底线后，关系常常没有真正处理。",
      "你为了维持关系，牺牲了很多原本的生活节奏。",
      "你感觉自己在这段关系里越来越不像自己。"
    ],
    advice: "观察你表达不舒服或提出正常需求后，对方是否尊重，而不是把你的需求定义成麻烦。"
  },
  {
    key: "position",
    name: "位置 Position",
    shortName: "位置",
    prompt: "判断：你在关系中的位置是否越来越被动？",
    questions: [
      "你经常在等对方选择、回应或安排你。",
      "你感觉自己的事情总是被对方往后放。",
      "你在对方生活里更像“空档”，而不是“安排”。",
      "对方很少主动把你放进未来计划里。",
      "你经常不确定自己在对方心里的优先级。",
      "关系定义权更多掌握在对方手里。",
      "你害怕退出关系，因为担心彻底失去对方。",
      "你的情绪很容易被对方的回应牵动。",
      "你在关系里越来越被动、等待、配合。",
      "你感觉自己变成了“可以被延后的人”。"
    ],
    advice: "观察你的事情是否被认真安排，你能否在关系里恢复自己的节奏和判断。"
  }
];

const options = [
  { value: 0, label: "几乎没有" },
  { value: 1, label: "偶尔出现" },
  { value: 2, label: "经常出现" },
  { value: 3, label: "长期明显存在" }
];

const form = document.querySelector("#quizForm");
const progressText = document.querySelector("#progressText");
const submitButton = document.querySelector("#submitButton");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const resultsSection = document.querySelector("#results");
const totalScoreEl = document.querySelector("#totalScore");
const statusPill = document.querySelector("#statusPill");
const resultTitle = document.querySelector("#resultTitle");
const resultSubtitle = document.querySelector("#resultSubtitle");
const bars = document.querySelector("#bars");
const interpretationText = document.querySelector("#interpretationText");
const adviceList = document.querySelector("#adviceList");
const copyResultButton = document.querySelector("#copyResultButton");

let latestResult = null;

function renderQuiz() {
  form.innerHTML = dimensions
    .map((dimension) => {
      const questions = dimension.questions
        .map((question, index) => {
          const name = `${dimension.key}-${index}`;
          const optionMarkup = options
            .map(
              (option) => `
                <label class="option">
                  <input type="radio" name="${name}" value="${option.value}" required />
                  <span>${option.label}</span>
                </label>
              `
            )
            .join("");

          return `
            <fieldset class="question">
              <p>${index + 1}. ${question}</p>
              <div class="options">${optionMarkup}</div>
            </fieldset>
          `;
        })
        .join("");

      return `
        <section class="dimension">
          <div class="dimension-header">
            <div>
              <h3>${dimension.name}</h3>
              <p>${dimension.prompt}</p>
            </div>
          </div>
          ${questions}
        </section>
      `;
    })
    .join("");
}

function answeredCount() {
  return form.querySelectorAll("input[type='radio']:checked").length;
}

function updateProgress() {
  const count = answeredCount();
  progressText.textContent = `已完成 ${count} / 40`;
  submitButton.disabled = count !== 40;
}

function scoreBand(score) {
  if (score <= 30) return { label: "稳定关系区", tone: "关系整体结构较稳，可以继续正常经营。" };
  if (score <= 60) return { label: "观察调整区", tone: "关系存在局部失衡，需要沟通、调整、重新建立规则。" };
  if (score <= 90) return { label: "高内耗区", tone: "多个变量已经失衡，你可能正在长期消耗自己。" };
  return { label: "严重失衡区", tone: "关系结构风险较高，不建议继续靠单方面努力维持。" };
}

function variableBand(score) {
  if (score <= 7) return "健康区";
  if (score <= 15) return "轻度失衡";
  if (score <= 23) return "中度失衡";
  return "高风险失衡";
}

function calculateScores() {
  const scores = {};
  dimensions.forEach((dimension) => {
    scores[dimension.key] = dimension.questions.reduce((sum, _question, index) => {
      const input = form.querySelector(`input[name="${dimension.key}-${index}"]:checked`);
      return sum + Number(input.value);
    }, 0);
  });

  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const main = dimensions
    .map((dimension) => ({ ...dimension, score: scores[dimension.key] }))
    .sort((a, b) => b.score - a.score)[0];

  return { scores, total, main, band: scoreBand(total) };
}

function buildInterpretation(result) {
  const mainBand = variableBand(result.main.score);
  const templates = {
    rhythm:
      "你现在的疲惫，不一定来自某一次具体事件，而是来自长期的节奏不稳定。对方可能不是完全没有回应，但回应频率、靠近方式和问题处理节奏让你一直处在判断里。真正消耗人的，往往不是等待本身，而是你不知道下一次稳定什么时候出现。",
    investment:
      "你现在的疲惫，不一定是因为你付出太多，而是关系成本正在变得单边。你可能一直在主动联系、解释、缓和、修复，把对方没有承担的部分默默接过来。长期看，这会让关系看似还在，实际却越来越依赖你的承载力。",
    boundary:
      "你现在的不舒服，不一定是你太敏感，而是你的边界可能正在后退。你开始更频繁地说算了，替对方找理由，把自己的感受往后放。短期看关系好像更顺，长期看你的位置会越来越轻。",
    position:
      "你现在的内耗，不一定是放不下，而是位置正在变得被动。你可能越来越依赖对方回应来确认关系，也越来越习惯等待对方安排。真正需要观察的，不是对方还会不会联系你，而是你是否被认真放进关系结构里。"
  };

  return `${templates[result.main.key]} 当前最明显的变量是「${result.main.shortName}」，得分 ${result.main.score}/30，属于${mainBand}。这不是结论，而是一个观察点：先看结构是否能变稳定，再决定要投入多少。`;
}

function renderResults(result) {
  latestResult = result;
  totalScoreEl.textContent = result.total;
  statusPill.textContent = result.band.label;
  resultTitle.textContent = `主要失衡变量：${result.main.shortName}`;
  resultSubtitle.textContent = result.band.tone;
  interpretationText.textContent = buildInterpretation(result);

  bars.innerHTML = dimensions
    .map((dimension) => {
      const score = result.scores[dimension.key];
      return `
        <div class="bar-row">
          <div class="bar-label">
            <span>${dimension.shortName}</span>
            <span>${score} / 30 · ${variableBand(score)}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${(score / 30) * 100}%"></div></div>
        </div>
      `;
    })
    .join("");

  const advice = [
    result.main.advice,
    "观察这段关系是否让你相处后更稳定，还是更疲惫。",
    "观察你减少自动配合后，关系是否仍然有双向回应和修复能力。"
  ];

  adviceList.innerHTML = advice.map((item) => `<li>${item}</li>`).join("");
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetQuiz() {
  form.reset();
  latestResult = null;
  resultsSection.hidden = true;
  updateProgress();
  document.querySelector("#intro").scrollIntoView({ behavior: "smooth", block: "start" });
}

function copyResult() {
  if (!latestResult) return;

  const lines = [
    "关系四变量测评结果",
    `总分：${latestResult.total}/120（${latestResult.band.label}）`,
    ...dimensions.map((dimension) => `${dimension.shortName}：${latestResult.scores[dimension.key]}/30（${variableBand(latestResult.scores[dimension.key])}）`),
    `主要失衡变量：${latestResult.main.shortName}`,
    `结构解释：${buildInterpretation(latestResult)}`
  ];

  const summary = lines.join("\n");
  const markCopied = () => {
    copyResultButton.textContent = "已复制";
    window.setTimeout(() => {
      copyResultButton.textContent = "复制结果摘要";
    }, 1600);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(summary).then(markCopied).catch(() => fallbackCopy(summary, markCopied));
    return;
  }

  fallbackCopy(summary, markCopied);
}

function fallbackCopy(text, onSuccess) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  onSuccess();
}

renderQuiz();
updateProgress();

form.addEventListener("change", updateProgress);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (answeredCount() !== 40) return;
  renderResults(calculateScores());
});

startButton.addEventListener("click", () => {
  document.querySelector("#assessment").scrollIntoView({ behavior: "smooth", block: "start" });
});

resetButton.addEventListener("click", resetQuiz);
copyResultButton.addEventListener("click", copyResult);
