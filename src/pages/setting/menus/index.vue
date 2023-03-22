<template>
    <div>
        <Card :bordered="false" dis-hover class="ivu-mt">
            <limits></limits>
        </Card>
    </div>
</template>

<script>
    import limits from '@/components/limits';
    export default {
        name: 'index',
        components: {
            limits
        },
        data () {
            return {
            }
        },
        mounted () {
        },
        methods: {
        }
    }
</script>

<style scoped lang="less">
    /deep/.ivu-card-body{
        padding: 0;
    }
</style>