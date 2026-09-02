/* =====================================================
   APP HỌC TIẾNG TRUNG
   ===================================================== */


/* =====================================================
   DỮ LIỆU MẶC ĐỊNH
   ===================================================== */
const defaultWords = [
    {
        id: 1,
        hsk: "HSK1",
        topic: "Chào hỏi",
        hanzi: "你好",
        pinyin: "nǐ hǎo",
        meaning: "Xin chào",
        example: "你好！很高兴认识你。"
    },
    {
        id: 2,
        hsk: "HSK1",
        topic: "Chào hỏi",
        hanzi: "谢谢",
        pinyin: "xiè xie",
        meaning: "Cảm ơn",
        example: "谢谢你的帮助。"
    },
    {
        id: 3,
        hsk: "HSK1",
        topic: "Chào hỏi",
        hanzi: "再见",
        pinyin: "zài jiàn",
        meaning: "Tạm biệt",
        example: "明天再见！"
    },
    {
        id: 4,
        hsk: "HSK1",
        topic: "Chào hỏi",
        hanzi: "你好",
        pinyin: "nǐ hǎo",
        meaning: "Xin chào",
        example: "老师，你好！"
    }
];


/* =====================================================
   DỮ LIỆU CHỦ ĐỀ MẶC ĐỊNH
   ===================================================== */
const defaultTopics = [
    {
        id: 1,
        hsk: "HSK1",
        name: "Chào hỏi",
        description: "Từ vựng chào hỏi cơ bản"
    }
];


/* =====================================================
   LOAD DỮ LIỆU
   ===================================================== */

let words =
    JSON.parse(localStorage.getItem("chineseWords"))
    || defaultWords;

let topics =
    JSON.parse(localStorage.getItem("chineseTopics"))
    || defaultTopics;


/* =====================================================
   BIẾN
   ===================================================== */

let currentClass = "HSK1";

let currentTopic = "Chào hỏi";

let flashWords = [];

let flashIndex = 0;

let quizWords = [];

let quizIndex = 0;

let quizScore = 0;

// TỰ LUẬN
let writingWords = [];

let writingIndex = 0;

let writingScore = 0;


/* =====================================================
   LƯU DỮ LIỆU
   ===================================================== */

function saveData() {

    localStorage.setItem(
        "chineseWords",
        JSON.stringify(words)
    );

    localStorage.setItem(
        "chineseTopics",
        JSON.stringify(topics)
    );
}


/* =====================================================
   CHUYỂN TRANG
   ===================================================== */

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(item => {

            item.classList.remove("active");

        });


    const target =
        document.getElementById(page);

    if (target) {
        target.classList.add("active");
    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

            if (item.dataset.page === page) {
                item.classList.add("active");
            }

        });


    if (page === "home") {
        renderHome();
    }


    if (page === "vocab") {
        renderVocabulary();
    }


    if (page === "flashcard") {
        prepareFlashcard();
    }


    if (page === "quiz") {
        startQuiz();
    }

    if (page === "writing") {
        startWriting();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   TRANG CHỦ
   ===================================================== */

function renderHome() {

    renderHskClasses();

    renderMyTopics();

    updateStats();
}


/* =====================================================
   HSK CLASSES
   ===================================================== */

function renderHskClasses() {

    const container =
        document.getElementById("hskGrid");

    const hskList = [
        "HSK1",
        "HSK2",
        "HSK3",
        "HSK4",
        "HSK5",
        "HSK6"
    ];


    container.innerHTML = hskList.map(hsk => {

        const topicCount =
            topics.filter(item => item.hsk === hsk).length;

        const wordCount =
            words.filter(item => item.hsk === hsk).length;


        return `

            <div
                class="hsk-card"
                onclick="openHsk('${hsk}')">

                <div class="hsk-icon">
                    📖
                </div>

                <h3>
                    ${hsk}
                </h3>

                <p>
                    ${topicCount} chủ đề · ${wordCount} từ vựng
                </p>

            </div>

        `;

    }).join("");
}


/* =====================================================
   MỞ HSK
   ===================================================== */

function openHsk(hsk) {

    currentClass = hsk;


    const classTopics =
        topics.filter(item => item.hsk === hsk);


    if (classTopics.length === 0) {

        alert(
            `${hsk} chưa có chủ đề. Hãy tạo chủ đề mới nhé!`
        );

        openCreateTopicModal(hsk);

        return;
    }


    const topic =
        classTopics[0];


    currentTopic = topic.name;


    showPage("vocab");
}


/* =====================================================
   CHỦ ĐỀ CỦA TÔI
   ===================================================== */

function renderMyTopics() {

    const container =
        document.getElementById("myTopicGrid");


    if (topics.length === 0) {

        container.innerHTML = `
            <div class="empty-box">
                Chưa có chủ đề nào.
            </div>
        `;

        return;
    }


    container.innerHTML =
        topics.map(topic => {

            const count =
                words.filter(word =>
                    word.hsk === topic.hsk &&
                    word.topic === topic.name
                ).length;


return `

    <div class="topic-card">

        <div
            class="topic-content"
            onclick="openTopic(
                '${escapeAttribute(topic.hsk)}',
                '${escapeAttribute(topic.name)}'
            )">

            <div class="topic-icon">
                📖
            </div>

            <h3>
                ${escapeHtml(topic.name)}
            </h3>

            <p>
                ${escapeHtml(
                    topic.description || "Chủ đề tiếng Trung"
                )}
            </p>

            <span class="topic-class">
                ${topic.hsk} · ${count} từ
            </span>

        </div>

        <button
            class="delete-topic"
            onclick="deleteTopic(
                '${escapeAttribute(topic.id)}'
            )">
            🗑
        </button>

    </div>

`;

        }).join("");
}


/* =====================================================
   MỞ CHỦ ĐỀ
   ===================================================== */

function openTopic(hsk, topic) {

    currentClass = hsk;

    currentTopic = topic;

    showPage("vocab");
}


/* =====================================================
   TẠO CHỦ ĐỀ
   ===================================================== */

function openCreateTopicModal(hsk = currentClass) {

    document.getElementById("topicClass").value =
        hsk || "HSK1";


    document.getElementById("topicName").value = "";

    document.getElementById("topicDescription").value = "";


    document
        .getElementById("topicModal")
        .classList.add("show");
}


function createTopic() {

    const hsk =
        document.getElementById("topicClass").value;

    const name =
        document.getElementById("topicName")
        .value
        .trim();

    const description =
        document.getElementById("topicDescription")
        .value
        .trim();


    if (!name) {

        alert("Bạn chưa nhập tên chủ đề.");

        return;
    }


    const exists =
        topics.some(item =>
            item.hsk === hsk &&
            item.name.toLowerCase() === name.toLowerCase()
        );


    if (exists) {

        alert("Chủ đề này đã tồn tại.");

        return;
    }


    topics.push({

        id:
            Date.now().toString(),

        hsk: hsk,

        name: name,

        description:
            description || "Chủ đề tiếng Trung"

    });


    saveData();


    currentClass = hsk;

    currentTopic = name;


    closeModal("topicModal");


    renderHome();


    showPage("vocab");
}


/* =====================================================
   XÓA CHỦ ĐỀ
   ===================================================== */

function deleteTopic(id) {

    id = String(id);

    const topic = topics.find(
        item => String(item.id) === id
    );

    if (!topic) {

        alert("Không tìm thấy chủ đề cần xóa.");

        return;
    }


    const confirmDelete = confirm(
        `Bạn có chắc muốn xóa chủ đề "${topic.name}" không?\n\n` +
        `Toàn bộ từ vựng trong chủ đề này cũng sẽ bị xóa.`
    );


    if (!confirmDelete) {
        return;
    }


    topics = topics.filter(
        item => String(item.id) !== id
    );


    words = words.filter(
        word =>
            !(
                word.hsk === topic.hsk &&
                word.topic === topic.name
            )
    );


    saveData();


    if (
        currentClass === topic.hsk &&
        currentTopic === topic.name
    ) {

        currentTopic = "";

    }


    renderHome();
}


/* =====================================================
   ĐÓNG MODAL
   ===================================================== */

function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");
}


document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains("modal")
        ) {

            event.target.classList.remove("show");

        }

    }
);


/* =====================================================
   TỪ VỰNG
   ===================================================== */

function renderVocabulary() {

    const container =
        document.getElementById("vocabularyList");


    document.getElementById("vocabClassTitle")
        .textContent = currentClass;


    document.getElementById("vocabTopicTitle")
        .textContent = currentTopic;


    const topic =
        topics.find(item =>
            item.hsk === currentClass &&
            item.name === currentTopic
        );


    document.getElementById("vocabDescription")
        .textContent =
        topic?.description || "Từ vựng tiếng Trung";


    document.getElementById("wordModalTitle")
        .textContent =
        `${currentClass} → ${currentTopic}`;


    const search =
        document.getElementById("searchInput")
        ?.value
        .toLowerCase()
        .trim() || "";


    const list =
        words.filter(word => {

            const correctTopic =
                word.hsk === currentClass &&
                word.topic === currentTopic;


            const correctSearch =
                (
                    word.hanzi +
                    " " +
                    word.pinyin +
                    " " +
                    word.meaning
                )
                .toLowerCase()
                .includes(search);


            return correctTopic && correctSearch;

        });


    if (list.length === 0) {

        container.innerHTML = `

            <div class="empty-box">

                <div class="empty-icon">
                    📚
                </div>

                <p>
                    Chủ đề này chưa có từ vựng.
                </p>

                <button
                    class="main-btn"
                    onclick="openAddWordModal()">
                    ＋ Thêm từ vựng
                </button>

            </div>

        `;

        return;
    }


    container.innerHTML =
        list.map(word => `

            <div class="vocabulary-item">

                <div class="vocab-hanzi">
                    ${escapeHtml(word.hanzi)}
                </div>


                <div class="vocab-info">

                    <b>
                        ${escapeHtml(word.pinyin)}
                    </b>

                    <span>
                        ${escapeHtml(word.meaning)}
                    </span>

                    ${
                        word.example
                        ?
                        `
                        <div class="vocab-example">
                            ${escapeHtml(word.example)}
                        </div>
                        `
                        :
                        ""
                    }

                </div>


                <span class="topic-mini">
                    ${escapeHtml(word.hsk)}
                </span>


                <button
                    class="listen"
                    onclick="speak('${escapeAttribute(word.hanzi)}')">
                    🔊
                </button>


                <button
                    class="delete-topic"
                    onclick="deleteTopic('${topic.id}'); event.stopPropagation();">
                    🗑
                </button>

            </div>

        `).join("");
}


/* =====================================================
   MỞ FORM THÊM TỪ
   ===================================================== */

function openAddWordModal() {

    if (!currentTopic) {

        alert("Bạn hãy chọn chủ đề trước.");

        return;
    }


    document.getElementById("wordModalTitle")
        .textContent =
        `${currentClass} → ${currentTopic}`;


    document.getElementById("hanziInput").value = "";

    document.getElementById("pinyinInput").value = "";

    document.getElementById("meaningInput").value = "";

    document.getElementById("exampleInput").value = "";


    document
        .getElementById("wordModal")
        .classList.add("show");


    setTimeout(() => {

        document
            .getElementById("hanziInput")
            .focus();

    }, 100);
}


/* =====================================================
   THÊM TỪ
   ===================================================== */

function addWord() {

    const hanzi =
        document.getElementById("hanziInput")
        .value
        .trim();

    const pinyin =
        document.getElementById("pinyinInput")
        .value
        .trim();

    const meaning =
        document.getElementById("meaningInput")
        .value
        .trim();

    const example =
        document.getElementById("exampleInput")
        .value
        .trim();


    if (!hanzi) {

        alert("Bạn chưa nhập chữ Hán.");

        return;
    }


    if (!pinyin) {

        alert("Bạn chưa nhập Pinyin.");

        return;
    }


    if (!meaning) {

        alert("Bạn chưa nhập nghĩa tiếng Việt.");

        return;
    }


    words.push({

        id:
            Date.now(),

        hsk:
            currentClass,

        topic:
            currentTopic,

        hanzi:
            hanzi,

        pinyin:
            convertPinyin(pinyin),

        meaning:
            meaning,

        example:
            example

    });


    saveData();


    closeModal("wordModal");


    renderVocabulary();

    renderHome();


    alert("✅ Đã thêm từ vựng!");
}


/* =====================================================
   XÓA TỪ
   ===================================================== */

function deleteWord(id) {

    const confirmDelete =
        confirm(
            "Bạn có chắc muốn xóa từ vựng này không?"
        );


    if (!confirmDelete) {
        return;
    }


    words =
        words.filter(word =>
            String(word.id) !== String(id)
        );


    saveData();

    renderVocabulary();

    renderHome();

}


/* =====================================================
   PINYIN
   ===================================================== */

const toneMap = {

    a: ["ā", "á", "ǎ", "à"],

    e: ["ē", "é", "ě", "è"],

    i: ["ī", "í", "ǐ", "ì"],

    o: ["ō", "ó", "ǒ", "ò"],

    u: ["ū", "ú", "ǔ", "ù"],

    ü: ["ǖ", "ǘ", "ǚ", "ǜ"]

};


function convertPinyin(text) {

    return text.replace(
        /([a-zü]+)([1-4])/gi,
        function(match, syllable, tone) {

            tone =
                Number(tone);


            syllable =
                syllable.toLowerCase();


            let vowel = "";


            if (syllable.includes("a")) {

                vowel = "a";

            }
            else if (syllable.includes("e")) {

                vowel = "e";

            }
            else if (syllable.includes("ou")) {

                vowel = "o";

            }
            else {

                const vowels =
                    ["a", "e", "i", "o", "u", "ü"];


                for (
                    let i = syllable.length - 1;
                    i >= 0;
                    i--
                ) {

                    if (
                        vowels.includes(
                            syllable[i]
                        )
                    ) {

                        vowel =
                            syllable[i];

                        break;
                    }

                }

            }


            if (!vowel) {
                return match;
            }


            const index =
                syllable.indexOf(vowel);


            const marked =
                toneMap[vowel][tone - 1];


            return (

                syllable.substring(
                    0,
                    index
                )

                +

                marked

                +

                syllable.substring(
                    index + 1
                )

            );

        }
    );
}


/* =====================================================
   PINYIN TRÊN ĐIỆN THOẠI
   Không tự động đổi khi đang gõ
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("pinyinInput");

    if (!input) {
        return;
    }

    /*
     * Khi đang gõ:
     * ni3hao3
     * kuai4
     * xue2sheng1
     *
     * Không tự đổi để tránh con trỏ bị nhảy
     * trên điện thoại.
     */

    input.addEventListener("input", function () {
        // Không làm gì ở đây
    });

});


/* =====================================================
   CHÈN DẤU PINYIN
   ===================================================== */

function insertTone(tone) {

    const input =
        document.getElementById("pinyinInput");


    const start =
        input.selectionStart;

    const end =
        input.selectionEnd;


    const value =
        input.value;


    input.value =
        value.substring(0, start)
        +
        tone
        +
        value.substring(end);


    input.focus();


    input.selectionStart =
        start + tone.length;

    input.selectionEnd =
        start + tone.length;
}


/* =====================================================
   PHÁT ÂM - ĐÃ SỬA CHO ĐIỆN THOẠI
   ===================================================== */

function speak(text) {

    if (!text) {
        return;
    }

    if (!("speechSynthesis" in window)) {

        alert(
            "Điện thoại hoặc trình duyệt này không hỗ trợ phát âm."
        );

        return;
    }


    const sound =
        localStorage.getItem("sound");


    if (sound === "off") {
        return;
    }


    // Hủy âm thanh trước đó
    window.speechSynthesis.cancel();


    const voice =
        new SpeechSynthesisUtterance();


    voice.text =
        text;


    voice.lang =
        "zh-CN";


    voice.rate =
        0.8;


    voice.pitch =
        1;


    voice.volume =
        1;


    /*
       Một số điện thoại cần đợi danh sách
       giọng đọc được tải xong.
    */
    const speakNow = function () {

        window.speechSynthesis.cancel();

        window.speechSynthesis.speak(voice);

    };


    const voices =
        window.speechSynthesis.getVoices();


    /*
       Ưu tiên giọng tiếng Trung nếu điện thoại có.
    */
    const chineseVoice =
        voices.find(v =>
            v.lang &&
            (
                v.lang.toLowerCase() === "zh-cn" ||
                v.lang.toLowerCase() === "zh"
            )
        );


    if (chineseVoice) {

        voice.voice =
            chineseVoice;

    }


    /*
       Trên một số trình duyệt điện thoại,
       voices chưa tải ngay lần đầu.
    */
    if (voices.length === 0) {

        window.speechSynthesis.onvoiceschanged =
            function () {

                const newVoices =
                    window.speechSynthesis.getVoices();


                const newChineseVoice =
                    newVoices.find(v =>
                        v.lang &&
                        (
                            v.lang.toLowerCase() === "zh-cn" ||
                            v.lang.toLowerCase() === "zh"
                        )
                    );


                if (newChineseVoice) {

                    voice.voice =
                        newChineseVoice;

                }


                speakNow();

            };

    }
    else {

        speakNow();

    }
}


/* =====================================================
   NÚT ÂM THANH
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const soundBtn =
            document.getElementById("soundBtn");


        if (!soundBtn) {
            return;
        }


        if (
            localStorage.getItem("sound") === "off"
        ) {

            soundBtn.textContent =
                "🔇";

        }
        else {

            soundBtn.textContent =
                "🔊";

        }


        soundBtn.addEventListener(
            "click",
            function () {

                const current =
                    localStorage.getItem("sound");


                if (current === "off") {

                    localStorage.setItem(
                        "sound",
                        "on"
                    );

                    soundBtn.textContent =
                        "🔊";

                }
                else {

                    localStorage.setItem(
                        "sound",
                        "off"
                    );

                    soundBtn.textContent =
                        "🔇";

                    window.speechSynthesis.cancel();

                }

            }
        );

    }
);


/* =====================================================
   FLASHCARD
   ===================================================== */

function prepareFlashcard() {

    const list =
        words.filter(word =>
            word.hsk === currentClass &&
            word.topic === currentTopic
        );


    if (list.length === 0) {

        flashWords =
            words.slice(0, 10);

    }
    else {

        flashWords =
            list;

    }


    flashIndex = 0;


    renderFlashcard();
}


function renderFlashcard() {

    if (
        !flashWords ||
        flashWords.length === 0
    ) {

        return;
    }


    const word =
        flashWords[flashIndex];


    document
        .getElementById("flashCard")
        .classList.remove(
            "flipped"
        );


    document.getElementById(
        "flashTopic"
    ).textContent =
        `${word.hsk} · ${word.topic}`;


    document.getElementById(
        "flashHanzi"
    ).textContent =
        word.hanzi;


    document.getElementById(
        "flashPinyin"
    ).textContent =
        word.pinyin;


    document.getElementById(
        "flashMeaning"
    ).textContent =
        word.meaning;


    document.getElementById(
        "flashExample"
    ).textContent =
        word.example || "";


    document.getElementById(
        "flashProgress"
    ).textContent =
        `${flashIndex + 1} / ${flashWords.length}`;


    document.getElementById(
        "flashTitle"
    ).textContent =
        `${currentClass} → ${currentTopic}`;
}


function flipCard() {

    document
        .getElementById("flashCard")
        .classList.toggle(
            "flipped"
        );
}


function nextCard() {

    if (!flashWords.length) {
        return;
    }


    flashIndex++;


    if (
        flashIndex >=
        flashWords.length
    ) {

        flashIndex = 0;

    }


    renderFlashcard();
}


function previousCard() {

    if (!flashWords.length) {
        return;
    }


    flashIndex--;


    if (flashIndex < 0) {

        flashIndex =
            flashWords.length - 1;

    }


    renderFlashcard();
}


function speakCurrent() {

    if (!flashWords.length) {
        return;
    }


    speak(
        flashWords[flashIndex].hanzi
    );
}


/* =====================================================
   QUIZ
   ===================================================== */

function startQuiz() {

    let list =
        words.filter(word =>
            word.hsk === currentClass &&
            word.topic === currentTopic
        );


    if (list.length < 4) {

        list =
            words.filter(word =>
                word.hsk === currentClass
            );

    }


    if (list.length < 4) {

        list =
            [...words];

    }


    quizWords =
        [...list]
        .sort(
            () => Math.random() - 0.5
        )
        .slice(
            0,
            Math.min(10, list.length)
        );


    quizIndex = 0;

    quizScore = 0;


    renderQuiz();
}


function renderQuiz() {

    if (
        !quizWords ||
        quizWords.length === 0
    ) {

        return;
    }


    const word =
        quizWords[quizIndex];


    document.getElementById(
        "quizNumber"
    ).textContent =
        `Câu ${quizIndex + 1}/${quizWords.length}`;


    document.getElementById(
        "quizScore"
    ).textContent =
        `Điểm: ${quizScore}`;


    document.getElementById(
        "quizHanzi"
    ).textContent =
        word.hanzi;


    document.getElementById(
        "quizPinyin"
    ).textContent =
        word.pinyin;


    document.getElementById(
        "quizTitle"
    ).textContent =
        `${currentClass} → ${currentTopic}`;


    let answers =
        [word.meaning];


    while (
        answers.length < 4 &&
        answers.length < words.length
    ) {

        const random =
            words[
                Math.floor(
                    Math.random() *
                    words.length
                )
            ];


        if (
            random &&
            !answers.includes(
                random.meaning
            )
        ) {

            answers.push(
                random.meaning
            );

        }

    }


    answers =
        answers.sort(
            () => Math.random() - 0.5
        );


    document.getElementById(
        "answers"
    ).innerHTML =

        answers.map(
            answer => `

                <button
                    class="answer"
                    onclick="chooseAnswer(
                        this,
                        '${escapeAttribute(answer)}',
                        '${escapeAttribute(word.meaning)}'
                    )">

                    ${escapeHtml(answer)}

                </button>

            `
        ).join("");


    document.getElementById(
        "nextQuiz"
    ).disabled = true;
}


function chooseAnswer(
    button,
    selected,
    correct
) {

    document
        .querySelectorAll(".answer")
        .forEach(item => {

            item.disabled = true;

        });


    if (
        selected === correct
    ) {

        button.classList.add(
            "correct"
        );

        quizScore++;

    }
    else {

        button.classList.add(
            "wrong"
        );


        document
            .querySelectorAll(".answer")
            .forEach(item => {

                if (
                    item.textContent.trim()
                    === correct
                ) {

                    item.classList.add(
                        "correct"
                    );

                }

            });

    }


    document.getElementById(
        "quizScore"
    ).textContent =
        `Điểm: ${quizScore}`;


    document.getElementById(
        "nextQuiz"
    ).disabled = false;
}


function nextQuiz() {

    quizIndex++;


    if (
        quizIndex >= quizWords.length
    ) {

        const oldScore =
            Number(
                localStorage.getItem(
                    "bestScore"
                ) || 0
            );


        if (
            quizScore > oldScore
        ) {

            localStorage.setItem(
                "bestScore",
                quizScore
            );

        }


        alert(
            `🎉 Hoàn thành!\n\nBạn đạt ${quizScore}/${quizWords.length} điểm.`
        );


        startQuiz();

        return;
    }


    renderQuiz();
}


function speakQuiz() {

    if (!quizWords.length) {
        return;
    }


    speak(
        quizWords[quizIndex].hanzi
    );
}


/* =====================================================
   THỐNG KÊ
   ===================================================== */

function updateStats() {

    document.getElementById(
        "topicCount"
    ).textContent =
        topics.length;


    document.getElementById(
        "wordCount"
    ).textContent =
        words.length;


    document.getElementById(
        "classCount"
    ).textContent =
        6;
}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


function escapeAttribute(value) {

    return String(value)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            "&quot;"
        );
}


/* =====================================================
   KHỞI TẠO APP
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            localStorage.getItem(
                "sound"
            ) === "off"
        ) {

            const soundBtn =
                document.getElementById("soundBtn");

            if (soundBtn) {
                soundBtn.textContent =
                    "🔇";
            }

        }


        renderHome();


        currentClass =
            "HSK1";

        currentTopic =
            "Chào hỏi";


        renderVocabulary();


        prepareFlashcard();

    }
);


/* =====================================================
   TỰ LUẬN
   ===================================================== */

function startWriting() {

    let list =
        words.filter(word =>
            word.hsk === currentClass &&
            word.topic === currentTopic
        );


    if (list.length === 0) {

        list =
            words.filter(word =>
                word.hsk === currentClass
            );

    }


    if (list.length === 0) {

        list = [...words];

    }


    writingWords =
        [...list]
        .sort(
            () => Math.random() - 0.5
        )
        .slice(
            0,
            Math.min(10, list.length)
        );


    writingIndex = 0;

    writingScore = 0;


    renderWriting();
}


function renderWriting() {

    if (
        !writingWords ||
        writingWords.length === 0
    ) {

        document.getElementById(
            "writingMeaning"
        ).textContent =
            "Chưa có từ vựng";


        document.getElementById(
            "writingNumber"
        ).textContent =
            "0 / 0";


        return;
    }


    const word =
        writingWords[writingIndex];


    document.getElementById(
        "writingNumber"
    ).textContent =
        `Câu ${writingIndex + 1}/${writingWords.length}`;


    document.getElementById(
        "writingScore"
    ).textContent =
        `Điểm: ${writingScore}`;


    document.getElementById(
        "writingTitle"
    ).textContent =
        `${currentClass} → ${currentTopic}`;


    document.getElementById(
        "writingMeaning"
    ).textContent =
        word.meaning;


    const input =
        document.getElementById(
            "writingAnswer"
        );

    input.value = "";

    input.disabled = false;

    input.focus();


    document.getElementById(
        "writingResult"
    ).innerHTML = "";


    document.getElementById(
        "nextWriting"
    ).disabled = true;


    document.getElementById(
        "checkWriting"
    ).disabled = false;
}


function checkWritingAnswer() {

    const word =
        writingWords[writingIndex];


    const input =
        document.getElementById(
            "writingAnswer"
        );


    const answer =
        input.value.trim();


    if (!answer) {

        alert(
            "Bạn chưa nhập câu trả lời."
        );

        input.focus();

        return;
    }


    const userAnswer =
        answer.replace(/\s/g, "");


    const correctAnswer =
        word.hanzi.replace(/\s/g, "");


    const result =
        document.getElementById(
            "writingResult"
        );


    if (
        userAnswer === correctAnswer
    ) {

        writingScore++;


        result.innerHTML = `
            <div class="writing-correct">
                ✅ Chính xác!
            </div>
        `;

    }
    else {

        result.innerHTML = `
            <div class="writing-wrong">
                ❌ Chưa đúng.
                <br>
                <span>Đáp án đúng: <b>${escapeHtml(word.hanzi)}</b></span>
                <br>
                <small>${escapeHtml(word.pinyin)}</small>
            </div>
        `;

    }


    document.getElementById(
        "writingScore"
    ).textContent =
        `Điểm: ${writingScore}`;


    input.disabled = true;


    document.getElementById(
        "checkWriting"
    ).disabled = true;


    document.getElementById(
        "nextWriting"
    ).disabled = false;
}


function nextWriting() {

    writingIndex++;


    if (
        writingIndex >= writingWords.length
    ) {

        alert(
            `🎉 Hoàn thành!\n\nBạn đạt ${writingScore}/${writingWords.length} điểm.`
        );


        startWriting();

        return;
    }


    renderWriting();
}


function handleWritingKey(event) {

    if (
        event.key === "Enter"
    ) {

        const checkButton =
            document.getElementById(
                "checkWriting"
            );


        if (!checkButton.disabled) {

            checkWritingAnswer();

        }
        else {

            nextWriting();

        }

    }

}


/* =====================================================
   GỢI Ý TỰ LUẬN
   ===================================================== */

function showWritingHint() {

    if (!writingWords || writingWords.length === 0) {
        return;
    }

    const word =
        writingWords[writingIndex];

    document.getElementById("hintHanzi").textContent =
        word.hanzi;

    document.getElementById("hintPinyin").textContent =
        word.pinyin;

    document.getElementById("writingHint").style.display =
        "block";

}