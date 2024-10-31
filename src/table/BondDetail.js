import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { CgAlignBottom } from "react-icons/cg";
import { GrAction } from "react-icons/gr";
import LookupParamService from "../service/LookupParamService";
import { getBranch, getToken } from "../config/Constant";
import { DisplayFormat } from "../utils/DisplayFormat";
import { Table } from "react-bootstrap";

const BondDetail = ({ selectedRow }) => {
    const branchId = getBranch();
    const authToken = getToken();
    const [activeTab, setActiveTab] = useState("schedule");
    const [selectedRowData, setSelectedRowData] = useState([]);
    const [selectedRowDataItem, setSelectedRowDataItem] = useState([]);
    const [bondPairData, setBondPairData] = useState([]);
    const [bondPosData, setBondPosData] = useState([]);
    console.log("Selected row:", selectedRow);

    // Get bond code from selectedRow
    const bondCode = selectedRow || "";

    console.log('wdqdqwd', selectedRow);

    useEffect(() => {
        if (bondCode) {
            fetchSchedulePaymentData(selectedRow);
            // fetchBondPairData(bondCode);
            // fetchBondPosData(bondCode);
        }
    }, [bondCode]); // Add bondCode as a dependency

    const fetchSchedulePaymentData = (selectedRow) => {
      console.log('selectedrow',selectedRow);
        let url = `PURC_FORMPUINVC&filterBy=INVOICE_NUMBER&filterValue=${selectedRow}&operation=EQUAL`;
        LookupParamService.fetchLookupData(
            `${url}`,
            authToken,
            branchId
        )
            .then((data) => {
                console.log("Schedule payment data:", data);
                const transformedData = data.data.map((item) =>
                    Object.keys(item).reduce((acc, key) => {
                        acc[key.toUpperCase()] = item[key];
                        return acc;
                    }, {})
                );
                console.log("Transformed data:", transformedData);
                setSelectedRowData(transformedData);
            })
            .catch((error) => {
                console.error("Failed to fetch schedule payment data:", error);
            });

        let urlD = `PURC_FORMPUINVCD&filterBy=INVOICE_NUMBER&filterValue=${selectedRow}&operation=EQUAL`;
        LookupParamService.fetchLookupData(
            `${urlD}`,
            authToken,
            branchId
        )
            .then((data) => {
                console.log("Schedule payment data:", data);
                const transformedDataItem = data.data.map((item) =>
                    Object.keys(item).reduce((acc, key) => {
                        acc[key.toUpperCase()] = item[key];
                        return acc;
                    }, {})
                );
                console.log("Transformed data:", transformedDataItem);
                setSelectedRowDataItem(transformedDataItem);
            })
            .catch((error) => {
                console.error("Failed to fetch schedule payment data:", error);
            });
    };

    const fetchBondPairData = (bond) => {
        let url = `TRY_FORMBONDPAIR&filterBy=BOND_CODE&filterValue=${bond}&operation=EQUAL&viewOnly=true&sortBy=ID&sortOperation=ASC`;
        LookupParamService.fetchLookupData(
            `${url}`,
            authToken,
            branchId
        )
            .then((data) => {
                const transformedData = data.data.map((item) =>
                    Object.keys(item).reduce((acc, key) => {
                        acc[key.toUpperCase()] = item[key];
                        return acc;
                    }, {})
                );
                console.log("Transformed data:", transformedData);
                setSelectedRowData(transformedData);
            })
            .catch((error) => {
                console.error("Failed to fetch bond pair data:", error);
            });
    };

    const fetchBondPosData = (bond) => {
        let url = `TRY_FORMBONDPOS&filterBy=BOND_CODE&filterValue=${bond}&operation=EQUAL&viewOnly=true&sortBy=ID&sortOperation=ASC`;
        LookupParamService.fetchLookupData(
            `${url}`,
            authToken,
            branchId
        )
            .then((data) => {
                const transformedData = data.data.map((item) =>
                    Object.keys(item).reduce((acc, key) => {
                        acc[key.toUpperCase()] = item[key];
                        return acc;
                    }, {})
                );
                console.log("Transformed data:", transformedData);
                setBondPosData(transformedData);
            })
            .catch((error) => {
                console.error("Failed to fetch bond position data:", error);
            });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="card">
            <div className="card-body">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "schedule" ? "active" : ""}`}
                            onClick={() => handleTabChange("schedule")}
                        >
                            <FaCalendarAlt /> Bond Schedule
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "pair" ? "active" : ""}`}
                            onClick={() => handleTabChange("pair")}
                        >
                            <GrAction /> Bond Pair
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "pos" ? "active" : ""}`}
                            onClick={() => handleTabChange("pos")}
                        >
                            <CgAlignBottom /> Bond Position
                        </button>
                    </li>
                </ul>
                {activeTab === "schedule" && (
                    <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">View Purchase Invoice</h5>
                      {/* <button type="button" className="close" onClick={handleCardClose}>
                        <span aria-hidden="true">&times;</span>
                      </button> */}
                    </div>
                    <div className="card-body">
                      {selectedRowData[0] ? (
                        <div>
                          <div className="container">
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Invoice Number:</div>
                              <div className="col-md-8">{selectedRowData[0].INVOICE_NUMBER}</div>
                            </div>
        
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Doc Reference:</div>
                              <div className="col-md-8">{selectedRowData[0].DOC_REFF}</div>
                            </div>
        
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Invoice Date:</div>
                              <div className="col-md-8">{selectedRowData[0].INVOICE_DATE}</div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Invoice Status:</div>
                              <div className="col-md-8">{selectedRowData[0].INVOICE_STATUS}</div>
                            </div>
        
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Payment Term:</div>
                              <div className="col-md-8">{selectedRowData[0].PAYMENT_TERM}</div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Due Date:</div>
                              <div className="col-md-8">{selectedRowData[0].DUE_DATE}</div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Term Of Payment:</div>
                              <div className="col-md-8">{selectedRowData[0].TERM_OF_PAYMENT}</div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Tax Rate:</div>
                              <div className="col-md-8">{selectedRowData[0].TAX_RATE}</div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Tax Invoice Number:</div>
                              <div className="col-md-8">{selectedRowData[0].TAX_INVOICE_NUMBER}</div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">BI Middle Rate:</div>
                              <div className="col-md-8">{selectedRowData[0].BI_MIDDLE_RATE}</div>
                            </div>
        
                            <div className="row mb-3">
                              <div className="col-md-4 font-weight-bold">Description:</div>
                              <div className="col-md-8">{selectedRowData[0].DESCRIPTION}</div>
                            </div>
                          </div>
                          {/* Add more fields as needed */}
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
                                {selectedRowDataItem.length > 0 ?
                                selectedRowDataItem
                                  .sort((a, b) => a.ID - b.ID) // Sort by ID in ascending order
                                  .map((detail) => (
                                    <tr key={detail.ID}>
                                      <td>{detail.INVOICE_NUMBER}</td>
                                      <td>{detail.PRODUCT}</td>
                                      <td>{detail.CURRENCY}</td>
                                      <td>{detail.QUANTITY}</td>
                                      <td style={{ textAlign: "right" }}>{DisplayFormat(detail.UNIT_PRICE)}</td>
                                      <td style={{ textAlign: "right" }}>{DisplayFormat(detail.TOTAL_PRICE)}</td>
                                      <td>{detail.PRODUCT_NOTE}</td>
                                      <td>{detail.TAX_PPN}</td>
                                      <td>{detail.TAX_PPN_RATE}</td>
                                      <td style={{ textAlign: "right" }}>{DisplayFormat(detail.TAX_PPN_AMOUNT)}</td>
                                      <td>{detail.TAX_PPH}</td>
                                      <td>{detail.TAX_PPH_RATE}</td>
                                      <td style={{ textAlign: "right" }}>{DisplayFormat(detail.TAX_PPH_AMOUNT)}</td>
                                      <td style={{ textAlign: "right" }}>{DisplayFormat(detail.TAX_BASE)}</td>
                                      <td>{detail.TYPE_OF_VAT}</td>
                                    </tr>
                                  ))
                                  :
                                  (
                                    <tr>
                                        <td colSpan="15" className="text-center">No data selected.</td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      ) : (
                        <p>No data selected.</p>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "pair" && (
                    <div>
                        <div className="my-4">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>BOND CODE</th>
                                            <th>CURRENCY</th>
                                            <th>PURCHASE ID</th>
                                            <th>PURCHASE AMOUNT</th>
                                            <th>PURCHASE ACCRUED INTEREST</th>
                                            <th>PURCHASE PROCEED AMOUNT</th>
                                            <th>PURCHASE TOTAL AMOUNT</th>
                                            <th>SALE ID</th>
                                            <th>SALE AMOUNT</th>
                                            <th>SALE PROCEED AMOUNT</th>
                                            <th>INVESTMENT TYPE</th>
                                            <th>LAST YEAR TOTAL AMORTIZATION</th>
                                            <th>DAILY AMORTIZATION</th>
                                            <th>GAIN/LOSS</th>
                                            <th>TRANSACTION TYPE</th>
                                            <th>CREATED AT</th>
                                            <th>UPDATED AT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bondPairData.length > 0 ? (
                                            bondPairData.map((bonPair, index) => (
                                                <tr key={index}>
                                                    <td>{bonPair.BOND_CODE}</td>
                                                    <td>{bonPair.CURRENCY}</td>
                                                    <td>{bonPair.PURCHASE_ID}</td>
                                                    <td className="text-right">{DisplayFormat(bonPair.PURCHASE_AMOUNT)}</td>
                                                    <td className="text-right">{DisplayFormat(bonPair.PURCHASE_ACCRUED_INTEREST)}</td>
                                                    <td className="text-right">{DisplayFormat(bonPair.PURCHASE_PROCEED_AMOUNT)}</td>
                                                    <td className="text-right">{DisplayFormat(bonPair.PURCHASE_TOTAL_AMOUNT)}</td>
                                                    <td>{bonPair.SALE_ID}</td>
                                                    <td className="text-right">{DisplayFormat(bonPair.SALE_AMOUNT)}</td>
                                                    <td className="text-right">{DisplayFormat(bonPair.SALE_PROCEED_AMOUNT)}</td>
                                                    <td>{bonPair.INVESTMENT_TYPE}</td>
                                                    <td className="text-right">{DisplayFormat(bonPair.LAST_YEAR_TOTAL_AMORT)}</td>
                                                    <td className="text-right">{DisplayFormat(bonPair.DAILY_AMORT)}</td>
                                                    <td className="text-right">{DisplayFormat(bonPair.GAIN_LOSS)}</td>
                                                    <td>{bonPair.TRANSACTION_TYPE}</td>
                                                    {/* <td>{format(new Date(bonPair.CREATED_AT), 'yyyy-MM-dd HH:mm:ss')}</td>
                                                    <td>{format(new Date(bonPair.UPDATED_AT), 'yyyy-MM-dd HH:mm:ss')}</td> */}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="17" className="text-center">Data not available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "pos" && (
                    <div>
                        <div className="my-4">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>BOND CODE</th>
                                            <th>INVESTMENT TYPE</th>
                                            <th>POSITION AMOUNT</th>
                                            <th>CREATED AT</th>
                                            <th>UPDATED AT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bondPosData.length > 0 ? (
                                            bondPosData.map((bondPos, index) => (
                                                <tr key={index}>
                                                    <td>{bondPos.BOND_CODE}</td>
                                                    <td>{bondPos.INVESTMENT_TYPE}</td>
                                                    <td>{DisplayFormat(bondPos.POSITION_AMOUNT)}</td>
                                                    {/* <td>{format(new Date(bondPos.CREATED_AT), 'yyyy-MM-dd HH:mm:ss')}</td>
                                                    <td>{format(new Date(bondPos.UPDATED_AT), 'yyyy-MM-dd HH:mm:ss')}</td> */}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="24" className="text-center">Data not available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BondDetail;