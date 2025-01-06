<style scoped lang="less">
.icon-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border: 1px solid #eee;
    border-radius: 4px;

    &:hover {
      background-color: #f5f7fa;
    }

    .el-icon {
      font-size: 20px;
      margin-bottom: 5px;
    }

    span {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
