<template>
	<div>
    <el-table :data="schedule" border>
      <el-table-column label="周一" prop="monday"></el-table-column>
      <el-table-column label="周二" prop="tuesday"></el-table-column>
      <el-table-column label="周三" prop="wednesday"></el-table-column>
      <el-table-column label="周四" prop="thursday"></el-table-column>
      <el-table-column label="周五" prop="friday"></el-table-column>
      <el-table-column label="周六" prop="saturday"></el-table-column>
      <el-table-column label="周日" prop="sunday"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TchSchedule",
  props: {
    schedule: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
    }
  },
}
</script>

<style scoped>

</style>
