const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $(".playlist");
const audio = $("#audio");


const app = {
    isRandom: false,
    isRepeat: false,
    isCheck: false,
    currentIndex: 0,
    songs: [{
            name: 'Hoa Hải Đường',
            singer: 'Jack',
            path: './audio/hoa-hai-duong.mp3',
            image: './images/hoa-hai-duong.jpeg'
        },
        {
            name: 'Khuê Mộc Lan',
            singer: 'Xuân Tùng',
            path: './audio/khue-moc-lang.mp3',
            image: './images/khue-moc-lang.jpeg'
        },
        {
            name: 'Rồi Tới Luôn',
            singer: 'Jack',
            path: './audio/roi-toi-luon.mp3',
            image: './images/roi-toi-luon.jpeg'
        },
        {
            name: 'Sầu Hồng Gai',
            singer: 'Jack',
            path: './audio/sau-hong-gai.mp3',
            image: './images/sau-hong-gai.jpeg'
        },
        {
            name: 'Thiên Đàng',
            singer: 'Jack',
            path: './audio/thien-dang.mp3',
            image: './images/thien-dang.jpeg'
        },
        {
            name: 'Thương Nhau Tới Bến',
            singer: 'Jack',
            path: './audio/thuong-nhau-toi-ben.mp3',
            image: './images/thuong-nhau-toi-ben.jpeg'
        },
        {
            name: 'Y Chang Xuân Sang',
            singer: 'Jack',
            path: './audio/y-chang-xuan-sang.mp3',
            image: './images/y-chang-xuan-sang.jpeg'
        }
    ],
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    Render: function() {

        this.songs.forEach((song, index) => {
            playlist.innerHTML += ` <div data-index ="${index}" class="song ${index === app.currentIndex?"active":""}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
        })
        return playlist;
    },
    handelEvent: function() {
        const _this = this;
        console.log(app);
        const cd = $(".cd");
        const btnPlay = $(".btn-toggle-play");
        const cdWidth = cd.offsetWidth;
        const playing = $('.player');
        const progress = $('#progress');
        const nextSong = $('.btn-next');
        const prevSong = $('.btn-prev');
        const reload = $('.btn-repeat');
        const btnRandom = $(".btn-random");
        console.log(btnRandom);
        const songs = $$(".song");


        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
            cd.style.opacity = newWidth / cdWidth;
        }


        const animationCD = cd.animate(
            [{
                transform: 'rotate(360deg)'
            }], {
                iterations: Infinity,
                duration: 9000
            }
        )
        animationCD.cancel();

        btnPlay.onclick = function() {
                if (!app.isCheck) {
                    audio.play();
                    audio.onplay();


                } else {
                    audio.pause();
                    audio.onpause();

                }
            }
            // xử lí sự kiện bắt đầu chạy của nhạc 
        audio.onplay = function() {
                playing.classList.add("playing");
                animationCD.play();
                app.isCheck = true;
            }
            // xử lí sự kiện nhạc đang chạy 
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    progress.value = Math.floor((this.currentTime / this.duration) * 100);

                }
            }
            // xử lí sự kiến nhạc bị dừn
        audio.onpause = function() {
                playing.classList.remove("playing");
                app.isCheck = false;
                animationCD.pause();

            }
            // thay đổi progress  khi nhạc chạy
        progress.onchange = function(e) {

                audio.currentTime = ((e.target.value / 100) * audio.duration);
            }
            //thêm class active vào list nhạc 
        var AddActive = () => {
                songs.forEach((value) => {
                    value.classList.remove("active");
                })
                songs[_this.currentIndex].classList.add("active");
            }
            // sự kiện chuyển bài hát tiếp theo
        nextSong.onclick = function() {
            progress.value = 0;
            if (_this.isRandom) {
                _this.RandomSong();
            } else {
                _this.NextSong();
            }
            AddActive();
            _this.HanldeScrollInterview();

        }
        prevSong.onclick = function() {
            progress.value = 0;
            if (_this.isRandom) {
                _this.RandomSong();
            } else {
                _this.PreviousSong();
            }
            AddActive();
            _this.HanldeScrollInterview();
        }

        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle("active");

        }
        audio.onended = function() {

            if (_this.isRepeat) {
                _this.currentIndex = _this.currentIndex;
                audio.play();
            } else {
                nextSong.click();
            }
        }

        reload.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle("active");

        }
        playlist.onclick = function(e) {
            const Song = e.target.closest(".song:not(.active)");
            if (Song) {
                if (!e.target.closest(".option")) {
                    let Location = Song.getAttribute("data-index");
                    _this.currentIndex = Location;
                    _this.LoadCurrentSong();
                    AddActive();
                    audio.play();
                }
            }
        }

    },

    LoadCurrentSong: function() {

        const heading = $("header h2");
        const backgroundSong = $(".cd .cd-thumb");
        heading.innerText = this.currentSong.name;
        backgroundSong.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },
    NextSong: function() {

        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.LoadCurrentSong();
        audio.play();
    },
    RandomSong: function() {
        var newIndex = 0;
        let max = this.songs.length;
        Math.floor(Math.random() * max);
        do {
            newIndex = Math.floor(Math.random() * max);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.LoadCurrentSong();
        audio.play();
    },

    PreviousSong: function() {

        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.LoadCurrentSong();
        audio.play();

    },
    HanldeScrollInterview: function() {
        const songs = $$(".song");
        if (this.currentIndex == 0) {
            songs[this.currentIndex].scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
            songs[[this.currentIndex]].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    },
    Start: function() {

        // xuất ra danh sách nhạc 
        this.Render();
        this.defineProperties();

        this.LoadCurrentSong();

        //bắt sự kiện 
        this.handelEvent();
    }

}
app.Start();