import React, { useState, useEffect } from "react";
import FormPagination from "../utils/FormPagination";
import { NumericFormat } from "react-number-format";
import { FaAddressBook, FaEye, FaFilter, FaSyncAlt } from "react-icons/fa";
import { FaEdit, FaTrash, FaFileExport } from "react-icons/fa"; // Import icons for Edit, Delete, and Export
import { Button, Modal, Table } from "react-bootstrap";
import { getBranch, getToken, userLoggin } from "../config/Constant";
import LookupService from "../service/LookupService";
import { DisplayFormat } from "../utils/DisplayFormat";
import Swal from "sweetalert2";
import DeleteDataService from "../service/DeleteDataService";

const PurchaseExpanseTable = ({
  formCode,
  dataTable,
  handleSelect,
  pageSize,
  handlePageSizeChange,
  handleRefresh,
  totalItems,
  currentPage,
  handlePageChange,
  isLoadingTable,
  handleFilterSearch,
  handleResetFilter,
  isAddingNewPurchaseExpanse,
  handleEditPurchaseExpanse,
  handleSelectData,
  selectedData,
  checker,
}) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = userLoggin();
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterOperation, setFilterOperation] = useState("");
  const [showAdditionalContent, setShowAdditionalContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowDataItem, setSelectedRowDataItem] = useState([]); // For storing selected row data

  const authToken = headers;

  useEffect(() => {
    setSelectedRows(new Set());
  }, [dataTable]);

  // Handle checkbox click separately
  const handleCheckboxSelect = (e, itemId) => {
    e.stopPropagation(); // Prevent triggering row click when checkbox is clicked
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(itemId)) {
      newSelectedRows.delete(itemId);
    } else {
      newSelectedRows.add(itemId);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle row click for modal view
  const handleRowSelect = (itemId) => {
    const rowData = dataTable.find((item) => item.ID === itemId); // Find the selected row data
    setSelectedRowData(rowData); // Set the row data

    const VOUCHER_NUMBER = rowData.VOUCHER_NUMBER;
    console.log("Fetching data for VOUCHER_NUMBER:", VOUCHER_NUMBER);

    LookupService.fetchLookupData(`VOUC_FORMVCBANKD&filterBy=VOUCHER_NUMBER&filterValue=${VOUCHER_NUMBER}&operation=EQUAL`, authToken, branchId)
      .then((response) => {
        const fetchedItems = response.data || [];
        console.log("Items fetched from API:", fetchedItems);

        // Set fetched items to state
        setSelectedRowDataItem(fetchedItems);
      })
      .catch((error) => {
        console.error("Failed to fetch product lookup:", error);
      });

    setIsModalOpen(true); // Open the modal
  };

  useEffect(() => {
    console.log("selectedRowDataItem:", selectedRowDataItem);
  }, [selectedRowDataItem]);

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(dataTable.map((item) => item.ID)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleNewBond = () => {
    isAddingNewPurchaseExpanse(true);
  };

  // const handleEdit = () => {
  //   handleEditPurchaseInvoice(true);
  //   handleSelectData(dataTable.filter((row) => selectedRows.includes(row.INVOICE_NUMBER)));
  // };

  const handleEdit = () => {
    console.log("selectedRows type:", typeof selectedRows);
    console.log("selectedRows:", selectedRows);

    // Convert selectedRows Set to an array of invoice numbers
    const dataSelected = dataTable.filter((row) => selectedRows.has(row.ID));
    console.log("dataSelected Edit:", dataSelected);

    if (dataSelected.length > 1) {
      Swal.fire({
        icon: "warning",
        title: "Multiple Rows Selected",
        text: "Please select only one row to edit.",
        confirmButtonText: "OK",
      });
      return; // Exit the function if multiple rows are selected
    }

    // Check if status_request is 'IN_PROCESS' and userId matches created_by
    const userId = sessionStorage.getItem("userId");
    if (!checker && dataSelected[0].STATUS_REQUEST === "IN_PROCESS" && userId === dataSelected[0].REQUESTOR) {
      Swal.fire({
        icon: "warning",
        title: "Edit Restricted",
        text: 'You cannot edit this invoice while it is "IN_PROCESS".',
        confirmButtonText: "OK",
      });
      return; // Exit the function if the condition is met
    }

    handleEditPurchaseExpanse(true);
    handleSelectData(dataSelected); // Pass the selected data for further processing
  };

  // const handleDelete = (value) => {
  //     const dataSelected = getSelectedRowsData();
  //     console.log('dataSelected Delete:', dataSelected);

  //     if (dataSelected.length > 1) {
  //         Swal.fire({
  //             icon: 'warning',
  //             title: 'Multiple Rows Selected',
  //             text: 'Please select only one row to Delete.',
  //             confirmButtonText: 'OK',
  //         });
  //         return; // Exit the function if multiple rows are selected
  //     }

  //     // Get the current user's userId
  //     const userId = sessionStorage.getItem('userId');

  //     // Check if status_request is 'IN_PROCESS' and userId matches created_by
  //     if (!checker && dataSelected[0].STATUS_REQUEST === 'IN_PROCESS' && userId === dataSelected[0].REQUESTOR) {
  //         Swal.fire({
  //             icon: 'warning',
  //             title: 'Delete Restricted',
  //             text: 'You cannot delete this request while it is "IN_PROCESS".',
  //             confirmButtonText: 'OK',
  //         });
  //         return; // Exit the function if the condition is met
  //     }
  //     console.log('dataSelected Delete:', dataSelected)  // Pass the selected data for further processing
  // };

  const handleDelete = async (value) => {
    const dataSelected = getSelectedRowsData(); // Ambil data yang dipilih
    console.log("dataSelected Delete:", dataSelected);

    // Cek jika lebih dari satu baris dipilih
    if (dataSelected.length !== 1) {
      Swal.fire({
        icon: "warning",
        title: "Multiple Rows Selected",
        text: "Please select exactly one row to delete.",
        confirmButtonText: "OK",
      });
      return;
    }

    const userId = sessionStorage.getItem("userId");

    // Cek apakah status IN_PROCESS dan userId cocok dengan REQUESTOR
    if (!checker && dataSelected[0].STATUS_REQUEST === "IN_PROCESS" && userId === dataSelected[0].REQUESTOR) {
      Swal.fire({
        icon: "warning",
        title: "Delete Restricted",
        text: 'You cannot delete this request while it is "IN_PROCESS".',
        confirmButtonText: "OK",
      });
      return;
    }

    const vcbankId = dataSelected[0].ID; // ID dari data utama
    const voucher_number = dataSelected[0].VOUCHER_NUMBER;

    // Konfirmasi sebelum penghapusan
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this request and its details? This process cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Panggil API untuk menghapus data master (utama)
          const response = await DeleteDataService.postData(`column=id&value=${vcbankId}`, "VCBANK", authToken, branchId);

          if (!response.message === "Delete Data Successfully") {
            throw new Error("Failed to delete main request");
          }

          // Jika berhasil hapus master, lanjutkan ke detail berdasarkan VOUCHER_NUMBER
          const responseDetail = await LookupService.fetchLookupData(`VOUC_FORMVCBANKD&filterBy=VOUCHER_NUMBER&filterValue=${voucher_number}&operation=EQUAL`, authToken, branchId);

          const fetchedItems = responseDetail.data || [];
          console.log("Items fetch:", fetchedItems);

          if (fetchedItems.length > 0) {
            // Hapus setiap detail yang ditemukan
            for (const item of fetchedItems) {
              if (item.ID) {
                try {
                  const itemResponseDelete = await DeleteDataService.postData(`column=id&value=${item.ID}`, "VCBANKD", authToken, branchId);
                  console.log("Item deleted successfully:", itemResponseDelete);
                } catch (error) {
                  console.error("Error deleting item:", item, error);
                  throw new Error("Failed to delete one or more detail items");
                }
              } else {
                console.log("No ID found for this item, skipping delete:", item);
              }
            }
          } else {
            throw new Error("No details found for this VOUCHER_NUMBER");
          }

          Swal.fire({
            icon: "success",
            title: "Request and Details Deleted",
            text: "Both the request and its details have been successfully deleted.",
            confirmButtonText: "OK",
          });

          handleRefresh();

          // Lakukan refresh data atau aksi lain yang diperlukan setelah penghapusan berhasil
        } catch (error) {
          console.error("Error during delete process:", error);
          Swal.fire({
            icon: "error",
            title: "Delete Error",
            text: "Failed to delete the request or its details. Please try again later.",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "Your request deletion has been cancelled.",
          confirmButtonText: "OK",
        });
      }
    });
  };

  const handleResetFilters = () => {
    setFilterColumn("");
    setFilterValue("");
    setFilterOperation("");
    handleResetFilter();
  };

  const handleApplyFilters = () => {
    handleFilterSearch({ filterColumn, filterOperation, filterValue });
  };

  const handleLoadDataClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAdditionalContent(true);
    }, 1000);
  };

  const getSelectedRowsData = () => {
    return dataTable.filter((item) => selectedRows.has(item.ID));
  };

  const handleView = () => {
    // Add logic for viewing selected rows
    const selectedData = getSelectedRowsData();
    if (selectedData.length > 1) {
      Swal.fire({
        icon: "warning",
        title: "Multiple Rows Selected",
        text: "Please select only one row to view details.",
        confirmButtonText: "OK",
      });
      return; // Exit the function if multiple rows are selected
    }
    

    setSelectedRowData(selectedData[0]);

    console.log("View selected rows data:", selectedData);
    const VOUCHER_NUMBER = selectedData[0].VOUCHER_NUMBER;
    console.log("Fetching data for VOUCHER_NUMBER:", VOUCHER_NUMBER);

    LookupService.fetchLookupData(`VOUC_FORMVCBANKD&filterBy=VOUCHER_NUMBER&filterValue=${VOUCHER_NUMBER}&operation=EQUAL`, authToken, branchId)
      .then((response) => {
        const fetchedItems = response.data || [];
        console.log("Items fetched from API:", fetchedItems);

        // Set fetched items to state
        setSelectedRowDataItem(fetchedItems);
      })
      .catch((error) => {
        console.error("Failed to fetch product lookup:", error);
      });

    setIsModalOpen(true); // Open the modal
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const handleExport = () => {
    // Add logic for exporting selected rows
    console.log("Export selected rows:", Array.from(selectedRows));
  };

  return (
    <div>
      <div className="card card-default">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="col-md-12 d-flex align-items-center">
                <div className="row-per-page-label" style={{ whiteSpace: "nowrap" }}>
                  Rows per page:
                </div>
                <select style={{ margin: "5px" }} id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} className="form-form-select form-select-sm">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            <div className="col-md-8 d-flex justify-content-end align-items-center">
              <div className="btn-group ml-2">
                <button type="button" className="btn btn-default" onClick={handleRefresh}>
                  <FaSyncAlt />
                </button>
                <button type="button" className="btn btn-default" onClick={handleNewBond}>
                  <FaAddressBook /> Add New
                </button>
                {selectedRows.size > 0 && (
                  <>
                    <button type="button" className="btn btn-default" onClick={handleEdit}>
                      <FaEdit /> Edit
                    </button>
                    <button type="button" className="btn btn-default" onClick={handleView}>
                      <FaEye /> View
                    </button>
                    <button type="button" className="btn btn-default" onClick={handleDelete}>
                      <FaTrash /> Delete
                    </button>
                    <button type="button" className="btn btn-default" onClick={handleExport}>
                      <FaFileExport /> Export
                    </button>
                  </>
                )}
                <button type="button" className={`btn ${isFilterOpen ? "btn-default" : "btn-default"}`} onClick={handleFilterToggle}>
                  {isFilterOpen ? (
                    <>
                      <span className="ml-1">
                        <i className="fa fa-times" />
                        Close
                      </span>
                    </>
                  ) : (
                    <>
                      <FaFilter /> <span className="ml-1">Filter</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {isFilterOpen && (
          <div className="card-body">
            <form className="row">
              <div className="col-md-4 mb-3">
                <select className="form-control" value={filterColumn} onChange={(e) => setFilterColumn(e.target.value)}>
                  <option value="">Select a column</option>
                  <option value="INV_NUMBER">INV Number</option>
                  <option value="TITLE">Title</option>
                  <option value="DOC_REFERENCE">Doc Reference</option>
                  <option value="INVOICE_TYPE">Invoice type</option>
                  <option value="INVOICE_DATE">Invoice Date</option>
                  <option value="INVOICE_STATUS">Invoice Status</option>
                  <option value="Vendor">Vendor</option>
                  <option value="PROJECT">Project</option>
                  <option value="TOTAL_AMOUNT">Total Amount</option>
                  <option value="DESCRIPTION">Description</option>
                  <option value="PAYMENT_TERM">Payment Term</option>
                  <option value="DUE_DATE">Due Date</option>
                  <option value="TERM_OF_PAYMENT">Term Of Payment</option>
                  <option value="TAX_RATE">Tax Rate</option>
                  <option value="TAX_INVOICE_NUMBER">Tax Invoice Number</option>
                  <option value="BI_MIDDLE_RATE">Bi Middle Rate</option>
                  <option value="TOTAL_TAX_BASE">Total Tax Base</option>
                  <option value="TOTAL_AMOUNT_PPN">Total Amount Ppn</option>
                  <option value="TOTAL_AMOUNT_PPH">Total Amount Pph</option>
                  <option value="DOC_SOURCE">Doc Source</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <select className="form-control" value={filterOperation} onChange={(e) => setFilterOperation(e.target.value)}>
                  <option value="">Select filter</option>
                  <option value="EQUAL">Equal</option>
                  <option value="NOTEQUAL">Not Equal</option>
                  <option value="LIKE">Contains</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <input type="text" className="form-control" placeholder="Enter value" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
              </div>
            </form>
            <div className="d-flex justify-content-end align-items-center mt-3">
              <button className="btn btn-secondary mr-2" onClick={handleResetFilters}>
                Reset
              </button>
              <button className="btn btn-primary" onClick={handleApplyFilters}>
                Search
              </button>
            </div>
          </div>
        )}
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedRows.size === dataTable.length && dataTable.length > 0} />
                  </th>
                  {/* <th>ID</th> */}
                  <th>Voucher Number</th>
                  <th>Voucher Date</th>
                  <th>Payment Source</th>
                  <th>Bank/cash</th>
                  <th>Bank Account Number</th>
                  <th>Check Number/Giro Number</th>
                  <th>Exchange Rate Bank</th>
                  <th>Voucher Status</th>

                  {/* <th>Total Amount</th>
                  <th>IDR Amount</th> */}
                </tr>
              </thead>
              <tbody>
                {isLoadingTable ? (
                  <tr>
                    <td colSpan={19}>
                      <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : dataTable.length === 0 ? (
                  <tr>
                    <td colSpan={19}>
                      <div className="text-center">No data available</div>
                    </td>
                  </tr>
                ) : (
                  dataTable.map((item) => (
                    <tr key={item.ID} onClick={() => handleRowSelect(item.ID)} style={{ cursor: "pointer" }}>
                      <td onClick={(e) => handleCheckboxSelect(e, item.ID)}>
                        <input type="checkbox" checked={selectedRows.has(item.ID)} onChange={(e) => handleCheckboxSelect(e, item.ID)} />
                      </td>
                     
                      <td>{item.VOUCHER_NUMBER}</td>
                      <td>{item.VOUCHER_DATE}</td>
                      <td>{item.PAYMENT_SOURCE}</td>
                      <td>{item.BANK_NAME}</td>
                      <td>{item.ACCOUNT_BANK}</td>
                      <td>{item.NUMBER_CHECK_GIRO}</td>
                      <td>{item.EXCHANGE_RATE}</td>
                      <td>{item.STATUS}</td>
                      
                      
                      {/* <td>
                        <NumericFormat value={item.AMOUNT} displayType="text" thousandSeparator="," prefix="Rp " />
                      </td>
                      <td>
                        <NumericFormat value={item.TOTAL_AMOUNT} displayType="text" thousandSeparator="," prefix="Rp " />
                      </td>
                      <td>{item.DOC_REFF}</td>
                      <td>{item.DOC_REFF_NO}</td>
                      <td>{item.DUE_DATE}</td>
                      <td>{item.PAY_TO}</td>
                      <td>{item.CHECK_NO}</td>
                      <td>{item.GIRO_NO}</td>
                      <td>{item.AMOUNT_IDR}</td>
                      <td>{item.DESCRIPTION}</td>
                      <td>{item.PAY_TO_SOURCE}</td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <FormPagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange} />
            <div>
              {startIndex + 1} - {endIndex} of {totalItems}
            </div>
          </div>
        </div>
        <Modal show={isModalOpen} onHide={handleModalClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>View Purchase Invoice</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRowData ? (
              <div>
                <div className="container">
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Voucher Number:</div>
                    <div className="col-md-8">{selectedRowData.VOUCHER_NUMBER}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Voucher Date:</div>
                    <div className="col-md-8">{selectedRowData.VOUCHER_DATE}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Payment Source:</div>
                    <div className="col-md-8">{selectedRowData.PAYMENT_SOURCE}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Bank:</div>
                    <div className="col-md-8">{selectedRowData.BANK_NAME}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Bank Account Number:</div>
                    <div className="col-md-8">{selectedRowData.ACCOUNT_BANK}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Check Number/Giro Number:</div>
                    <div className="col-md-8">{selectedRowData.NUMBER_CHECK_GIRO}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Exchange Rate:</div>
                    <div className="col-md-8">{selectedRowData.EXCHANGE_RATE}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Voucher Status:</div>
                    <div className="col-md-8">{selectedRowData.STATUS}</div>
                  </div>
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Project:</div>
                    <div className="col-md-8">{selectedRowData.PROJECT}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Amount:</div>
                    <div className="col-md-8">{selectedRowData.AMOUNT}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Doc Reference:</div>
                    <div className="col-md-8">{selectedRowData.DOC_REFF}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Doc Reference Number:</div>
                    <div className="col-md-8">{selectedRowData.DOC_REFF_NO}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Pay To:</div>
                    <div className="col-md-8">{selectedRowData.PAY_TO}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Check Number:</div>
                    <div className="col-md-8">{selectedRowData.CHECK_NO}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Giro Number:</div>
                    <div className="col-md-8">{selectedRowData.GIRO_NO}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">IDR Amount :</div>
                    <div className="col-md-8">{selectedRowData.AMOUNT_IDR}</div>
                  </div> */}
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Total Tax Base:</div>
                    <div className="col-md-8">{selectedRowData.TOTAL_TAX_BASE}</div>
                  </div> */}
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Total Amount Ppn:</div>
                    <div className="col-md-8">{selectedRowData.TOTAL_AMOUNT_PPN}</div>
                  </div> */}
                  
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Description:</div>
                    <div className="col-md-8">{selectedRowData.DESCRIPTION}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Pay To Source:</div>
                    <div className="col-md-8">{selectedRowData.PAY_TO_SOURCE}</div>
                  </div> */}
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Total Amount:</div>
                    <div className="col-md-8">{DisplayFormat(selectedRowData.TOTAL_AMOUNT)}</div>
                  </div> */}
                </div>
                {/* Add more fields as needed */}
                <div className="table-responsive" style={{ overflowX: "auto" }}>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                      <th>Purchase Invoice Number</th>
                              <th>Purchase Invoice Date</th>
                              <th>Status Detail</th>
                              <th>Code/Account</th>
                              <th>Product</th>
                              <th>Product Account</th>
                              <th>Description</th>
                              <th>Tax Invoice Number Vendor</th>
                              <th>Db/Cr</th>
                              <th>Vendor</th>
                              <th>Project</th>
                              <th>Project Contract Number</th>
                              <th>Customer</th>
                              <th>Department</th>
                              <th>Employee</th>

                              <th>Amount</th>
                              <th>Currency</th>
                              <th>Exchange Rate</th>                       
                              <th hidden>Amount IDR</th>                      
                              <th>Tax PPN</th>
                              <th>Amount PPN</th>                          
                              <th>Tax PPh</th>
                              <th>Amount PPh</th> 
                              <th>Tax Base</th>
                              <th>Total Amount to be Paid</th>
                         
                         

                        {/* <th>Invoice Number</th>
                        <th>Product</th>
                        <th>Currency</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                        <th>Product Note</th>
                        <th>Tax Ppn</th>
                        <th>Tax Ppn Rate</th>
                        <th>Total Amount Ppn</th>
                        <th>Tax Pph</th>
                        <th>Tax Pph Rate</th>
                        <th>Total Amount Pph</th>
                        <th>Total Tax Base</th>
                        <th>Type Of Vat</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRowDataItem
                        .sort((a, b) => a.ID - b.ID) // Sort by ID in ascending order
                        .map((detail) => (
                          <tr key={detail.ID}>
                            <td>{detail.purchase_invoice_number}</td>
                            <td>{detail.purchase_invoice_date}</td>
                            <td>{detail.status_detail}</td>
                            <td>{detail.coa}</td>
                            <td>{detail.product}</td>
                            <td>{detail.product_account}</td>
                            <td>{detail.description}</td>
                            <td>{detail.tax_invoice_number}</td>
                            <td>{detail.db_cr}</td>
                            <td>{detail.vendor}</td>
                            <td>{detail.project}</td>
                            <td>{detail.project_contract_number}</td>
                            <td>{detail.customer}</td>
                            {/* <td style={{ textAlign: "right" }}>{DisplayFormat(detail.kurs_deal)}</td>
                            <td style={{ textAlign: "right" }}>{DisplayFormat(detail.amount_in_idr)}</td> */}
                            <td>{detail.department}</td>
                            <td>{detail.employee}</td>
                            <td style={{ textAlign: "right" }}>{DisplayFormat(detail.amount)}</td>
                            <td>{detail.currency}</td>
                            <td style={{ textAlign: "right" }}>{DisplayFormat(detail.exchange_rate)}</td>
                            <td>{detail.tax_ppn}</td>
                            <td style={{ textAlign: "right" }}>{DisplayFormat(detail.tax_ppn_amount)}</td>
                            <td>{detail.tax_pph}</td>
                            <td style={{ textAlign: "right" }}>{DisplayFormat(detail.tax_pph_amount)}</td>
                            {/* <td>{detail.tax_pph_rate}</td> */}
                           
                            <td style={{ textAlign: "right" }}>{DisplayFormat(detail.tax_base)}</td>
                            <td style={{ textAlign: "right" }}>{DisplayFormat(detail.amount_paid)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            ) : (
              <p>No data selected.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PurchaseExpanseTable;