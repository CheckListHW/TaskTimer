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
            year: 2011,
            month: 0,
            day: 1,
        },
        enddate: {
            year: 2021,
            month: 2,
            day: 1,
        },

        projects: [],

        employees: [],
    },

    computed: {
        isDateChoose: function() {
            const vm = this;
            let StartDate = new Date(vm.startdate.year, vm.startdate.month, vm.startdate.day)
            let StartDateDb = StartDate.toLocaleDateString('fr-CA')
            let EndDate = new Date(vm.enddate.year, vm.enddate.month, vm.enddate.day)
            let EndDateDb = EndDate.toLocaleDateString('fr-CA')
            vm.update_reports('StartDate='+StartDateDb, 'EndDate='+EndDateDb)

            if(this.startdate.year > 0 && this.startdate.month >= 0 && this.startdate.day > 0 && this.enddate.year > 0 && this.enddate.month >= 0 && this.enddate.day > 0) {
                return true;
            }
            else {
                return false;
            }
        },
    },

    methods: {
        update_reports:async function(StartDate, EndDate){
            const vm = this;

            let users = (await axios.get('/api/user')).data
            let projectActive = (await axios.get('/api/project_history/?'+StartDate+'&'+EndDate)).data
            let new_employees = []
            for(let i = 0; i < users.length;i++){
                new_employees.push({
                    name: users[i].first_name+' '+users[i].last_name+' '+users[i].patronymic,
                    projectsList: await get_project_list(projectActive, users[i].id),
                })
            }
            vm.employees = new_employees

        },

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


async function get_project_list(projectActive, user_id) {
    let temp_projectActive = []

    projectActive.forEach(function (p_a) {
        if (p_a.Owner === user_id){
            temp_projectActive.push({
                name: p_a.Name,
                time: (Date.parse(p_a.End) - Date.parse(p_a.Start))/1000,
                note: "",
                inputedNote: "",
                isAddNote: false,

                timer: null,
                timeStart: {
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
            })
        }
    })
    return temp_projectActive
}