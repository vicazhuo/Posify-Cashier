<template>
    <GlobalFooter class="i-copyright" :links="links" :copyright="copyright" />
</template>
<script>
    export default {
        name: 'i-copyright',
        data () {
            return {
                links: [
                    {
                        title: '官网',
                        key: '官网',
                        href: 'https://www.crmeb.com',
                        blankTarget: true
                    },
                    {
                        title: '社区',
                        key: '社区',
                        href: 'http://q.crmeb.com',
                        blankTarget: true
                    },
                    {
                        title: '文档',
                        key: '文档',
                        href: 'http://doc.crmeb.com',
                        blankTarget: true
                    }
                ],
                copyright: 'Copyright © 2022 西安众邦网络科技有限公司'
            }
        },
        mounted () {
            this.getVersion();
        },
        methods: {
            getVersion () {
                this.$store.dispatch('store/db/get', {
                    dbName: 'sys',
                    path: 'user.info',
                    user: true
                }).then(res => {
                    this.copyright += res.version ? '  |  ' + res.version : '';
                })
            }
        }
    }
</script>
<style lang="less">
    .i-copyright{
        flex: 0 0 auto;
        z-index: 1;
    }
</style>
