import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from "../service/InsertDataService";
import { getBranch, getToken } from "../config/Constant";
import { GENERATED_NUMBER } from "../config/ConfigUrl";
import { generateUniqueId } from "../service/GeneratedId";
import Select from "react-select";
import LookupParamService from "../service/LookupParamService";
import LookupService from "../service/LookupService";
import CreatableSelect from "react-select/creatable";
import DropFileInput from './DropFileInput';

const AddPurchaseInvoice = ({ setIsAddingNewPurchaseInvoice, handleRefresh, index, item }) => {
  const headers = getToken();
  const branchId = getBranch();
  const [pr_number, setPrNumber] = useState("");
  const [request_date, setRequestDate] = useState("");
  const [title, setTitle] = useState("");
  const [schedule_date, setScheduleDate] = useState("");
  const [doc_no, setDocNo] = useState("FRM.PTAP.PRC.21a-01");
  const [requestor, setRequestor] = useState("");
  const [departement, setDepartment] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestorOptions, setRequestorOptions] = useState([]);
  const [selectedRequestor, setSelectedRequestor] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vendor, setVendor] = useState("");
  const [payment_term, setPaymentTerm] = useState("");
  const [invoice_date, setInvoiceDate] = useState("");
  const [ID, setID] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [invoicenumber, setInvoiceNumber] = useState("");
  const [po_number, setPoNumber] = useState("");
  const [internalmemo, setInternalMemo] = useState("");
  const [taxrate, setTaxRate] = useState("");
  const [bimiddle, setBiMiddle] = useState("");
  const [taxinvoice, setTaxInvoice] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
  const [docRef, setDocRef] = useState("");
  const [prNumberOptions, setPrNumberOptions] = useState([]);
  const [selectedPrNumber, setSelectedPrNumber] = useState(null);
  const [poNumberOptions, setPoNumberOptions] = useState([]);
  const [selectedPoNumber, setSelectedPoNumber] = useState(null);
  const [invoice_type, setInvoiceType] = useState("");
  const [tax_pph_type_option, setTax_Pph_Type_Option] = useState([]);
  const [PphRate, setPphRate] = useState("");
  const [PpnRate, setPpnRate] = useState("");
  const [selectedTaxPphType, setSelectedTaxPphType] = useState(null);
  const [selectedtaxtype, setSelectedTaxType] = useState(null);
  const [tax_ppn_type, setTaxPpnType] = useState("");
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState(null);
  const [quantity, setQuantity] = useState("");
  const authToken = headers;

  useEffect(() => {
    // Ambil data lookup untuk currency
    // MSDT_FORMEMPL adalah nama table yang menyimpan data lookup untuk currency
    // authToken dan branchId digunakan untuk mengirimkan token otorisasi dan kode cabang ke server
    LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
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
        }));
        setRequestorOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    //  buat project
    LookupParamService.fetchLookupData("MSDT_PRJT", authToken, branchId)
      .then((data) => {
        console.log("Project lookup data:", data);

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
        }));
        setProjectOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch project lookup:", error);
      });

    // buat vendor
    LookupParamService.fetchLookupData("MSDT_VNDR", authToken, branchId)
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

        const options = transformedData.map((item) => ({
          value: item.NAME,
          label: item.NAME,
        }));
        setVendorOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch vendor lookup:", error);
      });

    // buat payment term
    LookupParamService.fetchLookupData("MSDT_FORMPYTM", authToken, branchId)
      .then((data) => {
        console.log("Payment term lookup data:", data);

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
        }));
        setPaymentTermOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch payment term lookup:", error);
      });

    // buat pr number
    LookupParamService.fetchLookupData("PURC_FORMPUREQ", authToken, branchId)
      .then((data) => {
        console.log("PR number lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.PR_NUMBER,
          label: item.PR_NUMBER,
          project: item.PROJECT,
          id: item.ID,
          totalAmount: item.TOTAL_AMOUNT,
          currency: item.CURRENCY, // Add the currency property
          quantity: item.QUANTITY,
          product: item.PRODUCT,
          // title: item.TITLE,
        }));
        setPrNumberOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch PR number lookup:", error);
      });

    // PO NUMBER
    LookupParamService.fetchLookupData("PURC_FORMPUOR", authToken, branchId)
      .then((data) => {
        console.log("PO number lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.PO_NUMBER,
          label: item.PO_NUMBER,
        }));
        setPoNumberOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch PO number lookup:", error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
      .then((data) => {
        // console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.CODE,
          label: item.CODE,
        }));
        setCurrencyOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
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
        }));
        setDepartementOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMVNDR", authToken, branchId)
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
        }));
        setCompanyOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
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
        }));
        setProjectOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
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
        }));
        setProductOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId)
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
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTax_Pph_Type_Option(options);

        const optionsPpn = transformedData
          .filter((item) => item.TAX_TYPE === "PPN")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
          }));
        setTaxPpnTypeOption(optionsPpn);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });
  }, []);

  const handlePaymentTermChange = (selectedOption) => {
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");
  };

  // const handlePrNumberChange = (selectedOption) => {
  //   setSelectedPrNumber(selectedOption);
  //   setPrNumber(selectedOption ? selectedOption.value : "");
  // };

  // Handle PR Number Change
  const handlePrNumberChange = (selectedOption) => {
    setSelectedPrNumber(selectedOption);
    setPrNumber(selectedOption ? selectedOption.value : "");

    if (selectedOption) {

      LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then(response => {
          const fetchedItems = response.data || [];
          console.log('Items fetched:', fetchedItems);

          // Set fetched items to state
          setItems(fetchedItems);

          // Fetch product lookup data
          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
              .then(productData => {
                  console.log('Product lookup data:', productData);

                  // Transform and map product data to options
                  const transformedProductData = productData.data.map(item =>
                      Object.keys(item).reduce((acc, key) => {
                          acc[key.toUpperCase()] = item[key];
                          return acc;
                      }, {})
                  );

                  const productOptions = transformedProductData.map(item => ({
                      value: item.NAME,
                      label: item.NAME
                  }));

                  setProductOptions(productOptions); // Set product options to state

                  // Fetch currency lookup data
                  LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                      .then(currencyData => {
                          console.log('Currency lookup data:', currencyData);

                          // Transform and map currency data to options
                          const transformedCurrencyData = currencyData.data.map(item =>
                              Object.keys(item).reduce((acc, key) => {
                                  acc[key.toUpperCase()] = item[key];
                                  return acc;
                              }, {})
                          );

                          const currencyOptions = transformedCurrencyData.map(item => ({
                              value: item.CODE,
                              label: item.CODE
                          }));

                          setCurrencyOptions(currencyOptions); // Set currency options to state

                          // Update fetched items with selected options
                          const updatedItems = fetchedItems.map(item => {
                              const selectedProductOption = productOptions.find(option =>
                                  option.value === item.product
                              );

                              console.log('Selected product option:', selectedProductOption);

                              const selectedCurrencyOption = currencyOptions.find(option =>
                                  option.value === item.currency
                              );

                              console.log('Selected currency option:', selectedCurrencyOption);
                              setSelectedCurrency(selectedCurrencyOption);
                              setSelectedProduct(selectedProductOption);
                          });

                          // Set the updated items with selected product and currency options to state
                          setItems(fetchedItems);
                      })
                      .catch(error => {
                          console.error('Failed to fetch currency lookup:', error);
                      });
              })
              .catch(error => {
                  console.error('Failed to fetch product lookup:', error);
              });
      })
      .catch(error => {
          console.error('Failed to load items:', error);
      });


      const projectValue = selectedOption.project || selectedOption.PR_NUMBER;

      const matchingProjectOption = projectOptions.find((option) => option.value === projectValue);
      setSelectedProject(matchingProjectOption || null);
      setID(selectedOption.id); // Set the selected ID value
      setTotalAmount(selectedOption.totalAmount);
      setTitle(selectedOption.title);
    } else {
      setSelectedProject(null);
      setTotalAmount(null);
      setTitle(null);
      setID(null); // Clear the ID value if no option is selected
    }
  };

  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "");
  };

  const handleRequestorChange = (selectedOption) => {
    setSelectedRequestor(selectedOption);
    setRequestor(selectedOption ? selectedOption.value : "");
  };

  const handleDeppartementChange = (selectedOption) => {
    setSelectedDepartement(selectedOption);
    setDepartment(selectedOption ? selectedOption.value : "");
  };

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setCompany(selectedOption ? selectedOption.value : "");
  };

  const handlePoNumberChange = (selectedOption) => {
    setSelectedPoNumber(selectedOption);
    setPoNumber(selectedOption ? selectedOption.value : "");
  };

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: "",
        invoice_number: "",
        product: "",
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        vat: "Select an Option",
        tax_ppn: 0,
        tax_ppn_type: "",
        tax_ppn_rate: "",
        tax_ppn_amount: 0,
        tax_pph: 0,
        tax_pph_type: "",
        tax_pph_rate: "",
        tax_pph_amount: 0,
        tax_base: "",
        total_tax_base: 0,
        total_amount_ppn: 0,
        total_amount_pph: 0,
        total_price: 0,
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    console.log(index, field, value);

    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }

    if (field === "vat") {
      if (value === "include") {
        newItems[index].unit_price = newItems[index].unit_price * 1.1;
        newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
      } else if (value === "exclude") {
        newItems[index].unit_price = newItems[index].unit_price / 1.1;
        newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
      }
    }

    if (field === "tax_ppn_rate") {
      newItems[index].tax_ppn_amount = (newItems[index].total_price * value) / 100;
    }

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
    setPrNumber("");
    setRequestDate("");
    setTitle("");
    setScheduleDate("");
    setDocNo("");
    setRequestor("");
    setDepartment("");
    setCompany("");
    setProject("");
    setDescription("");
    setItems([]);
    setSelectedItems([]);
    setSelectedRequestor(null);
    setSelectedDepartement(null);
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    // if (!title) {
    //   messageAlertSwal("Error", "Title cannot be empty", "error");
    //   return;
    // }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Purchase Request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const total_amount = totalAmount;
        // Save general information and description
        const generalInfo = {
          po_number,
          pr_number,
          // request_date, // Converts to date format
          title,
          payment_term, // Converts to date format
          invoice_type,
          invoice_date,
          vendor,
          // internalmemo,
          project,
          description,
          total_amount,
        };

        console.log("Master", generalInfo);

        const response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              pr_number,
            };

            const itemResponse = await InsertDataService.postData(updatedItem, "PUINVC", authToken, branchId);
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

  // #Buat generate
  // useEffect(() => {
  //   const generatePrNumber = async () => {
  //     try {
  //       const uniquePrNumber = await generateUniqueId(${GENERATED_NUMBER}?code=INV, authToken);
  //       setPrNumber(uniquePrNumber);
  //     } catch (error) {
  //       console.error("Failed to generate PR Number:", error);
  //     }
  //   };

  //   generatePrNumber();
  // }, []);

  return (
    <Fragment>
      <section className="content">
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>General Information</Card.Title>
                <div className="ml-auto">
                  <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => {
                      handleRefresh();
                      setIsAddingNewPurchaseInvoice(false);
                    }}
                  >
                    <i className="fas fa-times"></i> Back
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                    <i className="fas fa-save"></i> Save
                  </Button>
                </div>
              </Card.Header>

              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} required />{" "}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formId">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter ID"
                          value={ID}
                          onChange={(e) => setID(e.target.value)} // Updated to setID
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formDocRef">
                        <Form.Label>Document Reference</Form.Label>
                        <Form.Control as="select" placeholder="Enter Document Number" value={docRef} onChange={(e) => setDocRef(e.target.value)}>
                          <option value="">Select Document Reference</option>
                          <option value="purchaseRequest">Purchase Request</option>
                          <option value="internalMemo">Internal Memo</option>
                          <option value="purchaseOrder">Purchase Order</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    {docRef === "purchaseRequest" && (
                      <Col md={6}>
                        <Form.Group controlId="formPrNumber">
                          <Form.Label>PR Number</Form.Label>
                          <Select value={selectedPrNumber} onChange={handlePrNumberChange} options={prNumberOptions} isClearable placeholder="Select PR Number..." />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formPoNumber">
                          <Form.Label>PO Number</Form.Label>
                          <Select value={selectedPoNumber} onChange={handlePoNumberChange} options={poNumberOptions} isClearable placeholder="Select PO Number..." />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "internalMemo" && (
                      <Col md={6}>
                        <Form.Group controlId="formInternalMemo">
                          <Form.Label>Internal Memo</Form.Label>
                          <Form.Control type="text" placeholder="Enter Internal Memo" value={internalmemo} onChange={(e) => setInternalMemo(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    )}

                    {/* {docRef === "purchaseRequest" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formProject">
                          <Form.Label>Project</Form.Label>
                          <Select value={selectedProject} onChange={handleProjectChange} options={projectOptions} isClearable placeholder="Select Project..." />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formPaymentTerm">
                          <Form.Label>Payment Term</Form.Label>
                          <Select value={selectedPaymentTerm} onChange={handlePaymentTermChange} options={paymentTermOptions} isClearable placeholder="Select Payment Term..." />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formDueDate">
                          <Form.Label>Due Date</Form.Label>
                          <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    )} */}

                    <Col md={6}>
                      <Form.Group controlId="formInvoceNumber">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Invoice Number" value={invoicenumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                      <Form.Group controlId="formPrNumber">
                        <Form.Label>PR Number</Form.Label>
                        <Select value={selectedPrNumber} onChange={handlePrNumberChange} options={prNumberOptions} isClearable placeholder="Select PR Number..." />
                      </Form.Group>
                    </Col> */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formPoNumber">
                        <Form.Label>PO Number</Form.Label>
                        <Select value={selectedPoNumber} onChange={handlePoNumberChange} options={poNumberOptions} isClearable placeholder="Select PO Number..." />
                      </Form.Group>
                    </Col> */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formInternalMemo">
                        <Form.Label>Internal Memo</Form.Label>
                        <Form.Control type="text" placeholder="Enter Internal Memo" value={internalmemo} onChange={(e) => setInternalMemo(e.target.value)} required />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceType">
                        <Form.Label>Invoice Type</Form.Label>
                        <Form.Control type="text" placeholder="Enter Invoice Type" value={invoice_type} onChange={(e) => setInvoiceType(e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceDate">
                        <Form.Label>Invoice Date</Form.Label>
                        <Form.Control type="date" value={invoice_date} onChange={(e) => setInvoiceDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formProject">
                        <Form.Label>Project</Form.Label>
                        <Select value={selectedProject} onChange={handleProjectChange} options={projectOptions} isClearable placeholder="Select Project..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formVendor">
                        <Form.Label>Vendor</Form.Label>
                        <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formPaymentTerm">
                        <Form.Label>Payment Term</Form.Label>
                        <Select value={selectedPaymentTerm} onChange={handlePaymentTermChange} options={paymentTermOptions} isClearable placeholder="Select Payment Term..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formDueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                      <Form.Group controlId="formInvoiceStatus">
                        <Form.Label>Invoice Status</Form.Label>
                        <Form.Control type="Text" placeholder="Enter Invoice Status" value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value)} required />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formTaxRate">
                        <Form.Label>Tax Rate</Form.Label>
                        <Form.Control type="text" placeholder="Enter Tax Rate" value={taxrate} onChange={(e) => setTaxRate(e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTaxInvoice">
                        <Form.Label>Tax Invoice</Form.Label>
                        <Form.Control type="number" min="0" placeholder="Enter Tax Invoice" value={taxinvoice} onChange={(e) => setTaxInvoice(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formBiMiddle">
                        <Form.Label>BI Middle Rate</Form.Label>
                        <Form.Control type="text" placeholder="Enter BI Middle" value={bimiddle} onChange={(e) => setBiMiddle(e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTotalAmount">
                        <Form.Label>Total Amount</Form.Label>
                        <Form.Control type="number" placeholder="Enter Total Amount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={12} style={{ marginTop: 20, marginBottom: 20 }}>
                      <DropFileInput />
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
                  <Card.Title>Item List</Card.Title>
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
                  <Droppable droppableId="items">
                    {(provided) => (
                      <div className="table-responsive" {...provided.droppableProps} ref={provided.innerRef}>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>
                                <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === items.length && items.length > 0} />
                              </th>
                              <th>ID</th>
                              <th>Invoice Number</th>
                              <th>Product</th>
                              <th>Currency</th>
                              <th>Quantity</th>
                              <th>Unit Price</th>
                              <th>Type Of VAT</th>
                              <th>Product Note</th>
                              {/* <th>Tax PPN</th> */}
                              <th>Tax PPN</th>
                              <th>Tax PPN Rate</th>
                              <th>Tax PPN Amount</th>
                              {/* <th>Tax PPh</th> */}
                              <th>Tax PPh</th>
                              <th>Tax PPh Rate</th>
                              <th>Tax PPh Amount</th>
                              <th>Tax Base</th>
                              <th>Total Tax Base</th>
                              <th>Total Amount PPN</th>
                              <th>Total Amount PPH</th>
                              <th>Total Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="22" className="text-center">
                                  No data available
                                </td>
                              </tr>
                            ) : (
                              items.map((item, index) => (
                                <tr key={index} className={selectedItems.includes(index) ? "table-active" : ""}>
                                  <td>
                                    <input type="checkbox" checked={selectedItems.includes(index)} onChange={() => handleSelectItem(index)} />
                                  </td>

                                  {/* <td>
                                    <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)} />
                                  </td> */}
                                  {/* {docRef === "purchaseRequest" || docRef === "purchaseOrder" ? (
                                    <td>
                                      <Form.Control type="number" value={item.id || selectedPrNumber?.id} onChange={(e) => handleItemChange(index, "id", e.target.value)} />
                                    </td>
                                  ) : (
                                    <td>
                                      <Form.Control type="number" value={item.id} onChange={(e) => handleItemChange(index, "id", e.target.value)} />
                                    </td>
                                  )} */}
                                  <td>
                                    <Form.Control type="number" value={item.id || selectedPrNumber?.id} onChange={(e) => handleItemChange(index, "id", e.target.value)} />
                                  </td>

                                  <td>
                                    <Form.Control type="text" value={item.invoice_number} onChange={(e) => handleItemChange(index, "invoice_number", e.target.value)} />
                                  </td>
                                  <td>
                                    <Select
                                      value={productOptions.find((option) => option.value === item.product)} // Menemukan produk yang sesuai
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "product", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui state
                                      }}
                                      options={productOptions} // Daftar opsi produk
                                      isClearable
                                      placeholder="Select Product..."
                                    />
                                  </td>

                                  <td>
                                    <Select
                                      value={currencyOptions.find((option) => option.value === item.currency)} // Menemukan mata uang yang sesuai
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "currency", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                                      }}
                                      options={currencyOptions} // Daftar opsi mata uang
                                      // isClearable
                                      placeholder="Select Currency"
                                      defaultValue={currencyOptions.find((option) => option.value === (item.currency || "USD"))} // Set default value to USD if item.currency is not set
                                    />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.quantity} min="0" onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.unit_price} min="0" onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))} />
                                  </td>

                                  <td>
                                    <Form.Control as="select" value={item.vat} onChange={(e) => handleItemChange(index, "vat", e.target.value)}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                    </Form.Control>
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                                  </td>
                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", parseFloat(e.target.value))} />
                                  </td> */}
                                  <td>
                                    <Select
                                      value={taxPpnTypeOption.find((option) => option.value === item.tax_ppn_type)}
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn_type for the specific item
                                        handleItemChange(index, "tax_ppn_type", selectedOption ? selectedOption.value : "");

                                        // Update the PpnRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_ppn_rate", selectedOption.RATE);
                                          setPpnRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_ppn_rate", 0);
                                          setPpnRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      options={taxPpnTypeOption}
                                      isClearable
                                      placeholder="Select Tax PPN Type..."
                                    />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.tax_ppn_rate} onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))} readOnly />
                                  </td>

                                  <td>
                                    <Form.Control className="text-end" type="text" value={item.tax_ppn_amount} onChange={(e) => handleItemChange(index, "tax_ppn_amount", e.target.value)} />
                                  </td>
                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_pph} onChange={(e) => handleItemChange(index, "tax_pph", parseFloat(e.target.value))} />
                                  </td> */}
                                  {/* {docRef === "purchaseRequest" || docRef === "purchaseOrder" ? (
                                    <td>
                                      <Select
                                        value={selectedTaxPphType}
                                        onChange={(selectedOption) => {
                                          setSelectedTaxPphType(selectedOption);
                                          handleItemChange(index, "tax_pph_type", selectedOption ? selectedOption.value : null);
                                        }}
                                        options={tax_pph_type_option}
                                        isClearable
                                        placeholder="Select Tax PPH Type..."
                                      />
                                    </td>
                                  ) : (
                                    <td>
                                      <Form.Control type="text" value={item.tax_pph_type} onChange={(e) => handleItemChange(index, "tax_pph_type", e.target.value)} />
                                    </td>
                                  )} */}

                                  {/* <td>
                                    <Select
                                      value={tax_pph_type_option.find((option) => option.value === item.tax_pph_type)}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "tax_pph_type", selectedOption ? selectedOption.value : "");
                                        if (selectedOption) {
                                          handleItemChange(index, "PphRate", selectedOption.RATE);
                                          setPphRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "PphRate", 0);
                                          setPphRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      options={tax_pph_type_option}
                                      isClearable
                                      placeholder="Select Tax PPH Type..."
                                    />
                                  </td> */}

                                  <td>
                                    <Select
                                      value={tax_pph_type_option.find((option) => option.value === item.tax_pph_type)}
                                      onChange={(selectedOption) => {
                                        // Update the tax_pph_type for the specific item
                                        handleItemChange(index, "tax_pph_type", selectedOption ? selectedOption.value : "");

                                        // Update the PphRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_pph_rate", selectedOption.RATE);
                                          setPphRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_pph_rate", 0);
                                          setPphRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      options={tax_pph_type_option}
                                      isClearable
                                      placeholder="Select Tax PPH Type..."
                                    />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.tax_pph_rate} onChange={(e) => handleItemChange(index, "tax_pph_rate", parseFloat(e.target.value))} readOnly />
                                  </td>

                                  {/* <td>
                                    <Form.Control type="text" value={item.tax_pph_type} onChange={(e) => handleItemChange(index, "tax_pph_type", e.target.value)} />
                                  </td> */}
                                  <td>
                                    <Form.Control className="text-end " type="text" value={item.tax_pph_amount} onChange={(e) => handleItemChange(index, "tax_pph_amount", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control className="text-end " type="text" value={item.total_tax_base} onChange={(e) => handleItemChange(index, "total_tax_base", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control className="text-end " type="text" value={item.total_amount_ppn} onChange={(e) => handleItemChange(index, "total_amount_ppn", e.target.value)} />
                                  </td>
                                  <td>
                                    <Form.Control className="text-end " type="text" value={item.total_amount_pph} onChange={(e) => handleItemChange(index, "total_amount_pph", e.target.value)} />
                                  </td>

                                  {/* <td>
                                    <Form.Control type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value) || 0)} />
                                  </td> */}
                                  <td>{item.total_price.toLocaleString("en-US", { style: "currency", currency: item.currency })}</td>
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
                            <tr>
                              <td colSpan="21" className="text-right">
                                Sub Total:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="21" className="text-right">
                                PPN 10%:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="21" className="text-right">
                                Total Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" })} </strong>
                              </td>
                              <td></td>
                            </tr>
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
          <Col md={12}>
            <Card>
              <Card.Body>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}

                    // Add state and event handling logic as needed
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12} className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="mr-2"
              onClick={() => {
                handleRefresh();
                setIsAddingNewPurchaseInvoice(false);
              }}
            >
              <i className="fas fa-times"></i> Back
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <i className="fas fa-save"></i> Save
            </Button>
          </Col>
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

export default AddPurchaseInvoice;