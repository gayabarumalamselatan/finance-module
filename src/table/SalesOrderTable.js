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

const SalesOrderTable = ({
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
  isAddingNewSalesOrder,
  EditSalesOrder,
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
    e.stopPropagation(); 
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

    const   SO_NUMBER = rowData.SO_NUMBER;
    console.log("Fetching data for SO_NUMBER:", SO_NUMBER);

    LookupService.fetchLookupData(`SALE_FORMSAORD&filterBy=so_number&filterValue=${SO_NUMBER}&operation=EQUAL`, authToken, branchId)
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

  const handleAddNewSalesOrder = () => {
    isAddingNewSalesOrder(true);
  };

  const handleEditSalesOrder = (value) => {
    const dataSelected = getSelectedRowsData();
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

    // Get the current user's userId
    const userId = sessionStorage.getItem("userId");

    // Check if status_request is 'IN_PROCESS' and userId matches created_by
    if (!checker && dataSelected[0].STATUS_REQUEST === "IN_PROCESS" && userId === dataSelected[0].REQUESTOR) {
      Swal.fire({
        icon: "warning",
        title: "Edit Restricted",
        text: 'You cannot edit this request while it is "IN_PROCESS".',
        confirmButtonText: "OK",
      });
      return; // Exit the function if the condition is met
    }

    EditSalesOrder(true); // Open the edit form or process
    selectedData(dataSelected); // Pass the selected data for further processing
  };

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

    const saorId = dataSelected[0].ID; // ID dari data utama
    const soNumber = dataSelected[0].SO_NUMBER;

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
          const response = await DeleteDataService.postData(`column=id&value=${saorId}`, "SAOR", authToken, branchId);

          if (!response.message === "Delete Data Successfully") {
            throw new Error("Failed to delete main request");
          }

          // Jika berhasil hapus master, lanjutkan ke detail berdasarkan SO_NUMBER
          const responseDetail = await LookupService.fetchLookupData(`SALE_FORMSAORD&filterBy=so_number&filterValue=${soNumber}&operation=EQUAL`, authToken, branchId);

          const fetchedItems = responseDetail.data || [];
          console.log("Items fetch:", fetchedItems);

          if (fetchedItems.length > 0) {
            // Hapus setiap detail yang ditemukan
            for (const item of fetchedItems) {
              if (item.ID) {
                try {
                  const itemResponseDelete = await DeleteDataService.postData(`column=id&value=${item.ID}`, "SAORD", authToken, branchId);
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
            throw new Error("No details found for this SO_NUMBER");
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
    const SO_NUMBER = selectedData[0].SO_NUMBER;
    console.log("Fetching data for SO_NUMBER:", SO_NUMBER);

    LookupService.fetchLookupData(`SALE_FORMSAORD&filterBy=so_number&filterValue=${SO_NUMBER}&operation=EQUAL`, authToken, branchId)
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
                <button type="button" className="btn btn-default" onClick={handleAddNewSalesOrder}>
                  <FaAddressBook /> Add New
                </button>
                {selectedRows.size > 0 && (
                  <>
                    <button type="button" className="btn btn-default" onClick={handleEditSalesOrder}>
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
            <form className="row">
              <div className="col-md-4 mb-3">
                <select className="form-control" value={filterColumn} onChange={(e) => setFilterColumn(e.target.value)}>
                  <option value="">Select a column</option>
                  <option value="SO_NUMBER">SO Number</option>
                  <option value="CUTOMER">Customer</option>
                  <option value="TO_ADDRESS">Address</option>
                  <option value="ORDER_DATE">Order Date</option>
                  <option value="PROJECT">Project</option>
                  <option value="STATUS">Status</option>
                  <option value="CURRENCY">Currency</option>
                  <option value="START_PERIOD">Start Period</option>
                  <option value="END_PERIOD">End Period</option>
                  <option value="CONTRACT">LOI/PO/SPK/Contract</option>
                  <option value="NEGO_RATE">Negotiation Rate</option>
                  <option value="PAY_TERM">Payment Term</option>
                  <option value="SALES_PERSON">Sales Person</option>
                  <option value="MANAGER_PERSON">Manager Person</option>
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
                  <th>SO Number</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Order Date</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Currency</th>
                  <th>Start Period</th>
                  <th>End Period</th>
                  <th>LOI/PO/SPK/Contract</th>
                  <th>Negotiation Rate</th>
                  <th>Payment Term</th>
                  <th>Sales Person</th>
                  <th>Manager Person</th>
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
                      <td>{item.SO_NUMBER}</td>
                      <td>{item.CUSTOMER}</td>
                      <td>{item.TO_ADDRESS}</td>
                      <td>{item.ORDER_DATE}</td>
                      <td>{item.PROJECT}</td>
                      <td>{item.STATUS}</td>
                      <td>{item.CURRENCY}</td>
                      <td>{item.PROJECT_PERIOD_STARTDATE}</td>
                      <td>{item.PROJECT_PERIOD_ENDDATE}</td>
                      <td>{item.LOI_SO_SPK_CONTRACT}</td>
                      {/* <td style={{ textAlign: "right" }}>{DisplayFormat(item.TOTAL_AMOUNT)}</td> */}
                      <td>{item.NEGOTIATION_RATE}</td>
                      <td>{item.PAYMENT_TERM}</td>
                      <td>{item.SALES_PERSON}</td>
                      <td>{item.MANAGER_PERSON}</td>
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
            <Modal.Title>View Sales Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRowData ? (
              <div>
                <div className="container">
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">SO Number:</div>
                    <div className="col-md-8">{selectedRowData.SO_NUMBER}</div>
                  </div>
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Customer:</div>
                    <div className="col-md-8">{selectedRowData.CUSTOMER}</div>
                  </div> */}
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Address:</div>
                    <div className="col-md-8">{selectedRowData.ADDRESS}</div>
                  </div> */}
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Order Date:</div>
                    <div className="col-md-8">{selectedRowData.ORDER_DATE}</div>
                  </div>
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Project:</div>
                    <div className="col-md-8">{selectedRowData.PROJECT}</div>
                  </div> */}
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Status:</div>
                    <div className="col-md-8">{selectedRowData.STATUS_SO}</div>
                  </div>
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Currency:</div>
                    <div className="col-md-8">{selectedRowData.CURRENCY}</div>
                  </div> */}
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Start Period:</div>
                    <div className="col-md-8">{selectedRowData.PROJECT_PERIOD_STARTDATE}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">End Period:</div>
                    <div className="col-md-8">{selectedRowData.PROJECT_PERIOD_ENDDATE}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Contract:</div>
                    <div className="col-md-8">{selectedRowData.LOI_SO_SPK_CONTRACT}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Negotiation Rate:</div>
                    <div className="col-md-8">{selectedRowData.NEGOTIATION_RATE}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Payment Term:</div>
                    <div className="col-md-8">{selectedRowData.PAYMENT_TERM}</div>
                  </div>
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Sales Person:</div>
                    <div className="col-md-8">{selectedRowData.SALES_PERSON}</div>
                  </div> */}
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Total Amount:</div>
                    <div className="col-md-8">{DisplayFormat(selectedRowData.TOTAL_AMOUNT)}</div>
                  </div> */}
                  {/* <div className="row mb-3">
                    <div className="col-md-4 font-weight-bold">Manager Person:</div>
                    <div className="col-md-8">{selectedRowData.MANAGER_PERSON}</div>
                  </div> */}
                </div>
                {/* Add more fields as needed */}
                <div classname="table-responsive" style={{overflowX: "auto"}}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                    <th>Item</th>
                      <th>Description</th>
                      <th>BA Date</th>
                      <th>BA Number</th>
                      <th>Start Period</th>
                      <th>End Period</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
                      <th>Jenis Hitung PPN</th>
                      <th>PPN</th>
                      <th>PPN Amount</th>
                      <th>DPP Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRowDataItem
                      .sort((a, b) => a.ID - b.ID) // Sort by ID in ascending order
                      .map((detail) => (
                        <tr key={detail.ID}>
                          <td>{detail.product}</td>
                          <td>{detail.description}</td>
                          <td>{detail.ba_date}</td>
                          <td>{detail.doc_reff_no}</td>
                          <td>{detail.period_start}</td>
                          <td>{detail.period_end}</td>
                          <td>{detail.quantity}</td>
                          <td style={{ textAlign: "right" }}>{DisplayFormat(detail.unit_price)}</td>
                          <td style={{ textAlign: "right" }}>{DisplayFormat(detail.total_price)}</td>
                          <td>{detail.type_of_vat}</td>
                          <td>{detail.tax_ppn}</td>
                          <td>{detail.tax_ppn_amount}</td>
                          <td>{detail.tax_base}</td>
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

export default SalesOrderTable;
