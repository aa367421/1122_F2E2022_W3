const sectionMap = ['cover', 'naming', 'tutorial', 'backlog', 'sprint', 'retro', 'ending']

import Vue from 'vue';
window.Vue = Vue;

const vm = Vue.createApp({
    data(){
        return {
            nowSection: 'cover',
            nowPage: 0,
            name: '',
            headImgSrc: '',
            alertMsg: '',
            alertBtnText: '',
            isAlertShow: false,
            chatYPos: 0,
            isPrevShow: false,
            backlogScore: 0,
            scrumOrder: [],
            dateText: '',
        }
    },
    methods:{
        chooseSexual(e){
            let chooseCharacterDiv = document.querySelector('.naming-section .main-character-div');
            chooseCharacterDiv.childNodes.forEach(el => {
                el.classList.remove('active');
            })
            if (e.target.className.substr(-3, 3) === 'man'){
                if (e.target.className.substr(-5, 5) === 'woman'){
                    this.headImgSrc = './img/character-woman-head.png';
                } else {
                    this.headImgSrc = './img/character-man-head.png';
                }
                e.target.classList.add('active');
            }
        },
        checkInfo(){
            let reg = /\s/g;
            this.name = this.name.replace(reg, '');
            if (this.name == '' || this.headImgSrc == ''){
                this.alertMsg = '嘿！菜鳥！<br>不打算報上名嗎？';
                this.alertBtnText = '好的';
                this.isAlertShow = true;
                return;
            }
            this.nowSection = 'tutorial';
            var namingTimeLine = gsap.timeline();
            namingTimeLine.to('.naming-page', {
                opacity: 0,
                duration: 0.5,
            }).to('.naming-section', {
                opacity: 0,
                duration: 0.5,
            }).to('.naming-section', {
                display: 'none',
                duration: 0,
            }).to('.tutorial-section', {
                display: 'block'
            }).to('.tutorial-section', {
                opacity: 1,
                duration: 0.5
            },'<')
        },
        confirmAlert(msg){
            this.alertMsg = '';
            this.alertBtnText = '';
            this.isAlertShow = false;
            if (msg != '謝謝'){
                return
            }
            let nextSectionId = sectionMap.findIndex(item => item == this.nowSection) + 1;
            let nextSectionName = sectionMap[nextSectionId];
            this.$options.methods.changeSection.bind(this)(nextSectionName);
        },
        checkTutorial(){
            let ary = [0, 1, 2, 3];
            tutorialPut.toArray().forEach(id => {
                let targetIndex = ary.findIndex(target => target == id);
                if (targetIndex != -1){
                    ary.splice(targetIndex, 1);
                }
            })
            if(ary.length != 0 ){
                this.alertMsg = '嘿！菜鳥！<br>想跑去哪呢？你的試煉還沒有完成呢！'
                this.alertBtnText = '好的';
                this.isAlertShow = true;
                return
            }
            this.alertMsg = '做得好啊！菜鳥！'
            this.alertBtnText = '謝謝';
            this.isAlertShow = true;

        },
        changeSection(sectionName){
            this.nowPage = 0;
            this.chatYPos = 0;
            gsap.to(`.${this.nowSection}-section`, {
                opacity: 0,
                duration: 0.5
            })
            gsap.to(`.${this.nowSection}-section`, {
                display: 'none',
                duration: 0,
                delay: 0.5
            })

            gsap.to(`.${sectionName}-section`, {
                display: 'block',
                duration: 0,
                delay: 0.5
            })
            gsap.to(`.${sectionName}-section`, {
                opacity: 1,
                duration: 0.5,
                delay: 0.5
            })
            this.nowSection = sectionName;
            if (sectionName == 'ending'){
                let d = new Date();
                let yy = d.getFullYear() - 1911;
                let mm = d.getMonth() + 1 + 1 < 10 ?  '0' + `${d.getMonth() + 1}` : d.getMonth() + 1;
                let dd = d.getDate() + 1 < 10 ? '0' + `${d.getDate()}` : d.getDate();
                this.dateText = `${yy}年${mm}月${dd}日`;
            }
        },
        changePage(action){
            let btns = document.querySelectorAll(`.${this.nowSection}-section .chat-box .bottom-btn`);
            btns.forEach(el => {
                el.classList.add('hidden');
            })

            let nowPage = this.nowPage;
            let nextPage;
            if (action == 'next'){
                nextPage = this.nowPage + 1;
                let nowPageEl = document.querySelector(`.${this.nowSection}-section .chat-box[data-page='${nowPage}'`);
                console.log(this.nowSection);
                console.log(nowPageEl);
                this.chatYPos -= nowPageEl.offsetHeight;
                this.chatYPos -= 0.05 * window.screen.availHeight * window.devicePixelRatio;
            } else {
                nextPage = this.nowPage - 1;
                let nowPageEl = document.querySelector(`.${this.nowSection}-section .chat-box[data-page='${nextPage}'`);
                this.chatYPos += nowPageEl.offsetHeight;
                this.chatYPos += 0.05 * window.screen.availHeight * window.devicePixelRatio;
            }

            gsap.to(`.${this.nowSection}-section .chat-box[data-page='${nextPage}']`, {
                opacity: 1,
                x: 0,
                duration: 0.5
            })
            if (this.nowSection == 'ending'){
                document.querySelector('.ending-section .bottom-btn').classList.add('hidden');
                return
            }

            gsap.to(`.${this.nowSection}-section .chat-box-container`, {
                y: this.chatYPos,
                delay: 0.25
            })

            let btnNowPage = document.querySelector(`.${this.nowSection}-section .chat-box[data-page='${nextPage}'] .bottom-btn`);
            btnNowPage.classList.remove('hidden');

            if (this.nowSection == 'backlog'){
                gsap.to(`.${this.nowSection}-section .character-page[data-page='${nowPage}']`, {
                    opacity: 0,
                    yPercent: 50,
                    duration: 0.5
                })
                gsap.to(`.${this.nowSection}-section .character-page[data-page='${nextPage}']`, {
                    opacity: 1,
                    transform: 'translate(0%, 0%)',
                    duration: 0.5
                })

                if (action == 'next' && nowPage != 1){
                    gsap.to(`.${this.nowSection}-section .chat-box[data-page='${nowPage}']`, {
                        opacity: 0
                    })
                } 
                if (action == 'prev'){
                    gsap.to(`.${this.nowSection}-section .chat-box[data-page='${nowPage}']`, {
                        opacity: 0
                    })
                }
            }
            
            if (nextPage != 0){
                this.isPrevShow = true;
            } else {
                this.isPrevShow = false;
            }

            this.nowPage = nextPage;
        },
        startTest(){
            console.log(this.nowSection);
            gsap.to(`.${this.nowSection}-section .chat-box-container, .${this.nowSection}-section .character-div`,{
                opacity: 0,
                duration: 0.5
            })
            gsap.to(`.${this.nowSection}-section .chat-box-container, .${this.nowSection}-section .character-div`,{
                display: 'none',
                duration: 0,
                delay: 0.5
            })
            gsap.to(`.${this.nowSection}-test-page`,{
                opacity: 1,
                delay: 0.5
            })
            this.isPrevShow = false;
        },
        checkBacklog(){
            this.backlogScore = backlogScoreTotal;
            this.isAlertShow = true;
            if (backlogScoreTotal == 0 || backlogScoreTotal > 20){
                this.alertMsg = '請再試試看，我相信你可以的！'
                this.alertBtnText = '好的';
                return
            }
            this.alertMsg = '你做到了！非常有潛力喔！！'
            this.alertBtnText = '謝謝';
            
        },
        checkSprint(){
            let ary = this.scrumOrder;
            ary[0] = ary[0] == 2;
            ary[1] = ary[1] == 0;
            ary[2] = ary[2] == 1;
            let isCorrect = ary.every(item => {
                return item === true
            })
            this.isAlertShow = true;
            if (!isCorrect){
                this.alertMsg = '加把勁啊新人！'
                this.alertBtnText = '好的';
                return
            }
            this.alertMsg = '這麼快就對Scrum瞭若指掌了，<br>我對你刮目相看了哦！'
            this.alertBtnText = '謝謝';
        },
        checkRetro(){
            let input0 = document.querySelector('input[name="Q0-answer"]:checked');
            let input1 = document.querySelector('input[name="Q1-answer"]:checked');
            this.isAlertShow = true;
            if (input0 === null || input1 === null){
                this.alertMsg = '……好哦，請再試一次吧～'
                this.alertBtnText = '好的';
                return
            }
            let ans0 = document.querySelector('input[name="Q0-answer"]:checked').value;
            let ans1 = document.querySelector('input[name="Q1-answer"]:checked').value;
            if (ans0 !== '1' || ans1 !== '0'){
                this.alertMsg = '……好哦，請再試一次吧～'
                this.alertBtnText = '好的';
                return
            }
            this.alertMsg = '你也是語言的藝術家了～～'
                this.alertBtnText = '謝謝';

        },
        showEndingPage(){
            gsap.to('.ending-section .chat-box-container, .character-div', {
                opacity: 0,
                duration: 0.5
            })
            gsap.to('.ending-section .chat-box-container, .character-div', {
                display: 'none',
                duration: 0,
                delay: 0.5
            })

            gsap.to('.ending-section .ending-page', {
                opacity: 1,
                duration: 0.5,
                delay: 0.5
            })
            gsap.to('.ending-section .ending-page .certificate, .ending-section .ending-page .character-div', {
                display: 'flex',
                opacity: 1,
                duration: 0.5,
                delay: 0.5
            })
        },
        screenShot(){
            let sideBtn = document.querySelector('.ending-page .side-btn');
            sideBtn.style.display = 'none';
            html2canvas(document.querySelector('#app')).then(canvas => {
                document.body.appendChild(canvas);
                let el = document.createElement('a');
                el.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                el.download = `${this.name}_F2E2022_certificate.jpg`;
                el.click();
            }).then(sideBtn.style.display = 'flex');
        },
        toHomePage(){
            location.reload();
        }
    }
}).mount('#app');

const preloadImg = (src) => {
    let el = document.createElement('link');
    el.crossorigin = 'anonymous';
    el.as = 'image';
    el.rel = 'preload';
    el.href = src;
    document.querySelector('.for-preload').appendChild(el);
}

const preloadImgAry = [
    './img/bg.png',
    './img/employ-1.png',
    './img/employ-2.png',
    './img/employ-3.png',
    './img/employ-4.png',
    './img/title.png'
]

const coverPage = document.querySelector('.cover-page');
let preloadedNum = 0;
preloadImgAry.forEach(el => {
    preloadImg(el);
    document.querySelector(`link[href='${el}']`).addEventListener('load', () => {
        setTimeout(() => {
            preloadedNum += 1;
        }, 2000)
    })
})
coverPage.addEventListener('click', () => {
    if (preloadedNum < 6){
        return
    }

    vm.$data.nowSection = 'naming';
    var coverTimeLine = gsap.timeline();
    coverTimeLine.to(coverPage, {
        opacity: 0,
        duration: 0.5
    }).to(coverPage, {
        display: 'none',
        duration: 0
    }).to('.cover-talking', {
        opacity: 1,
        duration: 0.5
    }).to('.cover-talking', {
        opacity: 1,
        duration: 1
    }).to('.cover-talking .chat-box-0', {
        opacity: 0,
        duration: 0.5
    }).to('.cover-talking .chat-box-0', {
        display: 'none',
        duration: 0
    }).to('.cover-talking .chat-box-1', {
        opacity: 1
    })
})

const coverBtn = document.querySelector('.cover-section .chat-button');
coverBtn.addEventListener('click', () => {
    gsap.to('.cover-section', {
        opacity: 0,
        duration: 0.5
    })
    gsap.to('.cover-section', {
        display: 'none',
        duration: 0,
        delay: 0.5
    })

    vm.$data.nowSection = 'naming';

    document.querySelector('.naming-section').classList.add('active');
    gsap.to('.naming-section', {
        opacity: 1,
        duration: 0.5
    })
    gsap.to('.naming-page', {
        opacity: 1,
        duration: 1,
        delay: 0.5
    })
})

const tutorialBtn = document.querySelector('.tutorial-section .chat-button');
tutorialBtn.addEventListener('click', () => {
    gsap.to('.tutorial-section .chat-box-container', {
        opacity: 0,
        duration: 0.5
    })
    gsap.to('.tutorial-section .chat-box-container', {
        display: 'none',
        duration: 0,
        delay: 0.5
    })

    gsap.to('.tutorial-section .character-div', {
        opacity: 0,
        duration: 0.5
    })
    gsap.to('.tutorial-section .character-div', {
        display: 'none',
        duration: 0,
        delay: 0.5
    })

    gsap.to('.tutorial-section .tutorial-page', {
        display: 'flex',
        duration: 0,
        delay: 0.5
    })
    gsap.to('.tutorial-section .tutorial-page', {
        opacity: 1,
        duration: 0.5,
        delay: 0.5
    })
})

const tutorialListDOM = document.querySelector('.backlog-drag-layer')
const tutorialPutPlaceDOM = document.querySelector('.tutorial-box .drag-place')

var tutorialDrag = Sortable.create(tutorialListDOM, {
    group: 'tutorial',
    sort: false
})
var tutorialPut = Sortable.create(tutorialPutPlaceDOM, {
    group: 'tutorial',
    filter: '.outline',
    sort: true,
    onChange: () => {
        let childNodesAll = document.querySelectorAll('.tutorial-section .drag-place *');
        if (childNodesAll.length >= 5){
            let outlineCardAry = document.querySelectorAll('.drag-place .outline');
            outlineCardAry[outlineCardAry.length - 1].remove();
        }
    }
})

var backlogListDOM = document.querySelector('.backlog-test-page .drag-place')
var backlogPutPlaceDOM = document.querySelector('.backlog-test-page .put-place')
let backlogScoreTotal = 0;

var backlogDrag = Sortable.create(backlogListDOM, {
    group: 'backlog',
    filter: '.outline',
    sort: true,
    onChange: () => {
        if (backlogListDOM.childNodes.length > 4){
            let outlineCardAry = document.querySelectorAll('.backlog-test-page .drag-place .outline');
            outlineCardAry[outlineCardAry.length - 1].remove();
        }
        if (backlogPutPlaceDOM.childNodes.length < 4){
            let el = document.createElement('li');
            el.className = 'backlog-card outline';
            el.dataset.score = '0';
            backlogPutPlaceDOM.appendChild(el);
        }

        let scoreSpan = document.querySelector('.sprint-backlog-score-now');
        let scoreAry = backlogPut.toArray();
        backlogScoreTotal = 0;
        scoreSpan.classList.remove('active');
        scoreAry.forEach(score => {
            backlogScoreTotal += parseInt(score, 10);
            vm.$data.backlogScore = backlogScoreTotal;
        })
        if (backlogScoreTotal > 20){
            scoreSpan.classList.add('active');
        }
    },
})
var backlogPut = Sortable.create(backlogPutPlaceDOM, {
    group: 'backlog',
    filter: '.outline',
    sort: true,
    dataIdAttr: 'data-score',
    onChange: () => {
        if (backlogListDOM.childNodes.length < 4){
            let el = document.createElement('li');
            el.className = 'backlog-card outline';
            backlogListDOM.appendChild(el);
        }
        if (backlogPutPlaceDOM.childNodes.length > 4){
            let outlineCardAry = document.querySelectorAll('.backlog-test-page .put-place .outline');
            outlineCardAry[outlineCardAry.length - 1].remove();
        }

        let scoreSpan = document.querySelector('.sprint-backlog-score-now');
        let scoreAry = backlogPut.toArray();
        backlogScoreTotal = 0;
        scoreSpan.classList.remove('active');
        scoreAry.forEach(score => {
            backlogScoreTotal += parseInt(score, 10);
            vm.$data.backlogScore = backlogScoreTotal;
        })
        if (backlogScoreTotal > 20){
            scoreSpan.classList.add('active');
        }
    },
})

const scrumListDOM = document.querySelector('.scrum-div .drag-place');
const scrumPutPlaceDOM = document.querySelector('.scrum-div .put-place');

var scrumDrag = Sortable.create(scrumListDOM, {
    group: 'scrum',  
    onChange: () => {
        if (scrumPutPlaceDOM.childNodes.length < 3){
            let el = document.createElement('li');
            el.className = 'scrum-card outline';
            scrumPutPlaceDOM.appendChild(el);
        }
    },
    onEnd: () => {
        vm.$data.scrumOrder = scrumPut.toArray();
    }
})
var scrumPut = Sortable.create(scrumPutPlaceDOM, {
    group: 'scrum',  
    filter: '.outline',
    sort: true,
    onChange: () => {
        if (scrumPutPlaceDOM.childNodes.length > 3){
            let outlineCardAry = document.querySelectorAll('.scrum-div .put-place .outline');
            outlineCardAry[outlineCardAry.length - 1].remove();
        }
    },
    onEnd: () => {
        vm.$data.scrumOrder = scrumPut.toArray();
    }
})
