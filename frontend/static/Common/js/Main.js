Vue.component ('pretty_time', {
    props: ['value'],
    template: '<p>{{computed_time | prettify}}</p>',
    computed: {
        computed_time() {
            var time = this.value / 3600;
            var hours = parseInt(time);
            var minutes = Math.round((time - hours) * 60);
            return hours + ":" + minutes;
        }
    },
    filters: {
        prettify : function(value) {
            var data = value.split(':');
            var hours = data[0];
            var minutes = data[1];
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            return hours + ":" + minutes;
        }
    }
})

new Vue ({
    el: '#projectList',
    data: {
        projects: [ ],

        projectsTimers: [ ],

        isChoosed: false,
        chosenProject: null,

        isOneTimerDoing: false,
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
            document.getElementById('user_id').getAttribute('value')
            var now = new Date();

            newProjectId = await axiospost('/project_active/add', {
                project_id: this.chosenProject.id,
            })

            if (newProjectId < 0){
                Toast.add({
                        text: 'Проект не добавлена!',
                        color: '#ff0000',
                        delay: 100000,
                    });
                return
            }


            var newProject = {
                id: newProjectId,
                name: this.chosenProject.name,
                note: "",
                inputedNote: "",
                isAddNote: false,

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

                isDone: false,
                isPlayed: false,
            }
            this.projectsTimers.unshift(newProject);

            this.chosenProject = null;
        },

        showNote: function(index) {
            this.projectsTimers[index].isAddNote = true;
            this.projectsTimers[index].inputedNote = this.projectsTimers[index].note;
        },

        addNote: function(index) {
            var str = this.projectsTimers[index].inputedNote;

            this.projectsTimers[index].isAddNote = false;
            this.projectsTimers[index].note = str.substring(0, str.length - 1);
            this.projectsTimers[index].inputedNote = "";
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

        start: function(index) {
            const vm =  this;
            var now = new Date();
            this.projectsTimers[index].isPlayed = true;
            this.startTimer(index);

            this.isOneTimerDoing = true;
        },

        stop: function(index) {
            var now = new Date();
            this.projectsTimers[index].timeEnd.hour = now.getHours();
            this.projectsTimers[index].timeEnd.minutes = now.getMinutes();

            this.projectsTimers[index].isPlayed = false;
            this.projectsTimers[index].isDone = true;

            this.stopTimer(index);

            this.isOneTimerDoing = false;
        },
        
        deleteTimer:async function(index) {
            console.log(this.projectsTimers[index])
            delete_project = await axiospost('project_active/delete', {
                project_id: this.projectsTimers[index].id,
            })
            if (delete_project<0){
              Toast.add({
                        text: 'Проект не удален! Перезагрузите страницу',
                        color: '#ff0000',
                        delay: 100000,
                    });
            }
            this.stopTimer(index);
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

        startTimer: async function(index) {
            start = await axiospost('project_active/start', {
                project_id: this.projectsTimers[index].id,
            })
            if (start){
               this.projectsTimers[index].timer = setInterval(() => {
                    this.projectsTimers[index].time = this.projectsTimers[index].time + 1;
                    var now = new Date();
                    this.projectsTimers[index].timeEnd.hour = now.getHours();
                    this.projectsTimers[index].timeEnd.minutes = now.getMinutes();
                }, 1000)
            }
            else{
                Toast.add({
                        text: 'Проект не оставновлен! Перезагрузите страницу',
                        color: '#ff0000',
                        delay: 100000,
                    });
            }
        },

        stopTimer:async function(index) {
            stop = await axiospost('project_active/stop', {
                project_id: this.projectsTimers[index].id,
            })
            if (stop){
                clearTimeout(this.projectsTimers[index].timer)
            }
            else{
                Toast.add({
                        text: 'Проект не оставновлен! Перезагрузите страницу',
                        color: '#ff0000',
                        delay: 100000,
                    });
            }


        },
    },

    created: async function() {
        const vm = this;

        let tempProjets = (await axios.get('/api/project')).data
        let tempProjetsActive = (await axios.get('/api/project_history')).data



        tempProjets.forEach(function (proj) {
            vm.projects.push({
                id: proj.id,
                name: proj.Name,
            })
        })

        tempProjetsActive.forEach(await function (projAct) {
            var start = projAct.Start == null ? new Date() : new Date(projAct.Start);
            var end = projAct.End == null ? new Date() : new Date(projAct.End);
            var done = null != projAct.End;
            var total_time = (end.getHours() - start.getHours())*60 + end.getMinutes()-start.getMinutes()
            vm.projectsTimers.push({
                id: projAct.id,
                name: projAct.Name,
                //name: tempProjets.find(city => city.id === projAct.Project).Name,
                // если сразу вставлять projAct.Note == '', то не будет написанно: Введите заметку...
                note: projAct.Note == '' ? projAct.Note : '',
                inputedNote: "",
                isAddNote: false,

                timer: 11,//total_time,
                time: 11,//total_time,
                timeStart: {
                    hour: start.getHours(),
                    minutes: start.getMinutes(),
                },

                timeEnd: {
                    hour: end.getHours(),
                    minutes: end.getMinutes(),
                },

                isDone: done,
                isPlayed: projAct.Play,
            })
        })
    }
})
