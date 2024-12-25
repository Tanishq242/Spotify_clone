let intervalId
let recordTime = [0, 0, 0]
let timeline_value = 0
let temp = 1
let duration

async function getsong() {
    const ls = await fetch('http://127.0.0.1:3000/songs/')
    const response = await ls.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let data = div.getElementsByTagName('a')
    let song = []
    for (let i = 0; i < data.length; i++) {
        let element = data[i]
        if (element.href.endsWith('.mp3')) {
            song.push(element.href)
        }
    }
    return song
}

// 502

function timer(s1, s2, m1, min, second, timeline) {
    let music_timeline = document.getElementsByClassName('music-timeline')[0]
    let incr_num = timeline
    let sec = 502 / (min * 60 + second)
    // incr_num = sec
    // console.log(incr_num)
    intervalId = setInterval(() => {
        incr_num += sec
        if (s1 < 5) {
            s2++
            if (s2 == 10) {
                s1++
                s2 = 0
                document.getElementById('start-time').textContent = '0' + m1 + ':' + s1 + s2
                recordTime = [m1, s1, s2]
            } else {
                document.getElementById('start-time').textContent = '0' + m1 + ':' + s1 + s2
                recordTime = [m1, s1, s2]
            }
        } else {
            s1 = s2 = 0
            m1++
            document.getElementById('start-time').textContent = '0' + m1 + ':' + s1 + s2
            recordTime = [m1, s1, s2]
        }
        // console.log('timeline-value:', incr_num)
        music_timeline.style.width = incr_num + 'px'
        timeline_value = incr_num
        if (incr_num >= 502) {
            clearInterval(intervalId)
        }
    }, 1000)
}

function nextSongPlay (max, sngs) {
    cnt = Math.floor(Math.random() * (max - 0 + 1)) + 0
    let audio = new Audio(sngs[cnt])
    audio.play()
}

async function main() {
    let songs = await getsong()
    const music = []
    for (let i = 0; i < songs.length; i++) {
        let txt = songs[i].slice(28, songs[i].length)
        music.push(txt.replaceAll('%20', '_'))
        let li = document.createElement('li')
        li.textContent = music[i].replaceAll('%20', '_')
        li.className = 'song' + i;
        document.getElementById('song-box').appendChild(li)
    }

    let shuffle_value = 1
    let minutes, seconds
    var cnt = 0;
    let shuffle_flag = false
    let value_temp = 0
    var audio = new Audio(songs[cnt])
    let song_name = document.getElementsByClassName('song-name-box')
    let play_pause_btn = document.getElementsByClassName('music-control')
    let forward = document.getElementsByClassName('forward')
    let backward = document.getElementsByClassName('backward')
    let img = document.getElementById('play-pause')
    let music_timeline = document.getElementsByClassName('music-timeline')[0]
    let ul = document.getElementsByClassName('song-box')[0].getElementsByTagName('li')
    let mute = document.getElementsByClassName('volume-icon')[0]
    let shuffle = document.getElementsByClassName('shuffle')[0]

    shuffle.addEventListener('click', function () {
        if (shuffle_value < 2) {
            console.log('here here here')
            nextSongPlay(songs.length, songs)
            shuffle.style.boxShadow = '0 0 20px 5px rgba(20, 213, 68, 0.8)'
            shuffle.style.borderRadius = '15px'
            document.getElementById('start-time').textContent = '00:00'
            shuffle_value++
        } else {
            if (shuffle_value%2 != 0){ 
                shuffle.style.boxShadow = '0 0 20px 5px rgba(20, 213, 68, 0.8)'
                shuffle.style.borderRadius = '15px'
                shuffle_value++
            } else {
                shuffle.style.boxShadow = 'none'
                shuffle.style.borderRadius = 'none'
                shuffle_value++
            }
        }

        // setInterval (() => {
        //     let a = parseInt((music_timeline.style.width).slice[0, 3])
        //     if (shuffle_flag && a >= 502){
        //         nextSongPlay(songs.length, songs)
        //     }
        // }, 1000)
    })

for (let song of ul) {
    song.addEventListener('click', function () {
        if (!temp) {
            music_timeline.style.width = '0px'
        }
        audio.pause()
        audio.currentTime = 0
        let sname = song.textContent
        console.log(sname)
        let ind = music.indexOf(sname)
        cnt = ind
        console.log(music)
        console.log(ind)
        audio = new Audio(songs[ind])
        audio.play()
        img.src = 'pause.svg'
        temp = 0
        song_name[0].textContent = music[ind].replaceAll('%20', '_')
        if (intervalId) {
            clearInterval(intervalId)
        }
        document.getElementById('start-time').textContent = '00:00'
        audio.addEventListener('loadedmetadata', () => {
            duration = audio.duration
            minutes = Math.floor(duration / 60);
            seconds = Math.floor(duration % 60);
            console.log(`Audio duration: ${audio.duration} seconds ${minutes} minutes ${seconds} seconds`);
            if (seconds > 9) {
                document.getElementsByClassName('end-time')[0].textContent = '0' + minutes + ':' + seconds
                timer(0, 0, 0, minutes, seconds, 0)
            } else {
                document.getElementsByClassName('end-time')[0].textContent = '0' + minutes + ':' + '0' + seconds
                timer(0, 0, 0, minutes, seconds, 0)
            }
        });
    })
}

play_pause_btn[0].addEventListener('click', function () {
    audio.addEventListener('loadedmetadata', () => {
        duration = audio.duration
        minutes = Math.floor(duration / 60);
        seconds = Math.floor(duration % 60);
        console.log(`Audio duration: ${audio.duration} seconds ${minutes} minutes ${seconds} seconds`);
        if (seconds > 9) {
            document.getElementsByClassName('end-time')[0].textContent = '0' + minutes + ':' + seconds

        } else {
            document.getElementsByClassName('end-time')[0].textContent = '0' + minutes + ':' + '0' + seconds

        }
    });
    if (!temp) {
        img.src = 'play.svg'
        audio.pause()
        if (intervalId) {
            clearInterval(intervalId)
        }
        console.log(timeline_value)
        temp = 1
    } else {
        img.src = 'pause.svg'
        timer(recordTime[1], recordTime[2], recordTime[0], minutes, seconds, timeline_value)
        // if (intervalId) {
        //     clearInterval(intervalId)
        // }
        console.log(timeline_value)
        audio.play()

        song_name[0].textContent = music[cnt].replaceAll('%20', '_')
        temp = 0

    }
})

forward[0].addEventListener('click', function () {
    audio.pause()
    audio.currentTime = 0
    if (cnt === songs.length - 1) {
        cnt = 0
        console.log(`Value of cnt: ${cnt}`)
        console.log("Now playing:", music[cnt]);
        console.log("Audio source:", songs[cnt]);
    } else {
        cnt++
        console.log(`Value of cnt: ${cnt}`)
        console.log("Now playing:", music[cnt]);
        console.log("Audio source:", songs[cnt]);
    }
    song_name[0].textContent = music[cnt].replaceAll('%20', '_')
    audio = new Audio(songs[cnt]);
    img.src = 'pause.svg'
    temp = 0
    audio.play()
    if (intervalId) {
        clearInterval(intervalId)
    }
    document.getElementById('start-time').textContent = '00:00'

    audio.addEventListener('loadedmetadata', () => {
        duration = audio.duration
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        console.log(`Audio duration: ${audio.duration} seconds ${minutes} minutes ${seconds} seconds`);
        if (seconds > 9) {
            document.getElementsByClassName('end-time')[0].textContent = '0' + minutes + ':' + seconds
            timer(0, 0, 0, minutes, seconds, 0)
        } else {
            document.getElementsByClassName('end-time')[0].textContent = '0' + minutes + ':' + '0' + seconds
            timer(0, 0, 0, minutes, seconds, 0)
        }
    });
})

backward[0].addEventListener('click', function () {
    audio.pause()
    audio.currentTime = 0
    cnt--
    console.log(`Value of cnt: ${cnt}`)
    console.log("Now playing:", music[cnt]);
    console.log("Audio source:", songs[cnt]);
    song_name[0].textContent = music[cnt].replaceAll('%20', '_')
    audio = new Audio(songs[cnt]);
    audio.play()
    if (intervalId) {
        clearInterval(intervalId)
    }
    document.getElementById('start-time').textContent = '00:00'
    audio.addEventListener('loadedmetadata', () => {
        duration = audio.duration
        const minutes1 = Math.floor(duration / 60);
        const seconds1 = Math.floor(duration % 60);
        console.log(`Audio duration: ${audio.duration} seconds ${minutes1} minutes ${seconds1} seconds`);
        if (seconds1 > 9) {
            document.getElementsByClassName('end-time')[0].textContent = '0' + minutes1 + ':' + seconds1
            timer(0, 0, 0, minutes1, seconds1, 0)
        } else {
            document.getElementsByClassName('end-time')[0].textContent = '0' + minutes1 + ':' + '0' + seconds1
            timer(0, 0, 0, minutes1, seconds1, 0)
        }
    });
})

mute.addEventListener('click', function () {
    if (audio.muted) {
        audio.muted = false
        mute.src = 'volume.svg'
    } else {
        audio.muted = true
        mute.src = 'mute.svg'
    }
})

function play_next() {
    console.log('hello world')
    cnt++
    song_name[0].textContent = music[cnt].replaceAll('%20', '_')
    audio = new Audio(songs[cnt]);
    img.src = 'pause.svg'
    audio.play()
}
}

main()


