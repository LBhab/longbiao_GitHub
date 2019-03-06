export default {
    name: 'background',
    comments: {},
    data() {
        return {
            path: ''
        }
    },
    computed: {

    },
    watch: {

    },
    methods: {
        changeColor(data) {
            //let path = '';
            // let themeLink = document.querySelector('link[name="test"]');
            // themeLink.setAttribute('href', '../../assets/background/bg_one.less');
            // switch (data) {
            //     case '皮肤1':
            //         require('../../assets/background/bg_one.less');
            //         break;
            //     case '皮肤2':
            //         require('../../assets/background/bg_two.less');
            //         break;
            //     case '皮肤3':
            //         require('../../assets/background/bg_three.less');
            //         break;
            // }
        },

    },
    mounted() {
        this.changeColor();
    },
}