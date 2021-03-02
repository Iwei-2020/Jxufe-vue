/**
 * api接口统一管理
 */
import { get, post } from './http'

let api = {};

// 登录
api.login = p => post('user/login', p)
// 获取用户菜单
api.getMenu = (url,p) => get(url, p)
// 添加用户
api.addUser = p => post('user/addUser', p);
// 批量添加用户
api.addUserBatch = p => post('user/addUserBatch', p)
// 获取全部用户
api.getAllUser = p => post('user/getAllUser', p)
// 修改教工积分
api.modifyScore = p => post('user/modifyScore', p)
// 批量修改教工积分
api.modifyScoreBatch = p => post('user/modifyScoreBatch', p)
// 修改个人信息
api.modifyInfo = p => post('user/modifyInfo', p)
// 获取部门记录
api.getDepartmentRecord = p => post('record/getDepartmentRecord', p)
// 获取教师记录
api.getTchRecord = p => post('record/getTchRecord', p)
// 获取部门
api.getDepartments = () => get('user/getDepartments')
// 获取option
api.getRule = p => post('rule/getRule', p)
// 教工申诉
api.tchAppeal = p => post('appeal/tchAppeal', p)
// 取消申诉
api.cancelAppeal = p => post('appeal/cancelAppeal', p)
// 查看申诉
api.seeAppeal = p => post('appeal/seeAppeal', p)
// 查看反馈
api.seeFeedback = p => post('appeal/seeFeedback', p)
// 获取部门申诉记录
api.getDepartmentAppeal = p => post('appeal/getDepartmentAppeal', p)
// 获取角色列表
api.getRoleList = p => post('user/getRoleList', p)
// 处理申诉
api.handleAppeal = p => post('appeal/handleAppeal',p)
// getSpecialAverage 获取各项平均积分
api.getSpecialAverage = p => post('user/getSpecialAverage',p)
// getGraphData 获取图像数据
api.getGraphData = p => post('user/getGraphData',p)
// saveSchedule 保存课程表
api.saveSchedule = p => post('schedule/saveSchedule',p)
// 上传考勤信息
api.uploadAttendanceFile = p => post('attendance/uploadAttendanceFile',p)
// 获取学生课程表
api.getUserSchedule = p => post('schedule/getUserSchedule',p)
// 获取对应的考勤记录
api.getSpecialAttendance = p => post('attendance/getSpecialAttendance',p)
// 获取教师的考勤记录
api.getTchAttendance = p => post('attendance/getTchAttendance',p)
// 删除用户角色
api.deleteUser = p => post('user/deleteUser',p)
// 添加用户角色
api.addUserRole = p => post('user/addUserRole',p)
// 保存规则
api.saveRule = p => post('rule/saveRule',p)
// 删除规则
api.deleteRule = p => post('rule/deleteRule',p)
// 增加新的计分分类的规则
api.addNewClassifyRule = p => post('rule/addNewClassifyRule',p)
// 新增部门
api.addDepartment = p => post('user/addDepartment',p)
// 获取部门选项
api.getDepartmentOption = () => get('user/getDepartmentOption',null)
// 提交用户修改基本信息的数据
api.userModify = p => post('user/userModify',p)
// 导入教工课程表
api.importSchedule = p => post('user/importSchedule',p)
// 获取classify
api.getClassify = () => get('rule/getClassify',null)
// 为部门分配规则
api.departmentAddRule = p => post('department-rule/departmentAddRule',p)
// 获取部门的规则权限
api.getCheckRuleList = p => post('department-rule/getCheckRuleList',p)
// 删除一系列的规则
api.deleteClassifyRule = p => post('rule/deleteClassifyRule',p)
// record学年
api.getRecordYearOption = () => get('record/getRecordYearOption',null)
// appeal学年
api.getAppealYearOption = () => get('appeal/getAppealYearOption',null)
// 获取是行政人员的教师
api.getAdminTch = () => get('user/getAdminTch',null)
// 提交标记行政人员
api.admitTagTch = p => post('user/admitTagTch',p)
// 批量删除记录
api.admitRemoveRecordBatch = p => post('record/admitRemoveRecordBatch',p)
// 批量删除申诉
api.admitRemoveAppealBatch = p => post('appeal/admitRemoveAppealBatch',p)
// 更新系统学年
api.updateSystemYear = p => post('system-year/updateSystemYear',p)
export default api
