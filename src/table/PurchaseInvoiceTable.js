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
import ListPurchaseInvoice from "../table/ListPurchaseInvoice";

const PurchaseInvoiceTable = ({
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
  isAddingNewPurchaseInvoice,
  handleEditPurchaseInvoice,
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
  const [isCardOpen, setIsCardOpen] = useState(false); // For card visibility
  const [isListVisible, setIsListVisible] = useState(false); // State to control visibility of ListPurchaseInvoice

  const authToken = headers;

  useEffect(() => {
    setSelectedRows(new Set());
  }, [dataTable]);

  useEffect(() => {
    let timer;

    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Set timer to 5 seconds
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

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

    const INVOICE_NUMBER = rowData.INVOICE_NUMBER;
    console.log("Fetching data for INVOICE_NUMBER:", INVOICE_NUMBER);

    LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=INVOICE_NUMBER&filterValue=${INVOICE_NUMBER}&operation=EQUAL`, authToken, branchId)
      .then((response) => {
        const fetchedItems = response.data || [];
        console.log("Items fetched from API:", fetchedItems);

        // Set fetched items to state
        setSelectedRowDataItem(fetchedItems);
      })
      .catch((error) => {
        console.error("Failed to fetch product lookup:", error);
      });

    setSelectedRowData(rowData);

    setIsListVisible(true);

    setIsLoading(true); // Set loading state to true when row is selected
  };

  useEffect(() => {
    console.log("selectedRowDataItem:", selectedRowDataItem);
  }, [selectedRowDataItem]);

  const handleCardClose = () => {
    setIsListVisible(false); // Hide the ListPurchaseInvoice when close button is clicked

    setSelectedRowData(null); // Optionally reset selected row data
  };

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
    isAddingNewPurchaseInvoice(true);
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

    handleEditPurchaseInvoice(true);
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

  // const handleDelete = async (value) => {
  //   const dataSelected = getSelectedRowsData(); // Ambil data yang dipilih
  //   console.log("dataSelected Delete:", dataSelected);

  //   // Cek jika lebih dari satu baris dipilih
  //   if (dataSelected.length !== 1) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Multiple Rows Selected",
  //       text: "Please select exactly one row to delete.",
  //       confirmButtonText: "OK",
  //     });
  //     return;
  //   }

  //   const userId = sessionStorage.getItem("userId");

  //   // Cek apakah status IN_PROCESS dan userId cocok dengan REQUESTOR
  //   if (!checker && dataSelected[0].STATUS_REQUEST === "IN_PROCESS" && userId === dataSelected[0].REQUESTOR) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Delete Restricted",
  //       text: 'You cannot delete this request while it is "IN_PROCESS".',
  //       confirmButtonText: "OK",
  //     });
  //     return;
  //   }

  //   const puinvcId = dataSelected[0].ID; // ID dari data utama
  //   const invoice_number = dataSelected[0].INVOICE_NUMBER;

  //   // Konfirmasi sebelum penghapusan
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you really want to delete this request and its details? This process cannot be undone.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "Cancel",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         // Panggil API untuk menghapus data master (utama)
  //         const response = await DeleteDataService.postData(`column=id&value=${puinvcId}`, "PUINVC", authToken, branchId);

  //         if (!response.message === "Delete Data Successfully") {
  //           throw new Error("Failed to delete main request");
  //         }

  //         // Jika berhasil hapus master, lanjutkan ke detail berdasarkan INVOICE_NUMBER
  //         const responseDetail = await LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=INVOICE_NUMBER&filterValue=${invoice_number}&operation=EQUAL`, authToken, branchId);

  //         const fetchedItems = responseDetail.data || [];
  //         console.log("Items fetch:", fetchedItems);

  //         if (fetchedItems.length > 0) {
  //           // Hapus setiap detail yang ditemukan
  //           for (const item of fetchedItems) {
  //             if (item.ID) {
  //               try {
  //                 const itemResponseDelete = await DeleteDataService.postData(`column=id&value=${item.ID}`, "PUREQD", authToken, branchId);
  //                 console.log("Item deleted successfully:", itemResponseDelete);
  //               } catch (error) {
  //                 console.error("Error deleting item:", item, error);
  //                 throw new Error("Failed to delete one or more detail items");
  //               }
  //             } else {
  //               console.log("No ID found for this item, skipping delete:", item);
  //             }
  //           }
  //         } else {
  //           throw new Error("No details found for this INVOICE_NUMBER");
  //         }

  //         Swal.fire({
  //           icon: "success",
  //           title: "Request and Details Deleted",
  //           text: "Both the request and its details have been successfully deleted.",
  //           confirmButtonText: "OK",
  //         });

  //         handleRefresh();

  //         // Lakukan refresh data atau aksi lain yang diperlukan setelah penghapusan berhasil
  //       } catch (error) {
  //         console.error("Error during delete process:", error);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Delete Error",
  //           text: "Failed to delete the request or its details. Please try again later.",
  //           confirmButtonText: "OK",
  //         });
  //       }
  //     } else {
  //       Swal.fire({
  //         icon: "info",
  //         title: "Cancelled",
  //         text: "Your request deletion has been cancelled.",
  //         confirmButtonText: "OK",
  //       });
  //     }
  //   });
  // };

  const handleDelete = async (value) => {
    try {
      const dataSelected = getSelectedRowsData();
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
      if (!checker && dataSelected[0].STATUS_REQUEST === "IN_PROCESS" && userId === dataSelected[0].REQUESTOR) {
        Swal.fire({
          icon: "warning",
          title: "Delete Restricted",
          text: 'You cannot delete this request while it is "IN_PROCESS".',
          confirmButtonText: "OK",
        });
        return;
      }

      const puinvcId = dataSelected[0].ID;
      const invoice_number = dataSelected[0].INVOICE_NUMBER;

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
            const response = await DeleteDataService.postData(`column=id&value=${puinvcId}`, "PUINVC", authToken, branchId);
            if (!response.message === "Delete Data Successfully") {
              throw new Error("Failed to delete main request");
            }

            const responseDetail = await LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=INVOICE_NUMBER&filterValue=${invoice_number}&operation=EQUAL`, authToken, branchId);
            const fetchedItems = responseDetail.data || [];

            if (fetchedItems.length === 0) {
              Swal.fire({
                icon: "info",
                title: "No Details Found",
                text: `No details found for invoice number ${invoice_number}.`,
                confirmButtonText: "OK",
              });
            } else {
              for (const item of fetchedItems) {
                if (item.ID) {
                  try {
                    const itemResponseDelete = await DeleteDataService.postData(`column=id&value=${item.ID}`, "PUINVCD", authToken, branchId);
                    console.log("Item deleted successfully:", itemResponseDelete);
                  } catch (error) {
                    console.error("Error deleting item:", item, error);
                    throw new Error("Failed to delete one or more detail items");
                  }
                } else {
                  console.log("No ID found for this item, skipping delete:", item);
                }
              }
            }

            Swal.fire({
              icon: "success",
              title: "Request Deleted",
              text: "The request has been successfully deleted.",
              confirmButtonText: "OK",
            });

            handleRefresh();
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
    } catch (error) {
      console.error("Error in handleDelete:", error);
      Swal.fire({
        icon: "error",
        title: "Delete Error",
        text: "An error occurred while deleting the request. Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  const [filters, setFilters] = useState([{ column: "", operation: "LIKE", value: "" }]);

  // Tambahkan filter baru
  const handleAddFilter = () => {
    setFilters([...filters, { column: "", operation: "LIKE", value: "" }]);
  };

  // Hapus filter
  const handleRemoveFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  // Perbarui filter tertentu
  const handleFilterChange = (index, key, value) => {
    const updatedFilters = filters.map((filter, i) => (i === index ? { ...filter, [key]: value } : filter));
    setFilters(updatedFilters);
  };

  // Reset semua filter
  const handleResetFilters = () => {
    handleResetFilter([{ column: "", operation: "LIKE", value: "" }]);
    setFilters([{ column: "", operation: "LIKE", value: "" }]);
  };

  // Terapkan filter
  const handleApplyFilters = () => {
    console.log("Applied Filters:", filters);
    handleFilterSearch({ filters });
    // Kirim ke backend atau gunakan logika filtering di sini
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
    const PR_NUMBER = selectedData[0].PR_NUMBER;
    console.log("Fetching data for PR_NUMBER:", PR_NUMBER);

    LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${PR_NUMBER}&operation=EQUAL`, authToken, branchId)
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
                {/* <button type="button" className="btn btn-default" onClick={handleAddNewPurchaseRequest}>
                                    <FaAddressBook /> Add New
                                </button> */}
                {selectedRows.size > 0 && (
                  <>
                    <button type="button" className="btn btn-default" onClick={handleEditPurchaseInvoice}>
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
                <button type="button" className={`btn ${isFilterOpen ? "btn-secondary" : "btn-default"}`} onClick={handleFilterToggle}>
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
            <div className="row">
              <div className="col-md-12">
                <a className="btn btn-success btn-sm float-right" onClick={handleAddFilter}>
                  <i className="fas fa-plus"></i> Add Row
                </a>
              </div>
            </div>
            <form>
              {filters.map((filter, index) => (
                <div className="row mb-3" key={index}>
                  <div className="col-md-3">
                    <select className="form-control" value={filter.column} onChange={(e) => handleFilterChange(index, "column", e.target.value)}>
                      <option value="">Select a column</option>
                      {/* <option value="ENDTOENDID">End To End Id</option> */}
                      <option value="INVOICE_NUMBER">Invoice Number</option>
                      <option value="DOC_REFF">Doc Reference</option>
                      <option value="INVOICE_DATE">Invoice Date</option>
                      <option value="INVOICE_STATUS">Invoice Status</option>
                      <option value="DESCRIPTION">Description</option>
                      <option value="DUE_DATE">Due Date</option>
                      <option value="CREATE_BY">Create By</option>
                      <option value="TOTAL_AMOUNT">Total Amount</option>
                      <option value="STATUS_WORKFLOW">Status Workflow</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select className="form-control" value={filter.operation} onChange={(e) => handleFilterChange(index, "operation", e.target.value)}>
                      <option value="LIKE">Contains</option>
                      <option value="EQUAL">Equal</option>
                      <option value="NOTEQUAL">Not Equal</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control" placeholder="Enter value" value={filter.value} onChange={(e) => handleFilterChange(index, "value", e.target.value)} />
                  </div>
                  <div className="col-md-3 d-flex align-items-center">
                    <button type="button" className="btn btn-danger" onClick={() => handleRemoveFilter(index)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
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
                  {/* <th>End To End Id</th> */}
                  <th>Invoice Number</th>
                  <th>Doc Reference</th>
                  <th>Invoice Date</th>
                  <th>Invoice Status</th>
                  <th>Description</th>
                  {/* <th>Payment Term</th>
                  <th>Term Of Payment</th> */}
                  <th>Due Date</th>
                  <th>Create By</th>
                  <th>Total Amount</th>
                  <th>Status Workflow</th>
                  {/* <th>Discount</th> */}
                  {/* <th>Total After Discount</th> */}
                  {/* <th>Tax Exchange Rate</th> */}
                  {/* <th>Total Amount PPN</th>
                  <th>Total Amount PPH</th> */}
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
                      {/* <td>{item.ENDTOENDID}</td> */}
                      <td>{item.INVOICE_NUMBER}</td>
                      <td>{item.DOC_REFF}</td>
                      <td>{item.INVOICE_DATE}</td>
                      <td>{item.INVOICE_STATUS}</td>
                      <td>{item.DESCRIPTION}</td>
                      <td>{item.DUE_DATE}</td>
                      <td>{item.CREATE_BY}</td>
                      <td>{item.TOTAL_AMOUNT}</td>
                      <td>{item.STATUS}</td>
                      {/* <td>{item.DISCOUNT}</td> */}
                      {/* <td>{item.TOTAL_AFTER_DISCOUNT}</td> */}
                      {/* <td>{item.TAX_EXCHANGE_RATE}</td> */}
                      {/* <td>{item.TOTAL_AMOUNT_PPN}</td>
                      <td>{item.TOTAL_AMOUNT_PPH}</td> */}
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
        {/* {isCardOpen && (
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">View Purchase Invoice</h5>
              <button type="button" className="close" onClick={handleCardClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="card-body">
              {selectedRowData ? (
                <div>
                  <div className="container">
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Invoice Number:</div>
                      <div className="col-md-8">{selectedRowData.INVOICE_NUMBER}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Doc Reference:</div>
                      <div className="col-md-8">{selectedRowData.DOC_REFF}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Invoice Date:</div>
                      <div className="col-md-8">{selectedRowData.INVOICE_DATE}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Invoice Status:</div>
                      <div className="col-md-8">{selectedRowData.INVOICE_STATUS}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Payment Term:</div>
                      <div className="col-md-8">{selectedRowData.PAYMENT_TERM}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Due Date:</div>
                      <div className="col-md-8">{selectedRowData.DUE_DATE}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Term Of Payment:</div>
                      <div className="col-md-8">{selectedRowData.TERM_OF_PAYMENT}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Tax Rate:</div>
                      <div className="col-md-8">{selectedRowData.TAX_RATE}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Tax Invoice Number:</div>
                      <div className="col-md-8">{selectedRowData.TAX_INVOICE_NUMBER}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">BI Middle Rate:</div>
                      <div className="col-md-8">{selectedRowData.BI_MIDDLE_RATE}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Description:</div>
                      <div className="col-md-8">{selectedRowData.DESCRIPTION}</div>
                    </div>
                  </div>
                  <div className="table-responsive" style={{ overflowX: "auto" }}>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Invoice Number</th>
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
                          <th>Type Of Vat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRowDataItem
                          .sort((a, b) => a.ID - b.ID) // Sort by ID in ascending order
                          .map((detail) => (
                            <tr key={detail.ID}>
                              <td>{detail.invoice_number}</td>
                              <td>{detail.product}</td>
                              <td>{detail.currency}</td>
                              <td>{detail.quantity}</td>
                              <td style={{ textAlign: "right" }}>{DisplayFormat(detail.unit_price)}</td>
                              <td style={{ textAlign: "right" }}>{DisplayFormat(detail.total_price)}</td>
                              <td>{detail.product_note}</td>
                              <td>{detail.tax_ppn}</td>
                              <td>{detail.tax_ppn_rate}</td>
                              <td style={{ textAlign: "right" }}>{DisplayFormat(detail.tax_ppn_amount)}</td>
                              <td>{detail.tax_pph}</td>
                              <td>{detail.tax_pph_rate}</td>
                              <td style={{ textAlign: "right" }}>{DisplayFormat(detail.tax_pph_amount)}</td>
                              <td style={{ textAlign: "right" }}>{DisplayFormat(detail.tax_base)}</td>
                              <td>{detail.type_of_vat}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              ) : (
                <p>No data selected.</p>
              )}
            </div>
          </div>
        )} */}
      </div>
      {isListVisible && (
        <div>
          {isLoading ? (
            <div className="full-screen-overlay">
              <i className="fa-solid fa-spinner fa-spin full-screen-spinner" />
            </div>
          ) : (
            <ListPurchaseInvoice selectedRow={selectedRowData} onClose={handleCardClose} />
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseInvoiceTable;
