'use client';

import { useMemo, useState } from 'react';

type Clue = { id: string; icon: string; object: string; title: string; detail: string; treasure?: string; position: string };
type Mission = {
  id: string; place: string; fact: 'F' | 'A' | 'C' | 'T'; theme: string; title: string; briefing: string;
  aiLabel: string; aiOutput: string; question: string; options: string[]; correct: number; success: string;
  wrong: string; rule: string; sceneClass: string; image?: string; clues: Clue[];
};

const factTools = [
  { letter: 'F', en: 'Find', zh: '找出怪怪的地方', icon: '🔦' },
  { letter: 'A', en: 'Ask', zh: '追問它憑什麼', icon: '📣' },
  { letter: 'C', en: 'Check', zh: '拿證據來比對', icon: '🔍' },
  { letter: 'T', en: 'Transform', zh: '把內容修正好', icon: '🛠️' },
];

const missions: Mission[] = [
  {
    id: 'chat', place: '五年三班群組', fact: 'F', theme: '假公告', title: '班群突然宣布停課！',
    briefing: '晚上九點，班群出現一張由 AI 整理的「緊急停課通知」。同學正在問明天到底要不要到校。',
    aiLabel: 'AI 小幫手轉貼', aiOutput: '「青芽國小明天 6/18 全校停課。教育局已經決定，請立刻轉傳給所有同學！」',
    question: '證物找齊了。現在最負責任的處理方式是？',
    options: ['通知看起來很緊急，先大量轉傳再說', '把訊息標成「尚未證實」，改查學校官網與市府正式公告', '再問一次同一個 AI，只要回答相同就是真的', '同學群裡有三個人說看過，所以可以相信'],
    correct: 1, success: '正確！停課影響所有人，必須回到有權發布、能追溯而且標有日期的官方來源。',
    wrong: '「很多人轉傳」和「AI說了兩次」都不是新證據。請回到真正有權發布停課消息的單位。',
    rule: '緊急訊息先別急著轉傳：查發布者、日期、原始連結與官方公告。', sceneClass: 'chat-scene',
    clues: [
      { id: 'account', icon: '👤', object: '發文帳號', title: '只差一個字的假帳號', detail: '帳號是「青芽國小通知站」，不是學校平常使用的「青芽國小官方」。名稱相似不代表相同。', position: 'pos-a' },
      { id: 'link', icon: '🔗', object: '公告連結', title: '沒有原始連結', detail: '訊息說「教育局已決定」，卻沒有教育局公告、文號或可點開的原文。', position: 'pos-b' },
      { id: 'date', icon: '📅', object: '班級行事曆', title: '日期對不起來', detail: '班級行事曆顯示明天是 6/17，訊息卻直接寫「明天 6/18」。', position: 'pos-c' },
      { id: 'treasure-source', icon: '🔎', object: '訊息角落', title: '找到來源放大鏡！', detail: '它會提醒你：誰說的？原文在哪裡？', treasure: '來源放大鏡', position: 'pos-d' },
    ],
  },
  {
    id: 'homework', place: '自然教室', fact: 'A', theme: '錯誤數據', title: '作業答案太完美了？',
    briefing: '小沛請 AI 幫忙寫植物呼吸的作業。答案有完整解釋，還附上一個很精確的百分比。',
    aiLabel: 'AI 作業解答', aiOutput: '「所有植物晚上都停止呼吸，只會釋放氧氣。研究證實，在房間放仙人掌能讓氧氣增加 42%。」',
    question: '要追問什麼，才能真正判斷這段答案？',
    options: ['文字寫得很順，就不用再問了', '只問「你確定嗎？」', '追問研究名稱、測量方式、42% 的比較基準，並比對課本', '請 AI 把答案寫得更長'],
    correct: 2, success: '答對了！精確數字需要樣本、方法與比較基準；「所有」這種絕對說法也值得特別檢查。',
    wrong: '答案變長或 AI 再保證一次，都不會自動產生證據。追問要能帶你找到可查證的資料。',
    rule: '數字越精確，越要問清楚：誰研究、怎麼測量、跟什麼比較？', sceneClass: 'science-scene',
    clues: [
      { id: 'absolute', icon: '💬', object: '「所有」', title: '說得太絕對', detail: '「所有植物」沒有留下例外與條件，是需要停下來檢查的紅旗。', position: 'pos-a' },
      { id: 'textbook', icon: '📘', object: '自然課本', title: '課本內容衝突', detail: '課本寫著植物白天與夜晚都會呼吸；光合作用才需要光。', position: 'pos-b' },
      { id: 'percent', icon: '42%', object: '精確數字', title: '數字沒有方法', detail: '42% 沒有說房間大小、植物數量、測量時間，也找不到研究名稱。', position: 'pos-c' },
      { id: 'treasure-ruler', icon: '📏', object: '實驗盒', title: '找到證據量尺！', detail: '它會提醒你檢查數字的樣本、方法和比較基準。', treasure: '證據量尺', position: 'pos-d' },
    ],
  },
  {
    id: 'library', place: '學校圖書館', fact: 'C', theme: '虛構來源', title: '找不到的推薦好書',
    briefing: '閱讀報告明天要交，AI 推薦了一本超符合主題的書，書名、作者、出版社甚至 ISBN 都有。',
    aiLabel: 'AI 推薦書目', aiOutput: '《會飛的雨傘》／林小光著／星河童書／ISBN 978-957-8888-42-6。曾獲 2024 兒童想像力金獎。',
    question: '三份查證結果都找不到這本書，報告應該怎麼寫？',
    options: ['資料這麼完整，直接放進參考書目', '保留書名但刪掉 ISBN', '寫明目前查無此書，改用館藏與出版社可確認的真實資料', '請 AI 再編一段內容摘要就好'],
    correct: 2, success: '正確！格式完整不等於來源存在。查不到時要誠實標示，不可以用更多虛構內容把洞補起來。',
    wrong: '刪掉一個欄位不能讓不存在的書變成真的。參考資料必須能讓別人重新找到。',
    rule: '好來源必須可追溯：館藏找得到、出版社有紀錄、書號能對應。', sceneClass: 'library-scene',
    clues: [
      { id: 'catalog', icon: '🗃️', object: '館藏目錄', title: '全校館藏查無結果', detail: '用完整書名與作者分別搜尋，都沒有相符紀錄。', position: 'pos-a' },
      { id: 'isbn', icon: '🔢', object: 'ISBN 查詢', title: '書號無法對應', detail: '這組 ISBN 沒有對應到所列的書名與出版社。數字格式像真的，內容仍可能是拼湊。', position: 'pos-b' },
      { id: 'publisher', icon: '🏢', object: '出版社網站', title: '出版社與獎項不存在', detail: '查不到這間出版社的出版目錄，也找不到同名獎項的主辦單位。', position: 'pos-c' },
      { id: 'treasure-key', icon: '🗝️', object: '借書櫃檯', title: '找到目錄鑰匙！', detail: '它能打開可搜尋、可回查、可重新找到的真實來源。', treasure: '目錄鑰匙', position: 'pos-d' },
    ],
  },
  {
    id: 'photo', place: '校園相簿室', fact: 'C', theme: 'AI 生圖', title: '這張運動會照片是真的嗎？',
    briefing: '一張逼真的接力賽照片在班群流傳。AI 說這是「今天上午十點的校慶運動會」，但看起來像照片不等於真的。',
    aiLabel: '班群照片說明', aiOutput: '「這是青芽國小今天上午 10 點舉行的 30 週年運動會。照片就是最直接的證據！」',
    question: '面對這張很自然的圖片，最好的查證方式是？',
    options: ['只要人物沒有多手指，就是真照片', '看起來很清楚，所以直接相信', '比對學校原始相簿、拍攝時間、校舍地圖與活動公告', '用另一個 AI 問它像不像 AI 圖'],
    correct: 2, success: '答對了！高品質生圖可能沒有明顯破綻。真正可靠的是來源、時間、地點與原始紀錄。',
    wrong: '現在的 AI 圖不一定會出現多手指。只靠肉眼猜「像不像AI」不足以證明真偽。',
    rule: '查圖片不要只找怪手指；更要查原始來源、時間、地點與前後事件。', sceneClass: 'photo-scene', image: 'assets/ai-sports-day-evidence.png',
    clues: [
      { id: 'clock', icon: '🕒', object: '牆上時鐘', title: '時間說法不一致', detail: '貼文說上午十點，但畫面裡的大時鐘顯示的時間不同。單張照片的說明可能被亂配。', position: 'pos-a' },
      { id: 'tower', icon: '🏫', object: '校舍高塔', title: '校舍地圖沒有這座塔', detail: '官方校舍平面圖與歷年照片中，都沒有右上方的鐘塔。', position: 'pos-b' },
      { id: 'emblem', icon: '🛡️', object: '制服與布旗', title: '校徽配色互相衝突', detail: '布旗和制服上的標誌並不一致；這需要回查官方活動照片。', position: 'pos-c' },
      { id: 'treasure-compass', icon: '🧭', object: '照片背面', title: '找到時間指南針！', detail: '它會帶你檢查拍攝時間、地點與事件前後脈絡。', treasure: '時間指南針', position: 'pos-d' },
    ],
  },
  {
    id: 'club', place: '社團博覽會', fact: 'T', theme: '刻板偏見', title: 'AI 幫每個人決定未來？',
    briefing: '學生會請 AI 製作社團招募海報。每個人物都畫得很漂亮，但工作分配卻有點熟悉。',
    aiLabel: 'AI 招募文案', aiOutput: '「男生邏輯好，推薦機器人與程式社；女生細心，推薦美宣與照顧服務隊。」',
    question: '哪個改寫真正移除了偏見，也保留每個人的選擇？',
    options: ['男生優先機器人社，女生也可以試試', '把男女分配全部對調', '每個人都能依興趣試做程式、機構、美宣與服務，不用性別預設能力', '刪掉男女兩字，但仍把學生自動分組'],
    correct: 2, success: '太好了！公平不是把限制反過來，而是移除預設，讓每個人都有嘗試、學習與改變選擇的機會。',
    wrong: '把限制顛倒或藏起來，仍然是在替別人決定。真正的修正要打開參與入口。',
    rule: '檢查偏見要看：誰主導、誰被照顧、誰沒有出現、誰被剝奪選擇。', sceneClass: 'club-scene',
    clues: [
      { id: 'roles', icon: '🤖', object: '機器人攤位', title: '工具都在誰手上？', detail: '海報裡操作工具、寫程式、做決定的角色全部是男生。', position: 'pos-a' },
      { id: 'care', icon: '🎨', object: '美宣攤位', title: '照顧工作被固定分配', detail: '女生只被安排布置與照顧，能力與性別被硬綁在一起。', position: 'pos-b' },
      { id: 'prompt', icon: '📌', object: '生成提示', title: '提示語本身有偏見', detail: '原提示寫著「畫出典型的男生與女生社團」，AI便放大了常見刻板印象。', position: 'pos-c' },
      { id: 'treasure-prism', icon: '🌈', object: '社團護照', title: '找到多元稜鏡！', detail: '它會提醒你看見被忽略的人、角色與更多可能性。', treasure: '多元稜鏡', position: 'pos-d' },
    ],
  },
];

const finalClaims = [
  { text: '「資料附了完整書名和 ISBN，所以一定是真的。」', answer: '幻覺', why: '格式完整仍可能是虛構來源。' },
  { text: '「女生天生比較適合照顧工作。」', answer: '偏見', why: '它把能力與性別固定連結。' },
  { text: '「照片很自然，所以事件一定發生過。」', answer: '待查證', why: '還要查來源、時間、地點和原始紀錄。' },
  { text: '「我比對了學校原文、發布日期與市府公告。」', answer: '有證據', why: '這是一條可重做、可追溯的證據鏈。' },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const [opened, setOpened] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [treasures, setTreasures] = useState<string[]>([]);
  const [finalMode, setFinalMode] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState<Record<number, string>>({});
  const [complete, setComplete] = useState(false);
  const mission = missions[current];
  const activeClue = mission.clues.find((clue) => clue.id === opened);
  const evidenceCount = mission.clues.filter((clue) => !clue.treasure && found.includes(clue.id)).length;
  const unlocked = evidenceCount === 3;
  const finalCorrect = useMemo(() => finalClaims.every((claim, index) => finalAnswers[index] === claim.answer), [finalAnswers]);

  function scrollToGame() { window.setTimeout(() => document.querySelector('#game')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }
  function begin() { setStarted(true); scrollToGame(); }
  function inspect(clue: Clue) {
    setOpened(clue.id);
    setFound((items) => items.includes(clue.id) ? items : [...items, clue.id]);
    if (clue.treasure) setTreasures((items) => items.includes(clue.treasure!) ? items : [...items, clue.treasure!]);
  }
  function check() { if (selected !== null) setResult(selected === mission.correct ? 'correct' : 'wrong'); }
  function next() {
    if (current === missions.length - 1) { setFinalMode(true); scrollToGame(); return; }
    setCurrent((value) => value + 1); setFound([]); setOpened(null); setSelected(null); setResult(null); scrollToGame();
  }
  function restart() {
    setStarted(true); setCurrent(0); setFound([]); setOpened(null); setSelected(null); setResult(null);
    setTreasures([]); setFinalMode(false); setFinalAnswers({}); setComplete(false); scrollToGame();
  }

  return (
    <main id="top">
      <nav className="topbar" aria-label="主要導覽">
        <a className="brand" href="#top"><span className="brand-mark">✓</span><span>校園真相修復隊</span></a>
        <div className="nav-right"><span className="age-pill">國小 4–6 年級</span><button type="button" className="nav-button" onClick={begin}>{started ? '回到任務' : '開始遊戲'}</button></div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span>CASE 001</span> AI 幻覺 × 偏見辨識挑戰</p>
          <h1>AI 怪怪校園<br /><em>消失的真相</em></h1>
          <p className="lead">班群、作業、圖書館和運動會照片都被 AI 搞亂了。加入修復隊，走進校園搜證，把「看起來合理」和「真的有證據」分開！</p>
          <div className="hero-actions"><button className="primary" type="button" onClick={begin}>加入修復隊 <span>→</span></button><span>約 20 分鐘 · 可單人或兩人共玩</span></div>
          <div className="case-tags"><span>5 個校園地點</span><span>15 份證物</span><span>5 件隱藏工具</span></div>
        </div>
        <div className="hero-art" aria-label="校園任務地圖">
          <img src="assets/campus-mystery-map.png" alt="教室、圖書館、健康中心、操場與社團市集組成的校園探險地圖" />
          <div className="map-sticker"><b>警報！</b><span>AI 答案混進校園</span></div>
          <div className="map-note">看起來像真的<br />不代表有證據</div>
        </div>
      </section>

      <section className="toolbelt" aria-labelledby="tool-title">
        <div className="tool-intro"><p className="section-kicker">你的查證工具</p><h2 id="tool-title">FACT 不是口號，<br />每一步都要動手。</h2></div>
        <div className="tool-grid">{factTools.map((tool) => <article key={tool.letter}><span className="tool-icon">{tool.icon}</span><span className="tool-letter">{tool.letter}</span><div><b>{tool.en}</b><small>{tool.zh}</small></div></article>)}</div>
      </section>

      {started && <section className="game" id="game" aria-live="polite">
        {!finalMode && !complete && <>
          <header className="game-header">
            <div><p className="section-kicker">校園搜證進度</p><h2>{current + 1}／{missions.length}　{mission.place}</h2></div>
            <div className="map-progress" aria-label={`完成 ${current + 1} / ${missions.length} 關`}>{missions.map((item, index) => <span key={item.id} className={index < current ? 'done' : index === current ? 'active' : ''}>{index < current ? '✓' : index + 1}</span>)}</div>
          </header>
          <div className="mission-card">
            <div className="mission-copy"><span className="case-type">{mission.fact} · {mission.theme}</span><h3>{mission.title}</h3><p>{mission.briefing}</p></div>
            <div className="ai-message"><span>{mission.aiLabel}</span><p>{mission.aiOutput}</p><i>AI 產出｜等待查證</i></div>
          </div>
          <div className="game-layout">
            <div>
              <div className={`scene ${mission.sceneClass}`}>
                {mission.image && <img src={mission.image} alt="待查證的校園運動會照片" />}
                {!mission.image && <SceneDecor mission={mission.id} />}
                <div className="scene-shade" />
                {mission.clues.map((clue) => <button type="button" key={clue.id} className={`hotspot ${clue.position} ${found.includes(clue.id) ? 'found' : ''} ${clue.treasure ? 'treasure' : ''}`} onClick={() => inspect(clue)} aria-label={`調查：${clue.object}`}><span>{clue.icon}</span><small>{clue.object}</small>{found.includes(clue.id) && <i>✓</i>}</button>)}
                <div className="scene-help"><b>點擊會閃動的物件</b><span>找齊 3 份證物，隱藏工具不影響過關</span></div>
              </div>
              <div className={`clue-card ${activeClue ? 'visible' : ''}`}>
                {activeClue ? <><span className="clue-big">{activeClue.icon}</span><div><small>{activeClue.treasure ? '隱藏工具' : `證物 ${evidenceCount}／3`}</small><h4>{activeClue.title}</h4><p>{activeClue.detail}</p></div></> : <p>從場景中找出可疑之處。每一個判斷都要有證物支持。</p>}
              </div>
            </div>
            <aside className={`repair-board ${unlocked ? 'unlocked' : ''}`}>
              <div className="evidence-meter"><span>證物板</span><b>{evidenceCount}／3</b><div><i style={{ width: `${evidenceCount / 3 * 100}%` }} /></div></div>
              {!unlocked ? <div className="board-locked"><span>📌</span><h3>修復任務尚未開啟</h3><p>還差 {3 - evidenceCount} 份證物。先觀察，再作判斷。</p></div> : <>
                <p className="board-label">FACT 修復任務</p><h3>{mission.question}</h3>
                <div className="options">{mission.options.map((option, index) => <button type="button" key={option} onClick={() => { setSelected(index); setResult(null); }} className={`${selected === index ? 'selected' : ''} ${result === 'correct' && index === mission.correct ? 'correct' : ''} ${result === 'wrong' && selected === index ? 'wrong' : ''}`}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
                {!result && <button type="button" className="check-button" onClick={check} disabled={selected === null}>送出修復方案</button>}
                {result && <div className={`feedback ${result}`}><b>{result === 'correct' ? '證據鏈成立！' : '再看一次證物'}</b><p>{result === 'correct' ? mission.success : mission.wrong}</p><div><strong>帶走的判斷規則</strong><span>{mission.rule}</span></div>{result === 'correct' && <button type="button" onClick={next}>{current === missions.length - 1 ? '前往朝會直播室' : '前往下一個地點'} →</button>}</div>}
              </>}
            </aside>
          </div>
          <div className="inventory"><span>修復隊工具袋</span>{['來源放大鏡', '證據量尺', '目錄鑰匙', '時間指南針', '多元稜鏡'].map((item, index) => <div key={item} className={treasures.includes(item) ? 'owned' : ''}><b>{treasures.includes(item) ? ['🔎','📏','🗝️','🧭','🌈'][index] : '?'}</b><small>{treasures.includes(item) ? item : '尚未發現'}</small></div>)}</div>
        </>}

        {finalMode && !complete && <section className="final-room">
          <p className="section-kicker">FINAL · 朝會直播室</p><h2>最後一分鐘：修好今天的校園廣播</h2><p className="final-lead">阿幻把四種內容混進朝會稿。替每一句貼上正確標籤，完成最後查核。</p>
          <div className="claim-grid">{finalClaims.map((claim, index) => <article key={claim.text}><span>廣播稿 0{index + 1}</span><p>{claim.text}</p><div>{['幻覺','偏見','待查證','有證據'].map((choice) => <button type="button" key={choice} onClick={() => setFinalAnswers((answers) => ({...answers, [index]: choice}))} className={finalAnswers[index] === choice ? 'selected' : ''}>{choice}</button>)}</div>{finalAnswers[index] && <small className={finalAnswers[index] === claim.answer ? 'ok' : 'try'}>{finalAnswers[index] === claim.answer ? `✓ ${claim.why}` : '再想想：這句話的問題是事實、觀點，還是證據不足？'}</small>}</article>)}</div>
          <button type="button" className="final-submit" disabled={!finalCorrect} onClick={() => setComplete(true)}>送出修正版廣播</button>
        </section>}

        {complete && <section className="complete-screen">
          <span className="complete-stamp">CASE<br />CLOSED</span><p className="section-kicker">校園警報解除</p><h2>你不是「抓 AI 說錯」，<br />而是學會用證據做決定。</h2><p>AI 可以幫忙整理與創作，但最後的查證、判斷和修正，仍然要由人負責。</p>
          <div className="report"><article><b>5</b><span>完成的校園案件</span></article><article><b>15</b><span>必要證物</span></article><article><b>{treasures.length}</b><span>找到的隱藏工具</span></article></div>
          <div className="takeaway"><b>離開前記住</b><span>流暢不等於正確</span><span>精確數字不等於有證據</span><span>圖片自然不等於事件真實</span><span>AI 也可能放大刻板印象</span></div>
          <button type="button" className="primary" onClick={restart}>再挑戰一次 ↻</button>
        </section>}
      </section>}

      <section className="teacher-section">
        <div><p className="section-kicker">給老師的課堂延伸</p><h2>先問學生「你看到什麼線索？」<br />再公布答案。</h2><p>建議兩人共用一台裝置：一人操作、一人擔任證據記錄員，每過一關交換角色。</p></div>
        <div className="teacher-cards"><details><summary>討論提問</summary><ol><li>哪一個細節最容易讓你相信 AI？</li><li>「查不到」和「一定是假的」有什麼不同？</li><li>偏見和錯誤事實要用同一種方式處理嗎？</li><li>你會如何把 AI 原句改得更負責任？</li></ol></details><details><summary>學習重點</summary><ul><li>把 AI 回答視為待查證初稿。</li><li>建立可追溯的來源、日期與證據鏈。</li><li>辨識人物分工、缺席觀點與刻板印象。</li><li>指出問題後，完成正確且公平的改寫。</li></ul></details></div>
      </section>
      <footer><span>AI 怪怪校園：消失的真相</span><span>看見可疑 · 找到證據 · 修正內容</span></footer>
    </main>
  );
}

function SceneDecor({ mission }: { mission: string }) {
  if (mission === 'chat') return <div className="decor chat-decor"><div className="phone"><i /><p>緊急通知！</p><span>明天停課</span><small>請立刻轉傳</small></div><div className="calendar">6<br /><b>17</b></div><div className="notice-mini">OFFICIAL?</div></div>;
  if (mission === 'homework') return <div className="decor science-decor"><div className="board">植物晚上<br />停止呼吸？</div><div className="plant">🌵</div><div className="book">自然課本</div><div className="number">+42%</div></div>;
  if (mission === 'library') return <div className="decor library-decor"><div className="shelves">📚　📗　📙<br />📘　📕　📚<br />📗　📚　📓</div><div className="book-card"><b>會飛的雨傘</b><span>林小光　著</span><small>查無館藏</small></div><div className="terminal">搜尋結果：0</div></div>;
  return <div className="decor club-decor"><div className="booth robot">🤖<b>機器人社</b><span>男生專區？</span></div><div className="booth art">🎨<b>美宣服務</b><span>女生專區？</span></div><div className="prompt-note">典型的男生／女生社團</div></div>;
}
