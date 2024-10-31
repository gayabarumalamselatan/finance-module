import React, { useState } from "react";
import FormPagination from "../utils/FormPagination";
import { NumericFormat } from "react-number-format";
import { FaAddressBook, FaFilter, FaSyncAlt } from "react-icons/fa";
import BondDetail from "./BondDetail";
import PurchaseInvoice from "../components/PurchaseInvoice";

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
    addingNewBond
}) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterOperation, setFilterOperation] = useState('');
    const [showAdditionalContent, setShowAdditionalContent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    const handleRowClick = (item) => {
      console.log('selecy', item);
      setSelectedRow(item);
        handleSelect(item);
        setShowAdditionalContent(false);
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

    const handleLoadDataClick = () => {
        setIsLoading(true); // Show loading indicator
        setTimeout(() => {
            setIsLoading(false); // Hide loading indicator after 2 seconds
            setShowAdditionalContent(true); // Show additional content
        }, 1000); // 2 seconds delay // Display additional content when button is clicked
    };
    console.log('data', selectedRow);
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
                                    <option value="DESCRIPTION">Description</option>
                                    <option value="ISSUER">Issuer</option>
                                    <option value="ISSUE_DATE">Issue Date</option>
                                    <option value="MATURITY_DATE">Maturity Date</option>
                                    <option value="CURRENCY">Currency</option>
                                    <option value="ISSUE_AMOUNT">Issue Amount</option>
                                    <option value="FACE_AMOUNT">Face Amount</option>
                                    <option value="ISSUE_QTY">Issue Qty</option>
                                    <option value="ISSUE_PRICE">Issue Price</option>
                                    <option value="REDEMPTION_PRICE">Redemption Price</option>
                                    <option value="COUPON_TYPE">Coupon Type</option>
                                    <option value="RATE_CODE">Rate Code</option>
                                    <option value="COUPON_RATE">Coupon Rate</option>
                                    <option value="COUPON_FREQ">Coupon Freq</option>
                                    <option value="AFTER_BEFORE_HOLIDAY">After Before Holiday</option>
                                    <option value="BASIS">Basis</option>
                                    <option value="ISIN_CODE">ISIN Code</option>
                                    <option value="BI_CODE">BI Code</option>
                                    <option value="CODE1">Code1</option>
                                    <option value="CODE2">Code2</option>
                                    <option value="RATING">Rating</option>
                                    <option value="RATING_SOURCE">Rating Source</option>
                                    <option value="PRODUCT">Product</option>
                                    <option value="PRODUCT_TYPE">Product Type</option>
                                    <option value="STATUS_BOND">Status Bond</option>
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
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th>Issuer</th>
                                    <th>Issue Date</th>
                                    <th>Maturity Date</th>
                                    <th>Currency</th>
                                    <th>Issue Amount</th>
                                    <th>Face Amount</th>
                                    <th>Issue Qty</th>
                                    <th>Issue Price</th>
                                    <th>Redemption Price</th>
                                    <th>Coupon Type</th>
                                    <th>Rate Code</th>
                                    <th>Coupon Rate</th>
                                    <th>Coupon Freq</th>
                                    <th>After Before Holiday</th>
                                    <th>Basis</th>
                                    <th>ISIN Code</th>
                                    <th>BI Code</th>
                                    <th>Code1</th>
                                    <th>Code2</th>
                                    <th>Rating</th>
                                    <th>Rating Source</th>
                                    <th>Product</th>
                                    <th>Product Type</th>
                                    <th>Status Bond</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingTable ? (
                                    <tr>
                                        <td colSpan="26">
                                            <div className="text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    dataTable.map((item, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => handleRowClick(item.INVOICE_NUMBER)}
                                            className={selectedRow === item ? "table-success" : ""}
                                        >
                                            <td>{item.CODE}</td>
                                            <td>{item.DESCRIPTION}</td>
                                            <td>{item.ISSUER}</td>
                                            <td>{item.ISSUE_DATE}</td>
                                            <td>{item.MATURITY_DATE}</td>
                                            <td>{item.CURRENCY}</td>
                                            <td className="text-right">
                                                <NumericFormat
                                                    value={item.ISSUE_AMOUNT}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    decimalScale={4}
                                                    fixedDecimalScale
                                                />
                                            </td>
                                            <td className="text-right">
                                                <NumericFormat
                                                    value={item.FACE_AMOUNT}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    decimalScale={4}
                                                    fixedDecimalScale
                                                />
                                            </td>
                                            <td className="text-right">
                                                <NumericFormat
                                                    value={item.ISSUE_QTY}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    decimalScale={4}
                                                    fixedDecimalScale
                                                />
                                            </td>
                                            <td className="text-right">{item.ISSUE_PRICE}</td>
                                            <td className="text-right">{item.REDEMPTION_PRICE}</td>
                                            <td>{item.COUPON_TYPE}</td>
                                            <td>{item.RATE_CODE}</td>
                                            <td className="text-right">
                                                <NumericFormat
                                                    value={item.COUPON_RATE}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    decimalScale={8}
                                                    fixedDecimalScale
                                                />
                                            </td>
                                            <td>{item.COUPON_FREQ}</td>
                                            <td>{item.AFTER_BEFORE_HOLIDAY}</td>
                                            <td>{item.BASIS}</td>
                                            <td>{item.ISIN_CODE}</td>
                                            <td>{item.BI_CODE}</td>
                                            <td>{item.CODE1}</td>
                                            <td>{item.CODE2}</td>
                                            <td>{item.RATING}</td>
                                            <td>{item.RATING_SOURCE}</td>
                                            <td>{item.PRODUCT}</td>
                                            <td>{item.PRODUCT_TYPE}</td>
                                            <td>{item.STATUS_BOND}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    {selectedRow && (
                        <div className="d-flex justify-content-left mt-3">
                            <button className="btn btn-primary" onClick={handleLoadDataClick}>
                                Load Data
                            </button>
                        </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                        </div>
                        <FormPagination
                            totalItems={totalItems}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>

                </div>
            </div>

            {showAdditionalContent && (
                <BondDetail 
                selectedRow={selectedRow}
                />
            )}
            {isLoading && (
                <div className="full-screen-overlay">
                    <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                </div>
            )}
        </div>
    );
};

export default PurchaseInvoiceTable;