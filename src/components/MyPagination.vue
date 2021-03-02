<template>
  <el-pagination background layout="total,sizes,prev,pager,next,jumper" class="pagination"
                 @current-change="handleCurrentChange" @size-change="handleSizeChange"
                 :total="total" :current-page="currentPageDiy" :page-size="pageSizeDiy" :page-sizes="[5,10,20,50]">
  </el-pagination>
</template>

<script>
export default {
  name: "MyPagination",
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPageDiy: 1,
      pageSizeDiy: 10
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange',val)
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange',val)
    }
  },
  watch: {
    currentPage(newValue, oldValue) {
      this.currentPageDiy = newValue
    },
    pageSize(newValue, oldValue) {
      this.pageSizeDiy = newValue
    }
  },
}
</script>

<style scoped>
  .pagination {
    margin-top: 10px;
  }
</style>
