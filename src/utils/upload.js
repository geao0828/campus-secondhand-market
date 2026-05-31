import { ElMessage } from 'element-plus'

/**
 * 上传图片并返回可访问 URL（本地 mock 模式）
 * @param {File} file
 * @param {'product'|'avatar'} type
 * @returns {Promise<string>}
 */
export async function uploadImageFile(file, type = 'product') {
  // const res = await uploadAPI.uploadImage(file, type)
  // const url = res?.data?.url
  // if (!url) {
  //   throw new Error(res?.message || '上传失败')
  // }
  // return url

  // 本地 mock: 使用 URL.createObjectURL
  return new Promise((resolve) => {
    setTimeout(() => {
      const url = URL.createObjectURL(file)
      resolve(url)
    }, 500)
  })
}

/**
 * Element Plus Upload 的 http-request 封装
 */
export function createUploadHandler(type = 'product', onSuccess) {
  return async (options) => {
    try {
      const url = await uploadImageFile(options.file, type)
      onSuccess?.(url, options.file)
      options.onSuccess?.({ url })
    } catch (err) {
      ElMessage.error(err.message || '上传失败')
      options.onError?.(err)
    }
  }
}
