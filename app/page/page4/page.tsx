"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Cpu, Copy, CheckCircle, FileText, 
  Lightbulb, Sparkles, MessageSquare, Settings, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";

// ==========================================
// 定数・設定
// ==========================================
const SUBJECT_OPTIONS = [
  "自立活動", "日常生活の指導", "職業", "生活単元学習", "作業学習", 
  "国語", "算数", "美術", "理科", "社会", "音楽", "図画工作", 
  "体育", "家庭", "外国語活動", "総合的な学習の時間", "保険", "数学"
];

const LOGO_PATH = "/MieeL2.png"; // 白背景用ロゴ

export default function AiPlanningPage() {
  // ==========================================
  // State管理
  // ==========================================
  const [mode, setMode] = useState<"normal" | "excel">("normal");

  // プロンプト①用
  const [p1Input, setP1Input] = useState("視力が弱い、落ち着きがない、疲れやすい、音に敏感、話しかけられると混乱する、同じ行動を繰り返す");
  const [p1Output, setP1Output] = useState("");

  // プロンプト②用
  const [p2Input, setP2Input] = useState("（例）対象児童は現在、感覚過敏があり...");
  const [p2Output, setP2Output] = useState("");

  // プロンプト③用
  const [p3Input, setP3Input] = useState("視力が弱い、落ち着きがない、疲れやすい、音に敏感、話しかけられると混乱する、同じ行動を繰り返す");
  const [p3Output, setP3Output] = useState("");

  // プロンプト④用
  const [p4SelectedSubjects, setP4SelectedSubjects] = useState<string[]>([]);
  const [p4SubjectInputs, setP4SubjectInputs] = useState<Record<string, string>>({});
  const [p4Reference, setP4Reference] = useState("（例：文字を読むことに抵抗がある、数の概念が理解しづらい...）");
  const [p4Output, setP4Output] = useState("");

  // プロンプト⑤用
  const [p5UseFile, setP5UseFile] = useState(false);
  const [p5Reference, setP5Reference] = useState("（例：個別の指導計画の「指導の目標および内容」の全文や、特に見てほしい部分など）");
  const [p5Activity, setP5Activity] = useState("【自立活動】：・教員の誘導で肩や首の力を抜き、胸を張った姿勢で活動できた。\n【国語】：自分の名前を丁寧になぞり書きできた。");
  const [p5Output, setP5Output] = useState("");

  // プロンプト⑥用
  const [p6Term, setP6Term] = useState<"前期" | "後期／学年末">("前期");
  const [p6UseFile, setP6UseFile] = useState(false);
  const [p6Reference, setP6Reference] = useState("（例：プロンプト④で作成した評価文の全体、または特に見てほしい部分など）");
  const [p6Points, setP6Points] = useState("- 大きなけがもなく元気に登校できたことの喜び。\n- 友人との関わりが前向きになった点。\n- 宿泊学習などの大きな行事を乗り越えた自信。\n- 家庭との連携への感謝。");
  const [p6Output, setP6Output] = useState("");

  // ==========================================
  // ロジック関数
  // ==========================================

  // クリップボードコピー
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("クリップボードにコピーしました！");
  };

  // プロンプト①生成
  const generatePrompt1 = () => {
    const commonInstructions = `
【出力項目】：
1.特別な教育的ニーズ

・入力から共通性を見出し、2～3つの抽象的カテゴリーに分類する（表記は①～③の形【※必ずしも③まで必要としない入力内容や添付資料により臨機応変に】）。
・各ニーズは20〜100字程度で、児童・生徒の実態を柔らかく教育的にまとめる。
・具体的な出力の形【出力フォーマット】
対象児童（生徒）は現在、以下の状況である。【←必ずこの文言で始める】
① （入力内容を整理してまとめた課題、困難さ、特徴）
② （入力内容を整理してまとめた課題、困難さ、特徴）
③ （入力内容を整理してまとめた課題、困難さ、特徴）
※ 内容は「日常生活・学習・コミュニケーション・行動・身体・感覚・心理」などから、入力内容に応じて適切に選んでまとめること。

従って、以下の支援が必要である。【←必ずこの文言で始める】
① （①の状況に対応した支援目標や方法）
② （②の状況に対応した支援目標や方法）
③ （③の状況に対応した支援目標や方法）

支援に当たっては、以下の配慮が必要である。【←必ずこの文言で始める】
① （①の状況に対応した配慮）
② （②の状況に対応した配慮）
③ （③の状況に対応した配慮）

2.合理的配慮の実施内容
・上記①のニーズに対応した合理的配慮を少なくとも2つ以上提案する。
・シンプルに2つ以上箇条書きで示す。（例：「具体物を示し、視覚的な支援を行う。」、「落ち着ける環境設定にする。」、「生徒が好きな感触の本や音の出る玩具等を教室内に用意し、心理的安定を図る。」など）。

【条件】：
- 添付資料がある場合（「プランA」や「個別の教育支援計画」）にある書き方を参考にしてください。
- この後、この「特別な教育的ニーズ」を「特別な教育的ニーズ」⇒「所属校の支援目標」及び「各目標に連動した支援内容」⇒「指導方針」（プランBや個別の指導計画）の順で具体化していくのでそのつもりで抽象的に表現する。
- 「～です。～ます。」調ではなく、「～である。」調で文章を作成してください。
- 各項目の文量は200〜300文字程度で、柔らかく教育的な表現で整えてください。
`;

    let finalPrompt = "";
    if (mode === "excel") {
      finalPrompt = `以下の実態や課題をもとに、特別支援教育に関する「プランA」の項目を作成してください。
ただし、出力形式は指定の【JSON形式】のみとします。前置きや解説は不要です。

【入力】実態や課題：
${p1Input}

${commonInstructions}

【重要：出力形式と整形ルール】
上記の内容を作成した上で、以下のJSONフォーマットに格納して出力してください。
JSONのvalue（値）については、以下のルールを厳守してください。

1. **タイトルの除外**：
   出力テキストには「1.特別な教育的ニーズ」や「2.合理的配慮の実施内容」といったタイトル行を含めないでください。

2. **改行の厳守**：
   Excelのセル内で見やすくするため、以下の箇所の直前には**必ず改行**を入れてください。
   - 「①」「②」「③」などの番号の直前
   - 「・」などの箇条書き記号の直前
   - 「従って、」「支援に当たっては、」などの段落の変わり目の直前

3. **余計な記号の禁止**：
   - Gemini等で表示される**「**」（太字強調）などのMarkdown記号は一切使用しないでください**。プレーンテキストのみにしてください。

【JSON出力フォーマット】
{
  "needs": "特別な教育的ニーズの内容のみ（タイトル不要、整形ルールに従う）",
  "accommodations": "合理的配慮の実施内容のみ（タイトル不要、整形ルールに従う）"
}`;
    } else {
      finalPrompt = `以下の実態や課題をもとに、特別支援教育に関する「プランA」の以下の項目を作成してください。

【入力】実態や課題：
${p1Input}
${commonInstructions}`;
    }
    setP1Output(finalPrompt);
  };

  // プロンプト②生成
  const generatePrompt2 = () => {
    const commonInstructions = `
【出力項目】：
・1所属校の支援目標・機関名、2支援内容のプロンプトを生成　※機関名はそういう表記がされているだけで、意味は無視して良いタイトルはそのままで。
1.所属校の支援目標・機関名  
（特別な教育的ニーズの①～③に対応して作成。②までしかない場合は②まででよい。）

①目標：（30字以内程度・短くてもよい）  
②目標：（30字以内程度・短くてもよい）    
③目標：（30字以内程度・短くてもよい）  

2.支援内容  
（上記の①～③の目標それぞれに対応して作成。）

①（50字以内程度で、学校現場で実践可能な支援内容を記載）  
②（50字以内程度で、学校現場で実践可能な支援内容を記載）  
③（50字以内程度で、学校現場で実践可能な支援内容を記載）

条件】：
- 「特別な教育的ニーズ」と対応が分かるように①～③の番号を揃えること。  
- 各文は短くてもよいが、教育的で柔らかい表現にすること。  
- 「～です。～ます。」調ではなく、「～である。」調で統一すること。  
- 添付資料（「プランA」や「個別の教育支援計画」）の書き方を参考にしてよい。  
- ここでは抽象的にまとめ、**次の段階（プランBなど）で具体化していくための基礎**として作成すること。  
`;

    let finalPrompt = "";
    if (mode === "excel") {
      finalPrompt = `以下の「特別な教育的ニーズ」に基づいて、「所属校による支援計画（プランA）」の項目を作成してください。
ただし、出力形式は指定の【JSON形式】のみとします。前置きや解説は不要です。

【参考】特別な教育的ニーズ：
${p2Input}

${commonInstructions}

【重要：出力形式と整形ルール】
上記の内容を作成した上で、以下のJSONフォーマットに格納して出力してください。
JSONのvalue（値）については、以下のルールを厳守してください。

1. **タイトルの除外**：
   「1.所属校の支援目標・機関名」や「2.支援内容」といった**タイトル行を含めないでください**。
   
2. **改行の厳守**：
   Excelのセル内で見やすくするため、「①」「②」「③」などの番号の直前には**必ず改行**を入れてください。
   
3. **余計な記号の禁止**：
   - **「**」（太字強調）などのMarkdown記号は一切使用しないでください**。

【JSON出力フォーマット】
{
  "goals": "支援目標の内容のみ（タイトル不要、整形ルールに従う）",
  "support": "支援内容の内容のみ（タイトル不要、整形ルールに従う）"
}`;
    } else {
      finalPrompt = `以下の「特別な教育的ニーズ」に基づいて、「所属校による支援計画（プランA）」の項目を作成してください。

【参考】特別な教育的ニーズ：
${p2Input}
${commonInstructions}`;
    }
    setP2Output(finalPrompt);
  };

  // プロンプト③生成
  const generatePrompt3 = () => {
    const commonInstructions = `
【出力項目】

1.指導方針
・「特別な教育的ニーズ①～③」と「所属校の支援目標①～③」を踏まえ、より具体的な指導の方向性を示す。
・児童生徒の実態を冒頭で丁寧に描写し、その後に必要な指導内容を①～③に整理する。
・全体を通して300〜500字程度とし、教育的で柔らかい表現を用いる。
・文章が長くなる場合は複数回に分けて出力してよい。

2.実態（特別支援における7区分〔箇条書きで、例：【着替え】・～の形〕）
・以下の区分ごとに項目をもうけて（内容によって項目の数に偏りがあってもよい）記述する。各区分に例を設けるので参考にしてください
① 健康の保持（日常生活面、健康面など）【着替え】【食事】【排泄】【健康上の配慮】
（この区分は多めに項目を設ける【例：【着替え】・ズボンにはワッペンをつけると前後がわかって履くことができる。・言葉かけを受けて脱いだ服の裏返しを直すことができる。・登校時はオムツを着用している。登校後に布パンツに履き替えている。・下校時は布パンツを使用する。デイサービスにより帰り際にトイレに行かせる。【食事】・食事は少量ずつ別皿に入れて提供している。また、左手をお椀に添えて、右手でスプーンや補助具付きの箸を使用して食べることができる。【排泄】・立ち便器を使うことができる。【健康上の配慮】・春は花粉症の薬を服用している。など】）
② 心理的な安定（情緒面、状況の理解など）【苦手な状況】
【例：【苦手な状況】・急な音や大きな音は苦手で、驚いて不安定になることがある。・気持ちが不安定な時は、首に掴みかかろうとしたり、噛もうとしたりすることがある。・暑い季節は苦手で、夏場は気持ちが不安定になることが多い。汗を拭くことにより気持ちが落ち着くことがある。・気持ちが不安定な時に、イヤーマフを着用している。・気持ちが不安定なときに深呼吸を促したり、教員が胸や背中をトントン叩いたりすると落ち着くことがある。（感覚統合、副交感神経）【その他】・歩いたり、身体を動かしたりすることが好きで、散歩をすることで気持ちを切り替えられることがある。・見通しの持ちやすい課題には３０分程度離席せずに取り組むことができる。・見通しの持ちにくい場面や、気持ちが向かない活動の時にはトイレに行こうとすることがある。・怒ると近くにある物を噛む癖がある。(かなり減ってきた)】
③ 人間関係の形成（人とのかかわり、集団への参加など）【大人や友達との関わり】【集団参加】
【例：【大人や友達との関わり】・教員からの呼びかけに反応し、行動することができる。・身近な大人の膝の上に乗ろうとしたり、抱き着こうとしたりするなどの身体・接触が好きである。【集団参加】・誰とでも手を繋いだり、関わったりすることができる。】
④ 環境の把握（感覚の活用、認知面、学習面など）【学習の様子】
【例：【学習の様子】・シールを自分で好きなように貼れる。丸い紙やタイルを一直線に貼れる。・色の区別ができる。・３０面までのパズルができる。・ひらがなやイラストのマッチングができる。】
⑤ 身体の動き（運動・動作、作業面など）【身体の動き】【手指の操作】
【例：【身体の動き】・音楽が好きで、聴きながら身体を動かすことができる。・ブランコに一人で乗れる。・ボールを投げることができる。支援を受けてボールを蹴ることができる。【手指の操作】・利き手がまだ定まっていないが、右手を日常的に使用する。・支援を受けてハサミやのりなどの道具を使うことができる。・粗大模倣は、教員の手本や映像を観たりしながら行うことができる。・つまむ、ひねる、回す、押すなど手指を使った活動ができる。・爪がないため微細な動きは苦手である。・自助箸を使用して食事が取れる。】
⑥ コミュニケーション（意思の伝達、言語の形成など）【ｺﾐｭﾆｹｰｼｮﾝの理解】【ｺﾐｭﾆｹｰｼｮﾝの表出】
【例：【ｺﾐｭﾆｹｰｼｮﾝの理解】・教員の指示をある程度理解していて、指示通り動くことができる。【ｺﾐｭﾆｹｰｼｮﾝの表出】・促されると､「ちょうだい」のサインを出すことができる。サインと一緒に・口を動かすことができる。サインを出している大人に物を渡すことができる。・教員を呼ぶときに、肩をトントンと叩くことができる。・「トイレ」「ごめん」など簡単な言葉の発語ができる。・排泄の意思表示は「トイレ」と伝えることができる。・口形模倣や単音の発声はできるようになってきている。】
⑦ その他（性格、行動特徴、興味関心など）【興味関心】
【例：【興味関心】・活動中に身体を大きく左右に動かしたり飛び跳ねたりするときがある。・おもちゃを床にたたきつけるように投げる。】
・【入力】の実態・課題をもとに、可能な限り多くの具体的内容を盛り込む。
・1回で書ききれない場合は、何回になってもよいので、複数回に分けて出力する。

【条件】：
- 添付資料があれば参考にしてください（プランBや個別の指導計画）。
- 「～です。～ます。」調ではなく、「～である。」調で文章を作成してください。
- 【入力】の内容だけでなく、これまでの特別な教育的ニーズと所属校の支援目標から発展させて作成する。
- 「1.指導方針」特別な教育的ニーズと所属校の支援目標より具体的な内容にする
- 「1.指導方針」は特別な教育的ニーズと所属校の支援目標の①～③に連動した形で（②までしかない場合は同様に①、②でOK）
- ① 指導方針の例：「現在、本生徒は、右目の視力が無く左目も視力が弱く視野が狭い。また、聴力は、全く聞こえていないと思われ、日常生活の殆どを教員に任せきりにしていたり、教員に対して常に触れ合い・揺さぶりなどの刺激を求めている。また、不適切な行動が多く見られ、刺激を求めて、自分の顔に唾や水・おしっこをかけたり、吹き出したりすることや物を投げたり、倒したり衝動的な行動、人とのかかわりの中で抓ったり、叩いたり、髪の毛を引っ張ったりすることがある。コミュケーション面では、手話によるサインが２～３個理解できる。また、自分で1個「トイレ」のサインを行う時がある。その他、相手の手を取り直接手を動かしての要求をすることが多い。
従って、以下の①～③の指導が必要だと考える。
　①トイレや食事、着替えなど日常生活の中で、教員に頼らずにひとりでできることを増やす。
　②不適切行動が起きた時に繰り返さないようにする。
　③絵カードや手話による要求を増やす。
これらの指導を元に本生徒の生活面での自立、行動面・コミュニケーション面での成長につなげていく。」
- 1回で書ききれない場合は、何回になってもよいので、複数回に分けて出力する。
- 指導方針は全体的な視点で、各実態は200〜300文字で丁寧に描写してください。
- **改行の厳守**：
   Excelのセル内で見やすくするため、「・」などの直前には**必ず改行**を入れてください。  
- **余計な記号の禁止**：
   - **「**」（太字強調）などのMarkdown記号は一切使用しないでください**
`;

    let finalPrompt = "";
    if (mode === "excel") {
      finalPrompt = `以下の実態・課題をもとに、特別支援計画「プランB」の項目を作成してください。
ただし、出力形式は指定の【JSON形式】のみとします。前置きや解説は不要です。

【入力】実態・課題：
${p3Input}

${commonInstructions}

【重要：出力形式と整形ルール】
上記の詳細な指示に基づき内容を作成した上で、以下のJSONフォーマットに格納して出力してください。
JSONのvalue（値）となる文字列については、以下の整形ルールを厳守してください。

1. **タイトルの除外**：
   Excelのセルに既にヘッダーがあるため、「1.指導方針」や「① 健康の保持」といった**タイトルや項目名を含めないでください**。その項目の実態（内容）のみを記述してください。

2. **改行の厳守**：
   Excelのセル内で見やすくするため、「・」や「【項目名】」の直前には**必ず改行**を入れてください。
   
3. **余計な記号の禁止**：
   - **「**」（太字強調）などのMarkdown記号は一切使用しないでください**。

【JSON出力フォーマット】
{{
  "policy": "指導方針の内容のみ（タイトル不要、整形ルールに従う）",
  "status_1": "健康の保持の実態のみ（「① 健康の保持」は含めない、整形ルールに従う）",
  "status_2": "心理的な安定の実態のみ（「② 心理的な安定」は含めない）",
  "status_3": "人間関係の形成の実態のみ（「③ 人間関係の形成」は含めない）",
  "status_4": "環境の把握の実態のみ（「④ 環境の把握」は含めない）",
  "status_5": "身体の動きの実態のみ（「⑤ 身体の動き」は含めない）",
  "status_6": "コミュニケーションの実態のみ（「⑥ コミュニケーション」は含めない）",
  "status_7": "その他の実態のみ（「⑦ その他」は含めない）"
}`;
    } else {
      finalPrompt = `以下の実態・課題をもとに、特別支援計画「プランB」の項目を作成してください。

【入力】実態・課題：
${p3Input}
${commonInstructions}`;
    }
    setP3Output(finalPrompt);
  };

  // プロンプト④生成 (教科ごと)
  const generatePrompt4 = () => {
    if (p4SelectedSubjects.length === 0) {
      alert("教科を選択してください。");
      return;
    }

    const prompts = p4SelectedSubjects.map((subject) => {
      const numItems = (subject === "自立活動" || subject === "日常生活の指導") ? 3 : 2;
      const currentJittai = p4SubjectInputs[subject] || "（入力なし）";

      return `
以下の情報をもとに、個別の指導計画における【${subject}】の目標と手立てを作成してください。

【入力】
教科：${subject}
教科の内容：${currentJittai}
参考指導方針：${p4Reference}

【出力項目】
1. 目標（${numItems}つ）：
   ・各目標は30字以内程度で、お子さんが達成すべき具体的な行動や状態を示すこと。
   ・教育的で柔らかい表現にすること。
   ・「～できる」調にする。
   ・教科が「自立活動」の場合は、【教育活動全般】と【時間における指導】の二つから目標をそれぞれ設定する（例：【教育活動全般】自分の意見や考えを相手に正確に伝える。【時間における指導】・友達と意思の疎通を図りながら言葉のやりとりをしたり、ゲームをしたりすることができる。・友だちと協力して活動に取り組むことができる。・器具を使ってバランスを取ったり姿勢を保持したりすることができる。）。
   ・各教科の例（美術：目標「・様々な素材や色から、好きなものを選び作品作りができる。・様々な道具を使って作品作りができる。・鑑賞を通して、自分の好きな作品を選ぶことができる。」）
   
2. 手立て（${numItems}つ）：
   ・教科が「自立活動」の場合は、【教育活動全般】と【時間における指導】の二つから手立てをそれぞれ目標に連動する形で設定する（例：【教育活動全般】・手話や文字カードや音声アプリの活用する。【時間における指導】・言葉でのやりとりなどで適切なコミュニケーションができた場合に称賛する。・色々な友達と活動できるようにする。・感覚刺激により協調運動の向上をはかる。）。
   ・各手立ては30字から50字程度で、目標達成のために学校現場で実践可能な具体的な支援内容や方法を示すこと。
   ・お子さんの実態や課題、指導方針を考慮し、個別具体的な内容にすること。
   ・文の最後は「～する。」「～を促す」など手立てに相応しい形にする。
   ・各教科の例（美術：手立て「・様々な素材や道具を用意することで、その中から選べるようにする。・使い方の掲示、教員と一緒につかったりする。・友達の作品を分かりやすく並べ、好きな作品を選べるようにする。」）

【出力フォーマット例】
【${subject}】
目標：
・（目標1：30字以内）
・（目標2：30字以内）
${numItems === 3 ? "・（目標3）" : ""}

手立て：
・（手立て1：30～50字）
・（手立て2：30～50字）
${numItems === 3 ? "・（手立て3：30～50字）" : ""}

【条件】：
条件】：
- 添付資料（個別の指導計画など）がある場合は、その書き方を参考にしてください。
- 他の教科の目標や手立ては出力せず、指定された【${subject}】のみを出力してください。
- 目標と手立ての数は、自立活動と日常生活の指導は3つ以上、それ以外は2つとしてください。
- 目標と手立ての内容は、入力された実態や課題、参考指導方針と連動させて具体的に記述してください。
- **改行の厳守**：
   Excelのセル内で見やすくするため、「・」などの直前には**必ず改行**を入れてください。  
- **余計な記号の禁止**：
   - **「**」（太字強調）などのMarkdown記号は一切使用しないでください**
`;
    });

    setP4Output(prompts.join("\n\n----------------------------------------\n\n"));
  };

  // プロンプト⑤生成
  const generatePrompt5 = () => {
    let intro = "";
    let mainSource = "";
    let refText = "";

    if (p5UseFile) {
      intro = "添付した指導計画のファイルを主たる情報源とし、";
      if (p5Reference.trim() && p5Reference !== "（例：個別の指導計画の「指導の目標および内容」の全文や、特に見てほしい部分など）") {
        mainSource = "以下の【参考テキスト】も補足情報として考慮した上で、";
        refText = `【参考テキスト】：\n${p5Reference}\n`;
      } else {
        mainSource = "以下の";
      }
    } else {
      intro = "以下の【指導計画のテキスト】を主たる情報源として、";
      refText = `【指導計画のテキスト】：\n${p5Reference}\n`;
    }

    const fullPrompt = `${intro}${mainSource}【できたこと・活動の様子】とを関連付けながら、教科ごとの「個別の指導の評価」（振り返り文）を作成してください。
${refText}
【できたこと・活動の様子】：
${p5Activity}

【出力ルール】：
- まず、主たる情報源（添付ファイルまたは上記テキスト）を読み込み、そこに書かれている目標や内容を完全に理解してください。
- 「～です。～ます。」調ではなく、「～である。」調で文章を作成してください。
- 文の最後は「～できた。」で終わらせる。
- その上で、【できたこと・活動の様子】が、計画のどの目標・内容に対応するのかを分析し、目標の達成度合いが分かるように評価文を作成してください。
- 計画で言及されているすべての教科・領域について、評価文を個別に出力してください。
- 各教科について、【教科名の見出し】と200～300文字程度の評価文を作成してください。
- 文体は、実務で使用されるような柔らかく教育的な表現にしてください。
- 各教科の例（美術：「・仙台七夕祭りの吹流し作りでは、折り染めに取り組んだ。染める色を３つ選択し、染める手元をよく見て色の滲みに注目して染めることができた。・土器作りではへらや縄、貝殻やビー玉などを粘土に押し付けて模様をつけることができた・土器の鑑賞では、友達の作品の中から気にいったものを２つ選ぶことができた。」）          
`;

    setP5Output(fullPrompt);
  };

  // プロンプト⑥生成
  const generatePrompt6 = () => {
    let intro = "";
    let mainSource = "";
    let refText = "";

    if (p6UseFile) {
      intro = "添付したファイル（評価文や計画書など）を主たる情報源とし、";
      if (p6Reference.trim() && p6Reference !== "（例：プロンプト④で作成した評価文の全体、または特に見てほしい部分など）") {
        mainSource = "以下の【参考テキスト】も補足情報として考慮し、";
        refText = `【参考テキスト】：\n${p6Reference}\n`;
      }
    } else {
      intro = "以下の【参考テキスト】を主たる情報源として、";
      refText = `【参考テキスト】：\n${p6Reference}\n`;
    }

    let specificConditions = "";
    if (p6Term === "前期") {
      specificConditions = `- 「前期は、〜」といった書き出しで始めてください。\n- 文末には「後期も引き続き、ご家庭と連携を取りながら、成長を見守っていきたいと思います。」などを含めてください。`;
    } else {
      specificConditions = `- 「この1年間で〜」や「いよいよ来年度は〜」など、年度の区切りを感じさせる書き出しにしてください。\n- 文末には、保護者への感謝と、次年度に向けた応援の言葉を含めてください。`;
    }

    const fullPrompt = `${intro}${mainSource}さらに【強調したいポイント】を盛り込みながら、保護者向けの「${p6Term}の所見」を作成してください。
${refText}
【強調したいポイント】：
${p6Points}

【全体の共通条件】：
- 主たる情報源（添付ファイルまたは上記テキスト）から全体的な成長の様子を読み取り、【強調したいポイント】を特に意識して、自然な文章を作成してください。
- 添付資料内に具体的事象（例：大きな行事の達成、友人とのやりとり、けがの有無）がある場合は具体例を1つ以上挙げて所見に反映すること。
- 丁寧な語り口で、前向きな表現を心がけてください。
- 保護者の方が読んで、お子さんの具体的な成長が伝わるような文章にしてください。
- 「～です。～ます。」調ではなく、「～である。」調で文章を作成してください。
- もし【入力】や添付資料の内容が極端に短い・情報不足な場合は、前期は200字、後期は200字を下回らないように、実務的に妥当な記述を参考テキストに基づき推測して補完すること

【${p6Term}用の個別条件】：
${specificConditions}`;

    setP6Output(fullPrompt);
  };

  // 教科選択のハンドラ
  const toggleSubject = (subject: string) => {
    if (p4SelectedSubjects.includes(subject)) {
      setP4SelectedSubjects(p4SelectedSubjects.filter(s => s !== subject));
      const newInputs = { ...p4SubjectInputs };
      delete newInputs[subject];
      setP4SubjectInputs(newInputs);
    } else {
      setP4SelectedSubjects([...p4SelectedSubjects, subject]);
      setP4SubjectInputs({ ...p4SubjectInputs, [subject]: "（例：ミニトマトの栽培を行った...）" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden relative">
      
      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm tracking-widest">BACK TO TOP</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
            <h1 className="text-sm font-bold tracking-widest text-slate-900">MieeL <span className="text-gray-400">APP</span></h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-6xl mx-auto">
        
        {/* タイトルエリア */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-4 bg-purple-50 rounded-full mb-6 text-purple-600 shadow-sm">
            <Cpu size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">AI 支援・指導計画作成</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            AIを活用して、個別の支援計画や指導計画のプロンプト（命令文）を簡単に作成します。<br/>
            生成された文章をコピーして、ChatGPTやGeminiに貼り付けてください。
          </p>
        </motion.div>

        {/* モード選択エリア */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 mb-12 shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-500 tracking-widest mb-4 flex items-center gap-2">
            <Settings size={16} /> モード選択
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setMode("normal")}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                mode === "normal" 
                  ? "border-purple-600 bg-purple-50 text-purple-900" 
                  : "border-gray-200 hover:border-purple-300 text-gray-600"
              }`}
            >
              <div className="font-bold text-lg mb-2 flex items-center gap-2">
                <FileText size={20} /> 通常モード
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                文章形式で出力します。<br/>Word等に手動でコピペする方に最適です。
              </p>
            </button>
            
            <button
              onClick={() => setMode("excel")}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                mode === "excel" 
                  ? "border-green-600 bg-green-50 text-green-900" 
                  : "border-gray-200 hover:border-green-300 text-gray-600"
              }`}
            >
              <div className="font-bold text-lg mb-2 flex items-center gap-2">
                <Sparkles size={20} /> Excel作成モード
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                JSON形式で出力します。<br/>岩槻はるかぜ機能（Excel自動入力）用です。
              </p>
            </button>
          </div>
        </motion.div>

        {/* AIチャットリンク */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer" 
             className="flex items-center justify-center gap-3 p-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors shadow-lg">
             <MessageSquare size={20} /> ChatGPT を開く
          </a>
          <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" 
             className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg">
             <Sparkles size={20} /> Gemini を開く
          </a>
        </div>

        {/* プロンプト① */}
        <PromptSection 
          title="プロンプト①【プランA：ニーズ・合理的配慮】"
          desc="実態からニーズと配慮を導き出します。"
          color="purple"
          delay={0.3}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">✅ お子さんの実態や課題</label>
              <textarea
                value={p1Input}
                onChange={(e) => setP1Input(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] text-base"
              />
            </div>
            
            <button
              onClick={generatePrompt1}
              className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Lightbulb size={20} /> プロンプト①を生成
            </button>

            {p1Output && <OutputArea text={p1Output} onCopy={() => copyToClipboard(p1Output)} />}
          </div>
        </PromptSection>

        {/* プロンプト② */}
        <PromptSection 
          title="プロンプト②【プランA：所属校の支援】"
          desc="ニーズに基づいた具体的な支援内容を作成します。"
          color="blue"
          delay={0.4}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">✅ 「特別な教育的ニーズ」（プロンプト①の結果）を貼り付け</label>
              <textarea
                value={p2Input}
                onChange={(e) => setP2Input(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] text-base"
              />
            </div>
            
            <button
              onClick={generatePrompt2}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Lightbulb size={20} /> プロンプト②を生成
            </button>

            {p2Output && <OutputArea text={p2Output} onCopy={() => copyToClipboard(p2Output)} color="blue" />}
          </div>
        </PromptSection>

        {/* プロンプト③ */}
        <PromptSection 
          title="プロンプト③【プランB：指導方針・実態】"
          desc="7つの領域に基づいた実態と指導方針を作成します。"
          color="emerald"
          delay={0.5}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">✅ 実態や課題（①と同じでOK）</label>
              <textarea
                value={p3Input}
                onChange={(e) => setP3Input(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px] text-base"
              />
            </div>
            
            <button
              onClick={generatePrompt3}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Lightbulb size={20} /> プロンプト③を生成
            </button>

            {p3Output && <OutputArea text={p3Output} onCopy={() => copyToClipboard(p3Output)} color="emerald" />}
          </div>
        </PromptSection>

        {/* プロンプト④ */}
        <PromptSection 
          title="プロンプト④【指導計画：目標と手立て】"
          desc="教科ごとに個別の目標と手立てを作成します。"
          color="orange"
          delay={0.6}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4">✅ 教科を選択してください（複数可）</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SUBJECT_OPTIONS.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-bold border-2 transition-all
                      ${p4SelectedSubjects.includes(subject) 
                        ? "border-orange-500 bg-orange-50 text-orange-700" 
                        : "border-gray-200 text-gray-500 hover:border-orange-300"}
                    `}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {p4SelectedSubjects.length > 0 && (
              <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                <h4 className="font-bold text-orange-800 mb-4">💡 各教科の実態を入力</h4>
                <div className="space-y-4">
                  {p4SelectedSubjects.map(subject => (
                    <div key={subject}>
                      <label className="block text-xs font-bold text-orange-600 mb-1">【{subject}】の実態</label>
                      <textarea
                        value={p4SubjectInputs[subject] || ""}
                        onChange={(e) => setP4SubjectInputs({...p4SubjectInputs, [subject]: e.target.value})}
                        className="w-full p-3 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">✅ 全体的な実態や指導方針（参考）</label>
              <textarea
                value={p4Reference}
                onChange={(e) => setP4Reference(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 min-h-[100px] text-base"
              />
            </div>
            
            <button
              onClick={generatePrompt4}
              className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Lightbulb size={20} /> プロンプト④を生成
            </button>

            {p4Output && <OutputArea text={p4Output} onCopy={() => copyToClipboard(p4Output)} color="orange" />}
          </div>
        </PromptSection>

        {/* プロンプト⑤ */}
        <PromptSection 
          title="プロンプト⑤【指導計画：評価】"
          desc="活動の様子から評価文を作成します。"
          color="pink"
          delay={0.7}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="useFile5" 
                checked={p5UseFile} 
                onChange={(e) => setP5UseFile(e.target.checked)}
                className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 border-gray-300" 
              />
              <label htmlFor="useFile5" className="text-sm font-bold text-gray-700 cursor-pointer">
                AIにファイルを添付して主情報として使う
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">✅ 参考テキスト（計画の目標など）</label>
              <textarea
                value={p5Reference}
                onChange={(e) => setP5Reference(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 min-h-[100px] text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">✅ できたこと・活動の様子</label>
              <textarea
                value={p5Activity}
                onChange={(e) => setP5Activity(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 min-h-[150px] text-base"
              />
            </div>
            
            <button
              onClick={generatePrompt5}
              className="w-full py-4 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Lightbulb size={20} /> プロンプト⑤を生成
            </button>

            {p5Output && <OutputArea text={p5Output} onCopy={() => copyToClipboard(p5Output)} color="pink" />}
          </div>
        </PromptSection>

        {/* プロンプト⑥ */}
        <PromptSection 
          title="プロンプト⑥【前期・後期の所見】"
          desc="保護者向けの総合的な所見を作成します。"
          color="indigo"
          delay={0.8}
        >
          <div className="space-y-6">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg">
                <input type="radio" checked={p6Term === "前期"} onChange={() => setP6Term("前期")} className="text-indigo-600" />
                <span className="font-bold">前期</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg">
                <input type="radio" checked={p6Term === "後期／学年末"} onChange={() => setP6Term("後期／学年末")} className="text-indigo-600" />
                <span className="font-bold">後期／学年末</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="useFile6" 
                checked={p6UseFile} 
                onChange={(e) => setP6UseFile(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" 
              />
              <label htmlFor="useFile6" className="text-sm font-bold text-gray-700 cursor-pointer">
                AIにファイルを添付して主情報として使う
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">✅ 参考テキスト（評価文など）</label>
              <textarea
                value={p6Reference}
                onChange={(e) => setP6Reference(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 min-h-[150px] text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">✅ 強調したいポイント（箇条書き）</label>
              <textarea
                value={p6Points}
                onChange={(e) => setP6Points(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 min-h-[100px] text-base"
              />
            </div>
            
            <button
              onClick={generatePrompt6}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Lightbulb size={20} /> プロンプト⑥を生成
            </button>

            {p6Output && <OutputArea text={p6Output} onCopy={() => copyToClipboard(p6Output)} color="indigo" />}
          </div>
        </PromptSection>

      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 text-xs">
        &copy; 2025 MieeL Project. All Rights Reserved.
      </footer>
    </div>
  );
}

// ==========================================
// 部品コンポーネント
// ==========================================

function PromptSection({ title, desc, children, color, delay }: any) {
  const styles: any = {
    purple: "border-purple-200 hover:border-purple-400 bg-purple-50 text-purple-900",
    blue: "border-blue-200 hover:border-blue-400 bg-blue-50 text-blue-900",
    emerald: "border-emerald-200 hover:border-emerald-400 bg-emerald-50 text-emerald-900",
    orange: "border-orange-200 hover:border-orange-400 bg-orange-50 text-orange-900",
    pink: "border-pink-200 hover:border-pink-400 bg-pink-50 text-pink-900",
    indigo: "border-indigo-200 hover:border-indigo-400 bg-indigo-50 text-indigo-900",
  };

  const currentStyle = styles[color] || styles.purple;
  const borderColor = currentStyle.split(" ")[0];
  const iconBg = currentStyle.split(" ").slice(2).join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.8 }}
      className={`bg-white border rounded-3xl p-8 mb-8 transition-all shadow-sm hover:shadow-xl ${borderColor}`}
    >
      <div className="flex items-start gap-4 mb-8 border-b pb-6 border-gray-100">
        <div className={`p-3 rounded-2xl ${iconBg}`}>
          <CheckCircle size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{desc}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function OutputArea({ text, onCopy, color="gray" }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6 relative group"
    >
      <div className="flex justify-between items-center mb-2 px-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Generated Prompt</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors shadow-sm"
        >
          <Copy size={14} /> コピー
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-sm text-slate-800 font-mono bg-white p-4 rounded-lg border border-gray-100 overflow-x-auto">
        {text}
      </pre>
    </motion.div>
  );
}