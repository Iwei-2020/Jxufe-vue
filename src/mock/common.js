import Mock from "mockjs";
let debug = 1;
if (debug) {
// 获取权限元数组

  Mock.mock(/getTchMenu/, {
    code: 1,
    msg: "Success",
    data: {
      menu: [
        {
          name: "个人信息",
          name_en: "UserInfo",
          router: "/UserInfo",
          icon: "el-icon-s-custom",
          children: []
        },
        {
          name: "我的积分修改记录",
          name_en: 'ScoreModifyLog',
          router: '/TchLog',
          icon: 'el-icon-data-analysis',
          children: []
        },
        {
          name: "我的考勤记录",
          name_en: 'MyAttendanceLog',
          router: '/TchAttendance',
          icon: 'el-icon-notebook-2',
          children: []
        }
      ]
    }
  })

  Mock.mock(/getMenu/, {
    code: 1,
    msg: "Success",
    data: {
      menu: [
        {
          name: "个人信息",
          name_en: "UserInfo",
          router: "/UserInfo",
          icon: "el-icon-s-custom",
          children: []
        },
        {
          name: "教工管理",
          name_en: "tchManage",
          router: "/tchManage",
          icon: "el-icon-s-marketing",
          children: [
            {
              name: "教工信息管理",
              name_en: "InfoManage",
              router: "/InfoManage",
              icon: ""
            },
            {
              name: "教工积分管理",
              name_en: "ScoreManage",
              router: "/ScoreManage",
              icon: ""
            },
            {
              name: "教工申诉管理",
              name_en: "AppealManage",
              router: "/AppealManage",
              icon: ""
            }
          ]
        },
        {
          name: "教工积分修改记录",
          name_en: "TchScoModifyLog",
          router: "/ModifyLog",
          icon: "el-icon-s-platform",
          children: []
        },
        {
          name: "统计分析",
          name_en: "Statistics",
          router: "/Statistics",
          icon: "el-icon-s-data",
          children: [
            {
              name: "数据统计",
              name_en: "DataSta",
              router: "/DataStatistics",
              icon: ""
            },
            {
              name: "原因统计",
              name_en: "ReasonSta",
              router: "/ReasonStatistics",
              icon: ""
            }
          ]
        }
      ]
    }
  })

  Mock.mock(/getAdminMenu/, {
    code: 1,
    msg: "Success",
    data: {
      menu: [
        {
          name: "个人信息",
          name_en: "UserInfo",
          router: "/UserInfo",
          icon: "el-icon-s-custom",
          children: []
        },
        {
          name: "规则管理",
          name_en: "RuleManage",
          router: "/RuleManage",
          icon: "el-icon-s-order",
          children: []
        },
        {
          name: "部门管理",
          name_en: "DepartmentManage",
          router: "/DepartmentManage",
          icon: "el-icon-menu",
          children: []
        },
        {
          name: "教工管理",
          name_en: "tchManage",
          router: "/tchManage",
          icon: "el-icon-s-marketing",
          children: [
            {
              name: "教工信息管理",
              name_en: "InfoManage",
              router: "/InfoManage",
              icon: ""
            },
            {
              name: "教工积分管理",
              name_en: "ScoreManage",
              router: "/ScoreManage",
              icon: ""
            },
            {
              name: "教工申诉管理",
              name_en: "AppealManage",
              router: "/AppealManage",
              icon: ""
            }
          ]
        },
        {
          name: "教工积分修改记录",
          name_en: "TchScoModifyLog",
          router: "/ModifyLog",
          icon: "el-icon-s-platform",
          children: []
        },
        {
          name: "统计分析",
          name_en: "DataSta",
          router: "/DataStatistics",
          icon: "el-icon-s-data",
          children: []
        },
      ]
    }
  })

}

