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
            return hours + "ч " + minutes+ "мин";
        }
    }
})

Vue.component('report_row', {
    props: ['employee', 'index', 'projects', 'startdate', 'enddate'],
    template: `<tr>
                    <td>{{index + 1}}</td>
                    <td>{{employee_string(employee.name)}}</td>
                    <td v-for="(project, index) in projects">
                        <pretty_time   :value="projectTime(project.name, employee.projectsList)"
                                       :key="index">
                        </pretty_time>
                    </td>
                </tr>`,
    methods: {
        employee_string: function(name) {
            var result = "";
            var array = name.split(' ');

            result += array[0] + " ";
            result += array[1][0] + ". ";
            result += array[2][0] + ".";

            return result;
        },

        findProjects: function(array) {
            var result = [];
            var sDate = new Date(this.startdate.year, this.startdate.month, this.startdate.day);
            var eDate = new Date(this.enddate.year, this.enddate.month, this.enddate.day);

            for(var i = 0; i < array.length; i++) {
                var pDate = new Date(array[i].date.year, array[i].date.month, array[i].date.day);

                if(pDate >= sDate && pDate <= eDate) {
                    result.push(array[i]);
                }
            }

            return result;
        },

        projectTime: function(element, array) {
            var modifiedArray = this.findProjects(array);

            var summArray = Object.fromEntries(modifiedArray.map(item => [item.name, 0]));
            modifiedArray.forEach(item => {summArray[item.name] += item.time})

            if(summArray[element] != null) {
                return summArray[element];
            }
            else {
                return 0;
            }
        },
    }
});

new Vue ({
    el: '#reportList',
    data: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        startdate: {
            year: 0,
            month: -1,
            day: 0,
        },
        enddate: {
            year: 0,
            month: -1,
            day: 0,
        },

        projects: [
        ],

        employees: [
            {
                name: "Антонов Антон Антонович",
                projectsList: [
                    {
                name: "Проект 1",

                note: "",
                inputedNote: "",
                isAddNote: false,

                timer: null,
                time: 3660,
                timeStart: {
                    hour: 0,
                    minutes: 0,
                },
                timeEnd: {
                    hour: 0,
                    minutes: 0,
                },

                date: {
                    year: 2021,
                    month: 1,
                    day: 28,
                },

                isDone: true,
                isPlayed: true,
            },
            {
                name: "Проект 1",

                note: "",
                inputedNote: "",
                isAddNote: false,

                timer: null,
                time: 3660,
                timeStart: {
                    hour: 0,
                    minutes: 0,
                },
                timeEnd: {
                    hour: 0,
                    minutes: 0,
                },

                date: {
                    year: 2021,
                    month: 1,
                    day: 15,
                },

                isDone: true,
                isPlayed: true,
            },
            {
                name: "Проект 3",

                note: "",
                inputedNote: "",
                isAddNote: false,

                timer: null,
                time: 3660,
                timeStart: {
                    hour: 0,
                    minutes: 0,
                },
                timeEnd: {
                    hour: 0,
                    minutes: 0,
                },

                date: {
                    year: 2021,
                    month: 1,
                    day: 16,
                },


                isDone: true,
                isPlayed: true,
            },
            {
                name: "Проект 4",

                note: "",
                inputedNote: "",
                isAddNote: false,

                timer: null,
                time: 3660,
                timeStart: {
                    hour: 0,
                    minutes: 0,
                },
                timeEnd: {
                    hour: 0,
                    minutes: 0,
                },

                date: {
                    year: 2021,
                    month: 1,
                    day: 20,
                },


                isDone: true,
                isPlayed: true,
            },],
            },
            {
                name: "Антонов Антон Антонович",
                projectsList: [
            {
                name: "Проект 1",

                note: "",
                inputedNote: "",
                isAddNote: false,

                timer: null,
                time: 3660,
                timeStart: {
                    hour: 0,
                    minutes: 0,
                },
                timeEnd: {
                    hour: 0,
                    minutes: 0,
                },

                date: {
                    year: 2021,
                    month: 1,
                    day: 15,
                },


                isDone: true,
                isPlayed: true,
            },
            {
                name: "Проект 4",

                note: "",
                inputedNote: "",
                isAddNote: false,

                timer: null,
                time: 3660,
                timeStart: {
                    hour: 0,
                    minutes: 0,
                },
                timeEnd: {
                    hour: 0,
                    minutes: 0,
                },

                date: {
                    year: 2021,
                    month: 0,
                    day: 15,
                },


                isDone: true,
                isPlayed: true,
            },],
            },
        ],
    },

    computed: {
      isDateChoose: function() {
          if(this.startdate.year > 0 && this.startdate.month >= 0 && this.startdate.day > 0 && this.enddate.year > 0 && this.enddate.month >= 0 && this.enddate.day > 0) {
              return true;
          }
          else {
              return false;
          }
      }
    },

    methods: {
        get_years: function () {
            var today = new Date();
            var count = 10;
            var start_year = today.getFullYear() - count;

            var array = Array(count + 1).fill().map((e, i) => i + start_year);

            return array;
        },

        get_dates: function (year, month) {
            if(year && (month + 1)) {
                var array = [];
                var max_date = this.get_final_date(year, month);
                if(max_date) {
                    array = Array(max_date).fill().map((e, i) => i + 1);
                }

                return array;
            } else {
                return [];
            }
        },

        modify: function (date) {
            var day = this.get_final_date(date.year, date.month);
        },

        get_final_date: function (year, month) {
            var date = new Date(year, month + 1, 0);
            return date.getDate();
        }
    },

     created: async function() {

        const vm = this;

        let projects = (await axios.get('/api/project')).data

        projects.forEach(function (project) {
            var newProject = {
                id:project.id ,
                name: project.Name,
            };
            vm.projects.push(newProject);
        })
    }
})
