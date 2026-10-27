import { ElMessageBox } from 'element-plus'

/**
 * 判断所传文件是否符合上传限制
 * @param file 文件
 * @param limitTypeArr 限制文件类型数组
 * @param limitSize 限制大小
 */
const checkFile = (file, limitTypeArr, limitSize) => {
  const suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const isLt2M = file.size / 1024 / 1024 < limitSize
  if (!isLt2M) {
    ElMessageBox.confirm($t('product.spu.downloadTemplateTips2') + limitSize + 'MB', $t('table.tips'), {
      confirmButtonText: $t('table.confirm'),
      showCancelButton: false,
      type: 'error'
    })
    return false
  }

  if (!(limitTypeArr.length > 0)) {
    return true
  }

  const str = limitTypeArr.join('、')
  if (!suffix) {
    ElMessageBox.confirm($t('product.spu.downloadTemplateTips1') + '【' + str + '】', $t('table.tips'), {
      confirmButtonText: $t('table.confirm'),
      showCancelButton: false,
      type: 'error'
    })
    return false
  }

  // foreach无法用return结束方法，改用for来遍历数据
  for (let i = 0; i < limitTypeArr.length; i++) {
    if (limitTypeArr[i] === suffix) {
      return true
    }
  }

  ElMessageBox.confirm($t('product.spu.downloadTemplateTips1') + '【' + str + '】', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    showCancelButton: false,
    type: 'error'
  })
  return false
}

export { checkFile }
