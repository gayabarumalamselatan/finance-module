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
import { GENERATED_DUE_DATE } from "../config/ConfigUrl";
import axios from "axios";
const EditPurchaseInvoice = ({ setIsEditingPurchaseInvoice, handleRefresh, index, item, selectedData }) => {
  console.log("selectedData", selectedData);
  const headers = getToken();
  const branchId = getBranch();
  const [pr_number, setPrNumber] = useState("");
  const [request_date, setRequestDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [schedule_date, setScheduleDate] = useState("");
  const [doc_no, setDocNo] = useState("FRM.PTAP.PRC.21a-01");
  const [doc_reff, setDocReff] = useState("");
  const [requestor, setRequestor] = useState("");
  const [departement, setDepartment] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [status_request, setStatusRequest] = useState("Draft");
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
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoice_number, setInvoiceNumber] = useState("");

  //   #INVOICE
  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [payment_term, setPaymentTerm] = useState("");
  const [invoice_date, setInvoiceDate] = useState("");
  const [ID, setID] = useState("");
  const [due_date, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [po_number, setPoNumber] = useState("");
  const [internalmemo, setInternalMemo] = useState("");
  const [tax_rate, setTaxRate] = useState("");
  const [bi_middle_rate, setBiMiddleRate] = useState("");
  const [tax_invoice_number, setTaxInvoiceNumber] = useState("");
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
  const [tax_pph_option, setTax_Pph_Option] = useState([]);
  const [PphRate, setPphRate] = useState("");
  const [PpnRate, setPpnRate] = useState("");
  const [selectedTaxPphType, setSelectedTaxPphType] = useState(null);
  const [selectedtaxtype, setSelectedTaxType] = useState(null);
  const [tax_ppn_type, setTaxPpnType] = useState("");
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [type_of_payment, setTypeOfPayment] = useState("");
  const [term_of_payment, setTermOfPayment] = useState("");
  const [total_tax_base, setTotalTaxBase] = useState("");
  const [total_amount_ppn, setTotalAmountPpn] = useState("");
  const [total_amount_pph, setTotalAmountPph] = useState("");
  const [allvendoroptions, setAllVendorOptions] = useState([]);
  const [doc_reference, setDocReference] = useState("");
  const [selecteddocref, setSelectedDocRef] = useState(null);
  const [selectedbothvendor, setSelectedBothVendor] = useState([]);
  const [invoice_status, setInvoiceStatus] = useState("Draft");
  const [doc_reff_no, setDocReffNo] = useState("");

  const authToken = headers;
  useEffect(() => {
    if (selectedData) {
      const { ID, INVOICE_NUMBER } = selectedData[0];
      // Set data awal dari selectedData
      console.log("id and invoice number", ID, INVOICE_NUMBER);
      setInvoiceNumber(INVOICE_NUMBER);

      // Panggil API untuk mendapatkan data berdasarkan ID
      // LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=invoice_number&filterValue=${invoice_number}&operation=EQUAL`, authToken, branchId)
      //   .then((response) => {
      //     const data = response.data[0];
      //     console.log("Data:", data);
      //     setInvoiceNumber(data.invoice_number);
      //     setTitle(data.title);
      //     setVendor(data.vendor);
      //     setDueDate(data.dueDate);
      //     setTermOfPayment(data.term_of_payment);
      //     setTypeOfPayment(data.type_of_payment);
      //     setBiMiddleRate(data.bi_middle_rate);

      //     setProject(data.project);
      //     setDescription(data.description);
      //   })
      //   .catch((error) => {
      //     console.error("Failed to load purchase request data:", error);
      //   });

      LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=INVOICE_NUMBER&filterValue=${INVOICE_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const data = response.data[0];
          if (data) {
            setInvoiceNumber(data.invoice_number);
            setDocReffNo(data.doc_reff_no);
            setDocRef(data.doc_reff);
            setTitle(data.title);
            setVendor(data.vendor);
            setDueDate(data.due_date);
            setTermOfPayment(data.term_of_payment);
            setTypeOfPayment(data.type_of_payment);
            setBiMiddleRate(data.bi_middle_rate);
            setTaxInvoiceNumber(data.tax_invoice_number);
            setProject(data.project);
            setPaymentTerm(data.payment_term);
            setDescription(data.description);
            setInvoiceDate(data.invoice_date);
            setInvoiceType(data.invoice_type);
            setDocReference(data.doc_reference);
            setTaxRate(data.tax_rate);
          } else {
            console.log("No data found");
          }
        })
        .catch((error) => {
          console.error("Failed to load purchase invoice data:", error);
        });

      // Panggil API untuk mendapatkan item berdasarkan pr_number
      // LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${PR_NUMBER}&operation=EQUAL`, authToken, branchId)
      //     .then(response => {
      //         const fetchedItems = response.data || [];
      //         console.log('Items fetch:', fetchedItems);
      //         setItems(fetchedItems);
      //     })
      //     .catch(error => {
      //         console.error('Failed to load items:', error);
      //     });

      // Fetch items based on PR_NUMBER and set them to state
      LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=invoice_number&filterValue=${INVOICE_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          // Set fetched items to state
          setItems(fetchedItems);

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
              setTax_Pph_Option(options);

              const optionsPpn = transformedData
                .filter((item) => item.TAX_TYPE === "PPN")
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                }));
              setTaxPpnTypeOption(optionsPpn);
              const selectedPPNOption = optionsPpn.find((option) => option.value === selectedData[0].TAX_PPN);
              setSelectedTaxType(selectedPPNOption || null);
            })
            .catch((error) => {
              console.error("Failed to fetch currency lookup:", error);
            });

          // Fetch product lookup data
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

          // Extract vendor options
          const vendorOptions = transformedData.map((item) => ({
            value: item.NAME,
            label: item.NAME,
          }));

          // Set all vendor options
          setAllVendorOptions(vendorOptions);

          // Set vendor options (filtered by ENTITY_TYPE === "BOTH")
          const bothOptions = vendorOptions.filter((option) => option.value === transformedData.find((item) => item.ENTITY_TYPE === "BOTH").NAME);
          setVendorOptions(bothOptions);

          // Set selected vendor option
          const selectedVendor = vendorOptions.find((option) => option.value === selectedData[0].VENDOR);
          setSelectedVendor(selectedVendor ? selectedVendor : null);
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

          const options = transformedData.map((item) => ({
            value: item.COUNT,
            label: item.NAME,
            dateType: item.DATE_TYPE,
          }));

          setPaymentTermOptions(options);

          // Get the payment term value from the selected data
          const paymentTermValue = selectedData[0].PAYMENT_TERM;

          // Find the corresponding payment term option
          const selectedPaymentTermOption = options.find((option) => option.value === paymentTermValue);

          // Update the payment term state
          setSelectedPaymentTerm(selectedPaymentTermOption);
          setPaymentTerm(paymentTermValue);
        })
        .catch((error) => {
          console.error("Failed to fetch payment term lookup:", error);
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

  const handlePaymentTermChange = async (selectedOption) => {
    console.log("pay term select", selectedOption);
    console.log(due_date);
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");

    const payload = {
      date: invoice_date,
      count: selectedOption ? selectedOption.value : "",
      dateType: selectedOption ? selectedOption.dateType : "",
    };

    console.log(payload);
    try {
      // Hit the API with the required data and Bearer token in the headers
      const response = await axios.post(`${GENERATED_DUE_DATE}`, payload, {
        headers: {
          Authorization: `Bearer ${headers}`,
        },
      });

      // Process the response if needed
      console.log("API response:", response.data.dueDate);
      setDueDate(response.data.dueDate);
    } catch (error) {
      // Handle any errors
      console.error("Error calling API:", error);
    }
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
      const projectValue = selectedOption.project || selectedOption.PR_NUMBER;

      const matchingProjectOption = projectOptions.find((option) => option.value === projectValue);
      setSelectedProject(matchingProjectOption ? matchingProjectOption : null);
      setProject(selectedOption.project);
      setID(selectedOption.id); // Set the selected ID value
      setTotalAmount(selectedOption.totalAmount); // Autofill total amount
      setTitle(selectedOption.title);
      setDescription(selectedOption.description); // Autofill description
    } else {
      setSelectedProject(null);
      setTotalAmount(null); // Clear total amount if no option is selected
      setTitle(null);
      setID(null); // Clear the ID value if no option is selected
      setDescription(null);
    }
  };

  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "");
  };

  const handleBothVendorChange = (selectedOption) => {
    setSelectedBothVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "");
  };

  const handlePoNumberChange = (selectedOption) => {
    setSelectedPoNumber(selectedOption);
    setPoNumber(selectedOption ? selectedOption.value : "");
  };

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");
    console.log("project", project);
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
        type_of_vat: "",
        tax_ppn: "",
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
        vat_included: false,
        new_unit_price: 0,
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    // newItems[index].original_unit_price = newItems[index].unit_price || 0;

    console.log(index, field, value);

    // Itungan Baru

    // Reset field vat type dan ppn type ketika mengubah unit price dan quantity

    if (field === "unit_price" || field === "quantity") {
      newItems[index].type_of_vat = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_ppn = "";
      newItems[index].tax_pph_rate = 0;
      newItems[index].tax_pph = "";
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      if (newItems[index].vat_included !== undefined) {
        newItems[index].vat_included = false;
      }
    }
    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }

    // Itungan New Unit Price
    let pengkali = newItems[index].tax_ppn_rate / 100;

    if (field === "tax_ppn" || field === "tax_ppn_rate") {
      if (newItems[index].type_of_vat === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;
        newItems[index].tax_base = Math.round(newItems[index].unit_price / ((1 + newItems[index].tax_ppn_rate / 100) * newItems[index].quantity));
        newItems[index].tax_ppn_amount = Math.round(newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100));
        newItems[index].vat_included = true;
      } else if (newItems[index].type_of_vat === "exclude") {
        newItems[index].tax_ppn_amount = Math.round(newItems[index].total_price * (newItems[index].tax_ppn_rate / 100));
        newItems[index].tax_base = Math.round(newItems[index].unit_price * newItems[index].quantity);
      }
      newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    }

    let pengkali2 = newItems[index].tax_pph_rate / 100;

    // if (field === "tax_pph_type" || field === "tax_pph_rate") {
    //   if (newItems[index].vat_type === "include") {
    //     newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali2;
    //     newItems[index].tax_base = Math.round(newItems[index].unit_price / ((1 + newItems[index].tax_pph_rate / 100) * newItems[index].quantity));
    //     newItems[index].tax_pph_amount = Math.round(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100));
    //     newItems[index].vat_included = true;
    //   } else if (newItems[index].vat_type === "exclude") {
    //     newItems[index].tax_pph_amount = Math.round(newItems[index].total_price * (newItems[index].tax_pph_rate / 100));
    //     newItems[index].tax_base = Math.round(newItems[index].unit_price * newItems[index].quantity);
    //   }
    //   newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    // }

    if (field === "type_of_vat") {
      newItems[index].tax_ppn = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_pph = "";
      newItems[index].tax_pph_rate = 0;
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      if (newItems[index].type_of_vat === "exclude" && newItems[index].vat_included === true) {
        newItems[index].new_unit_price = newItems[index].new_unit_price - newItems[index].unit_price * pengkali;
        newItems[index].vat_included = false;
      } else {
        newItems[index].new_unit_price = newItems[index].unit_price;
      }
      newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    }

    if (field === "tax_pph" || field === "tax_pph_rate") {
      if (newItems[index].type_of_vat === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali2;
        // newItems[index].tax_base = Math.round(newItems[index].unit_price / ((1 + newItems[index].tax_pph_rate / 100) * newItems[index].quantity));
        newItems[index].tax_pph_amount = Math.round(((newItems[index].total_price / (1 + newItems[index].tax_ppn_rate / 100)) * newItems[index].tax_pph_rate) / 100);
        newItems[index].vat_included = true;
      } else if (newItems[index].type_of_vat === "exclude") {
        newItems[index].tax_pph_amount = Math.round(newItems[index].total_price * (newItems[index].tax_pph_rate / 100));
        // newItems[index].tax_base = Math.round(newItems[index].unit_price * newItems[index].quantity);
      }
      newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    }

    // Itungan Original Unit Price

    // let pengkali = newItems[index].tax_ppn_rate/100;

    // if (field === 'tax_ppn_type' || field === 'tax_ppn_rate') {
    //   if (newItems[index].vat_type === 'include'){
    //     newItems[index].unit_price = newItems[index].original_unit_price + (newItems[index].original_unit_price * (pengkali));
    //     newItems[index].tax_base = newItems[index].unit_price / ((1 + (newItems[index].tax_ppn_rate / 100)) * newItems[index].quantity);
    //     newItems[index].tax_ppn_amount = newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100);
    //     newItems[index].vat_included = true;
    //   } else if (newItems[index].vat_type === "exclude"){
    //     newItems[index].tax_ppn_amount = newItems[index].total_price * (newItems[index].tax_ppn_rate/100);
    //     newItems[index].tax_base = newItems[index].unit_price * newItems[index].quantity;
    //   }
    //   newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    // }

    // if (field === 'vat_type') {
    //   newItems[index].tax_ppn_type = '';
    //   newItems[index].tax_ppn_rate = 0;
    //   newItems[index].tax_base = 0;
    //   newItems[index].tax_ppn_amount = 0;
    //   if (newItems[index].vat_type === 'exclude' && newItems[index].vat_included === true) {
    //     newItems[index].unit_price = newItems[index].unit_price - (newItems[index].original_unit_price * (pengkali));
    //     newItems[index].vat_included = false;

    //   }else{
    //     newItems[index].new_unit_price = newItems[index].unit_price;

    //   }
    //   newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity;
    // }

    console.log("new unit price", newItems[index].new_unit_price);
    console.log("original", newItems[index].original_unit_price);
    console.log("unit", newItems[index].unit_price);
    console.log("pengkali", pengkali);
    console.log("vatinc", newItems[index].vat_included);
    console.log("base", newItems[index].tax_base);
    console.log("vat", newItems[index].type_of_vat);
    console.log("pengkali2", pengkali2);

    // if (field === 'tax_type') {
    //   const selectedTaxType = taxTypeOptions.find(option => option.value === value);
    //   setPPNRate(selectedTaxType ? selectedTaxType.RATE : '');
    // }

    setItems(newItems);
  };

  const handleDeleteItem = async (index) => {
    // Get the item to be deleted based on the index
    const itemToDelete = items[index];

    if (itemToDelete && itemToDelete.ID) {
      try {
        // Call the Delete API for the item using the ID
        const itemId = itemToDelete.ID;
        const deleteResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUINVCD", authToken, branchId);
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
    const subTotal = items.reduce((total, item) => {
      const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
      return total + taxBase;
    }, 0);

    const totalPPNAmount = items.reduce((total, item) => {
      const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : item.tax_ppn_amount;
      return total + taxPPNAmount;
    }, 0);

    const totalPPHAmount = items.reduce((total, item) => {
      const taxPPHAmount = isNaN(item.tax_pph_amount) ? 0 : item.tax_pph_amount;
      return total + taxPPHAmount;
    }, 0);

    const total_amount = subTotal + totalPPNAmount + totalPPHAmount;
    const validTotalAmount = isNaN(total_amount) ? 0 : total_amount;
    return { subTotal, totalPPNAmount, totalPPHAmount, totalAmount: validTotalAmount };
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
    setTitle("");
    setInternalMemo("");
    setID("");
    setInvoiceNumber("");
    setInvoiceType("");
    setInvoiceDate("");
    setVendor("");
    setPaymentTerm("");
    setDueDate("");
    setTaxRate("");
    setTaxInvoiceNumber("");
    setBiMiddleRate("");
    setTypeOfPayment("");
    // setTermOfPayment("");
    setProject("");
    setDescription("");
    setItems([]);
    setSelectedItems([]);
    setSelectedPrNumber(null);
    setSelectedPoNumber(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
    setSelectedPaymentTerm(null);
    setSelectedVendor(null);
    setSelectedDocRef(null);
  };

  const generatePrNumber = async () => {
    try {
      const uniquePrNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=PR`, authToken);
      return uniquePrNumber;
    } catch (error) {
      console.error("Failed to generate PR Number:", error);
      throw error; // Rethrow the error to be caught in handleSave
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
        console.log("Status: ", status_request);

        // const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating
        const { subTotal, totalPPNAmount, totalPPHAmount, total_amount } = calculateTotalAmount();

        const generalInfo = {
          doc_reff: docRef,
          doc_reff_no: doc_reference,
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
          total_tax_base: subTotal,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          project,
          due_date,
          description,
          total_amount: total_amount,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
        console.log("General data posted successfully:", response);

        if (response.message === "Update Data Successfully") {
          // Iterate over items array and attempt to delete each item
          for (const item of items) {
            if (item.ID) {
              const itemId = item.ID;
              try {
                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUINVCD", authToken, branchId);
                console.log("Item deleted successfully:", itemResponse);
              } catch (error) {
                console.error("Error deleting item:", itemId, error);
              }
            } else {
              console.log("No ID found, skipping delete for this item:", item);
            }
          }

          // After deletion, insert updated items
          for (const item of items) {
            // Exclude rwnum, ID, status, and id_trx fields
            const { rwnum, ID, status, id_trx, ...rest } = item;

            const updatedItem = {
              ...rest,
              invoice_number,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
              console.log("Item inserted successfully:", itemResponse);
            } catch (error) {
              console.error("Error inserting item:", updatedItem, error);
            }
          }

          // Show success message and reset form
          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false);
        setIsEditingPurchaseInvoice(false);
        handleRefresh(); // Set loading state back to false after completion
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
        console.log("Status: ", status_request);

        // const total_amount = calculateTotalAmount();
        // Save general information and description
        const createBy = sessionStorage.getItem("userId");
        const id = selectedData[0].ID; // Assuming you use selectedData to get the ID for updating

        const { subTotal, totalPPNAmount, totalPPHAmount, total_amount } = calculateTotalAmount();

        const generalInfo = {
          doc_reff: docRef,
          doc_reff_no: doc_reference,
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
          total_tax_base: subTotal,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          project,
          due_date,
          description,
          total_amount: total_amount,
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        const response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
        console.log("General data posted successfully:", response);

        if (response.message === "Update Data Successfully") {
          // Iterate over items array and attempt to delete each item
          for (const item of items) {
            if (item.ID) {
              const itemId = item.ID;
              try {
                const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "PUINVCD", authToken, branchId);
                console.log("Item deleted successfully:", itemResponse);
              } catch (error) {
                console.error("Error deleting item:", itemId, error);
              }
            } else {
              console.log("No ID found, skipping delete for this item:", item);
            }
          }

          // After deletion, insert updated items
          for (const item of items) {
            // Exclude rwnum, ID, status, and id_trx fields
            const { rwnum, ID, status, id_trx, ...rest } = item;

            const updatedItem = {
              ...rest,
              invoice_number,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
              console.log("Item inserted successfully:", itemResponse);
            } catch (error) {
              console.error("Error inserting item:", updatedItem, error);
            }
          }

          // Show success message and reset form
          messageAlertSwal("Success", response.message, "success");
          resetForm();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false);
        setIsEditingPurchaseInvoice(false);
        handleRefresh(); // Set loading state back to false after completion
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
                    {/* <Col md={6}>
                      <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter Title" value={title || ""} onChange={(e) => setTitle(e.target.value)} disabled={docRef === "purchaseOrder"} required />
                      </Form.Group>
                    </Col> */}

                    {/* {docRef === "purchaseRequest" ? (
                      <Col md={6}>
                        <Form.Group controlId="formId">
                          <Form.Label>ID</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter ID"
                            value={ID}
                            onChange={(e) => setID(e.target.value)}
                            required
                            disabled={true} // Add this prop to disable the field
                          />
                        </Form.Group>
                      </Col>
                    ) : (
                      <Col md={6}>
                        <Form.Group controlId="formId">
                          <Form.Label>ID</Form.Label>
                          <Form.Control type="number" placeholder="Enter ID" value={ID} onChange={(e) => setID(e.target.value)} required />
                        </Form.Group>
                      </Col>
                    )} */}

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

                    <Col md={6}>
                      <Form.Group controlId="formDocRef">
                        <Form.Label>Document Reference Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Reference Number" value={doc_reff_no} onChange={(e) => setDocReffNo(e.target.value)} />
                      </Form.Group>
                    </Col>
                    {/*
                    {docRef === "purchaseRequest" && (
                      <Col md={6}>
                        <Form.Group controlId="formPrNumber">
                          <Form.Label>PR Number</Form.Label>
                          <Select value={selectedPrNumber} onChange={handlePrNumberChange} options={prNumberOptions} isClearable placeholder="Select PR Number..." readOnly />
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
                    )} */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formDocSource">
                        <Form.Label>Choose File</Form.Label>
                        <Form.Control type="file" placeholder="Choose File" value={doc_source} onChange={(e) => setDocSource(e.target.files[0])} />
                      </Form.Group>
                    </Col> */}

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
                      <Form.Group controlId="formInvoiceNumber">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Invoice Number" value={invoice_number} onChange={(e) => setInvoiceNumber(e.target.value)} />
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

                    {/* <Col md={6}>
                      <Form.Group controlId="formInvoiceType">
                        <Form.Label>Invoice Type</Form.Label>
                        <Form.Control type="text" placeholder="Enter Invoice Type" value={invoice_type} onChange={(e) => setInvoiceType(e.target.value)} />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceDate">
                        <Form.Label>Invoice Date</Form.Label>
                        <Form.Control type="date" value={invoice_date} onChange={(e) => setInvoiceDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    {docRef === "purchaseRequest" ? (
                      <Col md={6}>
                        <Form.Group controlId="formProject">
                          <Form.Label>Project</Form.Label>
                          <Select
                            value={selectedProject}
                            onChange={handleProjectChange}
                            options={projectOptions}
                            isClearable
                            placeholder="Select Project..."
                            isDisabled={true} // Add this prop to disable the field
                          />
                        </Form.Group>
                      </Col>
                    ) : (
                      <Col md={6}>
                        <Form.Group controlId="formProject">
                          <Form.Label>Project</Form.Label>
                          <Select value={selectedProject} onChange={handleProjectChange} options={projectOptions} isClearable placeholder="Select Project..." isDisabled={docRef === "purchaseOrder"} />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseRequest" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}
                    {docRef === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select value={selectedbothvendor} onChange={handleBothVendorChange} options={allvendoroptions} isClearable placeholder="Select Vendor..." isDisabled />
                        </Form.Group>
                      </Col>
                    )}
                    {!(docRef === "purchaseRequest" || docRef === "purchaseOrder") && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={allvendoroptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}

                    {docRef === "purchaseOrder" ? (
                      <Col md={6}>
                        <Form.Group controlId="formPaymentTerm">
                          <Form.Label>Payment Term</Form.Label>
                          <Select value={selectedPaymentTerm} onChange={handlePaymentTermChange} options={paymentTermOptions} isClearable placeholder="Select Payment Term..." isDisabled />
                        </Form.Group>
                      </Col>
                    ) : (
                      <Col md={6}>
                        <Form.Group controlId="formPaymentTerm">
                          <Form.Label>Payment Term</Form.Label>
                          <Select value={selectedPaymentTerm} onChange={handlePaymentTermChange} options={paymentTermOptions} isClearable placeholder="Select Payment Term..." />
                        </Form.Group>
                      </Col>
                    )}

                    <Col md={6}>
                      <Form.Group controlId="formDueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control type="date" value={due_date} onChange={(e) => setDueDate(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceStatus">
                        <Form.Label>Invoice Status</Form.Label>
                        <Form.Control type="Text" placeholder="Enter Invoice Status" value={invoice_status} onChange={(e) => setInvoiceStatus(e.target.value)} disabled />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTaxRate">
                        <Form.Label>Tax Rate</Form.Label>
                        <Form.Control type="text" placeholder="Enter Tax Rate" value={tax_rate} onChange={(e) => setTaxRate(e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTaxInvoiceNumber">
                        <Form.Label>Tax Invoice Number</Form.Label>
                        <Form.Control type="number" min="0" placeholder="Enter Tax Invoice Number" value={tax_invoice_number} onChange={(e) => setTaxInvoiceNumber(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formBiMiddleRate">
                        <Form.Label>BI Middle Rate</Form.Label>
                        <Form.Control type="text" placeholder="Enter BI Middle" value={bi_middle_rate} onChange={(e) => setBiMiddleRate(e.target.value)} />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                      <Form.Group controlId="formTypeOfPayment">
                        <Form.Label>Type of Payment</Form.Label>
                        <Form.Control type="text" placeholder="Enter Type Of Payment" value={type_of_payment} onChange={(e) => setTypeOfPayment(e.target.value)} />
                      </Form.Group>
                    </Col> */}
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
                              {/* <th>ID</th> */}
                              {/* <th>Invoice Number</th> */}
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
                              {/* <th>Tax PPN Amount</th> */}
                              <th>Tax PPH</th>
                              {/* <th>Tax PPh</th> */}
                              <th>Tax PPh Rate</th>
                              {/* <th>Tax PPh Amount</th> */}
                              {/* <th>Tax PPh Amount</th> */}
                              <th>Total Tax Base</th>

                              {/* <th>Total Price</th> */}
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="15" className="text-center">
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
                                  {/* <td>
                                    <Form.Control type="number" value={item.id || selectedPrNumber?.id} onChange={(e) => handleItemChange(index, "id", e.target.value)} />
                                  </td> */}

                                  {/* <td>
                                    <Form.Control type="text" value={item.invoice_number} onChange={(e) => handleItemChange(index, "invoice_number", e.target.value)} />
                                  </td> */}
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
                                    <Form.Control as="select" value={item.type_of_vat} onChange={(e) => handleItemChange(index, "type_of_vat", e.target.value)}>
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
                                      value={taxPpnTypeOption.find((option) => option.value === item.tax_ppn) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn_type for the specific item
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
                                      options={taxPpnTypeOption}
                                      isClearable
                                      placeholder="Select Tax PPN Type..."
                                    />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.tax_ppn_rate} onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))} readOnly />
                                  </td>

                                  {/* <td style={{ textAlign: "right" }}>{item.tax_ppn_amount ? item.tax_ppn_amount.toLocaleString("en-US", { style: "currency", currency: item.currency }) : "IDR 0.00"}</td> */}

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
                                      value={tax_pph_option.find((option) => option.value === item.tax_pph) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_pph_type for the specific item
                                        handleItemChange(index, "tax_pph", selectedOption ? selectedOption.value : "");

                                        // Update the PphRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_pph_rate", selectedOption.RATE);
                                          setPphRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_pph_rate", 0);
                                          setPphRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      options={tax_pph_option}
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
                                  {/* <td style={{ textAlign: "right" }}>{item.tax_pph_amount ? item.tax_pph_amount.toLocaleString("en-US", { style: "currency", currency: item.currency }) : "IDR 0.00"}</td> */}

                                  <td>
                                    <Form.Control type="number" value={item.tax_base} onChange={(e) => handleItemChange(index, "total_tax_base", parseFloat(e.target.value))} readOnly />
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
                            <tr className="text-right">
                              <td colSpan="12">Subtotal:</td>
                              <td>
                                <strong>{calculateTotalAmount().subTotal.toLocaleString("en-US", { style: "currency", currency: "IDR" })}</strong>
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="12">Total Ppn Amount:</td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={calculateTotalAmount().totalPPNAmount}
                                  onChange={(e) => {
                                    const newItems = [...items];
                                    const totalPPNAmount = e.target.value;
                                    newItems.forEach((item) => {
                                      item.tax_ppn_amount = totalPPNAmount / newItems.length;
                                    });
                                    setItems(newItems);
                                  }}
                                />
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="12">Total Pph Amount:</td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={calculateTotalAmount().totalPPHAmount}
                                  onChange={(e) => {
                                    const newItems = [...items];
                                    const totalPPHAmount = e.target.value;
                                    newItems.forEach((item) => {
                                      item.tax_pph_amount = totalPPHAmount / newItems.length;
                                    });
                                    setItems(newItems);
                                  }}
                                />
                              </td>
                            </tr>
                            <tr className="text-right">
                              <td colSpan="12">Total Amount:</td>
                              <td>
                                <strong>{calculateTotalAmount().totalAmount.toLocaleString("en-US", { style: "currency", currency: "IDR" })} </strong>
                              </td>
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

export default EditPurchaseInvoice;
