var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('ul'),
    container: document.querySelector('.container')
}
// 创建桌面歌词
function createLrc() {
    var fragrument = document.createDocumentFragment()
    for(var i=0; i < lrcData.length; i++) {
        var li = document.createElement('li')
        li.innerText = lrcData[i].words
        fragrument.appendChild(li)
    }
    doms.ul.appendChild(fragrument)
}
var lrcData = parseLrc()
createLrc()

var containerHeight = doms.container.clientHeight;
var ulHeight = doms.ul.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;
// 解析歌词
// 得到对象 {time: 开始时间, words: 歌词内容}
function parseLrc() {
    var lrcList = lrc.split('\n') 
    var result = []
    for(var i = 0; i < lrcList.length; i++) {
        var lrcItem = lrcList[i].split(']')
        var obj = {
            time: parseTime(lrcItem[0].slice(1)),
            words: lrcItem[1]
        }
        result.push(obj)
    }
    return result
    
}
function parseTime(time) {
    var parts = time.split(':')
    return  +parts[0] * 60 + +parts[1]
}

// 计算当前播放时间 显示的歌词 及移出的位置
function findIndex() {
   // 获取当前播放歌词时间
   var currentTime = doms.audio.currentTime
   //  显示对应的歌词
   for(var i=0; i < lrcData.length; i++) {
    if(currentTime < lrcData[i].time) {
        return i - 1
    }
   }
   return lrcData.length - 1
}

// 最大偏移量
var maxOffset = ulHeight - containerHeight


// 设置ul的偏移量
function setOffset() {
    // 偏移量 = 歌词的高度的一半 - 盒子的高度的一半
    var index = findIndex()
    var offset =  liHeight * index + liHeight / 2 - containerHeight / 2
    if(offset < 0) {
        offset = 0
    }
    if(offset > maxOffset) {
        offset = maxOffset
    }
    // 先移除所有active样式再添加
    var activeDom = doms.ul.querySelector('.active')
    if(activeDom) {
        activeDom.classList.remove('active')
    }
    doms.ul.style.transform = `translateY(${-offset}px`
    var li = doms.ul.children[index]
    if(li) {
        doms.ul.children[index].classList.add('active')
    }
}

doms.audio.addEventListener('timeupdate', setOffset)