const lotteryFrom = {
  name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
  image: [{ required: true, message: "请选择主图", trigger: "change" }],
  factor: [
    { required: true, message: "请选择活动类型", trigger: "change" },
  ],
  attends_user: [
    { required: true, message: "请选择参与用户", trigger: "change" },
  ],
  period: [
    {
      required: true,
      type: "array",
      message: "请选择活动时间",
      fields: {
        0: { required: true, message: "请选择起止日期" },
        1: { required: true, message: "请选择起止日期" },
      },
    },
  ],
  lottery_num_term: [
    { required: true, message: "请选择抽奖数量", trigger: "change" },
  ],
  user_level: [
    {
      required: true,
      type: "array",
      message: "请选择用户等级",
    },
    {
      type: "array",
      min: 1,
      message: "请选择用户等级",
    },
  ],
  is_svip: [
    {
      required: true,
      type: "array",
      message: "请选择是否是付费会员",
    },
  ],
  user_label: [
    {
      required: true,
      type: "array",
      message: "请选择用户标签",
    },
    {
      type: "array",
      min: 1,
      message: "请选择用户标签",
    },
  ],
  // prize: [
  //   {
  //     required: true,
  //     type: "array",
  //     message: "请添加抽奖奖品(8条)",
  //   },
  //   {
  //     type: "array",
  //     min: 1,
  //     message: "请添加抽奖奖品(8条)",
  //   },
  // ],
  factor: [
    {
      required: true,
      trigger: "change",
    },
  ],
  attends_user: [
    {
      required: true,
      trigger: "change",
    },
  ],
  spread_num: [
    {
      required: true,
      type: "number",
      message: "请输入关注额外抽多少次",
      trigger: "blur",
    },
  ],
  image: [
    {
      required: true,
      message: "请上传活动背景图",
    },
  ],
  content: [
    {
      required: true,
      message: "请填写活动规则",
      trigger: "blur",
    },
  ],
}
export { lotteryFrom }
