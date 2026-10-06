const original_options2 = [
  {
    label: "电网",
    value: "电网",
    leaf: false,
    level: 1,
    disabled: true,
    display: true,
  },
  {
    label: "华中",
    value: "华中",
    leaf: false,
    level: 1,
    children: [
      {
        label: "省级",
        value: "省级",
        leaf: true,
        level: 2,
        disabled: true,
        display: true,
      },
      {
        label: "河南省",
        value: "河南省",
        leaf: false,
        level: 2,
        children: [
          {
            label: "地级",
            value: "地级",
            leaf: false,
            level: 3,
          },
          {
            label: "信阳市",
            value: "信阳市",
            leaf: false,
            level: 3,
            children: [
              {
                label: "县级",
                value: "县级",
                leaf: true,
                level: 4,
              },
              {
                label: "潢川县",
                value: "潢川县",
                leaf: true,
                level: 4,
              },
            ],
          },
        ],
      },
      { label: "北京市", value: "北京市", leaf: false, level: 2 },
      { label: "天津市", value: "天津市", leaf: false, level: 2 },
      { label: "河北省", value: "河北省", leaf: false, level: 2 },
      { label: "山西省", value: "山西省", leaf: false, level: 2 },
      { label: "湖北省", value: "湖北省", leaf: false, level: 2 },
      { label: "黑龙江省", value: "黑龙江省", leaf: false, level: 2 },
    ],
  },
];
export default original_options2;
