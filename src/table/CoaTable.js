import React, { useState } from "react";
import { FaAddressBook, FaFilter, FaSyncAlt, FaChevronDown, FaChevronRight } from "react-icons/fa";
import FormPagination from "../utils/FormPagination";
import AddCoaModal from "../modal/AddCoaModal";
import axios from "axios";
import { FORM_SERVICE_DELETE_DATA, FORM_SERVICE_INSERT_DATA, FORM_SERVICE_UPDATE_DATA } from "../config/ConfigUrl";
import Swal from "sweetalert2";
import { messageAlertSwal } from "../config/Swal";
import EditCoaModal from "../modal/EditCoaModal";
import * as XLSX from 'xlsx';
import getDateTime from "../utils/DateTime";
import { DisplayFormat } from "../utils/DisplayFormat";

const CoaTable = ({
    formCode,
    dataTable,
    pageSize,
    handlePageSizeChange,
    handleRefresh,
    totalItems,
    showDynamicSweetAlert,
    currentPage,
    handlePageChange,
    isLoadingTable,
    handleFilterSearch,
    handleResetFilter,
    addingNewBond,
    branchId,
    authToken
}) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterOperation, setFilterOperation] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEditCoa, setSelectedEditCoa] = useState(null);

    // Toggle row expansion
    const toggleRowExpansion = (itemCode) => {
        setExpandedRows(prevExpandedRows => {
            const newExpandedRows = new Set(prevExpandedRows);
            if (newExpandedRows.has(itemCode)) {
                newExpandedRows.delete(itemCode);
            } else {
                newExpandedRows.add(itemCode);
            }
            return newExpandedRows;
        });
    };

    // Handle checkbox selection
    // Handle checkbox selection
    const handleRowSelect = (itemId) => {
        setSelectedRows(prevSelectedRows => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (newSelectedRows.has(itemId)) {
                newSelectedRows.delete(itemId);
            } else {
                newSelectedRows.add(itemId);
            }
            return newSelectedRows;
        });
    };

    const getSelectedData = () => {
        return dataTable.filter(item => selectedRows.has(item.ID));
    };


    // Render tree row
    const renderTreeRow = (item, level = 0, isLast = false) => {
        const children = dataTable.filter(child => child.PARENT_CODE_ID === item.CODE);
        const isLastChild = isLast;

        return (
            <React.Fragment key={item.ID}>
                <tr
                    className={selectedRow === item ? "table-success" : ""}
                >
                    <td>
                        <input
                            type="checkbox"
                            checked={selectedRows.has(item.ID)}
                            onChange={() => handleRowSelect(item.ID)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </td>
                    <td style={{ paddingLeft: `${level * 20}px`, paddingBottom: isLastChild ? '20px' : '5px' }}>
                        {children.length > 0 && (
                            <button
                                className="btn btn-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRowExpansion(item.CODE);
                                }}
                            >
                                {expandedRows.has(item.CODE) ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                        )}
                        {item.CODE}
                    </td>
                    <td style={{ paddingLeft: `${level * 20}px`, paddingBottom: isLastChild ? '20px' : '0' }}>{item.NAME}</td>
                    <td style={{ paddingBottom: isLastChild ? '20px' : '0' }}>{item.TYPE}</td>
                    <td style={{ paddingBottom: isLastChild ? '20px' : '0' }}>{DisplayFormat(item.NORMAL_BALANCE_POSITION || item.normal_balance_position)}</td>
                    <td style={{ paddingBottom: isLastChild ? '20px' : '0' }}>{item.DESCRIPTION}</td>
                </tr>
                {expandedRows.has(item.CODE) && children.map((child, index) =>
                    renderTreeRow(child, level + 1, index === children.length - 1)
                )}
            </React.Fragment>
        );
    };

    // Render tree table
    const renderTreeTable = () => {
        return dataTable
            .filter(item => !dataTable.some(parent => parent.CODE === item.PARENT_CODE_ID))
            .map((item, index, array) => renderTreeRow(item, 0, index === array.length - 1));
    };

    const handleFilterToggle = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleNewBond = () => {
        addingNewBond(true);
    };

    const handleResetFilters = () => {
        setFilterColumn('');
        setFilterValue('');
        setFilterOperation('');
        handleResetFilter();
    };

    const handleApplyFilters = () => {
        handleFilterSearch({ filterColumn, filterOperation, filterValue });
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleSaveCoa = async (newCoa) => {
        // Replace with the actual token, or fetch it dynamically
        try {
            const response = await axios.post(`${FORM_SERVICE_INSERT_DATA}?f=${formCode[0]}&branchId=${branchId}`, newCoa, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            console.log('Event saved successfully:', response.data);
            messageAlertSwal('Success!', 'Event saved successfully', 'success');
            handleRefresh();
        } catch (error) {
            console.error('Error saving event:', error);
            // Handle error (e.g., show a notification)
        }
    };



    const handleEdit = (editCoa) => {
        setSelectedEditCoa(editCoa);
        setShowEditModal(true);
    };


    const handleEditCloseModal = () => {
        setShowEditModal(false);
    };

    const handleEditCoa = async (newCoa) => {
        const { ID, ...newCoaWithoutID } = newCoa;
        setIsLoading(true);
        // Replace with the actual token, or fetch it dynamically
        try {
            const response = await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=${formCode[0]}&column=ID&value=${newCoa.ID}&branchId=${branchId}`, newCoaWithoutID, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
            setTimeout(() => {
                messageAlertSwal('Success!', 'Coa Updated successfully', 'success');
                setSelectedRows(new Set());

                handleRefresh();
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            console.error('Error saving Testimoni:', error);
            // Handle error (e.g., show a notification)
        }
    };
    const handleDeleteClick = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handleDelete();  // Call your delete function if confirmed
                Swal.fire(
                    'Deleted!',
                    'Data has been deleted successfully.',
                    'success'
                );
            }
        });
    };

    const handleDelete = async () => {
        setIsLoading(true);

        try {
            const selectedData = getSelectedData();

            console.log("Selected data:", selectedData);

            // Loop through each selected data item and send a delete request
            for (const data of selectedData) {
                // Make the DELETE request for each selected row
                await axios.delete(
                    `${FORM_SERVICE_DELETE_DATA}?f=${formCode[0]}&column=ID&value=${data.ID}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                });
            }

            // Optional: Delay to simulate processing time or to ensure UI update
            setTimeout(() => {
                setSelectedRows(new Set());
                handleRefresh(); // Trigger callback to refresh data
            }, 1000);

            // Success notification
            messageAlertSwal(
                "Delete Successful!",
                "Data has been deleted successfully.",
                "success"
            );
        } catch (error) {
            console.error("Error during deletion:", error);
            // Error notification
            messageAlertSwal(
                "Error!",
                "There was an issue processing your request. Please try again later.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportXls = () => {
        try {
            // Get the selected data
            const selectedData = getSelectedData();

            const filteredData = selectedData.map(({ RWNUM, ...rest }) => rest);

            // Check if there is data to export
            if (selectedData.length === 0) {
                showDynamicSweetAlert(
                    "No Data!",
                    "No rows selected for export.",
                    "info"
                );
                return;
            }

            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedData');

            // Generate a binary string representation of the workbook
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            // Create a Blob from the binary string
            const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

            // Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(data);
            link.download = `COA-${getDateTime()}.xlsx`
            link.click();
            // Notify user of successful export
            messageAlertSwal(
                "Export Successful!",
                "Data has been exported successfully.",
                "success"
            );
        } catch (error) {
            console.error("Error during export:", error);
            // Error notification
            messageAlertSwal(
                "Error!",
                "There was an issue processing your request. Please try again later.",
                "error"
            );
        }
    };

    return (
        <div>
            <div className="card card-default">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            {/* <div className="col-md-12 d-flex align-items-center">
                                <div className="row-per-page-label" style={{ whiteSpace: "nowrap" }}>
                                    Rows per page:
                                </div>
                                <select
                                    style={{ margin: "5px" }}
                                    id="pageSizeSelect"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="form-form-select form-select-sm"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div> */}
                        </div>
                        <div className="col-md-8 d-flex justify-content-end align-items-center">
                            <div className="btn-group ml-2">
                                <button type="button" className="btn btn-default" onClick={handleRefresh}>
                                    <FaSyncAlt />
                                </button>
                                <button type="button" className="btn btn-default" onClick={() => setShowModal(true)}>
                                    <FaAddressBook /> Add New
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${isFilterOpen ? "btn-secondary" : "btn-default"}`}
                                    onClick={handleFilterToggle}
                                >
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
                                <select
                                    className="form-control"
                                    value={filterColumn}
                                    onChange={(e) => setFilterColumn(e.target.value)}
                                >
                                    <option value="">Select a column</option>
                                    <option value="CODE">Code</option>
                                    <option value="NAME">Name</option>
                                    <option value="TYPE">Type</option>
                                    <option value="NORMAL_BALANCE_POSITION">Normal Balance Position</option>
                                    <option value="DESCRIPTION">Description</option>
                                    <option value="IS_PARENT">Is Parent</option>
                                    <option value="PARENT_CODE_ID">Parent Code ID</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <select
                                    className="form-control"
                                    value={filterOperation}
                                    onChange={(e) => setFilterOperation(e.target.value)}
                                >
                                    <option value="">Select filter</option>
                                    <option value="EQUAL">Equal</option>
                                    <option value="NOTEQUAL">Not Equal</option>
                                    <option value="LIKE">Contains</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter value"
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                />
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
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div></div>
                        <div>
                            {/* Tombol Edit */}
                            <button
                                className="btn btn-primary btn-sm mr-3"

                                onClick={() => {
                                    const selectedData = getSelectedData();
                                    console.log("selectedData", selectedData);

                                    if (selectedData.length > 1) {
                                        Swal.fire({
                                            icon: "warning",
                                            title: "Warning",
                                            text: "You can only edit one record at a time. Please select only one record.",
                                        });
                                    } else if (selectedData.length === 1) {
                                        console.log("selectedData", selectedData);
                                        handleEdit(selectedData); // Pass single selected row to handleShowModal
                                    }
                                    // Lanjutkan dengan logika yang diinginkan (misalnya, mengedit data yang dipilih)
                                }}
                                disabled={selectedRows.size === 0}
                            >
                                <i className="fas fa-edit"></i> Edit
                            </button>


                            {/* Tombol Delete */}
                            <button
                                className="btn btn-danger btn-sm mr-3"
                                onClick={() => handleDeleteClick()}
                                disabled={selectedRows.size === 0}
                            >
                                <i className="fas fa-trash"></i> Delete
                            </button>

                            {/* Tombol Export */}
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleExportXls()}
                                disabled={selectedRows.size === 0}
                            >
                                <i className="fas fa-file-export"></i> Export
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.size === dataTable.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRows(new Set(dataTable.map(item => item.ID)));
                                                } else {
                                                    setSelectedRows(new Set());
                                                }
                                            }}
                                        />
                                    </th>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Normal Balance Position</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTreeTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
                <FormPagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
                <div>
                    {startIndex + 1} - {endIndex} of {totalItems}
                </div>
            </div>
            <AddCoaModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSaveCoa}
            />
            <EditCoaModal
                coaData={selectedEditCoa}
                show={showEditModal}
                handleClose={handleEditCloseModal}
                handleSave={handleEditCoa}
            />

            {isLoading && (
                <div className="full-screen-overlay">
                    <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                </div>
            )}
        </div>
    );
};

export default CoaTable;
