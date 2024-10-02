// FORM-SERVICE
export const FORM_SERVICE_BASE = process.env.REACT_APP_API_FORM_SERVICE_BASE;
    // FORM CONTROLLER
    export const FORM_SERVICE_LOAD_FIELD = `${FORM_SERVICE_BASE}/form-service/form-field`;
    export const FORM_SERVICE_LOAD_DATA = `${FORM_SERVICE_BASE}/form-service/get-data`;
    export const FORM_SERVICE_INSERT_DATA = `${FORM_SERVICE_BASE}/form-service/insert-data`;
    export const FORM_SERVICE_UPDATE_DATA = `${FORM_SERVICE_BASE}/form-service/update-data`;
    export const FORM_SERVICE_DELETE_DATA = `${FORM_SERVICE_BASE}/form-service/delete-data`;
    export const FORM_SERVICE_VIEW_DATA = `${FORM_SERVICE_BASE}/form-service/get-detail-data`;
    export const FORM_SERVICE_UPDATE_STATUS = `${FORM_SERVICE_BASE}/form-service/update-status`;
    // REPORT CONTROLLER
    export const FORM_SERVICE_REPORT_DATA_EXCEL = `${FORM_SERVICE_BASE}/form-service/generate/excel`;

export const ACCOUNTING_SERVICE_BASE = process.env.REACT_APP_API_ACCOUNTING_SERVICE_BASE;

    export const GENERATED_NUMBER = `${ACCOUNTING_SERVICE_BASE}/accounting-service/generate`;
    export const GENERATED_DUE_DATE = `${ACCOUNTING_SERVICE_BASE}/accounting-service/get-due-date`;

