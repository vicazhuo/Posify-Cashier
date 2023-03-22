import Vue from 'vue'
// 在vue上挂载一个指量 preventReClick,防止连续多次点击提交
const preventReClick = Vue.directive('preventReClick', {
    inserted: function (el, binding) {
        console.log(el.disabled)
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 1000)
                //binding.value可以自行设置。如果设置了则跟着设置的时间走
                //例如：v-preventReClick='500'
            }
        })
    }
});
export { preventReClick }