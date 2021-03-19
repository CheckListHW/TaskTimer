Vue.component ('pretty_time', {
    props: ['value'],
    template: '<p>{{computed_time | prettify}}</p>',
    computed: {
        computed_time() {
            var time = this.value / 3600;
            var hours = parseInt(time);
            var minutes = Math.floor((time - hours) * 60);
            var time2 = this.value / 60;
            var secondes = Math.round((time2 - (minutes + hours * 60)) * 60);
            return hours + ":" + minutes + ":" + secondes;
        }
    },
    filters: {
        prettify : function(value) {
            var data = value.split(':');
            var hours = data[0];
            var minutes = data[1];
            var secondes = data[2];
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (secondes < 10) {
                secondes = "0" + secondes;
            }
            return hours + ":" + minutes + ":" + secondes;
        }
    }
})

Vue.component('notification', {
    props: ['note', 'show', 'del_note'],
    template:
      `
        <div class="notification">
            <div class="notice">
                <svg @click="del_note(note)" class="close" width="20" height="20" viewbox="0 0 20 20" stroke-width="2">
                    <line x1="3" y1="3" x2="17" y2="17"></line>
                    <line x1="3" y1="17" x2="17" y2="3"></line>
                </svg>

                <div class="title">
                    {{note.title}}
                </div>

                <div class="body">{{note.body}}</div>
            </div>
        </div>
      `,
});

new Vue ({
    el: '#projectList',
    data: {
        projects: [ ],

        projectsTimers: [ ],

        isChoosed: false,
        chosenProject: null,
        editTimeIndex: -1,
        editNoteIndex: -1,
        startEditTime: "00:00",
        endEditTime: "00:00",

        isOneTimerDoing: false,

        isOpenCalendar: false,
        month: null,
        year: null,
        number: null,
        day:["Пн","Вт","Ср","Чт","Пт","Сб", "Вс"],
        monthes:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
        date: new Date(),

        currentMonth: new Date().getMonth(),
        currentDay: new Date().getDate(),
        currentDayWeek: new Date().getDay(),
        fullDay:[ "Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
        prettyMonthes:["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"],

        pushNoteTime: {
            title: 'Ошибка времени',
            body: 'Время начала проекта больше времени конца проекта',
        },

        pushNoteDate: {
            title: 'Ошибка добавления проекта',
            body: 'Вернитесь на сегодняшнюю дату и затем добавьте проект',
        },

        notifications: [],
    },

    computed: {
        nameChosenProject: function() {
            if(this.chosenProject == null) {
                return "Выберите проект";
            }
            else {
                return this.chosenProject.name;
            }
        },

        isChosenProject: function() {
            if(this.chosenProject == null) {
                return true;
            }
            else {
                return false;
            }
        },
    },

    methods: {
        chooseProject: function(index) {
            this.chosenProject = this.projects[index];
            this.isChoosed = false;
        },

        addProject: async function() {
            const vm = this;
            var now = new Date();

            if(now.getFullYear() != this.year || now.getMonth() != this.month || now.getDate() != this.number)
            {
                //Тут короче чето тоже с БД надо сделать как в else

                response_message = await axiospost('/project_active/add/date', {
                    id: this.chosenProject.id,
                    date:{
                        year:vm.year,
                        month:vm.month+1,
                        day:vm.number,
                    }
                })

                if (response_message > 0){
                    Toast.add({
                        text: 'Проект: '+this.chosenProject.name+' добавлен!',
                        color: '#ffe600',
                        delay: 3000,
                    });
                }
                else{
                    Toast.add({
                        text: response_message,
                        color: '#ff0000',
                        delay: 10000,
                    });
                    return
                }


                var newProject = {
                    id: response_message,
                    name: this.chosenProject.name,
                    note: "",

                    inputedNote: "",
                    isAddNote: false,
                    isChangeTime: false,

                    timer: null,
                    time: 0,
                    timeStart: {
                        hour: now.getHours(),
                        minutes: now.getMinutes(),
                    },
                    timeEnd: {
                        hour: now.getHours(),
                        minutes: now.getMinutes(),
                    },
                    timeError: false,

                    date: {
                        year: now.getFullYear(),
                        month: now.getMonth(),
                        day: now.getDate(),
                    },

                    isDone: true,
                    isPlayed: true,
                }

                this.projectsTimers.push(newProject);

                this.chosenProject = null;
            }
            else {
                response_message = await axiospost('/project_active/add', {
                    id: this.chosenProject.id,
                })
                if (response_message > 0){
                    Toast.add({
                            text: 'Проект: '+this.chosenProject.name+' добавлен!',
                            color: '#ffe600',
                            delay: 3000,
                    });
                }
                else{
                    Toast.add({
                        text: response_message,
                        color: '#ff0000',
                        delay: 10000,
                    });
                    return
                }

                var newProject = {
                    id: response_message,
                    name: this.chosenProject.name,
                    note: "",
                    inputedNote: "",
                    isAddNote: false,
                    isChangeTime: false,

                    timer: null,
                    time: 0,
                    timeStart: {
                        hour: now.getHours(),
                        minutes: now.getMinutes(),
                    },
                    timeEnd: {
                        hour: now.getHours(),
                        minutes: now.getMinutes(),
                    },
                    timeError: false,

                    date: {
                        year: now.getFullYear(),
                        month: now.getMonth(),
                        day: now.getDate(),
                    },

                    isDone: false,
                    isPlayed: false,
                }
                this.projectsTimers.push(newProject);

                this.chosenProject = null;
            }
        },

        showNote: function(index) {
            var id = this.editNoteIndex;

            var string = "textarea" + index;
            var el = this.$refs[string];


            if(id >= 0) {
                this.projectsTimers[id].isAddNote = false;
                this.projectsTimers[index].isAddNote = true;
                this.projectsTimers[index].inputedNote = this.projectsTimers[index].note;
                this.editNoteIndex = index;

                this.$nextTick(function(){
                    el[0].focus();
                });
            }
            else {
                this.projectsTimers[index].isAddNote = true;
                this.projectsTimers[index].inputedNote = this.projectsTimers[index].note;
                this.editNoteIndex = index;

                this.$nextTick(function(){
                    el[0].focus();
                });
            }
        },

        addNote:async function(index) {
            let message = await axiospost('/project_active/edit/note',{
                id: this.projectsTimers[index].id,
                Note: this.projectsTimers[index].inputedNote,
            })

            var str = this.projectsTimers[index].inputedNote;

            this.projectsTimers[index].isAddNote = false;
            this.projectsTimers[index].note = str.substring(0, str.length - 1);
            this.projectsTimers[index].inputedNote = "";
            this.editNoteIndex = -1;
        },

        closeNote: function(index) {
            this.projectsTimers[index].isAddNote = false;
            this.projectsTimers[index].inputedNote = "";
        },

        noteText: function(index) {
            if(this.projectsTimers[index].note == "") {
                return "Введите заметку...";
            }
            else {
                return this.projectsTimers[index].note;
            }
        },

        start:async function(index) {
            let response_message = await axiospost('/project_active/start', {
                id: this.projectsTimers[index].id,
            })
            if (response_message == 'True'){
                Toast.add({
                        text: 'Проект: '+this.projectsTimers[index].name+' начат!',
                        color: '#5ac450',
                        delay: 3000,
                    });
            }
            else{
                Toast.add({
                        text: response_message,
                    });
                return
            }

            const vm =  this;
            var now = new Date();
            this.projectsTimers[index].isPlayed = true;
            this.startTimer(index);
            this.isOneTimerDoing = true;
        },

        stop:async function(index) {
            let response_message = await axiospost('/project_active/stop', {
                id: this.projectsTimers[index].id,
            })

            if (response_message == 'True'){
                Toast.add({
                        text: 'Проект: '+this.projectsTimers[index].name+' окончен!',
                        color: '#37ffd5',
                        delay: 3000,
                    });
            }
            else{
                Toast.add({
                        text: response_message,
                    });
                return
            }
            var now = new Date();
            this.projectsTimers[index].timeEnd.hour = now.getHours();
            this.projectsTimers[index].timeEnd.minutes = now.getMinutes();

            this.projectsTimers[index].isPlayed = false;
            this.projectsTimers[index].isDone = true;

            this.stopTimer(index);

            this.isOneTimerDoing = false;
        },
        
        deleteTimer: async function(index) {

            let response_message = await axiospost('/project_active/delete', {
                id: this.projectsTimers[index].id,
            })
            
            if (response_message == 'True'){
                Toast.add({
                        text: 'Проект: '+this.projectsTimers[index].name+' удален!',
                        color: '#e88888',
                        delay: 3000,
                    });
            }
            else{
                Toast.add({
                        text: response_message,
                    });
                return
            }

            this.projectsTimers.splice(index, 1);
        },

        prettify: function(value) {
            if (value < 10) {
                return "0" + value;
            }
            else {
                return value;
            }
        },

        stopTimer: function(index) {
            clearTimeout(this.projectsTimers[index].timer)
        },

        startTimer: function(index) {
            interval_id = setInterval(()=>this.tik_timer_iteration(index), 1000)
            this.projectsTimers[index].timer = interval_id
            for (let i = 1; i < interval_id; i++)
                window.clearInterval(i);
        },

        tik_timer_iteration: function(index){
            if (this.projectsTimers[index].isPlayed){
                console.log(this.projectsTimers[index])
                this.projectsTimers[index].time += 1;
                var now = new Date();
                this.projectsTimers[index].timeEnd.hour = now.getHours();
                this.projectsTimers[index].timeEnd.minutes = now.getMinutes();
            }

        },

        calendar: function() {
            var days = [];
            var week = 0;
            days[week] = [];
            var dlast = new Date(this.year, this.month + 1, 0).getDate();

            for (let i = 1; i <= dlast; i++) {
                if (new Date(this.year, this.month, i).getDay() != 1) {
                    a = {index:i};
                    days[week].push(a);
                    if (i == new Date().getDate() && this.year == new Date().getFullYear() && this.month == new Date().getMonth()) {
                        a.current = 'rgba(36,0,144,0.5)'
                    };
                    if (new Date(this.year, this.month, i).getDay() == 6 || new Date(this.year, this.month, i).getDay() == 0) {
                        a.weekend = '#ff0000'
                    };
                }
                else {
                    week++;
                    days[week] = [];
                    a = {index:i};
                    days[week].push(a);

                    if ((i == new Date().getDate()) && (this.year == new Date().getFullYear()) && (this.month == new Date().getMonth())) {
                        a.current = 'rgba(36,0,144,0.5)'
                    };

                    if (new Date(this.year, this.month, i).getDay() == 6 || new Date(this.year, this.month, i).getDay() == 0) {
                        a.weekend = '#ff0000'
                    };
                }
            }

            if (days[0].length > 0) {
                for (let i = days[0].length; i < 7; i++) {
                    days[0].unshift('');
                }
            }

            return days;
        },

        decrease: function() {
            this.month--;
            if (this.month < 0) {
                this.month = 12;
                this.month--;
                this.year--;
            }
        },

        increase: function() {
            this.month++;
            if (this.month > 11) {
                this.month = -1;
                this.month++;
                this.year++;
            }
        },

        show: function(day) {
            if(day != "") {
                this.number = day.index;
            }
        },

        newDate: async function(day) {
            if(day != "") {
                let date = new Date(this.year, this.month, day.index)
                this.number = day.index;
                this.currentMonth = this.month;
                this.currentDay = this.number;
                this.currentDayWeek = date.getDay();

                this.isOpenCalendar = !this.isOpenCalendar;

                //Здесь подгрузка данных
                this.upgradeProjectTimer(date)
            }
        },

        decreaseDay:async function() {
            var date = new Date(this.year, this.currentMonth, this.currentDay);
            date.setDate(date.getDate() - 1);
            this.month = date.getMonth();
            this.year = date.getFullYear();
            this.number = date.getDate();

            this.currentMonth = this.month;
            this.currentDay = this.number;
            this.currentDayWeek = new Date(this.year, this.month, this.number).getDay();

            //Здесь подгрузка данных
            this.upgradeProjectTimer(date)
        },

        increaseDay: function() {
            var date = new Date(this.year, this.currentMonth, this.currentDay);
            date.setDate(date.getDate() + 1);
            this.month = date.getMonth();
            this.year = date.getFullYear();
            this.number = date.getDate();

            this.currentMonth = this.month;
            this.currentDay = this.number;
            this.currentDayWeek = new Date(this.year, this.month, this.number).getDay();

            //Здесь подгрузка данных
            this.upgradeProjectTimer(date)
        },

        upgradeProjectTimer:async function(date) {
            //необхадимо для даты без учета UTC и приведению к формату БД
            const vm = this;
            let localdate = date.toLocaleDateString('fr-CA')
            owner = document.getElementById('user_id').getAttribute('value')
            vm.projectsTimers = await get_project_history(localdate, owner)
            vm.continue_timer()
        },

        continue_timer: function(e){
            let continue_project = this.projectsTimers.find(f=>f.isPlayed == true)
            if (continue_project != null){
                this.start(continue_project.number)
            }
        },

        dropdown: async function(e){
            var id = this.editTimeIndex;
            var idNote = this.editNoteIndex;

            if(id >= 0) {
                var string = "dropdown" + id;
                var el = this.$refs[string];
                var target = e.target;

                if (el !== target && !el[0].contains(target)) {
                    console.log('ad')
                    var elem = this.projectsTimers[id];

                    var dataStart = this.startEditTime.split(':');
                    var hoursStart = dataStart[0];
                    var minutesStart = dataStart[1];

                    var dataEnd = this.endEditTime.split(':');
                    var hoursEnd = dataEnd[0];
                    var minutesEnd = dataEnd[1];

                    elem.isChangeTime = false;
                    elem.timeStart.hour = parseInt(hoursStart);
                    elem.timeStart.minutes = parseInt(minutesStart);
                    elem.timeEnd.hour = parseInt(hoursEnd);
                    elem.timeEnd.minutes = parseInt(minutesEnd);

                    elem.time = hoursEnd*3600 + minutesEnd * 60 - hoursStart *3600 - minutesStart * 60;


                    let response_message = await axiospost('/project_active/edit/time',{
                        id: elem.id,
                        Start: {
                            hour: elem.timeStart.hour,
                            minute: elem.timeStart.minutes,
                        },
                        End:{
                            hour: elem.timeEnd.hour,
                            minute: elem.timeEnd.minutes,
                        },
                    })

                    if (response_message != 'True'){
                        Toast.add({
                            text: response_message,
                            delay: 21000
                        })
                    }

                    if(this.editTimeIndex >= 0) {
                        var prj = this.projectsTimers[this.editTimeIndex];
                        if(prj.timeStart.hour > prj.timeEnd.hour) {
                            prj.timeError = true;
                            if(this.notifications.indexOf(this.pushNoteTime) == -1) {
                                this.notifications.push(this.pushNoteTime);
                                elem.time = 0;
                            }
                        }
                        else if(prj.timeStart.hour == prj.timeEnd.hour && prj.timeStart.minutes > prj.timeEnd.minutes) {
                            prj.timeError = true;
                            if(this.notifications.indexOf(this.pushNoteTime) == -1) {
                                this.notifications.push(this.pushNoteTime);
                                elem.time = 0;
                            }
                        }
                        else {
                            prj.timeError = false;
                        }
                    }

                    this.editTimeIndex = -1;
                }
            }
            else if (idNote >= 0) {
                var string = "noteW" + idNote;
                var el = this.$refs[string];
                var target = e.target;

                if (el !== target && !el[0].contains(target)) {
                    var elem = this.projectsTimers[idNote];
                    elem.isAddNote = false;
                    this.addNote(idNote);
                }
            }
            else if(this.isChoosed) {
                var el = this.$refs["list"];
                var target = e.target;

                if (el !== target && !el.contains(target)) {
                    this.isChoosed = false;
                }
            }
        },

        updateStartValue(index) {
            if (this.projectsTimers[index].timeStart.minutes >= 60) {
                this.projectsTimers[index].timeStart.minutes = 0;
            }
            this.$forceUpdate();
        },

        updateEndValue(index) {
            if (this.projectsTimers[index].timeEnd.minutes >= 60) {
                this.projectsTimers[index].timeEnd.minutes = 0;
            }
            this.$forceUpdate();
        },

        editTime: function(index) {
            const vm = this;
            if(this.editNoteIndex >= 0) {
                vm.projectsTimers[vm.editNoteIndex].isAddNote = false;
            }

            var id = vm.editTimeIndex;
            var elem = this.projectsTimers[index];

            if(id >= 0) {
                this.projectsTimers[id].isChangeTime = false;

                this.startEditTime = this.prettify(elem.timeStart.hour) + ":" + this.prettify(elem.timeStart.minutes);
                this.endEditTime = this.prettify(elem.timeEnd.hour) + ":" + this.prettify(elem.timeEnd.minutes);

                this.projectsTimers[index].isChangeTime = true;
                this.editTimeIndex = index;
            }
            else {
                this.projectsTimers[index].isChangeTime = true;

                this.startEditTime = this.prettify(elem.timeStart.hour) + ":" + this.prettify(elem.timeStart.minutes);
                this.endEditTime = this.prettify(elem.timeEnd.hour) + ":" + this.prettify(elem.timeEnd.minutes);

                this.editTimeIndex = index;
            }
        },

        deleteNotification: function(note) {
            var id = this.notifications.indexOf(note);
            this.notifications.splice(id, 1);
        }
    },

    created: async function() {
        var date = new Date();
        this.month = date.getMonth();
        this.year = date.getFullYear();
        this.number = date.getDate();

        document.addEventListener('click', this.dropdown);

        const vm = this;

        let tempProjets = (await axios.get('/api/project/')).data

        tempProjets.forEach(function (proj) {
            vm.projects.push({
                id: proj.id,
                name: proj.Name,
            })
        })
        await vm.upgradeProjectTimer(new Date())

        vm.isOneTimerDoing = vm.projectsTimers.find(p => p.isPlayed == 1) != null
        console.log(vm.isOneTimerDoing)

        let until_day_end = 86400-((date.getHours()*60)+date.getMinutes())*60+date.getSeconds()
        setTimeout(night_update, (until_day_end-60)*1000);
    },
    destroyed: function() {
        document.removeEventListener('click', this.dropdown);
    }
})

function night_update() {
    Toast.add({text: 'Через 60 страница перезагрузится и активная задача перенесется на следущий день',
                color: '#16d1d7',
                delay: 60000})
    setTimeout(window.location.reload, 60000);
}



async function get_project_history(day, Owner=null) {
    let number = -1
    let owner_or_null = Owner == null ? '' : '&Owner=' + Owner
    let tempProjectsHistory = (await axios.get('/api/project_history/?Date='+day+owner_or_null)).data,
        returnProjectsHistory = []

    tempProjectsHistory.forEach(function (projAct) {
            var start = projAct.Start == null ? new Date() : new Date(projAct.Start);
            var end = projAct.End == null ? new Date() : new Date(projAct.End);
            var done = projAct.End != null;
            var total_time = (end.valueOf()-start.valueOf())/1000
            number += 1
            console.log(end)
            returnProjectsHistory.push({
                number: number,
                id: projAct.id,
                name: projAct.Name,
                note: projAct.Note != null ? projAct.Note : '',
                inputedNote: "",
                isAddNote: false,

                isChangeTime: false,
                time: total_time,
                timeStart: {
                    hour: start.getHours(),
                    minutes: start.getMinutes(),
                },

                timeEnd: {
                    hour: end.getHours(),
                    minutes: end.getMinutes(),
                },

                isDone: done,
                isPlayed: projAct.Activity,
            })
        })
    return  returnProjectsHistory
}

