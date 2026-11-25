'use client';

import { useState } from 'react';

type Mission = {
  fact: 'F' | 'A' | 'C' | 'T';
  en: string;
  title: string;
  scene: string;
  prompt: string;
  kind: 'multi' | 'single';
  options: string[];
  correct: number[];
  hint: string;
  success: string;
  wrong: string;
  rule: string;
  tag: string;
};

const factSteps = [
  { letter: 'F', en: 'Find', zh: '找出可疑' },
  { letter: 'A', en: 'Ask', zh: '追問依據' },
  { letter: 'C', en: 'Check', zh: '查證比對' },
  { letter: 'T', en: 'Transform', zh: '修正轉化' },
];

const missions: Mission[] = [
  {
    fact: 'F', en: 'Find', title: '班群裡的「讀書神招」', tag: '文字幻覺',
    scene: '明天要段考，同學把 AI 的回答貼進班群：「有研究證實，每天聽 10 分鐘白噪音，段考平均進步 37%。這是國家腦力研究院 2026 年的研究。」大家正準備轉傳。',
    prompt: '哪些地方值得先按下暫停？（可複選）', kind: 'multi',
    options: ['「有研究證實」卻沒有可點開的原始資料', '37% 很精確，但沒有樣本、方法與比較基準', '機構與研究名稱聽起來正式，卻可能無法查到', '句子有完整標點，所以應該可信'],
    correct: [0, 1, 2],
    hint: '把「說得很肯定」與「拿得出證據」分開看。',
    success: '你抓到三個紅旗：來源不明、數字缺少脈絡、權威名稱可能是虛構的。',
    wrong: '別只看語氣是否專業。幻覺常把具體數字、年份和機構拼成一個很像真的答案。',
    rule: '越具體的數字與文獻，越要能追到原始來源；查不到時先標示「未證實」。',
  },
  {
    fact: 'A', en: 'Ask', title: '社團成果展的 AI 配圖', tag: '圖像偏見',
    scene: '學生會請 AI 畫「多元社團成果展」。這張圖第一眼很自然，準備直接放上學校首頁。先觀察人物正在做什麼，再回答問題。',
    prompt: '最值得追問的問題是什麼？', kind: 'single',
    options: ['畫面顏色是不是太溫暖？', '為什麼操作機器與程式的都是男生，照護與布置的都是女生？', '每位學生的制服是否完全一樣？', '教室裡為什麼有植物？'],
    correct: [1],
    hint: '不要只數「有沒有男生和女生」，要看誰被安排做什麼。',
    success: '你看見了「角色分配」的偏見。人物都有出現，不代表每個人都獲得同樣的可能性。',
    wrong: '媒體識讀不只是找畫面瑕疵。請觀察性別與能力、興趣、職業之間是否被固定連結。',
    rule: '辨識偏見要看角色、位置、動作與權力：誰在主導？誰只被安排照顧或裝飾？誰沒有出現？',
  },
  {
    fact: 'C', en: 'Check', title: '一則看似貼心的新規定', tag: '查證來源',
    scene: 'AI 告訴小凱：「本市所有中學生每學期都有 3 天心理健康假，不必附任何證明。」他想把這句話做成班級公告，但回答沒有附法規名稱與日期。',
    prompt: '下一步怎麼查最可靠？', kind: 'single',
    options: ['再問同一個 AI 一次，只要答案相同就採用', '到社群平台搜尋按讚最多的貼文', '比對學校最新公告、主管機關官方規定與發布日期；必要時詢問承辦人', '請另一位同學憑印象判斷'],
    correct: [2],
    hint: '規定會更新，查「誰有權發布」和「何時生效」。',
    success: '查證不是換一個人猜，而是回到有權責、可追溯、標有日期的來源交叉比對。',
    wrong: '重複問 AI 或看人氣，都不能證明規定存在。先找有權發布這項規定的單位。',
    rule: '重要資訊至少核對：發布者、日期、原文、適用範圍；不同來源互相抄寫不等於多重證據。',
  },
  {
    fact: 'T', en: 'Transform', title: '把偏見改成負責任的表達', tag: '修正轉化',
    scene: '社團招募文案寫著：「男生邏輯好，適合機器人組；女生細心，適合美宣與照顧組。」你已經發現它把性別當成能力證明，現在要修正。',
    prompt: '哪一個改寫最公平，也最保留學生選擇？', kind: 'single',
    options: ['男生優先選機器人組，女生也可以試試看', '每個人都能依興趣加入；我們提供程式、機構、美宣與活動照護的入門體驗，不以性別預設能力', '為了公平，男生只能做美宣，女生只能做機器人', '刪掉性別兩字，改成「有天分的人自然會選對組」'],
    correct: [1],
    hint: '公平不是把刻板印象顛倒，而是移除預設、提供真實選擇與支持。',
    success: '你把單一標籤轉成可選擇、可學習的能力描述，也沒有用另一個刻板印象取代它。',
    wrong: '顛倒限制或把偏見藏起來，都不是真正修正。好的改寫要讓不同學生都有參與與學習的入口。',
    rule: 'Transform 不只是刪錯字：要補足被忽略的觀點，改成正確、多元、尊重差異的表達。',
  },
];

function sameAnswer(a: number[], b: number[]) {
  return a.length === b.length && [...a].sort().every((value, index) => value === [...b].sort()[index]);
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [hint, setHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const mission = missions[current];

  function begin() {
    setStarted(true);
    setTimeout(() => document.querySelector('#mission')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  function choose(index: number) {
    if (result === 'correct') return;
    setResult(null);
    if (mission.kind === 'multi') {
      setSelected((values) => values.includes(index) ? values.filter((value) => value !== index) : [...values, index]);
    } else {
      setSelected([index]);
    }
  }

  function checkAnswer() {
    if (!selected.length) return;
    setResult(sameAnswer(selected, mission.correct) ? 'correct' : 'wrong');
  }

  function nextMission() {
    if (current === missions.length - 1) {
      setFinished(true);
      setTimeout(() => document.querySelector('#mission')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      return;
    }
    setCurrent((value) => value + 1);
    setSelected([]);
    setResult(null);
    setHint(false);
    setTimeout(() => document.querySelector('#mission')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  function restart() {
    setCurrent(0); setSelected([]); setResult(null); setHint(false); setFinished(false); setStarted(true);
    setTimeout(() => document.querySelector('#mission')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  return (
    <main>
      <nav className="topbar" aria-label="遊戲資訊">
        <a className="brand" href="#top" aria-label="回到首頁"><span className="brand-mark">?</span><span>訊息偵探社</span></a>
        <span className="status-pill">校園 AI 密室 · {finished ? '已解除警報' : started ? `解鎖 ${current + 1} / 4` : '等待解鎖'}</span>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">AI 幻覺 × 偏見辨識挑戰</p>
          <h1>失控的<br /><em>完美答案</em></h1>
          <p className="lead">校園 AI 把「看起來合理」當成了「一定正確」。請在警報響起前，找出錯誤、偏見與被藏起來的觀點。</p>
          <button className="primary" type="button" onClick={begin}>{started ? '回到調查現場' : '開始調查'} <span>→</span></button>
          <p className="microcopy">全程約 12 分鐘 · 不用登入 · 適合分組討論</p>
        </div>
        <div className="hero-scene" aria-label="數位校園檔案室">
          <div className="scene-grid" />
          <div className="case-file">
            <div className="case-topline"><span>CASE 404</span><span className="blink">● LIVE</span></div>
            <p>「AI 說得很完整，<br />所以它一定是真的？」</p>
            <div className="redacted">SOURCE: ███████</div><div className="warning-stamp">待查證</div>
          </div>
          <div className="tape tape-one">DO NOT TRUST FIRST IMPRESSIONS</div><div className="tape tape-two">FACT CHECK ZONE</div>
        </div>
      </section>

      <section className="fact-strip" aria-labelledby="fact-title">
        <div><p className="section-kicker">你的破關工具</p><h2 id="fact-title">記住 FACT，不被「像真的」騙過</h2></div>
        <div className="fact-grid">
          {factSteps.map((step) => <article className="fact-card" key={step.letter}><span>{step.letter}</span><div><strong>{step.en}</strong><small>{step.zh}</small></div></article>)}
        </div>
      </section>

      {started && <section className="mission-zone" id="mission" aria-live="polite">
        {!finished ? <>
          <div className="mission-head">
            <div className="progress-track" aria-label={`完成進度 ${current + 1} / 4`}>
              {factSteps.map((step, index) => <span key={step.letter} className={index < current ? 'done' : index === current ? 'active' : ''}>{index < current ? '✓' : step.letter}</span>)}
            </div>
            <div className="mission-label"><span>MISSION {current + 1} / 4</span><b>{mission.fact} · {mission.en}</b></div>
          </div>

          <div className="mission-layout">
            <article className="evidence-panel">
              <div className="evidence-top"><span>證物 {String(current + 1).padStart(2, '0')}</span><span>{mission.tag}</span></div>
              <h3>{mission.title}</h3>
              <p>{mission.scene}</p>
              {current === 1 && <figure className="evidence-image"><img src="assets/ai-biased-career-day.webp" alt="AI 生成的校園社團成果展，學生分成機器人、照護與布置活動" /><figcaption>AI 生成圖像 · 請觀察人物的角色與分工</figcaption></figure>}
              <div className="note-pin">看似完整 ≠ 已經證實</div>
            </article>

            <div className="question-panel">
              <span className="question-no">{mission.kind === 'multi' ? 'MULTIPLE CLUES' : 'ONE BEST MOVE'}</span>
              <h3>{mission.prompt}</h3>
              <div className="options" role="group" aria-label="答案選項">
                {mission.options.map((option, index) => {
                  const isSelected = selected.includes(index);
                  const answerClass = result === 'correct' && mission.correct.includes(index) ? 'correct-choice' : result === 'wrong' && isSelected ? 'wrong-choice' : '';
                  return <button type="button" key={option} onClick={() => choose(index)} className={`option ${isSelected ? 'selected' : ''} ${answerClass}`} aria-pressed={isSelected}><span>{String.fromCharCode(65 + index)}</span>{option}</button>;
                })}
              </div>
              <div className="actions"><button type="button" className="hint-button" onClick={() => setHint((value) => !value)}>提示線索</button><button type="button" className="check-button" disabled={!selected.length || result === 'correct'} onClick={checkAnswer}>送出判斷</button></div>
              {hint && <p className="hint-box">🔦 {mission.hint}</p>}
              {result && <div className={`feedback ${result}`} role="status"><strong>{result === 'correct' ? '證物解鎖！' : '再看一次線索'}</strong><p>{result === 'correct' ? mission.success : mission.wrong}</p><div className="rule"><b>帶得走的判斷規則</b>{mission.rule}</div>{result === 'correct' && <button type="button" className="next-button" onClick={nextMission}>{current === 3 ? '輸入最終密碼' : '前往下一間密室'} →</button>}</div>}
            </div>
          </div>
        </> : <div className="escape-complete">
          <p className="section-kicker">ALERT CLEARED</p><div className="unlock-mark">FACT</div><h2>你逃出的不是房間，<br />是「AI 一定客觀」的陷阱。</h2>
          <p>真正的媒體識讀，不是從此不相信 AI；而是知道什麼時候要停下來、追問、查證，再負責任地修正。</p>
          <div className="takeaways"><article><b>遇到事實</b><span>追到可查證的原始來源</span></article><article><b>遇到觀點</b><span>問誰的聲音被放大或消失</span></article><article><b>準備分享</b><span>標示不確定，補足脈絡再轉傳</span></article></div>
          <button type="button" className="primary" onClick={restart}>重新挑戰 <span>↻</span></button>
        </div>}
      </section>}

      <section className="risk-section" aria-labelledby="risk-title">
        <div className="risk-intro"><p className="section-kicker">為什麼要學</p><h2 id="risk-title">AI 的問題，不只「答錯」</h2><p>最大的風險，是把錯誤資訊、單一觀點或刻板印象，誤認為中立、客觀或權威知識。</p></div>
        <div className="risk-list"><article><span>01</span><div><h3>幻覺</h3><p>產生錯誤資料、虛構來源、不存在的文獻、錯誤數據或不完整解釋。</p></div></article><article><span>02</span><div><h3>偏見</h3><p>從訓練資料延續或放大性別、族群、文化、職業與社會階級的刻板印象。</p></div></article><article><span>03</span><div><h3>假客觀</h3><p>流暢、完整、肯定的語氣會讓人降低警覺，但表達自信不等於證據可靠。</p></div></article></div>
      </section>

      <section className="teacher-section"><div><p className="section-kicker">課堂延伸</p><h2>別急著公布答案，<br />先讓學生說出判斷線索。</h2></div><details><summary>教師引導提問（點開查看）</summary><ol><li>你先注意到哪一個字、數字、人物或畫面位置？</li><li>如果要相信這則訊息，現在還缺哪一份證據？</li><li>同樣的回答若換成另一個性別、文化或家庭背景，結果會不會不同？</li><li>你的修正版如何做到更正確，也更公平？</li></ol></details></section>

      <footer><span>訊息偵探社 · AI 幻覺與偏見教學遊戲</span><span>先查證，再使用；能修正，才是理解。</span></footer>
    </main>
  );
}
