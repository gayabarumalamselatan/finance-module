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
import CreatableSelect from "react-select/creatable";
import LookupService from "../service/LookupService";
import UpdateDataService from "../service/UpdateDataService";
import DeleteDataService from "../service/DeleteDataService";
// import DropFileInput from "../components/drop-file-input/DropFileInput";

const EditSalesOrder = ({ setIsEditingSalesOrder, handleRefresh, index, item, selectedData }) => {
  console.log("selectedData", selectedData);
  const headers = getToken();
  const branchId = getBranch();

  const [so_number, setSoNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [to_address, setToAddress] = useState("");
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
  const [created_by, setCreatedBy] = useState("");
  const [approved_by, setApprovedBy] = useState("");
  const [total_amount_ppn, setTotalPpnAmount] = useState("");

  //   #Detail
  const [product, setProduct] = useState("");
  const [tax_ppn, setPPN] = useState("");
  const [tax_ppn_amount, setTotalAmountPpn] = useState("");
  const [tax_pph_amount, setTotalAmountPph] = useState("");
  const [type_of_vat, setTypeOfVat] = useState("");
  const [period_start, setPeriodStart] = useState ("");
  const [period_end, setPeriodEnd] = useState ("");
  const [quantity, setQuantity] = useState ("");
  const [unit_price, setUnitPrice] = useState ("");
  const [total_price, setTotalPrice] = useState ("");

  // Options
  const [projectOptions, setProjectOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [departementOptions, setDepartementOptions] = useState([]);
  const [ManagerPersonOptions, setManagerPersonOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [PpnOptions, setPpnOption] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [SalesPersonOptions, setSalesPersonOptions] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);

  // Selected
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
  const [selectedSoNumber, setSelectedSoNumber] = useState(null);
  const [selectedPpn, setSelectedPpn] = useState([]);
  const [taxPphTypeOption, setTaxPphTypeOption] = useState([]);
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState([]);
  const [taxPpnRoyaltyOption, setTaxPpnRoyaltyOption] = useState([]);
  const [tax_ppn_rate, setTaxPpnRate] = useState("");

  const authToken = headers;
  useEffect(() => {
    if (selectedData) {
      const { ID, SO_NUMBER } = selectedData[0];
      console.log("id and SO Number", ID, SO_NUMBER);
      setSoNumber(SO_NUMBER);

      LookupService.fetchLookupData(`SALE_FORMSAOR&filterBy=SO_NUMBER&filterValue=${SO_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const data = response.data[0];
          if (data) {
            setCustomer(data.customer);
            setSoNumber(data.so_number);
            setToAddress(data.to_address);
            setOrderDate(data.order_date);
            setProject(data.project);
            setStatus(data.status_so);
            setStartPeriod(data.project_period_startdate);
            setEndPeriod(data.project_period_enddate);
            setCurrency(data.currency);
            setContract(data.loi_so_spk_contract);
            setNegotiationRate(data.negotiation_rate);
            setPaymentTerm(data.payment_term);
            setSalesPerson(data.sales_person);
            setManagerPerson(data.manager_person);

            setProject(data.project);
            setDescription(data.description);
          } else {
            console.log("No data found");
          }
        })
        .catch((error) => {
          console.error("Failed to load purchase request data:", error);
        });

      // Fetch items based on SO_NUMBER and set them to state
      LookupService.fetchLookupData(`SALE_FORMSAORD&filterBy=so_number&filterValue=${SO_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          setItems(fetchedItems);

          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
            .then((productData) => {
              console.log("Product lookup data:", productData);

              // Transform and map product data to options
              const transformedProductData = productData.data.map((item) =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {})
              );

              const productOptions = transformedProductData.map((item) => ({
                value: item.NAME,
                label: item.NAME,
              }));

              setProductOptions(productOptions); // Set product options to state

              // Fetch currency lookup data
              LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                .then((currencyData) => {
                  console.log("Currency lookup data:", currencyData);

                  // Transform and map currency data to options
                  const transformedCurrencyData = currencyData.data.map((item) =>
                    Object.keys(item).reduce((acc, key) => {
                      acc[key.toUpperCase()] = item[key];
                      return acc;
                    }, {})
                  );

                  const currencyOptions = transformedCurrencyData.map((item) => ({
                    value: item.CODE,
                    label: item.CODE,
                  }));

                  setCurrencyOptions(currencyOptions); // Set currency options to state

                  // Update fetched items with selected options
                  const updatedItems = fetchedItems.map((item) => {
                    const selectedProductOption = productOptions.find((option) => option.value === item.product);

                    console.log("Selected product option:", selectedProductOption);

                    const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);

                    console.log("Selected currency option:", selectedCurrencyOption);
                    setSelectedCurrency(selectedCurrencyOption);
                    setSelectedProduct(selectedProductOption);
                  });

                  // Set the updated items with selected product and currency options to state
                  setItems(fetchedItems);
                })
                .catch((error) => {
                  console.error("Failed to fetch currency lookup:", error);
                });
            })
            .catch((error) => {
              console.error("Failed to fetch product lookup:", error);
            });
        })
        .catch((error) => {
          console.error("Failed to load items:", error);
        });

      // Lookup PPN & PPh
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
          const selectedPPNOption = options.find((option) => option.value === selectedData[0].TAX_PPN);
          setSelectedTaxType(selectedPPNOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });

      LookupParamService.fetchLookupData("MSDT_FORMCUST", authToken, branchId)
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
            value: item.NAME,
            label: item.NAME,
          }));
          setAllVendorOptions(allOptions);

          const bothOptions = transformedData
            .filter((item) => item.ENTITY_TYPE === "BOTH")
            .map((item) => ({
              value: item.NAME,
              label: item.NAME,
            }));
          setVendorOptions(bothOptions);
        })
        .catch((error) => {
          console.error("Failed to fetch vendor lookup:", error);
        });

      LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
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
            value: item.CODE,
            label: item.CODE,
          }));
          setCurrencyOptions(options);
          // const selectedCurrencyOption = options.find(option => option.value === currency);
          // setSelectedCurrency(selectedCurrencyOption || null);
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
          const selectedProjectOption = options.find((option) => option.value === selectedData[0].PROJECT);
          setSelectedProject(selectedProjectOption || null);
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
          console.log("Product :", options);
          const selectedProductOption = options.find((option) => option.value === selectedData[0].PRODUCT);
          setSelectedProduct(selectedProductOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });

      LookupParamService.fetchLookupData("MSDT_FORMCUST", authToken, branchId)
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
          setCustomerOptions(options);
          console.log("Customer :", customer);
          const selectedCustomerOption = options.find((option) => option.value === selectedData[0].CUSTOMER);
          setSelectedCustomer(selectedCustomerOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });
    }
  }, [selectedData]);

  const handlePaymentTermChange = (selectedOption) => {
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");
  };

  // const handlePrNumberChange = (selectedOption) => {
  //   setSelectedPrNumber(selectedOption);
  //   setPrNumber(selectedOption ? selectedOption.value : "");
  // };

  // Handle PR Number Change
  const handleSoNumberChange = (selectedOption) => {
    setSelectedSoNumber(selectedOption);
    const soNumber = selectedOption?.value || "";
    setSoNumber(soNumber);
  
    if (selectedOption) {
      // Fetch additional data using LookupService
      LookupService.fetchLookupData(
        `SALE_FORMSAOR&filterBy=SO_NUMBER&filterValue=${soNumber}&operation=EQUAL`,
        authToken,
        branchId
      )
        .then((response) => {
          const data = response.data[0];
          if (data) {
            // Autofill all relevant fields
            setCustomer(data.customer || "");
            setToAddress(data.to_address || "");
            setOrderDate(data.order_date || "");
            setProject(data.project || "");
            setStatus(data.status_so || "");
            setStartPeriod(data.project_period_startdate || "");
            setEndPeriod(data.project_period_enddate || "");
            setCurrency(data.currency || "");
            setContract(data.loi_so_spk_contract || "");
            setNegotiationRate(data.negotiation_rate || "");
            setPaymentTerm(data.payment_term || "");
            setSalesPerson(data.sales_person || "");
            setManagerPerson(data.manager_person || "");
            setDescription(data.description || "");
  
            // Autofill specific fields from selectedOption if needed
            setID(selectedOption.id || null);
            setTotalPrice(selectedOption.totalAmount || null);
          } else {
            console.log("No data found for the selected SO Number.");
            clearForm(); // Clear form if no data found
          }
        })
        .catch((error) => {
          console.error("Failed to fetch data for the selected SO Number:", error);
        });
    } else {
      // Clear form if no SO Number is selected
      clearForm();
    }
  };
  
  // Helper function to clear all fields
  const clearForm = () => {
    setCustomer("");
    setSoNumber("");
    setToAddress("");
    setOrderDate("");
    setProject("");
    setStatus("");
    setStartPeriod("");
    setEndPeriod("");
    setCurrency("");
    setContract("");
    setNegotiationRate("");
    setPaymentTerm("");
    setSalesPerson("");
    setManagerPerson("");
    setDescription("");
    setID(null);
    setTotalAmount(null);
    setSelectedProject(null);
  };
  
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");
  };

  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
    setCustomer(selectedOption ? selectedOption.value : "");
    if (selectedOption) {
      setToAddress(selectedOption.to_address); // Assuming selectedOption contains an address field
    } else {
      setToAddress(""); // Clear address if no customer is selected
    }
  };

  const handleToAddressChange = (selectedOption) => {
    setToAddress(selectedOption? selectedOption.value : "");
  };

  const handleNegotiationRateChange = (selectedOption) => {
    setNegotiationRate(selectedOption || "");
  };

  const handlePpnAmountChange = (e) => {
    // Remove any non-numeric characters (except the decimal point)
    const value = e.target.value.replace(/[^\d.-]/g, "");
  
    // Convert to number and update state
    setTotalPpnAmount(parseFloat(value) || 0);
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
    setStatus(selectedOption? selectedOption.value : "");
  };

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
    setCurrency(selectedOption ? selectedOption.value : "");
  }


  const handleSalesPersonChange = (selectedOption) => {
    setSelectedSalesPerson(selectedOption);
    setSalesPerson(selectedOption ? selectedOption.value : "");
  };

  const handleCreatedByChange = (selectedOption) => {
    setSelectedSalesPerson(selectedOption);
    setCreatedBy(selectedOption ? selectedOption.value: "")
  }

  const handleManagerPersonChange = (selectedOption) => {
    setSelectedManagerPerson(selectedOption);
    setManagerPerson(selectedOption ? selectedOption.value : "");
  };

  const handleProductChange = (index, selectedOption) => {
    const updatedItems = [...items]; // Create a copy of the items array
    updatedItems[index].product = selectedOption ? selectedOption.value : ""; // Update the specific item's product
    setItems(updatedItems); // Set the updated items array in the state
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: "",
        so_number: "",
        product: "",
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        type_of_vat: "Select an Option",
        tax_ppn: 0,
        tax_ppn_type: "",
        tax_ppn_rate: 0,
        tax_ppn_amount: 0,
        tax_pph: 0,
        tax_pph_type: "",
        tax_pph_rate: 0,
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
    if (field === "product" || field === "currency") {
      newItems[index][field] = value ? value.value : null;
    } else {
      newItems[index][field] = value;
    }

    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }

    setItems(newItems);
  };

  const handleDeleteItem = async (index) => {
    // Get the item to be deleted based on the index
    const itemToDelete = items[index];

    if (itemToDelete && itemToDelete.ID) {
      try {
        // Call the Delete API for the item using the ID
        const itemId = itemToDelete.ID;
        const deleteResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUREQD", authToken, branchId);
        console.log("Item deleted from API successfully:", deleteResponse);

        // Proceed to update local state only if API call was successful
        const newItems = items.filter((item, i) => i !== index);
        setItems(newItems);
        setSelectedItems(selectedItems.filter((i) => i !== index));
      } catch (error) {
        console.error("Error deleting item from API:", error);
        // Optionally, you can display an error message to the user here
      }
    } else {
      // If the item doesn't have an ID, simply remove it from local state
      const newItems = items.filter((item, i) => i !== index);
      setItems(newItems);
      setSelectedItems(selectedItems.filter((i) => i !== index));
      console.log("Item removed locally, no ID found.");
    }
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
    setSoNumber("");
    setCustomer("");
    setProject("");
    setStatus("");
    setOrderDate("");
    setStartPeriod("");
    setEndPeriod("");
    setCurrency("");
    setPaymentTerm("");
    setContract("");
    setNegotiationRate("");
    setSalesPerson("");
    setManagerPerson("");
    setTypeOfPayment("");
    setTermOfPayment("");
    setProject("");
    setDescription("");
    setItems([]);
    setSelectedItems([]);
    setSelectedCustomer(null);
    setSelectedSoNumber(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
    setSelectedPaymentTerm(null);
    setSelectedVendor(null);
    setSelectedDocRef(null);
  };

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
  

  const handleSave = async (event) => {
    event.preventDefault();

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Purchase Invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Save It!",
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
          doc_reference,
          // internalmemo,
          title,
          payment_term, // Converts to date format
          invoice_number,
          invoice_type,
          invoice_date,
          invoice_status: "IN_PROCESS",
          vendor,
          tax_rate,
          tax_invoice_number,
          term_of_payment,
          bi_middle_rate,
          total_tax_base,
          total_amount_ppn,
          total_amount_pph,
          project,
          due_date,
          description,
          total_amount,
        };

        console.log("Master", generalInfo);

        const response = await InsertDataService.postData(generalInfo, "SAOR", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
          // Iterate over items array and post each item individually
          for (const item of items) {
            const updatedItem = {
              ...item,
              invoice_number,
              type_of_vat: item.vat,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,
              tax_base: item.total_tax_base,
              tax_ppn_amount: item.total_amount_ppn,
              tax_pph_amount: item.total_amount_pph,
            };
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if (!title) {
    //   messageAlertSwal("Error", "Title cannot be empty", "error");
    //   return;
    // }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the Purchase Invoice?",
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
        const generalInfo = {
          doc_reference,
          title,
          payment_term, 
          invoice_number,
          invoice_type,
          invoice_date,
          invoice_status: "IN_PROCESS",
          vendor,
          tax_rate,
          tax_invoice_number,
          term_of_payment,
          bi_middle_rate,
          total_tax_base,
          total_amount_ppn,
          total_amount_pph,
          project,
          due_date,
          description,
          total_amount,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
        console.log("Data posted successfully:", response);

        if (response.message === "insert Data Successfully") {
            for (const item of items) {
            const updatedItem = {
              ...item,
              invoice_number,
              type_of_vat: item.vat,
              tax_ppn: item.tax_ppn_type,
              tax_pph: item.tax_pph_type,
              tax_base: item.total_tax_base,
              tax_ppn_amount: item.total_amount_ppn,
              tax_pph_amount: item.total_amount_pph,
            };
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;

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
        setIsLoading(false); 
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
                <Card.Title>General Information</Card.Title>
                <div className="ml-auto">
                  <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => {
                      handleRefresh();
                      setIsEditingPurchaseInvoice(false);
                    }}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </Button>
                  <Button variant="primary" className="mr-2" onClick={handleSave}>
                    <i className="fas fa-save"></i> Save
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
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
                        <Select
                          id="customer"
                          options={customerOptions} 
                          isClearable
                          placeholder="Select..."
                          value={selectedCustomer}
                          onChange={handleCustomerChange} 
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="soNumber">
                        <Form.Label>SO Number</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={so_number} 
                          readOnly 
                          placeholder="Nomor SO" 
                        />
                      </Form.Group>
                      {/* Add other form fields here */}
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="to_address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter the Address"
                          value={to_address} 
                          onChange={handleToAddressChange}
                          readOnly 
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Order Date</Form.Label>
                        <Form.Control 
                          type="date"  
                          value={order_date} 
                          onChange={(e) => setOrderDate(e.target.value)} 
                          required 
                          />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Project</Form.Label>
                        <Select 
                          id="project" 
                          options={projectOptions} 
                          isClearable 
                          value={selectedProject}
                          onChange={handleProjectChange}
                          placeholder="Select..." 
                          required 
                          />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={status_so} 
                          readOnly 
                          placeholder="NEW"
                          onChange={handleStatusChange}
                          required
                          />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Project Period</Form.Label>
                        <div className="d-flex">
                          <Form.Control 
                            type="date"
                            value={project_period_startdate} 
                            onChange={(e) => handleProjectStartChange(e.target.value)}
                            required 
                            />
                          <div className="d-flex justify-content-center items-center mx-2">-</div>
                          <Form.Control 
                            type="date"
                            value={project_period_enddate} 
                            onChange={(e) => handleProjectEndChange(e.target.value)}
                            required 
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Currency</Form.Label>
                        <Select 
                          id="Select the currency" 
                          options={currencyOptions} 
                          isClearable 
                          placeholder="Select..."
                          value={selectedCurrency} 
                          onChange={handleCurrencyChange} 
                          required 
                          />
                      </Form.Group>
                      <Form.Group controlId="">
                        <Form.Label>LOI/PO/SPK/Contract</Form.Label>
                        <Form.Control 
                          type="text" 
                          isClearable 
                          placeholder=" " 
                          value={loi_so_spk_contract}
                          onChange={(e) => handleContractChange(e.target.value)}
                          required 
                          />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="negotiationRate">
                        <Form.Label>Negotiation Rate</Form.Label>
                        <Form.Control
                          type="number"
                          value={negotiation_rate}
                          onChange={(e) => handleNegotiationRateChange(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>


                    <Col md={6}>
                      <Form.Group controlId="">
                        <Form.Label>Payment Term</Form.Label>
                        <Select 
                          id="paymentTerm" 
                          options={paymentTermOptions} 
                          value={selectedPaymentTerm}
                          isClearable 
                          placeholder="Select..." 
                          onChange={handlePaymentTermChange} required />
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
                        <Select
                          id="managerPerson"
                          options={ManagerPersonOptions}
                          isClearable
                          placeholder="Select..."
                          onChange={handleManagerPersonChange} 
                          value={selectedManagerPerson}
                          required
                        />
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
                              <th>Total Price</th>
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
                              <th>Total Tax Base</th>

                              {/* <th>Total Price</th> */}
                              <th>Actions</th>
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
                                    <Form.Control type="number" value={item.quantity || 0} min="0" onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.unit_price || 0} min="0" onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))} />
                                  </td>

                                  <td>{item.total_price.toLocaleString("en-US", { style: "currency", currency: item.currency || 0 })}</td>

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
                                    <Form.Control type="text" value={item.total_tax_base} onChange={(e) => handleItemChange(index, "total_tax_base", e.target.value)} />
                                  </td>

                                  {/* <td>
                                    <Form.Control type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value) || 0)} />
                                  </td> */}
                                  {/* <td>{item.total_price.toLocaleString("en-US", { style: "currency", currency: item.currency })}</td> */}
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
                              <td colSpan="16" className="text-right">
                                Total Tax Base:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="16" className="text-right">
                                Total Ppn Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="16" className="text-right">
                                Total Pph Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="16" className="text-right">
                                Total Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
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
                setIsEditingPurchaseInvoice(false);
              }}
            >
              <i className="fas fa-arrow-left"></i> Go Back
            </Button>
            <Button variant="primary" className="mr-2" onClick={handleSave}>
              <i className="fas fa-save"></i> Save
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              <i className="fas fa-check"></i> Submit
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

export default EditSalesOrder;
