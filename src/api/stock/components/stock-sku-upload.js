import excelRequest from '@/utils/excel-request'

/**
 *
 * @param {Number} type  //
 * @returns
 */
export function downloadModel (type = 1) {
  return excelRequest({
    url: '/mall4cloud_product/m/stock_bill_log_item/download_model',
    method: 'GET',
    params: {
      type
    }
  })
}

export const importExcelURL = import.meta.env.VITE_APP_BASE_API + '/mall4cloud_product/m/stock_bill_log_item/import_excel'
