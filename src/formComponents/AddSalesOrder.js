import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Card, CardBody, CardHeader } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from "../service/InsertDataService";
import { getBranch, getToken } from "../config/Constant";
import { GENERATED_NUMBER } from "../config/ConfigUrl";
import { generateUniqueId } from "../service/GeneratedId";
import Select from "react-select";
import LookupParamService from "../service/LookupParamService";
import CreatableSelect from "react-select/creatable";

const AddSalesOrder = ({ setIsAddingNewSalesOrder, handleRefresh, index, item }) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem("userId");

  // Generate SO Number
  const generateSONumber = () => {
    const prefix = "SO";
    const year = new Date().getFullYear();
    const uniqueNumber = String(index || 1).padStart(5, "0"); // Default to 1 if index is undefined
    return `${prefix}/${year}/${uniqueNumber}`;
  };

  const [so_number, setSoNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [to_address, setToAddress] = useState("");
  const [SONumber] = useState(generateSONumber());
  const [project, setProject] = useState("");
  const [status_so, setStatus] = useState("DRAFT");
  const [order_date, setOrderDate] = useState("");
  const [project_period_startdate, setStartPeriod] = useState("");
  const [project_period_enddate, setEndPeriod] = useState("");
  const [currency, setCurrency] = useState("");
  const [loi_so_spk_contract, setContract] = useState("");
  const [payment_term, setPaymentTerm] = useState("");
  const [negotiation_rate, setNegotiationRate] = useState("");
  const [sales_person, setSalesPerson] = useState("");
  const [manager_person, setManagerPerson] = useState("");

  const [product, setProduct] = useState("");
  const [tax_ppn, setPPN] = useState("");
  const [tax_ppn_amount, setTotalAmountPpn] = useState("");
  const [type_of_vat, setTypeOfVat] = useState("");
  const [period_start, setPeriodStart] = useState("");
  const [period_end, setPeriodEnd] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit_price, setUnitPrice] = useState("");
  const [total_price, setTotalPrice] = useState("");

  const [pph1, setPph1] = useState("");
  const [totalAmountPph1, setTotalAmountPph1] = useState("");
  const [pph2, setPph2] = useState("");
  const [totalAmountPph2, setTotalAmountPph2] = useState("");
  const [totalAmountPaid, setTotalAmountPaid] = useState("");
  const [department, setDepartment] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [totalAmountDpp, setTotalAmountDpp] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [description, setDescription] = useState("");
  const { doc_reff, setDocReff } = useState("");
  const { doc_reff_no, setDocReffNo } = useState("");
  const [tax_base, setTaxBase] = useState("");
  const [product_note, setProductNote] = useState("");

  const [code_account_name_options, setCodeAccountNameOptions] = useState([]);
  const [dr_cr_options, setDrCrOptions] = useState([]);
  const [typeOfVat_options, setTypeOfVatOptions] = useState([]);
  const [pph1_options, setPph1Options] = useState([]);
  const [pph2_options, setPph2Options] = useState([]);
  const [department_options, setDepartmentOptions] = useState([]);

  const [items, setItems] = useState([]);

  const [projectOptions, setProjectOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [ManagerPersonOptions, setManagerPersonOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [PpnOptions, setPpnOption] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [SalesPersonOptions, setSalesPersonOptions] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedJenisPPN, setSelectedjenisPPN] = useState([]);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState([]);
  const [selectedManagerPerson, setSelectedManagerPerson] = useState([]);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPpn, setSelectedPpn] = useState([]);
  const [taxPphTypeOption, setTaxPphTypeOption] = useState([]);
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState([]);
  const [taxPpnRoyaltyOption, setTaxPpnRoyaltyOption] = useState([]);
  const [ppnRate, setPpnRate] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const authToken = headers;

  useEffect(() => {
    const generateInitialSoNumber = async () => {
      const generatedSoNumber = await generateSoNumber("DRAFT_SO"); // Adjust the code as needed

      setSoNumber(generatedSoNumber);
    };
    generateInitialSoNumber();
  }, []); // Empty dependency array means this runs once on mount

  const generateSoNumber = async (code) => {
    try {
      const uniqueSoNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken);
      setSoNumber(uniqueSoNumber); // Updates state, if needed elsewhere in your component
      return uniqueSoNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate Voucher Number:", error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  useEffect(() => {
    LookupParamService.fetchLookupDataView("MSDT_FORMTAX", authToken, branchId)
      .then((data) => {
        console.log("TAX:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const optionsPPH = transformedData
          .filter((item) => item.TAX_TYPE === "PPh")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTaxPphTypeOption(optionsPPH);

        const optionsPpn = transformedData
          .filter((item) => item.TAX_TYPE === "PPN")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTaxPpnTypeOption(optionsPpn);
        console.log("ppnop", optionsPpn);

        const optionsPpnRoyalty = transformedData
          .filter((item) => item.TAX_TYPE === "PPN Royalty")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTaxPpnRoyaltyOption(optionsPpnRoyalty);
      })
      .catch((error) => {
        console.error("Failed to fetch  lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMCUST", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const optionsCustomer = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
          to_address: item.ADDRESS,
        }));

        setCustomerOptions(optionsCustomer);
      })
      .catch((error) => {
        console.error("Failed to fetch customer lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMPYTM", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const paymentTermOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));

        setPaymentTermOptions(paymentTermOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch Payment Term lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMEMPL", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const SalesPersonOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));

        setSalesPersonOptions(SalesPersonOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch Sales Person lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMEMPL", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const ManagerPersonOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));

        setManagerPersonOptions(ManagerPersonOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch Manager Person lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
      .then((data) => {
        console.log("product lookup data:", data);
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        const ManagerPersonOptions = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));

        setProductOptions(productOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch PPN lookup:", error);
      });

    const fetchLookupData = async () => {
      try {
        const responses = await Promise.all([
          LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMPYTM", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId),
          LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId),
        ]);

        const transformedData = responses.map((response) =>
          response.data.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          )
        );

        setCurrencyOptions(transformedData[0].map((item) => ({ value: item.CODE, label: item.CODE })));
        setDepartementOptions(transformedData[1].map((item) => ({ value: item.NAME, label: item.NAME })));
        setProjectOptions(transformedData[2].map((item) => ({ value: item.NAME, label: item.NAME, project_contract_number: item.CONTRACT_NUMBER })));
        setProductOptions(transformedData[3].map((item) => ({ value: item.NAME, label: item.NAME })));
        setPaymentTermOptions(transformedData[4].map((item) => ({ value: item.NAME, label: item.NAME })));
        setSalesPersonOptions(transformedData[6].map((item) => ({ value: item.NAME, label: item.NAME })));
        setManagerPersonOptions(transformedData[6].map((item) => ({ value: item.NAME, label: item.NAME })));
      } catch (error) {
        console.error("Failed to fetch lookup data:", error);
      }
    };

    fetchLookupData();
  }, []);

  const handleDeppartementChange = (selectedOption) => {
    setSelectedDepartement(selectedOption);
    setDepartment(selectedOption ? selectedOption.value : "");
  };

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");
  };

  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
    setCustomer(selectedOption ? selectedOption.value : "");

    // Set the address based on the selected customer
    if (selectedOption) {
      setToAddress(selectedOption.to_address); // Assuming selectedOption contains an address field
    } else {
      setToAddress(""); // Clear address if no customer is selected
    }
  };

  const handleSoNumberChange = (selectedOption) => {
    setSoNumber(selectedOption ? selectedOption.value : "");
  };

  const handleToAddressChange = (selectedOption) => {
    setToAddress(selectedOption ? selectedOption.value : "");
  };

  const handlePaymentTermChange = (selectedOption) => {
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");
  };

  const handleNegotiationRateChange = (selectedOption) => {
    setNegotiationRate(selectedOption || "");
  };

  const handleProjectStartChange = (selectedOption) => {
    setStartPeriod(selectedOption || "");
  };

  const handleProjectEndChange = (selectedOption) => {
    setEndPeriod(selectedOption || "");
  };

  const handleContractChange = (selectedOption) => {
    setContract(selectedOption || "");
  };

  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption ? selectedOption.value : "");
  };

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
    setCurrency(selectedOption ? selectedOption.value : "");
  };

  const handleSalesPersonChange = (selectedOption) => {
    setSelectedSalesPerson(selectedOption);
    setSalesPerson(selectedOption ? selectedOption.value : "");
  };

  const handleManagerPersonChange = (selectedOption) => {
    setSelectedManagerPerson(selectedOption);
    setManagerPerson(selectedOption ? selectedOption.value : "");
  };

  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption);
    setProduct(selectedOption ? selectedOption.value : "");
  };

  const handlePpnChange = (selectedOption) => {
    setSelectedPpn(selectedOption);
    setPPN(selectedOption ? selectedOption.value : "");
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        product: "",
        product_note: "",
        invoice_number: 0,
        doc_reff_no: "",
        period_start: "",
        period_end: "",
        quantity: "",
        unit_price: 0,
        total_price: 0,
        type_of_vat: "",

        tax_ppn: "",
        tax_ppn_amount: 0,
        tax_base: 0,
        type_of_vat: "",
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    // Clone the items array to avoid mutating the original state directly
    const newItems = [...items];

    // Update the field value for the given index
    if (field === "product" || field === "currency") {
      newItems[index][field] = value?.value || null; // Handle dropdown or object inputs
    } else {
      newItems[index][field] = value; // For other fields, directly assign the value
    }

    // Recalculate `total_price` if the changed field affects it
    if (field === "quantity" || field === "unit_price") {
      const quantity = parseFloat(newItems[index].quantity) || 0; // Default to 0 if invalid
      const unitPrice = parseFloat(newItems[index].unit_price) || 0; // Default to 0 if invalid
      newItems[index].total_price = quantity * unitPrice; // Compute total price
    }

    // Update the state with the new array
    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
    setSelectedItems(selectedItems.filter((i) => i !== index));
  };

  const handleSelectItem = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((_, index) => index));
    }
  };

  const handleDeleteSelected = () => {
    const newItems = items.filter((_, index) => !selectedItems.includes(index));
    setItems(newItems);
    setSelectedItems([]);
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.total_price, 0);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = [...items];
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const resetForm = () => {
    setCustomer("");
    setToAddress("");
    // setPaymentTerm("");
    setSoNumber("");
    setOrderDate("");
    setStatus("");
    setCurrency("");
    setNegotiationRate("");
    setPaymentTerm("");
    setSalesPerson("");
    setManagerPerson("");
    // setDocSourceType("");
    // setDocSourceNumber("");
    // setVoucherStatus("");
    // setVoucherDate("");
    // setTotalAmount("");
    // setCodeAccountName("");
    setDescription("");
    // setInvoiceNumber("");
    // setAmount("");
    // setDrCr("");
    // setTypeOfVat("");
    // setPPN("");
    // setTotalAmountPpn("");
    // setPph1("");
    // setTotalAmountPph1("");
    // setPph2("");
    // setTotalAmountPph2("");
    // setTotalAmountPaid("");
    setProject("");
    setDepartment("");
    setTaxCode("");
    setTotalAmountDpp("");
    setTaxAmount("");
    setItems([]);
    setSelectedItems([]);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus("in process");

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Sales Order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit It!",
      cancelButtonText: "No, Cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const generalInfo = {
          customer,
          so_number,
          to_address,
          project,
          status_so,
          order_date,
          project_period_startdate,
          project_period_enddate,
          currency,
          loi_so_spk_contract,
          payment_term,
          negotiation_rate,
          sales_person,
          manager_person,
          description,

          doc_reff: "awa",
          doc_reff_no,
        };

        console.log("Master", generalInfo);
        console.log("items", items);

        const response = await InsertDataService.postData(generalInfo, "SAOR", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              so_number,
              product,
              // description,
              // period_start,
              // period_end,
              // quantity,
              // unit_price,
              // total_price,
              // type_of_vat,
              tax_ppn,
              // tax_ppn_amount,
            };
            delete updatedItem.description;

            const itemResponse = await InsertDataService.postData(updatedItem, "SAORD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
        // delete updatedItem.customer;
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the Sales Order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit It!",
      cancelButtonText: "No, Cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const generalInfo = {
          customer,
          so_number,
          to_address,
          project,
          status_so,
          order_date,
          project_period_startdate,
          project_period_enddate,
          currency,
          loi_so_spk_contract,
          payment_term,
          negotiation_rate,
          sales_person,
          manager_person,
          description,

          doc_reff: "awa",
          doc_reff_no,
        };

        console.log("Master", generalInfo);

        const response = await InsertDataService.postData(generalInfo, "SAOR", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              //  customer,
              so_number,
              product,
              // to_address,
              // project,
              // status_so,
              // // order_date,
              // period_start,
              // period_end,
              // currency,
              // loi_so_spk_contract,
              // payment_term,
              // negotiation_rate,
              // sales_person,
              // manager_person,
              // description,
              // tax_base,
              tax_ppn,
              // doc_reff: 'awa',
              // doc_reff_no,
            };
            // delete updatedItem.tax_base;

            const itemResponse = await InsertDataService.postData(updatedItem, "SAORD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
    }
  };

  return (
    <Fragment>
      <section className="content">
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>Sales Order</Card.Title>
                <div className="ml-auto">
                  <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => {
                      handleRefresh();
                      setIsAddingNewSalesOrder(false);
                    }}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </Button>
                  <Button variant="primary" className="mr-2" onClick={handleSave}>
                    <i className="fas fa-save"></i> Save
                  </Button>
                  <Button variant="primary" className="mr-2" onClick={handleSubmit}>
                    <i className="fas fa-check"></i> Submit
                  </Button>
                </div>
              </Card.Header>

              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="customer">
                        <Form.Label>Customer</Form.Label>
                        <Select id="customer" options={customerOptions} isClearable placeholder="Select..." value={selectedCustomer} onChange={handleCustomerChange} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="soNumber">
                        <Form.Label>SO Number</Form.Label>
                        <Form.Control type="text" value={so_number} readOnly placeholder="Nomor SO" />
                      </Form.Group>
                      {/* Add other form fields here */}
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="to_address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter the Address" value={to_address} onChange={handleToAddressChange} readOnly required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Order Date</Form.Label>
                        <Form.Control type="date" value={order_date} onChange={(e) => setOrderDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Project</Form.Label>
                        <Select id="project" options={projectOptions} isClearable value={selectedProject} onChange={handleProjectChange} placeholder="Select..." required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control type="text" value={status_so} readOnly placeholder="NEW" onChange={handleStatusChange} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Project Period</Form.Label>
                        <div className="d-flex">
                          <Form.Control type="date" value={project_period_startdate} onChange={(e) => handleProjectStartChange(e.target.value)} required />
                          <div className="d-flex justify-content-center items-center mx-2">-</div>
                          <Form.Control type="date" value={project_period_enddate} onChange={(e) => handleProjectEndChange(e.target.value)} required />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Currency</Form.Label>
                        <Select id="Select the currency" options={currencyOptions} isClearable placeholder="Select..." value={selectedCurrency} onChange={handleCurrencyChange} required />
                      </Form.Group>
                      <Form.Group controlId="">
                        <Form.Label>LOI/PO/SPK/Contract</Form.Label>
                        <Form.Control type="text" isClearable placeholder=" " value={loi_so_spk_contract} onChange={(e) => handleContractChange(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="negotiationRate">
                        <Form.Label>Negotiation Rate</Form.Label>
                        <Form.Control type="number" value={negotiation_rate} onChange={(e) => handleNegotiationRateChange(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Payment Term</Form.Label>
                        <Select id="paymentTerm" options={paymentTermOptions} value={selectedPaymentTerm} isClearable placeholder="Select..." onChange={handlePaymentTermChange} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="salesPerson">
                        <Form.Label>Sales Person</Form.Label>
                        <Select
                          id="salesPerson"
                          options={SalesPersonOptions}
                          value={selectedSalesPerson}
                          isClearable
                          placeholder="Select..."
                          onChange={handleSalesPersonChange} // Handle selection
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="managerPerson">
                        <Form.Label>Manager Person</Form.Label>
                        <Select id="managerPerson" options={ManagerPersonOptions} isClearable placeholder="Select..." onChange={handleManagerPersonChange} value={selectedManagerPerson} required />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>Detail Item</Card.Title>
                  <div>
                    <Button variant="success" size="sm" onClick={handleAddItem}>
                      <i className="fas fa-plus"></i> New Item
                    </Button>
                    <Button variant="danger" size="sm" className="ml-2" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                      <i className="fas fa-trash"></i> Delete Selected
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="detail">
                    {(provided) => (
                      <div className="table-responsive" {...provided.droppableProps} ref={provided.innerRef}>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>
                                <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === items.length && items.length > 0} />
                              </th>
                              <th>Product</th>
                              <th>Product Note</th>
                              <th>BA Date</th>
                              <th>BA Number</th>
                              <th>Start Period</th>
                              <th>End Period</th>
                              <th>Quantity</th>
                              <th className={items.length > 0 && items[0].currency === "IDR"}>Unit Price</th>
                              <th className={items.length > 0 && items[0].currency === "IDR"}>Total Price</th>
                              <th>Type of VAT</th>
                              <th>PPN</th>
                              <th>PPN Amount</th>
                              <th>DPP Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="17" className="text-center">
                                  No data available
                                </td>
                              </tr>
                            ) : (
                              items.map((item, index) => (
                                <tr key={index} className={selectedItems.includes(index) ? "table-active" : ""}>
                                  <td>
                                    <input type="checkbox" checked={selectedItems.includes(index)} onChange={() => handleSelectItem(index)} />
                                  </td>
                                  <td>
                                    <Form.Group controlId="product">
                                      <Select id="product" options={productOptions} isClearable placeholder="Select..." value={selectedProduct} onChange={handleProductChange} required />
                                    </Form.Group>
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                                  </td>
                                  <td>{/* <Form.Control type="date" value={item.invoiceNumber} onChange={(e) => handleItemChange(index, "BA_Date", e.target.value)} /> */}</td>
                                  <td>
                                    <Form.Control type="number" value={item.doc_reff_no} onChange={(e) => handleItemChange(index, "doc_reff_no", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="date" value={item.period_start} onChange={(e) => handleItemChange(index, "period_start", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="date" value={item.period_end} onChange={(e) => handleItemChange(index, "period_end", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.quantity || 0} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.unit_price || 0} onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.total_price || 0} readOnly onChange={(e) => handleItemChange(index, "total_price", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Group controlId="type_of_vat">
                                      <Form.Select value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", e.target.value)} aria-label="Select PPN">
                                        <option value="">Type of VAT</option>
                                        <option value="SubTotal1">INCLUDE</option>
                                        <option value="SubTotal2">EXCLUDE</option>
                                        <option value="SubTotal3">NON PPN</option>
                                      </Form.Select>
                                    </Form.Group>
                                  </td>
                                  <td>
                                    <Select
                                      value={
                                        items[index].type_of_vat === "ppn_royalty" ? taxPpnRoyaltyOption.find((option) => option.value === item.tax_ppn) : taxPpnTypeOption.find((option) => option.value === items[index].tax_ppn) || null
                                      }
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn for the specific item
                                        handleItemChange(index, "tax_ppn", selectedOption ? selectedOption.value : "");

                                        // Update the PpnRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_ppn_rate", selectedOption.RATE);
                                          setPpnRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_ppn_rate", 0);
                                          setPpnRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      options={items[index].type_of_vat === "ppn_royalty" ? taxPpnRoyaltyOption : taxPpnTypeOption}
                                      // options={taxPpnTypeOption}
                                      isClearable
                                      placeholder="Select Tax PPN Type..."
                                      isDisabled={items[index].type_of_vat === "non_ppn"}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_ppn_amount} onChange={(e) => handleItemChange(index, "tax_ppn_amount", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", parseFloat(e.target.value))} />
                                  </td>
                                  {/* <td>
                                    <Select
                                      value={ productOptions.find((option) => option.value === item.coa)}
                                      onChange={(selectedOption) => handleItemChange(index, "product", selectedOption)}
                                      options={productOptions}
                                      isClearable
                                      placeholder="Select product"
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} style={{ width: "80px" }} />
                                  </td>
                                  <td>
                                    <Select
                                      value={currencyOptions.find((option) => option.value === item.currency)}
                                      onChange={(selectedOption) => handleItemChange(index, "currency", selectedOption)}
                                      options={currencyOptions}
                                      isClearable
                                      placeholder="Select currency"
                                      style={{ width: "80px" }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      onChange={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas to get raw number
                                        const value = parseFloat(rawValue);

                                        if (!isNaN(value)) {
                                          handleItemChange(index, "unit_price", value); // Update state with raw numeric value
                                        } else if (rawValue === "") {
                                          handleItemChange(index, "unit_price", 0); // Set value to 0 if input is cleared
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas to get raw number
                                        let value = parseFloat(rawValue) || 0;

                                        let formattedValue;
                                        if (item.currency === "IDR") {
                                          // For IDR: Format without decimals
                                          formattedValue = value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                                        } else {
                                          // For non-IDR: Ensure there are 2 decimal places
                                          formattedValue = value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                        }

                                        console.log("Formatted value:", formattedValue);

                                        e.target.value = formattedValue; // Set the formatted value in the input field

                                        handleItemChange(index, "unit_price", value); // Update state with the parsed value
                                      }}
                                      style={{ textAlign: "right" }}
                                    />
                                  </td>
                                  <td className="text-end">{item.total_price.toLocaleString("en-US", { currency: item.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td> */}
                                  <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                          <tfoot>
                            {/* <tr>
                              <td colSpan="6" className="text-right">
                                Total Amount:
                              </td>
                              <td className="text-end">
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { currency: "IDR", minimumFractionDigits: 2, maximumFractionDigits: 2 })} </strong>
                              </td>
                              <td></td>
                            </tr> */}
                          </tfoot>
                        </table>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Form.Group controlId="formDescription">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter note"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}

                    // Add state and event handling logic as needed
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Form.Group controlId="">
              <Form.Label>Sub Total:</Form.Label>
              <Form.Control type="text" value="Your Sub Total Value" readOnly placeholder="Sub Total" />
            </Form.Group>
            <Form.Group controlId="">
              <Form.Label>PPN:</Form.Label>
              <Form.Control type="text" value="PPN" readOnly placeholder="PPN" />
            </Form.Group>
            <Form.Group controlId="">
              <Form.Label>Total:</Form.Label>
              <Form.Control type="text" value="Total Value" readOnly placeholder="Total" />
            </Form.Group>
          </Col>

          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Col md={6}>
                    <Form.Group controlId="">
                      <Form.Label>Diajukan Oleh</Form.Label>
                      <Select
                        id="salesPerson"
                        options={SalesPersonOptions} // Use the fetched options here
                        isClearable
                        placeholder="Select..."
                        onChange={handleSalesPersonChange} // Handle selection
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="">
                      <Form.Label>Tanggal Diajukan</Form.Label>
                      <Form.Control type="date" required />
                    </Form.Group>
                  </Col>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Col md={6}>
                    <Form.Group controlId="">
                      <Form.Label>Disetujui Oleh</Form.Label>
                      <Select
                        id="salesPerson"
                        options={SalesPersonOptions} // Use the fetched options here
                        isClearable
                        placeholder="Select..."
                        onChange={handleSalesPersonChange} // Handle selection
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="">
                      <Form.Label>Tanggal Disetujui</Form.Label>
                      <Form.Control type="date" required />
                    </Form.Group>
                  </Col>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Row>
      </section>

      {isLoading && (
        <div className="full-screen-overlay">
          <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
        </div>
      )}
    </Fragment>
  );
};

export default AddSalesOrder;
