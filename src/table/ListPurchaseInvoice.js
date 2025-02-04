import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { CgAlignBottom } from "react-icons/cg";
import { GrAction } from "react-icons/gr";
import LookupParamService from "../service/LookupParamService";
import { getBranch, getToken } from "../config/Constant";
import { DisplayFormat } from "../utils/DisplayFormat";
import { Table } from "react-bootstrap";
import LookupService from "../service/LookupService";
import UserService from "../service/UserService";

const ListPurchaseInvoice = ({ selectedRow, onClose }) => {
  const branchId = getBranch();
  const authToken = getToken();
  const userId = sessionStorage.getItem("userId");
  const idUser = sessionStorage.getItem("id");
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [selectedRowDataItem, setSelectedRowDataItem] = useState([]);
  const [bondPairData, setBondPairData] = useState([]);
  const [bondPosData, setBondPosData] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const [bondPairDataItem, setBondPairDataItem] = useState([]); // Add this line
  const [tax_ppn_royalty_option, setTaxPpnRoyaltyOption] = useState([]);
  const [tax_pph_type_option, setTax_Pph_Type_Option] = useState([]);
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState([]);
  const [taxTypeIncludeOptions, setTaxTypeIncludeOptions] = useState([]);
  const [taxTypeExcludeOptions, setTaxTypExcludeeOptions] = useState([]);
  const [taxTypeIncludepphOptions, setTaxTypeIncludePphOptions] = useState([]);
  const [taxTypeExcludepphOptions, setTaxTypExcludeePphOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [contractNumberOptions, setContractNumberOptions] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
  const [allvendoroptions, setAllVendorOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedbothvendor, setSelectedBothVendor] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [core_user_options, setCoreUserOptions] = useState([]);

  const create_by_id = parseInt(idUser);

  console.log("Selected row:", selectedRow);

  // Get bond code from selectedRow
  const bondCode = selectedRow || "";

  console.log("wdqdqwd", selectedRow);

  useEffect(() => {
    console.log("Selected row:", selectedRow);
    if (selectedRow) {
      fetchSchedulePaymentData(selectedRow);
      fetchBondPairData(selectedRow);
    }
  }, [selectedRow]);

  const handleCardClose = () => {
    setIsListVisible(false); // Hide the ListPurchaseInvoice when close button is clicked

    setSelectedRowData(null); // Optionally reset selected row data
  };

  const fetchSchedulePaymentData = (selectedRow, selectedData) => {
    console.log("Fetching schedule payment data for:", selectedRow);

    // Construct the URL for the main invoice data
    let url = `PURC_FORMPUINVC&filterBy=INVOICE_NUMBER&filterValue=${selectedRow.INVOICE_NUMBER}&operation=EQUAL`;
    console.log("Fetching data from URL:", url);

    // Lookup Payment Term
    LookupParamService.fetchLookupDataView("MSDT_FORMPYTM", authToken, branchId)
      .then((data) => {
        console.log("Payment term lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const options = transformedData.map((item) => ({
          value: item.COUNT,
          label: item.NAME,
          dateType: item.DATE_TYPE,
          id: item.ID,
        }));

        setPaymentTermOptions(options);

        // const selectPaymentTermOption = options.find((option) => option.id === selectedData[0].PAYMENT_TERM_ID) || "";
        // setSelectedPaymentTerm(selectPaymentTermOption);
        // console.log("Selected payment option:", selectedPaymentTerm);
      })
      .catch((error) => {
        console.error("Failed to fetch payment term lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMCUST", authToken, branchId)
      .then((data) => {
        console.log("Vendor lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const allOptions = transformedData.map((item) => ({
          id: item.ID,
          value: item.NAME,
          label: item.NAME,
        }));
        setAllVendorOptions(allOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch vendor lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          id: item.ID,
          value: item.CODE,
          label: item.CODE,
        }));
        setCurrencyOptions(options);
        const selectedCurrencyOption =
          options.find((option) => option.value === currency) || null;
        setSelectedCurrency(selectedCurrencyOption || null);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    UserService.fetchAllUser(authToken)
      .then((data) => {
        console.log("Usere:", JSON.stringify(data, null, 2)); // Log the entire response

        // Check if the users array is defined
        if (data && Array.isArray(data.users)) {
          const transformedData = data.users.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          );

          const options = transformedData.map((item) => ({
            id: item.ID,
            value: item.USERNAME,
            label: item.USERNAME,
          }));

          // Create a Map for quick lookup
          const userMap = new Map(
            options.map((option) => [option.id, option.label])
          );
          console.log("userr", authToken);
          setCoreUserOptions(userMap); // Store the Map instead of an array
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user lookup:", error);
      });

    LookupService.fetchLookupData(url, authToken, branchId)
      .then((data) => {
        if (!data || !data.data) {
          console.error("Unexpected data format:", data);
          return;
        }
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
        // Optionally, display an error message to the user
      });

    // Construct the URL for the invoice details
    let urlD = `PURC_FORMPUINVCD&filterBy=INVOICE_NUMBER&filterValue=${selectedRow.INVOICE_NUMBER}&operation=EQUAL`;
    console.log("Fetching data from URL for details:", urlD);

    LookupParamService.fetchLookupDataView("MSDT_FORMTAX", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData
          .filter((item) => item.TAX_TYPE === "PPh")
          .map((item) => ({
            id: item.ID,
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            tax_account: item.TAX_ACCOUNT,
            coa_id: item.coa_id,
          }));
        setTax_Pph_Type_Option(options);

        const optionsPpn = transformedData
          .filter((item) => item.TAX_TYPE === "PPN")
          .map((item) => ({
            id: item.ID,
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            tax_account: item.TAX_ACCOUNT,
            coa_id: item.coa_id,
          }));
        setTaxPpnTypeOption(optionsPpn);

        const IncludeOptions = transformedData
          .filter(
            (item) =>
              item.TAX_TYPE === "PPN" &&
              item.BASE_TAX_FLAG === true &&
              (item.TAX_TYPE_USE === "Purchase" ||
                item.TAX_TYPE_USE === "All") &&
              item.ACTIVE === true
          )
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            tax_account: item.TAX_ACCOUNT,
            coa_id: item.coa_id,
            id: item.ID,
          }));
        setTaxTypeIncludeOptions(IncludeOptions);

        const ExcludeOptions = transformedData
          .filter(
            (item) =>
              item.TAX_TYPE === "PPN" &&
              item.BASE_TAX_FLAG === false &&
              (item.TAX_TYPE_USE === "Purchase" ||
                item.TAX_TYPE_USE === "All") &&
              item.ACTIVE === true
          )
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            tax_account: item.TAX_ACCOUNT,
            coa_id: item.coa_id,
            id: item.ID,
          }));
        setTaxTypExcludeeOptions(ExcludeOptions);

        const IncludepphOptions = transformedData
          .filter(
            (item) =>
              item.TAX_TYPE === "PPh" &&
              item.BASE_TAX_FLAG === true &&
              (item.TAX_TYPE_USE === "Purchase" ||
                item.TAX_TYPE_USE === "All") &&
              item.ACTIVE === true
          )
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            tax_account: item.TAX_ACCOUNT,
            coa_id: item.coa_id,
            id: item.ID,
          }));
        setTaxTypeIncludePphOptions(IncludepphOptions);

        const ExcludepphOptions = transformedData
          .filter(
            (item) =>
              item.TAX_TYPE === "PPh" &&
              item.BASE_TAX_FLAG === false &&
              (item.TAX_TYPE_USE === "Purchase" ||
                item.TAX_TYPE_USE === "All") &&
              item.ACTIVE === true
          )
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            tax_account: item.TAX_ACCOUNT,
            coa_id: item.coa_id,
            id: item.ID,
          }));
        setTaxTypExcludeePphOptions(ExcludepphOptions);

        const optionsPpnRoyalty = transformedData
          .filter((item) => item.TAX_TYPE === "PPN" && item.ROYALTY === true)
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            tax_account: item.TAX_ACCOUNT,
            coa_id: item.coa_id,
          }));
        setTaxPpnRoyaltyOption(optionsPpnRoyalty);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    // Fetch product data
    LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
      .then((data) => {
        console.log("COA lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const productOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
          id: item.ID,
        }));
        setProductOptions(productOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch COA lookup:", error);
      });

    // Lookup Department
    LookupParamService.fetchLookupDataView("MSDT_FORMDPRT", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          id: item.ID,
          value: item.NAME,
          label: item.NAME,
        }));
        setDepartementOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    // buat project dll
    LookupParamService.fetchLookupDataView("MSDT_FORMPRJT", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
          customer: item.CUSTOMER,
          contract_number: item.CONTRACT_NUMBER,
          id: item.ID,
        }));

        const optionsCustomer = transformedData.map((item) => ({
          id: item.ID,
          value: item.CUSTOMER,
          label: item.CUSTOMER,
        }));
        const contractNumOptions = transformedData.map((item) => ({
          value: item.CONTRACT_NUMBER,
          label: item.CONTRACT_NUMBER,
        }));
        setProjectOptions(options);
        setCustomerOptions(optionsCustomer);
        setContractNumberOptions(contractNumOptions);
        console.log("custop", optionsCustomer);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupService.fetchLookupData(urlD, authToken, branchId)
      .then((data) => {
        if (!data || !data.data) {
          console.error("Unexpected data format for details:", data);
          return;
        }
        console.log("Schedule payment detail data:", data);
        const transformedDataItem = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        console.log("Transformed detail data:", transformedDataItem);
        setSelectedRowDataItem(transformedDataItem);
      })
      .catch((error) => {
        console.error("Failed to fetch schedule payment detail data:", error);
        // Optionally, display an error message to the user
      });
  };

  const fetchBondPairData = (bond) => {
    let url = `VOUC_FORMVCBANK&filterBy=VOUCHER_NUMBER&filterValue=${selectedRow.INVOICE_NUMBER}&operation=EQUAL`;
    console.log("Fetching data from URL:", url);

    LookupParamService.fetchLookupData(url, authToken, branchId)
      .then((data) => {
        if (!data || !data.data) {
          console.error("Unexpected data format:", data);
          return;
        }
        console.log("Bond pair data:", data);
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        console.log("Transformed bond pair data:", transformedData);
        setBondPairData(transformedData);
      })
      .catch((error) => {
        console.error("Failed to fetch bond pair data:", error);
      });

    let urlD = `VOUC_FORMVCBANKD&filterBy=VOUCHER_NUMBER&filterValue=${selectedRow.INVOICE_NUMBER}&operation=EQUAL`;

    console.log("Fetching data from URL for details:", urlD);

    LookupParamService.fetchLookupData(urlD, authToken, branchId)

      .then((data) => {
        if (!data || !data.data) {
          console.error("Unexpected data format for details:", data);

          return;
        }

        console.log("Bond pair detail data:", data);

        const transformedDataItem = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];

            return acc;
          }, {})
        );

        console.log("Transformed bond pair detail data:", transformedDataItem);

        setBondPairDataItem(transformedDataItem); // Change this line to use bondPairDataItem
      })

      .catch((error) => {
        console.error("Failed to fetch bond pair detail data:", error);
      });
  };

  const fetchBondPosData = (bond) => {
    let url = `TRY_FORMBONDPOS&filterBy=BOND_CODE&filterValue=${bond}&operation=EQUAL&viewOnly=true&sortBy=ID&sortOperation=ASC`;
    LookupParamService.fetchLookupData(`${url}`, authToken, branchId)
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

  // buat jurnal
  const fetchJurnal = (selectedRow) => {
    console.log("Fetching schedule payment data for:", selectedRow);

    // Construct the URL for the main invoice data
    let url = `PURC_FORMPUINVC&filterBy=INVOICE_NUMBER&filterValue=${selectedRow.INVOICE_NUMBER}&operation=EQUAL`;
    console.log("Fetching data from URL:", url);

    LookupParamService.fetchLookupData(url, authToken, branchId)
      .then((data) => {
        if (!data || !data.data) {
          console.error("Unexpected data format:", data);
          return;
        }
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
        // Optionally, display an error message to the user
      });

    // Construct the URL for the invoice details
    let urlD = `PURC_FORMPUINVCD&filterBy=INVOICE_NUMBER&filterValue=${selectedRow.INVOICE_NUMBER}&operation=EQUAL`;
    console.log("Fetching data from URL for details:", urlD);

    LookupParamService.fetchLookupData(urlD, authToken, branchId)
      .then((data) => {
        if (!data || !data.data) {
          console.error("Unexpected data format for details:", data);
          return;
        }
        console.log("Schedule payment detail data:", data);
        const transformedDataItem = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        console.log("Transformed detail data:", transformedDataItem);
        setSelectedRowDataItem(transformedDataItem);
      })
      .catch((error) => {
        console.error("Failed to fetch schedule payment detail data:", error);
        // Optionally, display an error message to the user
      });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to get the name by ID
  const getTaxNameById = (id, taxOptions = []) => {
    if (!Array.isArray(taxOptions)) {
      console.error("taxOptions should be an array");
      return id; // Return the id if taxOptions is not an array
    }

    const taxOption = taxOptions.find((option) => option.id === id);
    return taxOption ? taxOption.label : id; // Return the label if found, otherwise return the id
  };

  const getCustomerByProjectId = (projectId, projectOptions) => {
    const project = projectOptions.find((option) => option.id === projectId);
    return project ? project.customer : "N/A"; // Return 'N/A' if no customer is found
  };

  const getUserNameById = (id, userMap) => {
    if (!(userMap instanceof Map)) {
      console.error("userMap should be a Map");

      return id; // Return the id if userMap is not a Map
    }

    console.log("User  Map contents:", Array.from(userMap.entries())); // Log the entire map

    console.log("id user to display:", id); // Debugging statement

    const userLabel = userMap.get(id); // Get the label from the map using the id

    console.log("User  found:", userLabel); // Debugging statement

    return userLabel ? userLabel : id; // Return the label if found, otherwise return the id
  };

  // Buat project_contracut_number berdasarkan id dari si project
  // const getCustomerByProjectId = (projectId, projectOptions) => {
  //   const project = projectOptions.find((option) => option.id === projectId);
  //   return project ? { customer: project.customer, contractNumber: project.contract_number } : { customer: "N/A", contractNumber: "N/A" }; // Return 'N/A' if no project is found
  // };

  return (
    <div className="card">
      <div className="card-body">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => handleTabChange("schedule")}
            >
              <CgAlignBottom /> Invoice Number
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "jurnal" ? "active" : ""}`}
              onClick={() => handleTabChange("jurnal")}
            >
              <CgAlignBottom /> Journal
            </button>
          </li>
          {/* <li className="nav-item">
            <button className={`nav-link ${activeTab === "pair" ? "active" : ""}`} onClick={() => handleTabChange("pair")}>
              <CgAlignBottom /> Inquiry Purchase Invoice
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "pos" ? "active" : ""}`} onClick={() => handleTabChange("pos")}>
              <CgAlignBottom /> Voucher Payment Petty Cash
            </button>
          </li> */}
        </ul>
        {activeTab === "schedule" && (
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">View Purchase Invoice</h5>
              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="card-body">
              {selectedRowData.length > 0 ? (
                <div>
                  <div className="container">
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Invoice Number:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].INVOICE_NUMBER}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Invoice Date:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].INVOICE_DATE}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Doc Reference:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].DOC_REFF}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Payment Term:
                      </div>
                      <div className="col-md-8">
                        {getTaxNameById(
                          selectedRowData[0].PAYMENT_TERM_ID,
                          paymentTermOptions
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Due Date:</div>
                      <div className="col-md-8">
                        {selectedRowData[0].DUE_DATE}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Term Of Payment:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].TERM_OF_PAYMENT}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Tax Exchange Rate:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].TAX_EXCHANGE_RATE}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Invoice Status:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].INVOICE_STATUS}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Created By:
                      </div>
                      <div className="col-md-8">
                        {" "}
                        {getUserNameById(
                          selectedRowData[0].CREATE_BY_ID,
                          core_user_options
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Vendor:</div>
                      <div className="col-md-8">
                        {getTaxNameById(
                          selectedRowData[0].VENDOR_ID,
                          allvendoroptions
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Cod, Cor, And SKB:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].COD_COR_SKB}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Currency:</div>
                      <div className="col-md-8">
                        {getTaxNameById(
                          selectedRowData[0].CURRENCY_ID,
                          currencyOptions
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Discount:</div>
                      <div className="col-md-8">
                        {selectedRowData[0].DISCOUNT}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Total Amount:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].TOTAL_AMOUNT}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Description:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].DESCRIPTION}
                      </div>
                    </div>
                  </div>
                  {/* Add more fields as needed */}
                  <div
                    className="table-responsive"
                    style={{ overflowX: "auto" }}
                  >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Invoice Number</th>
                          <th>Document Referance Number</th>
                          <th>Document Referance Source</th>
                          <th>Invoice Number Vendor</th>
                          <th>Project</th>
                          <th>Project Contract Number</th>
                          <th>Customer</th>
                          <th>Departement</th>
                          <th>Product</th>
                          <th>Product Note</th>
                          <th>Tax Exchange Rate</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                          <th>Total Price IDR</th>
                          <th>Type Of VAT</th>
                          {/* <th>Tax PPN</th> */}
                          <th>Tax PPN</th>
                          <th>Tax PPN Rate %</th>
                          {/* <th>Tax PPN Amount</th> */}
                          {/* <th>Tax PPh</th> */}
                          <th>Tax PPh Type</th>
                          <th>Tax PPh</th>
                          <th>Tax PPh Rate %</th>
                          {/* <th>Tax PPh Amount</th> */}
                          <th>Tax Base</th>
                          <th>Tax PPN Amount</th>
                          <th>Tax PPh Amount</th>
                          {/* <th>Total Amount</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRowDataItem.length > 0 ? (
                          selectedRowDataItem
                            .sort((a, b) => a.ID - b.ID) // Sort by ID in ascending order
                            .map((detail) => (
                              <tr key={detail.ID}>
                                <td>{detail.INVOICE_NUMBER}</td>
                                <td>{detail.DOC_REFF_NO}</td>
                                <td>{detail.DOC_SOURCE}</td>
                                <td>{detail.INVOICE_NUMBER_VENDOR}</td>
                                <td>
                                  {getTaxNameById(
                                    detail.PROJECT_ID,
                                    projectOptions
                                  )}
                                </td>
                                <td>{detail.PROJECT_CONTRACT_NUMBER}</td>
                                <td>
                                  {getCustomerByProjectId(
                                    detail.PROJECT_ID,
                                    projectOptions
                                  )}
                                </td>{" "}
                                {/* Manggil customer_id berdasarkan project_id */}
                                <td>
                                  {getTaxNameById(
                                    detail.DEPARTMENT_ID,
                                    departementOptions
                                  )}
                                </td>
                                <td>
                                  {getTaxNameById(
                                    detail.PRODUCT_ID,
                                    productOptions
                                  )}
                                </td>
                                <td>{detail.PRODUCT_NOTE}</td>
                                <td>{detail.TAX_EXCHANGE_RATE}</td>
                                <td>{detail.QUANTITY}</td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.UNIT_PRICE)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.TOTAL_PRICE)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.TOTAL_PRICE_IDR)}
                                </td>
                                <td>{detail.TYPE_OF_VAT}</td>
                                <td>
                                  {getTaxNameById(
                                    detail.TAX_PPN_ID,
                                    taxPpnTypeOption
                                  )}
                                </td>
                                <td>{detail.TAX_PPN_RATE}</td>
                                <td>{detail.TYPE_OF_PPH}</td>
                                <td>
                                  {getTaxNameById(
                                    detail.TAX_PPH_ID,
                                    tax_pph_type_option
                                  )}
                                </td>
                                <td>{detail.TAX_PPH_RATE}</td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.TAX_BASE)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.TAX_PPN_AMOUNT)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.TAX_PPH_AMOUNT)}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="27" className="text-center">
                              No data selected.
                            </td>
                          </tr>
                        )}
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
        {activeTab === "jurnal" && (
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Journal</h5>
              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="card-body">
              {selectedRowData.length > 0 ? (
                <div>
                  <div className="container">
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Journal Number:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].INVOICE_NUMBER}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Posting Date:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].INVOICE_DATE}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Type:</div>
                      <div className="col-md-8">{selectedRowData[0].TYPE}</div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Period</div>
                      <div className="col-md-8">
                        {selectedRowData[0].PERIOD}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Currency:</div>
                      <div className="col-md-8">
                        {selectedRowData[0].CURRENCY}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Exchange Rate:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].TAX_EXCHANGE_RATE}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Vendor:</div>
                      <div className="col-md-8">
                        {selectedRowData[0].VENDOR}
                      </div>
                    </div>
                  </div>
                  {/* Add more fields as needed */}
                  <div
                    className="table-responsive"
                    style={{ overflowX: "auto" }}
                  >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Code/Name Account</th>
                          <th>Description</th>
                          <th>Discharge (IDR)</th>
                          <th>Credit (IDR)</th>
                          <th>Discharge</th>
                          <th>Credit</th>
                          <th>Currency</th>
                          <th>Exchange Rate</th>
                          <th>Invoice Number</th>
                          <th>Project</th>
                          <th>Departement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRowDataItem.length > 0 ? (
                          selectedRowDataItem
                            .sort((a, b) => a.ID - b.ID) // Sort by ID in ascending order
                            .map((detail) => (
                              <tr key={detail.ID}>
                                <td>{detail.ACCOUNT_CODE}</td>
                                <td>{detail.DESCRIPTION}</td>
                                <td>{detail.DISCHARGE_IDR}</td>
                                <td>{detail.CREDIT_IDR}</td>
                                <td>{detail.DISCHARGE}</td>
                                <td>{detail.CREDIT}</td>
                                <td>{detail.CURRENCY}</td>
                                <td>{detail.EXCHANGE_RATE}</td>
                                <td>{detail.INVOICE_NUMBER}</td>
                                <td>{detail.PROJECT}</td>
                                <td>{detail.DEPARTEMENT}</td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="27" className="text-center">
                              No data selected.
                            </td>
                          </tr>
                        )}
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
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">View Voucher Payment Bank</h5>
              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="card-body">
              {bondPairData.length > 0 ? (
                <div>
                  <div className="container">
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Voucher Number:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].VOUCHER_NUMBER}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Payment Source:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].PAYMENT_SOURCE}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Bank Account Number:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].BANK_ACCOUNT_NUMBER}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Paid To:</div>
                      <div className="col-md-8">
                        {selectedRowData[0].PAID_TO}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Voucher Status:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].VOUCHER_STATUS}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        IDR Amount:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].IDR_AMOUNT}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Voucher Date:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].VOUCHER_DATE}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">BANK:</div>
                      <div className="col-md-8">{selectedRowData[0].BANK}</div>
                    </div>

                    {/* <div className="row mb-3">
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
              </div> */}

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Check Number/Giro Number:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].CHECK_NUMBER}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Exchange Rate Bank:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].EXCHANGE_RATE_BANK}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Total Amount:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].TOTAL_AMOUNT}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Description:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].DESCRIPTION}
                      </div>
                    </div>
                  </div>
                  {/* Add more fields as needed */}
                  <div
                    className="table-responsive"
                    style={{ overflowX: "auto" }}
                  >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Purchase Invoice Number</th>
                          <th>Purchase Invoice Date</th>
                          <th>Code/Account</th>
                          <th>Product</th>
                          <th>Description</th>
                          <th>Tax Invoice Number Vendor</th>
                          <th>Db/Cr</th>
                          <th>Vendor</th>
                          <th>Project</th>
                          <th>Project Contract Number</th>
                          <th>Customer</th>
                          <th>Department</th>
                          <th>Employee</th>
                          {/* <th>Tax Invoice Number</th> */}
                          <th>Amount</th>
                          <th>Currency</th>
                          <th>Exchange Rate</th>
                          {/* <th>Kurs Deal</th> */}
                          <th hidden>Amount IDR</th>
                          {/* <th>Type of VAT</th> */}
                          <th>Tax PPN</th>
                          <th>Amount PPN</th>
                          {/* <th>Total Amount PPN in IDR</th> */}
                          <th>Tax PPh</th>
                          <th>Amount PPh</th>
                          {/* <th>PPh 2</th> */}
                          {/* <th>Total Amount PPh 2</th> */}
                          <th>Total Tax Base</th>
                          <th>Total Amount to be Paid</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bondPairDataItem.length > 0 ? (
                          bondPairDataItem
                            .sort((a, b) => a.ID - b.ID) // Sort by ID in ascending order
                            .map((detail) => (
                              <tr key={detail.ID}>
                                <td>{detail.PURCHASE_INVOICE_NUMBER}</td>
                                <td>{detail.PURCHASE_INVOICE_DATE}</td>
                                <td>{detail.CODE}</td>
                                <td>{detail.DESCRIPTION}</td>
                                <td>{detail.PURCHASE_INVOICE_NOTE}</td>
                                <td>{detail.TAX_INVOICE_NUMBER}</td>
                                <td>{detail.DEBIT_CREDIT}</td>
                                <td>{detail.VENDOR}</td>
                                <td>{detail.PROJECT}</td>
                                <td>{detail.PROJECT_CONTRACT_NUMBER}</td>
                                <td>{detail.CUSTOMER}</td>
                                <td>{detail.DEPARTEMENT}</td>
                                <td>{detail.EMPLOYEE}</td>
                                {/* <td>{detail.TAX_INVOICE_NUMBER}</td> */}
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.AMOUNT)}
                                </td>
                                <td>{detail.CURRENCY}</td>
                                <td>{detail.EXCHANGE_RATE}</td>
                                {/* <td>{detail.KURS_DEAL}</td> */}
                                <td hidden style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.AMOUNT_IDR)}
                                </td>
                                {/* <td>{detail.TYPE_OF_VAT}</td> */}
                                <td>{detail.TAX_PPN}</td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.AMOUNT_PPN)}
                                </td>
                                {/* <td style={{ textAlign: "right" }}>{DisplayFormat(detail.AMOUNT_PPN_IDR)}</td> */}
                                <td>{detail.TAX_PPH}</td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.AMOUNT_PPH)}
                                </td>
                                {/* <td>{detail.PPH_2}</td> */}
                                {/* <td style={{ textAlign: "right" }}>{DisplayFormat(detail.TOTAL_AMOUNT_PPH_2)}</td> */}
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.TOTAL_TAX_BASE)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(
                                    detail.TOTAL_AMOUNT_TO_BE_PAID
                                  )}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="15" className="text-center">
                              No data selected.
                            </td>
                          </tr>
                        )}
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
        {activeTab === "pos" && (
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">View Voucher Payment Petty Cash</h5>
              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="card-body">
              {selectedRowData.length > 0 ? (
                <div>
                  <div className="container">
                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Voucher Number:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].VOUCHER_NUMBER}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Paid To:</div>
                      <div className="col-md-8">
                        {selectedRowData[0].PAID_TO}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Voucher Date:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].VOUCHER_DATE}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Document Referance:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].DOC_REFF_NO}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Voucher Status:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].VOUCHER_STATUS}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">Amount:</div>
                      <div className="col-md-8">
                        {selectedRowData[0].AMOUNT}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4 font-weight-bold">
                        Description:
                      </div>
                      <div className="col-md-8">
                        {selectedRowData[0].DESCRIPTION}
                      </div>
                    </div>
                  </div>
                  {/* Add more fields as needed */}
                  <div
                    className="table-responsive"
                    style={{ overflowX: "auto" }}
                  >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          {/* <th>Document Reference</th> */}
                          <th>Document Reference Number</th>
                          <th>Code/Account Name</th>
                          <th>Description</th>
                          <th>Invoice Number</th>
                          <th>Db/Cr</th>
                          <th>Type of VAT</th>
                          <th>Vendor</th>
                          <th>Project</th>
                          <th>Project Contract Number</th>
                          <th>Customer</th>
                          <th>Department</th>
                          <th>Amount</th>
                          <th>PPH</th>
                          <th>Amount PPN</th>
                          <th>Amount PPh</th>
                          {/* <th>Total Amount PPh</th> */}
                          <th>Total To Be Paid</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRowDataItem.length > 0 ? (
                          selectedRowDataItem
                            .sort((a, b) => a.ID - b.ID) // Sort by ID in ascending order
                            .map((detail) => (
                              <tr key={detail.ID}>
                                {/* <td>{detail.DOC_REFF_NO}</td> */}
                                <td>{detail.DOC_REFF_NO}</td>
                                <td>{detail.ACCOUNT_NAME}</td>
                                <td>{detail.DESCRIPTION}</td>
                                <td>{detail.INVOICE_NUMBER}</td>
                                <td>{detail.DEBIT_CREDIT}</td>
                                <td>{detail.TYPE_OF_VAT}</td>
                                <td>{detail.VENDOR}</td>
                                <td>{detail.PROJECT}</td>
                                <td>{detail.PROJECT_CONTRACT_NUMBER}</td>
                                <td>{detail.CUSTOMER}</td>
                                <td>{detail.DEPARTMENT}</td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.AMOUNT)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.AMOUNT_PPH)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.AMOUNT_PPN)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.AMOUNT_PPH)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {DisplayFormat(detail.TOTAL_TO_BE_PAID)}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="15" className="text-center">
                              No data selected.
                            </td>
                          </tr>
                        )}
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
      </div>
    </div>
  );
};

export default ListPurchaseInvoice;
