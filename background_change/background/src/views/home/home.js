export default {
    data() {
        return {
            show: true
        }
    },
    computed: {},
    watch: {},
    methods: {
        change() {
            if (this.show) {
                this.$refs.test.style.height = '50px';
                this.$refs.test.style.background = "red";
                this.$refs.test.style.position = "absolute";
                this.$refs.test.style.top = "60px";
                this.$refs.test.style.left = "0px";
                this.$refs.test.style.transition = "all 2s";
                this.show = false;
            } else {
                let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                this.$refs.test.style.top = (h - 50) + "px";
                // debugger
                this.show = true;
            }




        }
    },
    mounted() {

    },
}