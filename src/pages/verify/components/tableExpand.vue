<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">{{$t("page.common.total_price")}}：</span>
                <span class="expand-value" v-text="row.total_price"></span>
            </Col>
            <Col span="8">
                <span class="expand-key">{{$t("page.common.order_time")}}：</span>
                <span class="expand-value" v-text="row.add_time"></span>
            </Col>
            <Col span="8">
                <span class="expand-key">{{$t("page.common.spread_man")}}：</span>
                <span class="expand-value" v-text="row.spread_nickname?row.spread_nickname:'无'"></span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="expand-key">{{$t("page.common.customer_make")}}：</span>
                <span class="expand-value" v-text="row.mark?row.mark:'none'"></span>
            </Col>
            <Col span="8">
                <span class="expand-key">{{$t("page.common.merchan_make")}}：</span>
                <span class="expand-value" v-text="row.remark?row.remark:'none'"></span>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'table-expand',
        props: {
            row: Object
        }
    }
</script>

<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
