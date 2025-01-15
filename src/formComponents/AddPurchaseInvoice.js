import React, { Fragment, useEffect, useState, useSyncExternalStore } from "react";
import { Button, Col, Form, InputGroup, Row, Card, CardHeader } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from "../service/InsertDataService";
import { getBranch, getToken, token } from "../config/Constant";
import { FORM_SERVICE_UPDATE_DATA, GENERATED_NUMBER, DOWNLOAD_FILES } from "../config/ConfigUrl";
import { generateUniqueId } from "../service/GeneratedId";
import Select from "react-select";
import LookupParamService from "../service/LookupParamService";
import { GENERATED_DUE_DATE, UPLOAD_FILES } from "../config/ConfigUrl";
import axios from "axios";
import LookupService from "../service/LookupService";
import UpdateDataService from "../service/UpdateDataService";
import DeleteDataService from "../service/DeleteDataService";
import UpdateStatusService from "../service/UpdateStatusService";
import DatePicker from "react-datepicker";
import moment from "moment";
import { FaCalendar } from "react-icons/fa";
import { id } from "date-fns/locale";

const AddPurchaseInvoice = ({ setIsAddingNewPurchaseInvoice, setIsEditingPurchaseInvoice, handleRefresh, index, item, selectedData, duplicateFlag, setDuplicateFlag, setIsAddingNewDuplicatePurchaseInvoice }) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem("userId");
  const idUser = sessionStorage.getItem("id");
  const [pr_number, setPrNumber] = useState("");
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestorOptions, setRequestorOptions] = useState([]);
  const [selectedRequestor, setSelectedRequestor] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({ value: "IDR", label: "IDR" });
  const [departementOptions, setDepartementOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [coaOptions, setCoaOptions] = useState([]);
  const [codCorSkbOptions, setCodCorSkbOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vendor, setVendor] = useState("");
  const [payment_term, setPaymentTerm] = useState("");
  const [invoice_date, setInvoiceDate] = useState("");
  const [ID, setID] = useState("");
  const [due_date, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [invoice_number, setInvoiceNumber] = useState("");
  const [po_number, setPoNumber] = useState("");
  const [internalmemo, setInternalMemo] = useState("");
  const [tax_rate, setTaxRate] = useState("");
  const [bi_middle_rate, setBiMiddleRate] = useState("1");
  const [tax_invoice_number, setTaxInvoiceNumber] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedCodCorSkb, setSelectedCodCorSkb] = useState(null);
  const [selectedCoa, setSelectedCoa] = useState(null);
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
  const [tax_ppn, setTaxPpnType] = useState("");
  const [taxPpnTypeOption, setTaxPpnTypeOption] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [type_of_payment, setTypeOfPayment] = useState("");
  const [term_of_payment, setTermOfPayment] = useState("");
  const [total_after_discount, setTotalAfterDiscount] = useState("");
  const [total_amount_ppn, setTotalAmountPpn] = useState("");
  const [total_amount_pph, setTotalAmountPph] = useState("");
  const [invoice_status, setInvoiceStatus] = useState("Draft");
  const [doc_reference, setDocReference] = useState("");
  const [allvendoroptions, setAllVendorOptions] = useState([]);
  const [selectedbothvendor, setSelectedBothVendor] = useState([]);
  const [doc_source, setDocSource] = useState("");
  const [doc_reff, setDocReff] = useState("");
  const [endToEnd, setEndToEnd] = useState("");
  const [idPr, setIdPr] = useState("");
  const [idPo, setIdPo] = useState("");
  const [cod_cor_skb, SetCodCorSkb] = useState("");
  const [tax_exchange_rate, setTaxExchangeRate] = useState(1);
  const [customer_contract, setCustomerContract] = useState("");
  const [file, setFile] = useState("");
  const [vatType, setVatType] = useState(null);
  const [formattedDiscount, setFormattedDiscount] = useState("IDR 0.00");
  const [discount, setDiscount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customer, setCustomer] = useState("");
  const [departement, setDepartement] = useState("");
  const [doc_reff_no, setDocReffNo] = useState("");
  const [contractNumberOptions, setContractNumberOptions] = useState([]);
  const [isAddFile, setIsAddFile] = useState(false);
  const [tax_ppn_royalty_option, setTaxPpnRoyaltyOption] = useState([]);
  const [selectedPrNumbers, setSelectedPrNumbers] = useState([]);
  const [fetchedDetail, setFetchedDetail] = useState([]);
  const [createdBy, setCreatedBy] = useState(userId);
  const [isSubmited, setIsSubmited] = useState(false);
  const [currency, setCurrency] = useState("IDR");
  const [total_amount_idr, setTotalAmountIdr] = useState("");
  const [total_after_discount_idr, setTotalAfterDiscountIdr] = useState("");
  const [total_before_discount_idr, setTotalBeforeDiscountIdr] = useState("");
  const [total_amount_ppn_idr, setTotalAmountPpnIdr] = useState("");
  const [total_amount_pph_idr, setTotalAmountPphIdr] = useState("");
  const [storedPoHeader, setStoredPoHeader] = useState([]);
  const [isCurrencyIsSet, setIsCurrencyIsSet] = useState(false);
  const [fetchedPRDetail, setFetchedPRDetail] = useState([]);
  const [taxItems, setTaxItems] = useState([]);
  const [taxSummaryItems, setTaxSummaryItems] = useState([]);
  const [taxTypeIncludeOptions, setTaxTypeIncludeOptions] = useState([]);
  const [taxTypeExcludeOptions, setTaxTypExcludeeOptions] = useState([]);
  const [taxTypeIncludepphOptions, setTaxTypeIncludePphOptions] = useState([]);
  const [taxTypeExcludepphOptions, setTaxTypExcludeePphOptions] = useState([]);

  // id
  const [payment_term_id, setPaymentTermId] = useState("");
  const create_by_id = parseInt(idUser);
  const [vendor_id, setVendorId] = useState("");
  const [currency_id, setCurrencyId] = useState("");

  const authToken = headers;

  const [inputWidth, setInputWidth] = useState(100);

  useEffect(() => {
    const generateInitialInvoiceNumber = async () => {
      const generatedInvoiceNumber = await generatePrNumber("DRAFT_INVC"); // Adjust the code as needed

      setInvoiceNumber(generatedInvoiceNumber);
    };

    generateInitialInvoiceNumber();
  }, []); // Empty dependency array means this runs once on mount

  // buat edit autofill
  useEffect(() => {
    console.log("duplicateFlag", duplicateFlag);
    console.log("selectedData", selectedData);
    if (selectedData && selectedData.length > 0) {
      const { ID, INVOICE_NUMBER } = selectedData[0];
      // Set data awal dari selectedData

      console.log("id and invoice number", ID, INVOICE_NUMBER);
      if (duplicateFlag === false) {
        setInvoiceNumber(INVOICE_NUMBER);
      }

      console.log("deda", selectedData[0]);

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
            setTaxExchangeRate(data.tax_exchange_rate);
            setInvoiceStatus(data.invoice_status);
            setTotalAmount(data.total_amount);
            setTotalAmountPpn(data.total_amount_ppn);
            setTotalAmountPph(data.total_amount_pph);
            setTotalAmountIdr(data.total_amount_idr);
            setTotalAmountPpnIdr(data.total_amount_ppn_idr);
            setTotalAmountPphIdr(data.total_amount_pph_idr);
            setTotalBeforeDiscountIdr(data.total_before_discount_idr);
            setTotalAfterDiscount(data.total_after_discount);
            setTotalAfterDiscountIdr(data.total_after_discount_idr);
            setCodCorSkbOptions(data.cod_cor_skb);
          } else {
            console.log("No data found");
          }
        })
        .catch((error) => {
          console.error("Failed to load purchase invoice data:", error);
        });

      // Fetch items based on INVOICE_NUMBER and set them to state
      LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=invoice_number&filterValue=${INVOICE_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          // Set fetched items to state
          setItems(fetchedItems);

          LookupService.fetchLookupData(`PURC_FORMINVCTAX&filterBy=INVOICE_ID&filterValue=${ID}&operation=EQUAL`, authToken, branchId)
            .then((response) => {
              const fetchedItems = response.data || [];
              console.log("Tax Items Fetched", fetchedItems);
              // setItems(fetchedItems);
            })
            .catch((error) => {
              console.error("Failed to load purchase invoice tax data:", error);
            });

          // Fetch COA data
          LookupParamService.fetchLookupDataView("MSDT_FORMCOAA", authToken, branchId)
            .then((data) => {
              console.log("COA lookup data:", data);

              // Transform keys to uppercase directly in the received data
              const transformedData = data.data.map((item) =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {})
              );

              const options = transformedData.map((item) => ({
                value: item.CODE,
                label: item.CODE,
              }));
              setCoaOptions(options);
            })
            .catch((error) => {
              console.error("Failed to fetch COA lookup:", error);
            });

          // Lookup PPN & PPh
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
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  tax_account: item.TAX_ACCOUNT,
                  coa_id: item.coa_id,
                }));
              setTaxPpnTypeOption(optionsPpn);

              const IncludeOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypeIncludeOptions(IncludeOptions);

              const ExcludeOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypExcludeeOptions(ExcludeOptions);

              const IncludepphOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypeIncludePphOptions(IncludepphOptions);

              const ExcludepphOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypExcludeePphOptions(ExcludepphOptions);

              const optionsPpnRoyalty = transformedData
                .filter((item) => item.TAX_TYPE === "PPN Royalty")
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

          // Fetch product lookup data
          LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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
                id: item.ID,
              }));

              setProductOptions(productOptions); // Set product options to state

              // Fetch currency lookup data
              LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
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
            value: item.NAME,
            label: item.NAME,
          }));
          setAllVendorOptions(allOptions);
          const selectVendorOption = allOptions.find((option) => option.value === selectedData[0].VENDOR) || "";
          setSelectedVendor(selectVendorOption);
          console.log("Selected vendor option:", selectedVendor);

          if (selectedData[0].DOC_REFF === "purchaseOrder") {
            const bothOptions = transformedData
              .filter((item) => item.ENTITY_TYPE === "BOTH" || item.ENTITY_TYPE === "Vendor")
              .map((item) => ({
                value: item.NAME,
                label: item.NAME,
              }));
            setVendorOptions(bothOptions);
            const selectedVendorOption = allOptions.find((option) => option.value === selectedData[0].VENDOR);
            setSelectedBothVendor(selectedVendorOption || null);
            console.log("asdhhkjda", selectedVendor);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch vendor lookup:", error);
        });

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

          const selectPaymentTermOption = options.find((option) => option.value === selectedData[0].PAYMENT_TERM) || "";
          setSelectedPaymentTerm(selectPaymentTermOption);
          console.log("Selected payment option:", selectedPaymentTerm);
        })
        .catch((error) => {
          console.error("Failed to fetch payment term lookup:", error);
        });

      LookupParamService.fetchLookupDataView("BooleanTrueFalse", authToken, branchId)
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
          setCodCorSkbOptions(options);
          const codOption = options.find((option) => option.value === selectedData[0].COD_COR_SKB) || "";
          setSelectedCodCorSkb(codOption);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });
    } else {
      generatePrNumber("DRAFT_INVC");

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
            value: item.CODE,
            label: item.CODE,
          }));
          setCurrencyOptions(options);
          const selectedCurrencyOption = options.find((option) => option.value === currency) || null;
          setSelectedCurrency(selectedCurrencyOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });

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

          if (selectedData) {
            const selectPaymentTermOption = options.find((option) => option.value === selectedData[0].PAYMENT_TERM) || null;
            setSelectedPaymentTerm(selectPaymentTermOption || null);
            console.log("Selected payment option:", selectedPaymentTerm);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch payment term lookup:", error);
        });

      LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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
          setProductOptions(options);
          console.log("Product :", options);
          if (selectedData) {
            const selectedProductOption = options.find((option) => option.value === selectedData[0].PRODUCT) || "";
            setSelectedProduct(selectedProductOption || null);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch product lookup:", error);
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
          //console.log('Transformed data:', transformedData);

          const options = transformedData.map((item) => ({
            value: item.NAME,
            label: item.NAME,
            id: item.ID,
          }));
          setCustomerOptions(options);
          console.log("Customer :", customer);
          if (selectedData) {
            const selectedCustomerOption = options.find((option) => option.value === selectedData[0].CUSTOMER) || null;
            setSelectedCustomer(selectedCustomerOption || null);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch currency lookup:", error);
        });
    }
  }, [selectedData, duplicateFlag]);

  useEffect(() => {
    // Ambil data lookup untuk currency
    // MSDT_FORMEMPL adalah nama table yang menyimpan data lookup untuk currency
    // authToken dan branchId digunakan untuk mengirimkan token otorisasi dan kode cabang ke server
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

    // buat cod/cor
    LookupParamService.fetchLookupDataView("BooleanTrueFalse", authToken, branchId)
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
        setCodCorSkbOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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
          id: item.ID,
        }));
        setProductOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    // buat vendor
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
          value: item.NAME,
          label: item.NAME,
          id: item.ID,
        }));
        setAllVendorOptions(allOptions);

        const bothOptions = transformedData
          .filter((item) => item.ENTITY_TYPE === "BOTH" || item.ENTITY_TYPE === "Vendor")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            id: item.ID,
          }));
        setVendorOptions(bothOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch vendor lookup:", error);
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

    // buat coa
    LookupParamService.fetchLookupDataView("MSDT_FORMCOAA", authToken, branchId)
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
        setCoaOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    // buat payment term
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
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          id: item.ID,
          value: item.COUNT,
          label: item.NAME,
          dateType: item.DATE_TYPE,
        }));
        setPaymentTermOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch payment term lookup:", error);
      });

    // buat pr number status request in_process dan partial requested
    LookupService.fetchLookupData("PURC_FORMPUREQ&filterBy=STATUS&filterValue=APPROVED&operation=EQUAL", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        // Filter the transformed data based on STATUS_REQUEST
        const filteredData = transformedData.filter((item) => item.STATUS_REQUEST === "IN_PROCESS" || item.STATUS_REQUEST === "PARTIAL_REQUESTED");
        console.log("status baru", filteredData);

        const options = filteredData
          .map((item) => {
            const label = item.PR_NUMBER;
            if (label.startsWith("DRAFT")) {
              return null; // or you can return an empty object {}
            }
            return {
              value: item.PR_NUMBER,
              label: label.replace("DRAFT ", ""), // remove 'DRAFT ' from the label
              id: item.ID,
              project: item.PROJECT,
              totalAmount: item.TOTAL_AMOUNT,
              description: item.DESCRIPTION,
              title: item.TITLE,
              vendor: item.VENDOR,
              ENDTOENDID: item.ENDTOENDID,
              vatType: item.TYPE_OF_VAT,
              tax_ppn: item.TAX_PPN,
              discount: item.DISCOUNT,
              currency: item.CURRENCY,
              quantity: item.QUANTITY,
              paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
              dueDate: item.DUE_DATE,
              customer: item.CUSTOMER,
              departement: item.DEPARTEMENT,
            };
          })
          .filter((option) => option !== null); // Filter out null options

        setPrNumberOptions(options);
        console.log("Pr number options:", options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    // buat po baru
    LookupService.fetchLookupData("PURC_FORMPUOR&filterBy=STATUS&filterValue=APPROVED&operation=EQUAL", authToken, branchId)
      .then((data) => {
        console.log("Currency lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );

        // Filter the transformed data based on STATUS_PO
        const filteredData = transformedData.filter((item) => item.STATUS_PO === "IN_PROCESS" || item.STATUS_PO === "PARTIAL_ORDERED");
        console.log("Filtered data based on STATUS_PO:", filteredData);

        const options = filteredData.map((item) => {
          const label = item.PO_NUMBER;
          return {
            value: item.PO_NUMBER,
            label: label.replace("DRAFT ", ""), // remove 'DRAFT ' from the label
            id: item.ID,
            project: item.PROJECT,
            totalAmount: item.TOTAL_AMOUNT,
            description: item.DESCRIPTION,
            title: item.TITLE,
            vendor: item.VENDOR,
            ENDTOENDID: item.ENDTOENDID,
            vatType: item.TYPE_OF_VAT,
            tax_ppn: item.TAX_PPN,
            discount: item.DISCOUNT,
            currency: item.CURRENCY,
            quantity: item.QUANTITY,
            paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
            dueDate: item.DUE_DATE,
            customer: item.CUSTOMER,
            departement: item.DEPARTEMENT,
          };
        });

        setPoNumberOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });

    LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
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
          id: item.ID,
        }));
        setCurrencyOptions(options);
        const defCurr = options.find((item) => item.value === "IDR");
        setCurrencyId(defCurr.id);
        console.log("currid", defCurr);
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
          .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            id: item.ID,
          }));
        setTaxTypeIncludeOptions(IncludeOptions);

        const ExcludeOptions = transformedData
          .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            id: item.ID,
          }));
        setTaxTypExcludeeOptions(ExcludeOptions);

        const IncludepphOptions = transformedData
          .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            id: item.ID,
          }));
        setTaxTypeIncludePphOptions(IncludepphOptions);

        const ExcludepphOptions = transformedData
          .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            id: item.ID,
          }));
        setTaxTypExcludeePphOptions(ExcludepphOptions);

        const optionsPpnRoyalty = transformedData
          .filter((item) => item.TAX_TYPE === "PPN Royalty")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            RATE: item.RATE,
            tax_account: item.tax_account,
            coa_id: item.coa_id,
          }));
        setTaxPpnRoyaltyOption(optionsPpnRoyalty);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });
  }, []);

  const handlePaymentTermChange = async (selectedOption) => {
    console.log("pay term select", selectedOption);
    console.log(due_date);
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");
    setPaymentTermId(selectedOption ? selectedOption.id : 0);

    const formatDate = moment(invoice_date).format("YYYY-MM-DD"); // format tanggal jadi "yyyy-MM-dd"; // format tanggal jadi "yyyy-MM-dd"
    const payload = {
      date: formatDate,
      count: selectedOption ? selectedOption.value : "",
      dateType: selectedOption ? selectedOption.dateType : "",
    };

    console.log(payload);
    try {
      // Hit the API with the required data and Bearer token in the headers
      const response = await axios.post(`${GENERATED_DUE_DATE}`, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
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

  const handlePrNumberChange = (index, selectedOption) => {
    if (selectedOption) {
      // Fetch lookup data based on the selected option
      LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=PR_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          // Filter fetched items where status_detail is null
          const filteredItems = fetchedItems.filter((item) => item.status_detail === null);
          console.log("Filtered items:", filteredItems);

          // Fetch product lookup data
          LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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
                id: item.ID,
              }));

              setProductOptions(productOptions); // Set product options to state

              // Fetch currency lookup data
              LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
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

                  const newItems = [...items];
                  const newStored = [...items];

                  const storedItems = fetchedItems.map((item) => {
                    return {
                      ...item,
                    };
                  });

                  storedItems.forEach((fetchedDetail, i) => {
                    newStored[index + i] = {
                      ...newStored[index + i],
                      ...fetchedDetail,
                    };
                  });

                  console.log("storedItems", newStored);
                  setFetchedDetail(newStored);

                  // Update fetched items with selected options
                  const updatedFetchedItems = filteredItems.map((item) => {
                    return {
                      ...item,
                      doc_reff_no: item.pr_number,
                      // selectedProduct: productOptions.find((option) => option.value === item.product),
                      // selectedCurrency: currencyOptions.find((option) => option.value === item.currency),
                      // selectedProject: projectOptions.find((option) => option.value === item.project),
                      // selectedDepartement: departementOptions.find((option) => option.value === item.departement),
                      // selectedCustomer: customerOptions.find((option) => option.value === item.customer),
                    };
                  });

                  updatedFetchedItems.forEach((fetchedItem, i) => {
                    // Either update the existing index or add new items for each fetched object
                    newItems[index + i] = {
                      ...newItems[index + i],
                      ...fetchedItem,
                    };
                  });

                  // Set the updated items to state
                  setItems(newItems);
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
    } else {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        product: "",
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        original_unit_price: 0,
        total_price: 0,
        type_of_vat: "",
        tax_ppn: "",
        tax_ppn_rate: 0,
        tax_ppn_amount: 0,
        tax_base: 0,
        discount: 0,
        subTotal: 0,
        vat_included: false,
        new_unit_price: 0,
        doc_reff_num: "",
        vendor: "",
        project: "",
        customer: "",
        departement: "",
        contract_number: "",
      };
      setItems(newItems); // Update state with reset selections
    }
  };

  const handlePoNumberChange = (index, selectedOption) => {
    if (selectedOption) {
      // Fetch lookup data based on the selected option
      LookupParamService.fetchLookupDataView(`PURC_FORMPUOR&filterBy=PO_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedDatas = response.data || [];
          console.log("Datas fetched:", fetchedDatas);

          const PoHeaderItems = [...storedPoHeader];

          // Simpan Header PO untuk cek Docref Po
          if (PoHeaderItems.length <= index) {
            PoHeaderItems.length = index + fetchedDatas.length;
          }

          fetchedDatas.forEach((fetchedData, i) => {
            const targetIndex = index + i;

            // Dynamically grow the array if necessary
            if (PoHeaderItems.length <= targetIndex) {
              PoHeaderItems.push(fetchedData); // Add at the end if the index exceeds current length
            } else {
              PoHeaderItems[targetIndex] = {
                ...PoHeaderItems[targetIndex], // Preserve existing data
                ...fetchedData,
              };
            }
          });

          const sanitizedPoHeaders = PoHeaderItems.filter((item) => item !== undefined);

          setStoredPoHeader(sanitizedPoHeaders);

          console.log("poHeaders", storedPoHeader);

          LookupService.fetchLookupData(`PURC_FORMPUORD&filterBy=PO_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
            .then((response) => {
              const fetchedItems = response.data || [];
              console.log("Items fetched:", fetchedItems);

              // Filter fetched items where status_detail is null
              const filteredItems = fetchedItems.filter((item) => item.status_detail === null && item.currency === selectedCurrency);
              console.log("Filtered items:", filteredItems);

              // Fetch product lookup data
              LookupParamService.fetchLookupDataView("MSDT_FORMPRDT", authToken, branchId)
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
                    id: item.ID,
                  }));

                  setProductOptions(productOptions); // Set product options to state

                  // Fetch currency lookup data
                  LookupParamService.fetchLookupDataView("MSDT_FORMCCY", authToken, branchId)
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
                              value: item.NAME,
                              label: item.NAME,
                              RATE: item.RATE,
                              tax_account: item.TAX_ACCOUNT,
                              coa_id: item.coa_id,
                            }));
                          setTaxPpnTypeOption(optionsPpn);

                          const IncludeOptions = transformedData
                            .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
                            .map((item) => ({
                              value: item.NAME,
                              label: item.NAME,
                              RATE: item.RATE,
                              id: item.ID,
                            }));
                          setTaxTypeIncludeOptions(IncludeOptions);

                          const ExcludeOptions = transformedData
                            .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
                            .map((item) => ({
                              value: item.NAME,
                              label: item.NAME,
                              RATE: item.RATE,
                              id: item.ID,
                            }));
                          setTaxTypExcludeeOptions(ExcludeOptions);

                          const IncludepphOptions = transformedData
                            .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
                            .map((item) => ({
                              value: item.NAME,
                              label: item.NAME,
                              RATE: item.RATE,
                              id: item.ID,
                            }));
                          setTaxTypeIncludePphOptions(IncludepphOptions);

                          const ExcludepphOptions = transformedData
                            .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "ALL") && item.ACTIVE === true)
                            .map((item) => ({
                              value: item.NAME,
                              label: item.NAME,
                              RATE: item.RATE,
                              id: item.ID,
                            }));
                          setTaxTypExcludeePphOptions(ExcludepphOptions);

                          const optionsPpnRoyalty = transformedData
                            .filter((item) => item.TAX_TYPE === "PPN Royalty")
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

                      const newItems = [...items];
                      const newStored = [...items];

                      const storedPRItems = fetchedItems.map((item) => {
                        return {
                          ...item,
                        };
                      });

                      storedPRItems.forEach((fetchedItem, i) => {
                        newStored[index + i] = {
                          ...newStored[index + i],
                          ...fetchedItem,
                        };
                      });

                      setFetchedDetail(newStored);

                      // Update fetched items with selected options
                      const updatedFetchedItems = fetchedItems.map((item) => {
                        return {
                          ...item,
                          doc_reff_no: item.po_number,
                          tax_exchange_rate: tax_exchange_rate,
                        };
                      });

                      updatedFetchedItems.forEach((fetchedItem, i) => {
                        // Either update the existing index or add new items for each fetched object
                        newItems[index + i] = {
                          ...newItems[index + i],
                          ...fetchedItem,
                        };
                      });

                      // Set the updated items to state
                      setItems(newItems);
                      console.log("poitems", newItems);
                    })
                    .catch((error) => {
                      console.error("Failed to fetch PR Items", error);
                    });
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
    } else {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        product: "",
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        original_unit_price: 0,
        total_price: 0,
        type_of_vat: "",
        tax_ppn: "",
        tax_ppn_rate: 0,
        tax_ppn_amount: 0,
        tax_base: 0,
        discount: 0,
        subTotal: 0,
        vat_included: false,
        new_unit_price: 0,
        doc_reff_num: "",
        vendor: "",
        project: "",
        customer: "",
        departement: "",
        contract_number: "",
      };
      setItems(newItems); // Update state with reset selections
    }
  };

  const handleCodCorSkbChange = (selectedOption) => {
    setSelectedCodCorSkb(selectedOption);
    SetCodCorSkb(selectedOption ? selectedOption.value : "");
  };

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
    setCurrency(selectedOption ? selectedOption.value : "", selectedOption ? selectedOption.id : "");
    setCurrencyId(selectedOption ? selectedOption.id : "");
  };

  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "", selectedOption ? selectedOption.id : "");
    setVendorId(selectedOption ? selectedOption.id : "");
  };

  const handleBothVendorChange = (selectedOption) => {
    setSelectedBothVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "", selectedOption ? selectedOption.id : "");
    setVendorId(selectedOption ? selectedOption.id : "");
  };

  console.log("vendorid", vendor_id);

  const handleProjectChange = (index, selectedOption) => {
    const newItems = [...items]; // Create a copy of the current items array

    // Update the selected project state
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : "");

    if (selectedOption) {
      // Find the corresponding customer for the selected project
      const customerProject = customerOptions.find((option) => option.value === selectedOption.customer);
      setSelectedCustomer(customerProject);
      setCustomer(customerProject ? customerProject.value : null);

      // Update the project and project_contract_number in the newItems array
      newItems[index] = {
        ...newItems[index],
        project: selectedOption.value, // Set the project value
        project_contract_number: selectedOption.contract_number || "", // Set the project_contract_number from the selected option
      };
    } else {
      // If no project is selected, clear the project and project_contract_number
      newItems[index] = {
        ...newItems[index],
        project: "",
        project_contract_number: "",
      };
      setSelectedCustomer(null);
      setCustomer("");
    }

    // Update the items state with the new items array
    setItems(newItems);
  };
  const handleOptionChange = (setter, stateSetter, selectedOption) => {
    setter(selectedOption);
    stateSetter(selectedOption ? selectedOption.value : "");
  };

  const generateUploadId = async (code) => {
    try {
      const uniqueNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken); // Updates state, if needed elsewhere in your component
      return uniqueNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate Unique Number:", error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: "",
        invoice_number: "",
        product: "",
        product_id: "",
        product_note: "",
        quantity: 1,
        currency: "IDR",
        unit_price: 0,
        type_of_vat: "",
        tax_ppn: "",
        tax_ppn_rate: "",
        tax_ppn_amount: 0,
        tax_pph: 0,
        tax_pph_type: "",
        tax_pph_rate: "",
        tax_pph_amount: 0,
        tax_base: 0,
        total_after_discount: 0,
        total_before_discount: 0,
        total_amount_ppn: 0,
        total_amount_pph: 0,
        total_price: 0,
        total_price_idr: 0,
        vat_included: false,
        new_unit_price: 0,
        tax_exchange_rate: 1,
        vendor: "",
        doc_reff_no: "",
        project_contract_number: "",
        bi_middle_rate: "",
        cod_cor_skb: "",
        total_amount_idr: 1,
        total_before_discount_idr: 1,
        total_after_discount_idr: 1,
        tax_base_idr: 0,
        tax_ppn_amount_idr: 0,
        tax_pph_amount_idr: 0,
        total_amount_ppn_idr: 0,
        total_amount_pph_idr: 0,
        tax_ppn_id: "",
        tax_pph_id: "",
        project_id: "",
        customer_id: "",
        department_id: "",
        vendor_id: vendor_id,
        currency_id: currency_id,
        tax_account_ppn: "",
        tax_account_pph: "",
      },
    ]);
  };

  const handleTaxItemChange = (index, field, value) => {
    const updatedTaxItems = [...taxItems];
    updatedTaxItems[index][field] = value;
    setTaxItems(updatedTaxItems);
  };

  const handleDeleteTaxItem = (index) => {
    const updatedTaxItems = taxItems.filter((_, i) => i !== index);
    setTaxItems(updatedTaxItems);
  };

  const handleAddTaxItem = () => {
    setTaxItems([
      ...taxItems,
      {
        tax_account: "",
        tax_code: "",
        tax_amount: 0,
        tax_amount_idr: 0,
        base_amount: 0,
        base_amount_idr: 0,
      },
    ]);
  };

  useEffect(() => {
    summarizeItems(items);
  }, [items]);

  const summarizeItems = () => {
    const summary = [];

    items.forEach((item) => {
      // PPN
      if (item.tax_ppn && item.tax_ppn_amount) {
        const existingTaxPPN = summary.find((s) => s.tax_code === item.tax_ppn);

        if (existingTaxPPN) {
          existingTaxPPN.tax_amount += item.tax_ppn_amount;
          existingTaxPPN.base_amount += item.tax_base;
          existingTaxPPN.base_amount_idr += item.tax_base_idr;
          existingTaxPPN.tax_amount_idr += item.tax_ppn_amount_idr;
        } else {
          summary.push({
            tax_code: item.tax_ppn,
            tax_amount: item.tax_ppn_amount,
            base_amount: item.tax_base,
            tax_account: item.tax_account_ppn,
            base_amount_idr: item.tax_base_idr,
            tax_amount_idr: item.tax_ppn_amount_idr,
          });
        }
      }

      // PPh
      if (item.tax_pph && item.tax_pph_amount) {
        const existingPPh = summary.find((s) => s.tax_code === item.tax_pph);
        if (existingPPh) {
          existingPPh.tax_amount += item.tax_pph_amount;
          existingPPh.base_amount += item.tax_base;
          existingPPh.base_amount_idr += item.tax_base_idr;
          existingPPh.tax_amount_idr += item.tax_pph_amount_idr;
        } else {
          summary.push({
            tax_code: item.tax_pph,
            tax_amount: item.tax_pph_amount,
            base_amount: item.tax_base,
            tax_account: item.tax_account_pph,
            base_amount_idr: item.tax_base_idr,
            tax_amount_idr: item.tax_pph_amount_idr,
          });
        }
      }
    });
    setTaxSummaryItems(summary);
  };

  console.log("asd", taxSummaryItems);
  console.log("asd", items);

  const handleItemChange = async (index, field, value) => {
    const newItems = [...items];

    console.log(index, field, value);

    if (field === "file") {
      const file = value.target.files[0]; // Get the uploaded file
      if (file) {
        try {
          // Generate the upload ID asynchronously
          const id_upload = await generateUploadId("UPLOAD");

          // Store the file name and id_upload in the item
          newItems[index].doc_source = file.name;
          newItems[index].id_upload = id_upload;

          // Update the items state before uploading the file
          setItems(newItems);

          // Prepare upload request
          const request = {
            idTrx: id_upload,
            code: "INVCD",
          };

          const formData = new FormData();
          formData.append("request", JSON.stringify(request));
          formData.append("file", file);

          // Upload the file
          const uploadResponse = await axios.post(`${UPLOAD_FILES}`, formData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("File uploaded successfully", uploadResponse.data);
        } catch (error) {
          console.error("File upload failed", error);
        }
      }
    } else {
      newItems[index][field] = value;
    }

    // Reset fields when 'unit_price', 'quantity', or 'discount' changes
    if (field === "unit_price" || field === "quantity" || field === "discount") {
      newItems[index].type_of_vat = "";
      newItems[index].tax_ppn = "";
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph = "";
      newItems[index].type_of_pph = "";
      newItems[index].tax_pph_rate = 0;
      if (newItems[index].vat_included !== undefined) {
        newItems[index].vat_included = false;
      }
    }

    // Update total price and total price IDR
    if (field === "quantity" || field === "unit_price" || field === "discount") {
      const quantity = newItems[index].quantity || 0;
      const unit_price = newItems[index].unit_price || 0;
      const discount = newItems[index].discount || 0;

      // Calculate total_price considering discount
      newItems[index].total_price = quantity * unit_price - discount;

      // Calculate total_price_idr based on exchange rate if currency is not IDR
      if (currency === "IDR") {
        newItems[index].total_price_idr = newItems[index].total_price;
      } else {
        newItems[index].total_price_idr = newItems[index].total_price * (newItems[index].tax_exchange_rate || 1);
      }
    }

    // Calculate tax_base_idr
    if (newItems[index].tax_base !== undefined && newItems[index].tax_exchange_rate !== undefined) {
      newItems[index].tax_base_idr = newItems[index].tax_base * newItems[index].tax_exchange_rate;
    }

    // Calculate New Unit Price based on VAT and PPN
    let pengkali = newItems[index].tax_ppn_rate / 100;

    if (currency !== "IDR") {
      if (field === "tax_ppn" || field === "tax_ppn_rate" || field === "tax_pph_rate") {
        if (newItems[index].type_of_vat === "include") {
          newItems[index].tax_base_idr = newItems[index].tax_base * (newItems[index].tax_exchange_rate || 1);
          newItems[index].tax_ppn_amount_idr = newItems[index].tax_base_idr * (newItems[index].tax_ppn_rate / 100); // Bottom rounding
        } else if (newItems[index].type_of_vat === "exclude" || newItems[index].type_of_vat === "PPNRoyalty") {
          newItems[index].tax_ppn_amount_idr = Math.floor(newItems[index].total_price_idr * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
          newItems[index].tax_base_idr = newItems[index].total_price_idr;
          // newItems[index].tax_base = Math.floor(newItems[index].total_price / (1 + newItems[index].tax_ppn_rate / 100));
          // newItems[index].tax_ppn_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
        }
      }
      if (field === "tax_pph_type" || field === "tax_pph_rate") {
        if (newItems[index].type_of_pph === "gross") {
          if (newItems[index].type_of_vat === "exclude") {
            newItems[index].tax_pph_amount_idr = Math.floor(newItems[index].total_price_idr * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
          } else {
            newItems[index].tax_pph_amount_idr = Math.floor(newItems[index].tax_base_idr * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
          }
        } else if (newItems[index].type_of_pph === "nett") {
          let taxWithPPhIDR = newItems[index].tax_base_idr / (1 - newItems[index].tax_pph_rate / 100);
          let taxWithPPnIDR = newItems[index].tax_base_idr / (1 - newItems[index].tax_ppn_rate / 100);
          newItems[index].tax_pph_amount_idr = Math.floor(taxWithPPhIDR * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
          newItems[index].tax_ppn_amount_idr = Math.floor(taxWithPPhIDR * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
        }
        console.log("totalpriceidr", newItems[index].total_price_idr);
        console.log("lococ", newItems[index].tax_base_idr);
        console.log("taxPPHIDR", newItems[index].tax_pph_amount_idr);
      }
    }

    // Calculate PPN and PPH
    if (field === "tax_ppn" || field === "tax_ppn_rate") {
      if (newItems[index].type_of_vat === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * pengkali;
        newItems[index].tax_base = Math.round(newItems[index].total_price / (1 + newItems[index].tax_ppn_rate / 100));
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
        newItems[index].vat_included = true;
      } else if (newItems[index].type_of_vat === "exclude" || newItems[index].type_of_vat === "PPNRoyalty") {
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].total_price * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
        newItems[index].tax_base = newItems[index].total_price;
      }
    }

    // Handle non_ppn case
    if (newItems[index].type_of_vat === "non_ppn") {
      // Reset PPN related fields
      newItems[index].tax_ppn = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_ppn_amount = 0; // No PPN for non_ppn
      newItems[index].new_unit_price = newItems[index].unit_price; // Set new unit price to the original unit price
      newItems[index].tax_base = newItems[index].total_price; // Tax base is the total price
      newItems[index].tax_pph_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100)); // Calculate PPH only
    }

    // Calculate PPh based on PPh type and rate
    if (field === "tax_pph_type" || field === "tax_pph_rate") {
      if (newItems[index].type_of_pph === "gross") {
        if (newItems[index].type_of_vat === "exclude") {
          newItems[index].tax_pph_amount = Math.floor(newItems[index].total_price * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
        } else {
          newItems[index].tax_pph_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
        }
      } else if (newItems[index].type_of_pph === "nett") {
        let taxWithPPh = newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100);
        newItems[index].tax_pph_amount = Math.floor(taxWithPPh * (newItems[index].tax_pph_rate / 100)); // Bottom rounding
        newItems[index].tax_ppn_amount = Math.floor(taxWithPPh * (newItems[index].tax_ppn_rate / 100)); // Bottom rounding
      }
    }

    // Update VAT type logic
    if (field === "type_of_vat") {
      // Reset VAT-related fields
      newItems[index].tax_ppn = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_base = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph = "";
      newItems[index].type_of_pph = "";
      newItems[index].tax_pph_rate = 0;
      // Set new unit price to the original unit price
      newItems[index].new_unit_price = newItems[index].unit_price;
      newItems[index].total_price = newItems[index].unit_price * newItems[index].quantity - (newItems[index].discount || 0);
    }

    if (field === "type_of_pph") {
      newItems[index].tax_pph_rate = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph = "";
    }

    console.log("ppnamidr", newItems[index].tax_ppn_id);

    // Calculate the total_before_discount_idr after updating the items
    const total_before_discount_idr = newItems.reduce((total, item) => total + (item.tax_base_idr || 0), 0);
    setTotalBeforeDiscountIdr(total_before_discount_idr); // Update item state

    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    const itemToRemove = items[index];
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
    setSelectedItems(selectedItems.filter((i) => i !== index));

    console.log("items", itemToRemove);

    // Reset curency
    if (newItems.length === 0) {
      console.log("lengt", selectedItems.length);
      setIsCurrencyIsSet(false);
      // setFetchedPRDetail([]);
      return;
    }
  };

  const handleDeleteLast = () => {
    const newItems = items.slice(0, items.length - 1); // Create a new array excluding the last item
    setItems(newItems);
    setSelectedItems([]);
    if (newItems.length === 0) {
      setIsCurrencyIsSet(false);
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
    if (newItems.length === 0) {
      setIsCurrencyIsSet(false);
    }
  };

  useEffect(() => {
    const { total_amount_idr } = calculateTotalAmount();
    setTotalAmountIdr(total_amount_idr);
  }, [total_after_discount_idr, total_amount_ppn_idr, total_amount_pph_idr]);

  const calculateTotalAmount = () => {
    // Calculate total discount from all items
    const totalDiscount = items.reduce((total, item) => total + (item.discount || 0), 0);

    const subTotal = items.reduce((total, item) => {
      const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
      return total + taxBase;
    }, 0);

    const taxbasePPH = items.reduce((total, item) => {
      if (item.type_of_vat === "include" && item.type_of_pph === "nett") {
        const taxBase = isNaN(item.tax_base) ? 0 : item.tax_base;
        const taxPphRate = isNaN(item.tax_pph_rate) ? 0 : item.tax_pph_rate;
        return total + taxBase / (1 - taxPphRate / 100);
      } else if (item.type_of_vat === "exclude") {
        return total + item.unit_price / (1 - item.tax_pph_rate / 100);
      } else {
        return total + (isNaN(item.tax_base) ? 0 : item.tax_base);
      }
    }, 0);

    // Calculate total_after_discount_idr based on the provided formula
    const total_before_discount_idr = items.reduce((total, item) => total + (item.tax_base_idr || 0), 0);
    const subtotalAfterDiscount = subTotal - totalDiscount; // Use totalDiscount here

    const totalPPNAmount = items.reduce((total, item) => {
      const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : item.tax_ppn_amount;
      return total + taxPPNAmount;
    }, 0);

    const totalPPHAmount = items.reduce((total, item) => {
      const taxPPHAmount = isNaN(item.tax_pph_amount) ? 0 : item.tax_pph_amount;
      return total + taxPPHAmount;
    }, 0);

    // Calculate totalPPNAmountIDR
    const totalPPNAmountIDR = items.reduce((total, item) => {
      const taxPPNAmountIDR = isNaN(item.tax_ppn_amount_idr) ? 0 : item.tax_ppn_amount_idr;
      return total + taxPPNAmountIDR;
    }, 0);

    // Calculate totalPPHAmountIDR
    const totalPPHAmountIDR = items.reduce((total, item) => {
      const taxPPHAmountIDR = isNaN(item.tax_pph_amount_idr) ? 0 : item.tax_pph_amount_idr;
      return total + taxPPHAmountIDR;
    }, 0);

    // Initialize total_amount
    let total_amount = subtotalAfterDiscount;

    // Determine if any items qualify for royalty
    const hasRoyalty = items.some((item) => item.type_of_vat === "PPNRoyalty");

    // Determine if any items are non_ppn
    const hasNonPPN = items.some((item) => item.type_of_vat === "non_ppn");

    // Calculate total_amount based on type_of_vat and type_of_pph
    if (hasRoyalty) {
      // If there are royalties, total amount is subtotalAfterDiscount + totalPPNAmount
      total_amount = subtotalAfterDiscount + totalPPNAmount;
      // total_amount = Math.ceil(total_amount);
    } else if (hasNonPPN) {
      // If there are non_ppn items, total amount is subtotalAfterDiscount - totalPPHAmount
      total_amount = subtotalAfterDiscount - totalPPHAmount;
    } else {
      // Calculate total amount based on the cases
      const case1 = items.some((item) => (item.type_of_vat === "include" && item.type_of_pph === "gross") || item.type_of_pph === "");
      const case2 = items.some((item) => item.type_of_vat === "include" && item.type_of_pph === "nett");
      const case3 = items.some((item) => (item.type_of_vat === "exclude" && item.type_of_pph === "gross") || item.type_of_pph === "");
      const case4 = items.some((item) => item.type_of_vat === "exclude" && item.type_of_pph === "nett");

      if (case1 || case3) {
        total_amount += totalPPNAmount - totalPPHAmount;
      }

      if (case2) {
        const taxBasePPNAF = Math.round(taxbasePPH);
        total_amount = taxBasePPNAF - totalPPHAmount + totalPPNAmount;
      }

      if (case4) {
        const taxBase = taxbasePPH;
        total_amount = taxBase - totalPPNAmount + totalPPHAmount;
      }
    }

    // Calculate total_amount_idr
    const total_amount_idr = total_before_discount_idr + totalPPNAmountIDR - totalPPHAmountIDR; // Ensure it's not negative
    console.log("total amount idr", total_amount_idr);

    // Ensure valid total amount
    const validTotalAmount = isNaN(total_amount) ? 0 : total_amount;

    return {
      subTotal,
      subtotalAfterDiscount,
      taxbasePPH,
      totalPPNAmount,
      totalPPHAmount,
      totalPPNAmountIDR,
      totalPPHAmountIDR,
      totalAmount: validTotalAmount,
      total_amount_idr,
      total_after_discount_idr,
      total_before_discount_idr,
      total_amount_ppn_idr: totalPPNAmountIDR,
      total_amount_pph_idr: totalPPHAmountIDR,
      discount: totalDiscount,
    };
  };

  // ngitung diskon buat idr
  useEffect(() => {
    const { total_amount_ppn_idr } = calculateTotalAmount();
    setTotalAmountPpnIdr(total_amount_ppn_idr); // Update the state

    const { total_amount_pph_idr } = calculateTotalAmount();
    setTotalAmountPphIdr(total_amount_pph_idr); // Update the state agar bs sama kek total amount pph dibawa
  }, [items, discount, tax_exchange_rate]);

  useEffect(() => {
    const { total_before_discount_idr } = calculateTotalAmount();
    const calculatedTotalAfterDiscountIdr = total_before_discount_idr - discount * (tax_exchange_rate || 1);
    // Ensure the value is not negative
    setTotalAfterDiscountIdr(Math.max(calculatedTotalAfterDiscountIdr, 0));
  }, [discount, tax_exchange_rate, items]); // Add dependencies

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = [...items];
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const resetForm = () => {
    // generatePrNumber("DRAFT_INVC");
    setPrNumber("");
    setTitle("");
    setInternalMemo("");
    setCustomerContract("");
    setCreatedBy(createdBy);
    setID(null);
    setDocRef("");
    setInvoiceNumber("");
    setInvoiceType("");
    setInvoiceDate("");
    setVendor(null);
    setPaymentTerm("");
    setDueDate("");
    setTaxRate("");
    setTaxInvoiceNumber("");
    setTaxExchangeRate("");
    SetCodCorSkb("");
    setInvoiceStatus("");
    setBiMiddleRate("");
    setTypeOfPayment("");
    setTermOfPayment("");
    setProject("");
    setDescription("");
    setItems([]);
    setSelectedItems([]);
    setSelectedPrNumber(null);
    setSelectedPoNumber(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
    setDocSource(null);
    setAllVendorOptions(null);
    setVendorOptions(null);
    setPaymentTermOptions(null);
    setIsSubmited(false);
  };

  const handleItemsInsert = async (invoice_number, duplicateFlag) => {
    for (const item of items) {
      let updatedItem;
      if (duplicateFlag) {
        updatedItem = {
          doc_reff_no: item.doc_reff_no,
          doc_source: item.doc_source,
          tax_invoice_number: item.tax_invoice_number,
          project_contract_number: item.project_contract_number,
          customer: item.customer,
          departement: item.departement,
          product: item.product,
          product_note: item.product_note,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          total_price_idr: item.total_price_idr,
          tax_exchange_rate: item.tax_exchange_rate,
          type_of_vat: item.type_of_vat,
          tax_ppn: item.tax_ppn,
          tax_ppn_rate: item.tax_ppn_rate,
          type_of_pph: item.type_of_pph,
          tax_pph: item.tax_pph,
          tax_pph_rate: item.tax_pph_rate,
          tax_base: item.tax_base,
          tax_base_idr: item.tax_base_idr,
          id_upload: item.id_upload,
          po_number: invoice_number,
        };
      } else {
        updatedItem = { ...item, invoice_number };
      }
      await InsertDataService.postData(updatedItem, "INVCD", authToken, branchId);
      console.log("Item posted successfully:", updatedItem);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    // Validation for required fields
    if (!invoice_number) {
      messageAlertSwal("Error", "Invoice Number cannot be empty.", "error");
      return; // Prevent form submission
    }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Purchase Invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        // Generate PR number
        const pr_number = await generatePrNumber("PR");
        console.log("pr_number", pr_number);

        let endToEndId;
        if (!endToEnd) {
          endToEndId = await generatePrNumber("PURC");
        } else {
          endToEndId = endToEnd;
          console.log("endtoendId is not empty");
        }

        const checkDataResponse = await LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=invoice_number&filterValue=${invoice_number}&operation=EQUAL`, authToken, branchId);
        const existingData = checkDataResponse.data;

        const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount, total_amount_idr, total_before_discount_idr } = calculateTotalAmount();

        // Save general information
        const generalInfo = {
          doc_reff: docRef,
          payment_term,
          invoice_number,
          invoice_date,
          invoice_status: "DRAFT",
          term_of_payment,
          total_after_discount: subtotalAfterDiscount,
          total_before_discount: subTotal,
          discount,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          tax_exchange_rate,
          due_date,
          description,
          total_amount: totalAmount,
          endtoendid: endToEndId,
          created_by: createdBy,
          bi_middle_rate,
          vendor,
          cod_cor_skb,
          currency,
          total_amount_idr,
          total_amount_ppn_idr,
          total_amount_pph_idr,
          total_after_discount_idr,
          total_before_discount_idr,
          payment_term_id: parseInt(payment_term_id, 10),
          create_by_id: parseInt(create_by_id, 10),
          vendor_id: parseInt(vendor_id, 10), // Ensure this is an integer
          currency_id: parseInt(currency_id, 10), // Ensure this is an integer
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        let response;

        // Check if updating existing data or inserting new data
        if (selectedData && duplicateFlag === false) {
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
        } else if (existingData && existingData.length > 0) {
          const ida = existingData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${ida}`, authToken, branchId);
        } else {
          response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
        }

        const getIDforINVID = await LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=invoice_number&filterValue=${invoice_number}&operation=EQUAL`, authToken, branchId);
        const idforIVCID = getIDforINVID.data[0];

        console.log("the id", idforIVCID.ID);

        console.log("Data posted successfully:", response);

        // Handle item deletion and insertion
        if (response.message === "Update Data Successfully") {
          if (existingData && existingData.length > 0) {
            const piNum = existingData[0].invoice_number;
            const lookupResponse = await LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=invoice_number&filterValue=${piNum}&operation=EQUAL`, authToken, branchId);

            const ids = lookupResponse.data.map((item) => item.ID); // Dapatkan semua ID dari respons array
            console.log("IDs to delete:", ids);

            // Delete each item based on fetched IDs
            for (const id of ids) {
              try {
                await DeleteDataService.postData(`column=id&value=${id}`, "PUINVCD", authToken, branchId);
                console.log("Item deleted successfully:", id);
              } catch (error) {
                console.error("Error deleting item:", id, error);
              }
            }
          } else {
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
          }

          // Insert updated items
          for (const item of items) {
            const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedProject, ...rest } = item;
            const updatedItem = {
              ...rest,
              invoice_number,
              invoice_id: idforIVCID.ID,
              payment_term_id: parseInt(payment_term_id, 10),
              create_by_id: parseInt(create_by_id, 10),
              vendor_id: parseInt(vendor_id, 10), // Ensure this is an integer
              currency_id: parseInt(currency_id, 10), // Ensure this is an integer
            };
            // delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.selectedCurrency;
            delete updatedItem.selectedProduct;
            delete updatedItem.selectedProject;
            delete updatedItem.selectedCustomer;
            delete updatedItem.selectedDepartement;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;
            delete updatedItem.company;
            delete updatedItem.po_number;
            delete updatedItem.requestor;
            delete updatedItem.id_upload;
            delete updatedItem.total_before_discount;
            delete updatedItem.total_after_discount;
            delete updatedItem.bi_middle_rate;
            delete updatedItem.total_amount_idr;
            delete updatedItem.total_before_discount_idr;
            delete updatedItem.total_after_discount_idr;
            delete updatedItem.total_amount_ppn_idr;
            delete updatedItem.total_amount_pph_idr;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.tax_account;
            delete updatedItem.tax_code;
            delete updatedItem.tax_amount;
            delete updatedItem.tax_amount_idr;
            delete updatedItem.base_amount;
            delete updatedItem.base_amount_idr;
            delete updatedItem.payment_term_id;
            delete updatedItem.create_by_id;
            delete updatedItem.vendor_id;
            delete updatedItem.currency_id;
            delete updatedItem.tax_account_ppn;
            delete updatedItem.tax_account_pph;
            delete updatedItem.request_id;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
              console.log("Item inserted successfully:", itemResponse);
            } catch (error) {
              console.error("Error inserting item:", updatedItem, error);
            }
          }

          // Show success message and reset form
          messageAlertSwal("Success", response.message, "success");
          // resetForm();
        } else if (response.message === "insert Data Successfully") {
          // Insert new items
          for (const item of items) {
            const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedAllVendor, selectedbothvendor, selectedProject, selcetedContractNumber, ...rest } = item;
            const updatedItem = {
              ...rest,
              invoice_number,
              invoice_id: idforIVCID.ID,
              type_of_vat: item.type_of_vat,
              tax_ppn: item.tax_ppn,
              tax_base: item.tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
              tax_exchange_rate: item.tax_exchange_rate,
              total_after_discount: item.subtotalAfterDiscount,
            };
            // delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.selectedCurrency;
            delete updatedItem.selectedProduct;
            delete updatedItem.selectedProject;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;
            delete updatedItem.company;
            delete updatedItem.po_number;
            delete updatedItem.requestor;
            delete updatedItem.id_upload;
            delete updatedItem.total_before_discount;
            delete updatedItem.bi_middle_rate;
            delete updatedItem.total_amount_idr;
            delete updatedItem.total_before_discount_idr;
            delete updatedItem.total_after_discount_idr;
            delete updatedItem.total_amount_ppn_idr;
            delete updatedItem.total_amount_pph_idr;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.tax_account;
            delete updatedItem.tax_code;
            delete updatedItem.tax_amount;
            delete updatedItem.tax_amount_idr;
            delete updatedItem.base_amount;
            delete updatedItem.base_amount_idr;
            delete updatedItem.request_id;
            delete updatedItem.tax_account_ppn;
            delete updatedItem.tax_account_pph;

            const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          //Set status workflow VERIFIED
          LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
            .then((response) => {
              const data = response.data[0];
              console.log("Data:", data);

              const requestData = {
                idTrx: data.ID,
                status: "DRAFT", // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
              };
              UpdateStatusService.postData(requestData, "PUINVC", authToken, branchId)
                .then((response) => {
                  console.log("Data updated successfully:", response);
                })
                .catch((error) => {
                  console.error("Failed to update data:", error);
                });
            })
            .catch((error) => {
              console.error("Failed to load purchase request data:", error);
            });
        }

        // Handle INVCTAX data (insert, update, delete)
        if (response.message === "Update Data Successfully") {
          // Fetch existing INVCTAX data
          const taxLookupResponse = await LookupService.fetchLookupData(`PURC_FORMINVCTAX&filterBy=invoice_id&filterValue=${idforIVCID.ID}&operation=EQUAL`, authToken, branchId);
          const taxIds = taxLookupResponse.data.map((tax) => tax.ID);

          // Delete existing INVCTAX records
          for (const taxId of taxIds) {
            try {
              await DeleteDataService.postData(`column=id&value=${taxId}`, "INVCTAX", authToken, branchId);
              console.log("Tax data deleted successfully:", taxId);
            } catch (error) {
              console.error("Error deleting tax data:", taxId, error);
            }
          }

          // Insert updated INVCTAX records
          for (const item of items) {
            const taxInv = {
              tax_account: item.tax_account,
              tax_code: item.tax_code,
              tax_amount: item.tax_amount,
              tax_amount_idr: item.tax_amount_idr,
              invoice_id: idforIVCID.ID,
              base_amount: item.base_amount,
              base_amount_idr: item.base_amount_idr,
            };
            delete taxInv.ID;
            delete taxInv.id;

            try {
              const taxResponse = await InsertDataService.postData(taxInv, "INVCTAX", authToken, branchId);
              console.log("Tax data inserted successfully:", taxResponse);
            } catch (error) {
              console.error("Error inserting tax data:", taxInv, error);
            }
          }
        } else if (response.message === "insert Data Successfully") {
          // Insert new INVCTAX records
          for (const item of items) {
            const taxInv = {
              tax_account: item.tax_account,
              tax_code: item.tax_code,
              tax_amount: item.tax_amount,
              tax_amount_idr: item.tax_amount_idr,
              invoice_id: idforIVCID.ID,
              base_amount: item.base_amount,
              base_amount_idr: item.base_amount_idr,
            };
            delete taxInv.ID;
            delete taxInv.id;

            try {
              const taxResponse = await InsertDataService.postData(taxInv, "INVCTAX", authToken, branchId);
              console.log("Tax data posted successfully:", taxResponse);
            } catch (error) {
              console.error("Error inserting tax data:", taxInv, error);
            }
          }
        }

        messageAlertSwal("Success", response.message, "success");
        // resetForm();
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false);
        // setIsEditingPurchaseInvoice(false);
        // handleRefresh(); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
    }
  };

  const generatePrNumber = async (code) => {
    try {
      const response = await axios.get(`${GENERATED_NUMBER}?code=${code}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Ensure this token is valid
        },
      });
      const uniquePrNumber = response.data; // Adjust based on your API response structure
      setPrNumber(uniquePrNumber); // Update state, if needed elsewhere in your component
      return uniquePrNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate PR Number:", error.response ? error.response.data : error.message);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation for required fields
    if (!invoice_number) {
      messageAlertSwal("Error", "Invoice Number cannot be empty.", "error");
      return; // Prevent form submission
    }

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
        // Generate PR number
        const pr_number = await generatePrNumber("PR");
        console.log("pr_number", pr_number);

        let endToEndId;
        if (!endToEnd) {
          endToEndId = await generatePrNumber("PURC");
        } else {
          endToEndId = endToEnd;
          console.log("endtoendId is not empty");
        }

        const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount, total_amount_idr, total_before_discount_idr } = calculateTotalAmount();
        setTotalAmountIdr(total_amount_idr);

        // Save general information
        const generalInfo = {
          doc_reff: docRef,
          payment_term,
          invoice_number: invoice_number.replace("DRAFT_", ""),
          invoice_date,
          invoice_status: "IN_PROCESS",
          term_of_payment,
          total_after_discount: subtotalAfterDiscount,
          total_before_discount: subTotal,
          discount,
          total_amount_ppn: totalPPNAmount,
          total_amount_pph: totalPPHAmount,
          tax_exchange_rate,
          due_date,
          description,
          total_amount: totalAmount,
          endtoendid: endToEndId,
          created_by: createdBy,
          bi_middle_rate,
          vendor,
          cod_cor_skb,
          currency,
          total_amount_idr,
          total_amount_ppn_idr,
          total_amount_pph_idr,
          total_after_discount_idr,
          total_before_discount_idr,
          payment_term_id: parseInt(payment_term_id, 10),
          create_by_id: parseInt(create_by_id, 10),
          vendor_id: parseInt(vendor_id, 10), // Ensure this is an integer
          currency_id: parseInt(currency_id, 10), // Ensure this is an integer
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        let response;

        // Check if updating existing data or inserting new data
        if (selectedData && duplicateFlag === false) {
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `PUINVC&column=id&value=${id}`, authToken, branchId);
        } else {
          response = await InsertDataService.postData(generalInfo, "PUINVC", authToken, branchId);
        }

        console.log("Data posted successfully:", response);

        const getIDforINVID = await LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=INVOICE_NUMBER&filterValue=${invoice_number.replace("DRAFT_", "")}&operation=EQUAL`, authToken, branchId);
        const idforIVCID = getIDforINVID.data[0]; // Ambil data pertama

        // if (!idforIVCID) {
        //   throw new Error("Invoice ID not found."); // Atau tangani kesalahan sesuai kebutuhan
        // }

        console.log("the id", idforIVCID.ID);

        // Update Status for PR or PO
        if (idPr) {
          await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}`, { status_request: "INVOICE" }, { headers: { Authorization: `Bearer ${authToken}` } });
        } else if (idPo) {
          await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}`, { status_po: "INVOICE" }, { headers: { Authorization: `Bearer ${authToken}` } });
        }

        // Handle item deletion and insertion
        if (response.message === "Update Data Successfully") {
          // Delete existing items
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

          // Insert updated items
          for (const item of items) {
            const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedProject, ...rest } = item;
            const updatedItem = {
              ...rest,
              invoice_number,
              invoice_id: idforIVCID.ID,
              payment_term_id: parseInt(payment_term_id, 10),
              create_by_id: parseInt(create_by_id, 10),
              vendor_id: parseInt(vendor_id, 10), // Ensure this is an integer
              currency_id: parseInt(currency_id, 10), // Ensure this is an integer
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.selectedCurrency;
            delete updatedItem.selectedProduct;
            delete updatedItem.selectedProject;
            delete updatedItem.selectedCustomer;
            delete updatedItem.selectedDepartement;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;
            delete updatedItem.company;
            delete updatedItem.po_number;
            delete updatedItem.requestor;
            delete updatedItem.id_upload;
            delete updatedItem.total_before_discount;
            delete updatedItem.total_after_discount;
            delete updatedItem.bi_middle_rate;
            delete updatedItem.total_amount_idr;
            delete updatedItem.total_before_discount_idr;
            delete updatedItem.total_after_discount_idr;
            delete updatedItem.total_amount_ppn_idr;
            delete updatedItem.total_amount_pph_idr;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.tax_code;
            delete updatedItem.tax_account;
            delete updatedItem.tax_amount;
            delete updatedItem.tax_amount_idr;
            delete updatedItem.base_amount;
            delete updatedItem.base_amount_idr;
            delete updatedItem.payment_term_id;
            delete updatedItem.create_by_id;
            delete updatedItem.vendor_id;
            delete updatedItem.currency_id;
            delete updatedItem.departement_id;
            delete updatedItem.request_id;
            delete updatedItem.tax_account_ppn;
            delete updatedItem.tax_account_pph;
            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
              console.log("Item inserted successfully:", itemResponse);
            } catch (error) {
              console.error("Error inserting item:", updatedItem, error);
            }
          }

          // Show success message and reset form
          messageAlertSwal("Success", response.message, "success");
          setIsSubmited(true);
        } else if (response.message === "insert Data Successfully") {
          // Insert new items
          for (const item of items) {
            const { rwnum, ID, status, id_trx, selectedProduct, selectedCurrency, selectedAllVendor, selectedbothvendor, selectedProject, selcetedContractNumber, ...rest } = item;
            const updatedItem = {
              ...rest,
              invoice_number: invoice_number.replace("DRAFT_", ""),
              type_of_vat: item.type_of_vat,
              doc_reff_no: docRef === "purchaseOrder" ? item.po_number : item.pr_number,
              tax_ppn: item.tax_ppn,
              tax_base: item.tax_base,
              tax_ppn_amount: item.tax_ppn_amount,
              tax_pph_amount: item.tax_pph_amount,
              tax_exchange_rate: item.tax_exchange_rate,
              total_after_discount: item.subtotalAfterDiscount,
            };
            delete updatedItem.ID;
            delete updatedItem.id;
            delete updatedItem.vat;
            delete updatedItem.tax_pph_type;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.total_ppn_amount;
            delete updatedItem.rwnum;
            delete updatedItem.pr_number;
            delete updatedItem.id_trx;
            delete updatedItem.status;
            delete updatedItem.selectedCurrency;
            delete updatedItem.selectedProduct;
            delete updatedItem.selectedProject;
            delete updatedItem.new_unit_price;
            delete updatedItem.vat_included;
            delete updatedItem.exchange_rate;
            delete updatedItem.company;
            delete updatedItem.po_number;
            delete updatedItem.requestor;
            delete updatedItem.id_upload;
            delete updatedItem.total_before_discount;
            delete updatedItem.bi_middle_rate;
            delete updatedItem.total_amount_idr;
            delete updatedItem.total_before_discount_idr;
            delete updatedItem.total_after_discount_idr;
            delete updatedItem.total_amount_ppn_idr;
            delete updatedItem.total_amount_pph_idr;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.tax_code;
            delete updatedItem.tax_account;
            delete updatedItem.tax_amount;
            delete updatedItem.tax_amount_idr;
            delete updatedItem.base_amount;
            delete updatedItem.base_amount_idr;
            delete updatedItem.payment_term_id;
            delete updatedItem.create_by_id;
            delete updatedItem.vendor_id;
            delete updatedItem.currency_id;
            delete updatedItem.departement_id;
            delete updatedItem.request_id;
            delete updatedItem.tax_account_ppn;
            delete updatedItem.tax_account_pph;

            const itemResponse = await InsertDataService.postData(updatedItem, "PUINVCD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);

            if (docRef === "purchaseRequest" || docRef === "purchaseOrder") {
              let fetchUrl;
              let formToDel;
              let getHeader;
              let formHeader;
              let fetchPRD;

              if (docRef === "purchaseRequest") {
                fetchUrl = `PURC_FORMPUREQD&filterBy=pr_number&filterValue=${item.pr_number}&operation=EQUAL`;
                formToDel = "PUREQD";
                formHeader = "PUREQ";
                getHeader = `PURC_FORMPUREQ&filterBy=pr_number&filterValue=${item.doc_reff_no}&operation=EQUAL`;
              } else if (docRef === "purchaseOrder") {
                fetchUrl = `PURC_FORMPUORD&filterBy=po_number&filterValue=${item.po_number}&operation=EQUAL`;
                formToDel = "PUORD";
                formHeader = "PUOR";
                getHeader = `PURC_FORMPUOR&filterBy=po_number&filterValue=${item.po_number}&operation=EQUAL`;
              }

              const fetchCheckIsUsed = await LookupService.fetchLookupData(fetchUrl, authToken, branchId);
              const checkIsUsedData = fetchCheckIsUsed.data;
              console.log("fetchedisuseddata", checkIsUsedData);

              if (docRef === "purchaseOrder") {
                const prno = checkIsUsedData.map((item) => item.doc_reff_no);
                console.log("pron", prno);

                // Iterate over each pr_number
                for (const pr_number of prno) {
                  try {
                    // Fetch PRD data for the current pr_number
                    const fetchPRD = await LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=pr_number&filterValue=${pr_number}&operation=EQUAL`, authToken, branchId);
                    const prToDel = fetchPRD.data.map((item) => item.ID);
                    console.log("prtodel", prToDel);
                    console.log("prtodels", fetchPRD);

                    for (const prdel of prToDel) {
                      try {
                        // Now, find the corresponding stored item to update/insert
                        const storedItem = fetchPRD.data.find((item) => item.ID === prdel);

                        if (storedItem) {
                          // Check the new condition
                          const matchingPoNumber = items.some((newItem) => newItem.po_number === storedItem.po_number && storedPoHeader.some((header) => header.po_number === newItem.po_number && header.doc_reff === "purchaseRequest"));
                          console.log("mathcing", matchingPoNumber);
                          if (matchingPoNumber) {
                            // Delete the item first
                            await DeleteDataService.postData(`column=id&value=${prdel}`, "PUREQD", authToken, branchId);
                            console.log("Item deleted successfully:", prdel);

                            const { rwnum, ID, status, id_trx, ...stored } = storedItem;

                            console.log("storeditem", storedItem);
                            console.log("itemsa", item);

                            let invoicenum;

                            const usedDataEntry = fetchPRD.data.find((entry) => entry.ID === prdel);

                            if (usedDataEntry) {
                              // If the status_detail is "USED", use the po_number from the used data
                              if (usedDataEntry.status_detail === "USED") {
                                invoicenum = usedDataEntry.invoice_number; // Set ponumb from checkIsUsedData
                              }
                            }

                            for (const item of items) {
                              // Assuming 'items' is an array of items to check against
                              if (storedItem.po_number === item.po_number && (storedItem.po_number === item.doc_reff_no || storedItem.pr_number === item.doc_reff_no)) {
                                invoicenum = invoice_number.replace("DRAFT_", "");
                              }
                            }
                            console.log("invoicenumc", invoice_number);

                            const updatedStoredItem = {
                              ...stored,
                              invoice_number: invoicenum,
                            };
                            console.log("updatedstatus", updatedStoredItem.status_detail);
                            console.log("incovid", invoicenum);

                            // Remove unwanted fields
                            const fieldsToDelete = [
                              "rwnum",
                              "ID",
                              "id",
                              "status",
                              "id_trx",
                              "original_unit_price",
                              "type_of_vat",
                              "tax_ppn",
                              "tax_pph",
                              "tax_pph_type",
                              "total_amount_ppn",
                              "total_amount_pph",
                              "total_price_idr",
                              "tax_exchange_rate",
                              "total_after_discount",
                              "total_before_discount",
                              "tax_ppn_amount",
                              "tax_pph_amount",
                              "tax_ppn_rate",
                              "tax_pph_rate",
                              "subtotal",
                              "subTotal",
                              "tax_base",
                              "discount",
                              "vat_included",
                              "new_unit_price",
                              "requestor",
                              "total_amount_idr",
                              "total_before_discount_idr",
                              "total_after_discount_idr",
                              "total_amount_ppn_idr",
                              "total_amount_pph_idr",
                              "cod_cor_skb",
                              "tax_base_idr",
                            ];

                            fieldsToDelete.forEach((field) => delete updatedStoredItem[field]);

                            // Insert the updated stored item
                            const storedItemResponse = await InsertDataService.postData(updatedStoredItem, "PUREQD", authToken, branchId);
                            console.log("Stored item posted successfully:", storedItemResponse);
                          } else {
                            console.log("Condition not met for stored item ID:", prdel);
                          }
                        } else {
                          console.log("No corresponding stored item found for ID:", prdel);
                        }
                      } catch (error) {
                        console.error("Error processing item:", prdel, error);
                      }
                    }
                  } catch (error) {
                    console.error("Error fetching PRD data for pr_number:", pr_number, error);
                  }
                }
              }

              const dels = fetchCheckIsUsed.data.map((item) => item.ID);
              console.log("idtoChange", dels);

              let hasNullStatus = false;

              for (const del of dels) {
                try {
                  // Now, find the corresponding stored item to update/insert
                  const storedItem = fetchedDetail.find((item) => item.ID === del);

                  if (storedItem) {
                    // Delete the item first
                    await DeleteDataService.postData(`column=id&value=${del}`, formToDel, authToken, branchId);
                    console.log("Item deleted successfully:", del);

                    const { rwnum, ID, status, id_trx, ...stored } = storedItem;

                    console.log("storeditem", storedItem);
                    console.log("itemsa", item);

                    let statusDetail;
                    let invnum;

                    for (const item of items) {
                      // Assuming 'items' is an array of items to check against
                      if (storedItem.status_detail === "USED") {
                        statusDetail = "USED";
                      }
                      if (storedItem.ID === item.ID) {
                        statusDetail = "USED";
                        invnum = invoice_number.replace("DRAFT_", "");
                        break; // Exit the loop early if we find a match
                      }
                    }

                    const updatedStoredItem = {
                      ...stored,
                      status_detail: statusDetail,
                      invoice_number: invnum,
                    };
                    console.log("updatedstatus", updatedStoredItem.status_detail);

                    // Remove unwanted fields
                    const fieldsToDelete = [
                      "rwnum",
                      "ID",
                      "id",
                      "status",
                      "id_trx",
                      "original_unit_price",
                      "type_of_vat",
                      "tax_ppn",
                      "tax_pph",
                      "tax_pph_type",
                      "total_amount_ppn",
                      "total_amount_pph",
                      "total_price_idr",
                      "tax_exchange_rate",
                      "total_after_discount",
                      "total_before_discount",
                      "tax_ppn_amount",
                      "tax_pph_amount",
                      "tax_ppn_rate",
                      "tax_pph_rate",
                      "subtotal",
                      "subTotal",
                      "tax_base",
                      "discount",
                      "vat_included",
                      "new_unit_price",
                      "requestor",
                      "bi_middle_rate",
                      "total_amount_idr",
                      "total_before_discount_idr",
                      "total_after_discount_idr",
                      "tax_base_idr",
                      "cod_cor_skb",
                      "tax_pph_amount_idr",
                      "tax_ppn_amount_idr",
                      "tax_ppn_amount_idr",
                      "total_amount_pph_idr",
                      "total_amount_ppn_idr",
                    ];

                    fieldsToDelete.forEach((field) => delete updatedStoredItem[field]);

                    // Insert the updated stored item
                    const storedItemResponse = await InsertDataService.postData(updatedStoredItem, formToDel, authToken, branchId);
                    console.log("Stored item posted successfully:", storedItemResponse);
                  } else {
                    console.log("No corresponding stored item found for ID:", del);
                  }
                } catch (error) {
                  console.error("Error processing item:", del, error);
                }
              }

              const getDocRefList = await LookupService.fetchLookupData(getHeader, authToken, branchId);
              const prID = getDocRefList.data[0].ID;
              console.log("PRid", prID);

              // Check if all of the status detail is used
              const checkNullStatus = await LookupService.fetchLookupData(`PURC_FORMPUREQD&filterBy=pr_number&filterValue=${item.pr_number}&operation=EQUAL`, authToken, branchId);
              const nullStatusExists = checkNullStatus.data.some((entry) => entry.status_detail === null);

              let updateStatusData;
              if (docRef === "purchaseRequest") {
                updateStatusData = {
                  status_request: nullStatusExists ? "PARTIAL_REQUESTED" : "REQUESTED",
                };
              } else if (docRef === "purchaseOrder") {
                updateStatusData = {
                  status_po: hasNullStatus ? "PARTIAL_ORDERED" : "ORDERED ",
                };
              }

              // Update Status
              const updatePRStatus = await axios.post(`${FORM_SERVICE_UPDATE_DATA}?f=${formHeader}&column=id&value=${prID}&branchId=${branchId}`, updateStatusData, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });
              await updatePRStatus;
            }
          }

          // Handle INVCTAX data (insert, update, delete)
          if (response.message === "Update Data Successfully") {
            // Fetch existing INVCTAX data
            const taxLookupResponse = await LookupService.fetchLookupData(`PURC_FORMINVCTAX&filterBy=invoice_id&filterValue=${idforIVCID.ID}&operation=EQUAL`, authToken, branchId);
            console.log("tax response", taxLookupResponse);
            const taxIds = taxLookupResponse.data.map((tax) => tax.ID);

            // Delete existing INVCTAX records
            for (const taxId of taxIds) {
              try {
                await DeleteDataService.postData(`column=id&value=${taxId}`, "INVCTAX", authToken, branchId);
                console.log("Tax data deleted successfully:", taxId);
              } catch (error) {
                console.error("Error deleting tax data:", taxId, error);
              }
            }

            // Insert updated INVCTAX records
            for (const item of items) {
              const taxInv = {
                tax_account: item.tax_account,
                tax_code: item.tax_code,
                tax_amount: item.tax_amount,
                tax_amount_idr: item.tax_amount_idr,
                invoice_id: idforIVCID.ID,
                base_amount: item.base_amount,
                base_amount_idr: item.base_amount_idr,
              };
              delete taxInv.ID;
              delete taxInv.id;

              console.log("taxinv data:", taxInv); // Log data before sending

              try {
                const taxResponse = await InsertDataService.postData(taxInv, "INVCTAX", authToken, branchId);
                console.log("Tax data inserted successfully:", taxResponse);
              } catch (error) {
                console.error("Error inserting tax data:", taxInv, error);
              }
            }
          } else if (response.message === "insert Data Successfully") {
            // Insert new INVCTAX records
            for (const item of items) {
              const taxInv = {
                tax_account: item.tax_account,
                tax_code: item.tax_code,
                tax_amount: item.tax_amount,
                tax_amount_idr: item.tax_amount_idr,
                invoice_id: idforIVCID.ID,
                base_amount: item.base_amount,
                base_amount_idr: item.base_amount_idr,
              };
              delete taxInv.ID;
              delete taxInv.id;

              try {
                const taxResponse = await InsertDataService.postData(taxInv, "INVCTAX", authToken, branchId);
                console.log("Tax data posted successfully:", taxResponse);
              } catch (error) {
                console.error("Error inserting tax data:", taxInv, error);
              }
            }
          }

          //Set status workflow VERIFIED
          LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
            .then((response) => {
              const data = response.data[0];
              console.log("Data:", data);

              const requestData = {
                idTrx: data.ID,
                status: "PENDING",
              };
              UpdateStatusService.postData(requestData, "PUINVC", authToken, branchId)
                .then((response) => {
                  console.log("Data updated successfully:", response);
                })
                .catch((error) => {
                  console.error("Failed to update data:", error);
                });
            })
            .catch((error) => {
              console.error("Failed to load purchase request data:", error);
            });

          messageAlertSwal("Success", response.message, "success");
          setIsSubmited(true);
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        messageAlertSwal("Error", err.message, "error");
      } finally {
        setIsLoading(false);
        // setIsEditingPurchaseInvoice(false);
        // handleRefresh(); // Set loading state back to false after completion
      }
    } else {
      console.log("Form submission was canceled.");
    }
  };

  const dynamicFormWidth = (e) => {
    const contentLength = e.target.value.length;
    const newWidth = Math.max(100, contentLength * 12); // 8px per character, adjust as needed
    setInputWidth(newWidth);
  };

  const taxExchangeChange = (e) => {
    setTaxExchangeRate(e);
    console.log("taxe", tax_exchange_rate);
    items.forEach((item) => {
      item.tax_exchange_rate = parseFloat(e) || 0;
    });
  };

  // console.log("subl", items.tax_exchange_rate);

  // set tanggal hari ini
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    setInvoiceDate(today);
  }, []);

  const getFileDocument = async (endtoendid) => {
    const request = {
      idTrx: "2910202400024",
      code: "PUREQD",
    };

    const formData = new FormData();
    formData.append("request", JSON.stringify(request));
    console.log("token", authToken);
    try {
      const getFileResponse = await axios.get(`${DOWNLOAD_FILES}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: request,
        responseType: "blob",
      });
      const blob = new Blob([getFileResponse.data], { type: getFileResponse.headers["content-type"] || "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const contentDisposition = getFileResponse.headers["content-disposition"];
      const filename = contentDisposition ? contentDisposition.split("filename=")[1].replace(/"/g, "") : "download.pdf";

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const usedOptions = new Set(items.map((item) => item.doc_reff_no));
  const optionsWithDisabled = prNumberOptions.map((option) => ({
    ...option,
    isDisabled: usedOptions.has(option.value),
  }));
  const optionsWithDisabled1 = poNumberOptions.map((option) => ({
    ...option,
    isDisabled: usedOptions.has(option.value),
  }));

  const handleBiMiddleRateChange = (e) => {
    const value = parseFloat(e.target.value); // Convert to a number
    setBiMiddleRate(isNaN(value) ? 0 : value); // Set to 0 if NaN
  };

  const detailFormStyle = () => {
    return {
      border: "none",
      background: "transparent",
      color: "#000",
    };
  };

  const formatCurrency = (amount, currency) => {
    const options = {
      style: "currency",
      currency: currency || "IDR", // Default to IDR if no currency is provided
      minimumFractionDigits: 0,
      maximumFractionDigits: 2, // Adjust as needed
    };

    return new Intl.NumberFormat("en-US", options).format(amount);
  };

  return (
    <Fragment>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>{selectedData ? "Edit Purchase Invoice" : "Add Purchase Invoice"}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">{selectedData ? "Edit Purchase Invoice" : "Add Purchase Invoice"}</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>General Information</Card.Title>
                <div className="ml-auto">
                  {setIsEditingPurchaseInvoice || duplicateFlag ? (
                    <Button
                      variant="secondary"
                      className="mr-2"
                      onClick={() => {
                        handleRefresh();
                        if (duplicateFlag) {
                          setIsAddingNewDuplicatePurchaseInvoice(false);
                          setDuplicateFlag(false);
                        } else {
                          setIsEditingPurchaseInvoice(false);
                        }
                      }}
                    >
                      <i className="fas fa-arrow-left"></i> Go Back
                    </Button>
                  ) : (
                    <></>
                  )}
                  {isSubmited === true ? (
                    <Button onClick={resetForm}>
                      <i className="fas fa-plus"></i> Add New
                    </Button>
                  ) : (
                    <>
                      <Button variant="primary" className="mr-2" onClick={handleSave}>
                        <i className="fas fa-save"></i> Save
                      </Button>
                      <Button variant="primary" onClick={handleSubmit}>
                        <i className="fas fa-check"></i> Submit
                      </Button>
                    </>
                  )}
                </div>
              </Card.Header>

              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6} hidden>
                      <Form.Group controlId="formInternalMemo">
                        <Form.Label>End To End Id</Form.Label>
                        <Form.Control type="text" placeholder="Enter Internal Memo" value={endToEnd} onChange={(e) => setEndToEnd(e.target.value)} required />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceNumber">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control type="text" value={invoice_number} readOnly /> {/* Make it read-only */}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formInvoiceDate">
                        <Form.Label>Invoice Date</Form.Label>
                        <div className="input-group">
                          <DatePicker
                            selected={invoice_date}
                            onChange={(date) => {
                              setInvoiceDate(date);
                              setSelectedPaymentTerm(null); // balikin agar ganti invoice date maka untuk payment term di reset
                              setDueDate(null);
                            }}
                            dateFormat={"dd-MM-yyyy"}
                            className="form-control"
                            placeholder="Select Invoice Date"
                            required
                          />
                          <FaCalendar style={{ marginLeft: "-30px", zIndex: "2" }} className="my-auto" />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formDocReff">
                        <Form.Label>Document Reference</Form.Label>
                        <Form.Control as="select" placeholder="Enter Document Number" value={docRef} onChange={(e) => setDocRef(e.target.value)}>
                          <option value="">Select Document Reference</option>
                          <option value="purchaseRequest">Purchase Request</option>
                          <option value="internalMemo">Internal Memo</option>
                          <option value="purchaseOrder">Purchase Order</option>
                          <option value="customerContract">Customer Contract</option>
                        </Form.Control>
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
                        <div className="input-group">
                          <DatePicker selected={due_date} onChange={(date) => setDueDate(date)} dateFormat="dd-MM-yyyy" className="form-control" placeholderText="Select Due Date" required />
                          <FaCalendar style={{ marginLeft: "-30px", zIndex: "2" }} className="my-auto" />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTermOfPayment">
                        <Form.Label>Term Of Payment</Form.Label>
                        <Form.Control type="text" placeholder="Enter Term Of Payment" value={term_of_payment} onChange={(e) => setTermOfPayment(e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formTaxRate">
                        <Form.Label>Tax Exchange Rate (Amount)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Tax Exchange Rate"
                          min="0"
                          value={tax_exchange_rate.toLocaleString("en-US")}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                            taxExchangeChange(newPrice);
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formCreatedBy">
                        <Form.Label>Created By</Form.Label>
                        <Form.Control type="text" placeholder="Insert Created By" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} disabled />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formVendor">
                        <Form.Label>Vendor</Form.Label>
                        {docRef === "purchaseOrder" ? (
                          <Select value={selectedbothvendor} onChange={handleBothVendorChange} options={allvendoroptions} isClearable placeholder="Select Vendor..." />
                        ) : (
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formCodCorSkb">
                        <Form.Label>COD, COR, SKB</Form.Label>
                        <Select value={selectedCodCorSkb} onChange={handleCodCorSkbChange} options={codCorSkbOptions} isClearable placeholder="Select COD/COR, SKB..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formCurrency">
                        <Form.Label>Currency</Form.Label>
                        <Select
                          value={selectedCurrency}
                          onChange={(selectedOption) => {
                            handleCurrencyChange(selectedOption); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                          }}
                          options={currencyOptions}
                          placeholder="Select Currency..."
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} hidden>
                      <Form.Group controlId="formTotalAmountPpnIdr">
                        <Form.Label>Total Amount PPN IDR</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Total Amount PPN IDR"
                          min="1"
                          value={total_amount_ppn_idr}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setTotalAmountPpnIdr(isNaN(value) ? 0 : value);
                          }}
                          readOnly
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} hidden>
                      <Form.Group controlId="formTotalAmountPphIdr">
                        <Form.Label>Total Amount PPH IDR</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Total Amount PPN IDR"
                          min="1"
                          value={total_amount_pph_idr}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setTotalAmountPphIdr(isNaN(value) ? 0 : value);
                          }}
                          readOnly
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} hidden>
                      <Form.Group controlId="formTotalBeforeDiscount">
                        <Form.Label>Total Before Discount IDR</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter Total Amount IDR"
                          min="1"
                          value={total_before_discount_idr}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setTotalBeforeDiscountIdr(isNaN(value) ? 0 : value);
                          }}
                          readOnly
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} hidden>
                      <Form.Group controlId="formTotalAfterDiscount">
                        <Form.Label>Total After Discount IDR</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter Total Amount IDR"
                          min="1"
                          value={total_after_discount_idr}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setTotalAfterDiscountIdr(isNaN(value) ? 0 : value);
                          }}
                          readOnly
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} hidden>
                      <Form.Group controlId="formBiMiddleRate">
                        <Form.Label>Total Amount IDR</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter Total Amount IDR"
                          min="1"
                          value={total_amount_idr}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setTotalAmountIdr(isNaN(value) ? 0 : value);
                          }}
                          readOnly // Tidak dapat diedit karena sudah dihitung
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
                    <Button variant="danger" size="sm" className="ml-2 rounded-3" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
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
                              <th>Invoice Number Vendor</th>
                              <th>Product</th>
                              <th>Product Description</th>
                              <th>Quantity</th>
                              <th>Unit Price</th>
                              <th>Discount</th>
                              <th className={items.length > 0 && items[0].currency === "IDR"}>Total Price</th>
                              <th className={items.length > 0 && items[0].currency === "IDR"}>Tax Exchange Rate</th>
                              <th>Total Price IDR</th>
                              <th>Type Of VAT</th>
                              <th>Tax PPN</th>
                              <th>Tax PPN Rate %</th>
                              <th>Tax PPh Type</th>
                              <th>Tax PPh</th>
                              <th>Tax PPh Rate %</th>
                              <th>Tax Base</th>
                              <th>Tax Base IDR</th>
                              <th>Tax Invoice Number Vendor</th>
                              <th>Document Reference Number</th>
                              <th>Document Reference Source</th>
                              {/* <th>Tax Invoice Number Vendor</th> */}
                              {/* <th>Vendor</th> */}
                              <th>Project</th>
                              <th>Project Contract Number</th>
                              <th>Customer</th>
                              <th>Departement</th>
                              {/* <th>Currency</th> */}
                              {/* <th>Cod, Cor, Skb</th> */}
                              {/* <th>Tax PPN</th> */}

                              {/* <th>Tax PPN Amount</th> */}
                              {/* <th>Tax PPh</th> */}

                              {/* <th>Tax PPh Amount</th> */}
                              {/* <th>Total Price</th> */}
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="26" className="text-center">
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
                                    <Form.Control type="text" value={item.invoice_number_vendor} onChange={(e) => handleItemChange(index, "invoice_number_vendor", e.target.value)} style={detailFormStyle()} />
                                  </td>
                                  <td>
                                    <Select
                                      value={productOptions.find((option) => option.id === items[index].product_id)} // Menemukan produk yang sesuai
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "product", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui state
                                        handleItemChange(index, "product_id", selectedOption ? selectedOption.id : null); // Memanggil handleItemChange untuk memperbarui state
                                      }}  
                                      options={productOptions} // Daftar opsi produk
                                      isClearable
                                      placeholder="Select Product..."
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} style={detailFormStyle()} />
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.quantity || 0}
                                      min="0"
                                      onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))}
                                      style={{
                                        ...detailFormStyle(),
                                        width: `${inputWidth}px`,
                                      }}
                                    />
                                  </td>
                                  <td>
                                    {currency === "IDR" ? (
                                      <Form.Control
                                        className="text-left"
                                        type="text"
                                        value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price.toLocaleString("en-US") : 0}
                                        onChange={(e) => {
                                          const newPrice = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                          handleItemChange(index, "unit_price", newPrice);
                                          dynamicFormWidth(e);
                                        }}
                                        style={detailFormStyle()}
                                      />
                                    ) : (
                                      <Form.Control
                                        className="text-left"
                                        type="text"
                                        value={item.unit_price !== undefined && item.unit_price !== null ? item.unit_price.toLocaleString("en-US", { minimumFractionDigits: 2, useGrouping: false }) : "0"}
                                        onChange={(e) => {
                                          const input = e.target.value;

                                          // Allow only numbers, periods, and remove unwanted characters
                                          const sanitizedInput = input.replace(/[^0-9.]/g, "");

                                          // Update the state with sanitized input
                                          handleItemChange(index, "unit_price", sanitizedInput);

                                          // Optional: You can maintain original price logic if needed
                                          // handleItemChange(index, 'original_unit_price', sanitizedInput);
                                        }}
                                        onBlur={() => {
                                          const price = parseFloat(item.unit_price) || 0;
                                          handleItemChange(index, "unit_price", price); // Convert back to number on blur
                                        }}
                                        style={detailFormStyle()}
                                      />
                                    )}
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="number"
                                      value={item.discount || 0}
                                      min="0"
                                      onChange={(e) => handleItemChange(index, "discount", parseFloat(e.target.value))}
                                      style={{
                                        ...detailFormStyle(),
                                        width: `${inputWidth}px`,
                                      }}
                                    />
                                  </td>
                                  <td className={currency}>{item.total_price.toLocaleString("en-US", { style: "currency", currency: currency }) || 0} </td>
                                  <td>
                                    <Form.Control
                                      className="text-left"
                                      type="text"
                                      value={item.tax_exchange_rate !== undefined && item.tax_exchange_rate !== null ? item.tax_exchange_rate.toLocaleString("en-US") : "0"}
                                      onChange={(e) => {
                                        const input = e.target.value;

                                        // Allow only numbers, periods, and remove unwanted characters
                                        const sanitizedInput = input.replace(/[^0-9.]/g, "");

                                        // Update the state with sanitized input
                                        handleItemChange(index, "tax_exchange_rate", sanitizedInput);

                                        // Optional: Adjust the width dynamically based on the input
                                        dynamicFormWidth(e);
                                      }}
                                      onBlur={() => {
                                        const rate = parseFloat(item.tax_exchange_rate) || 0;
                                        handleItemChange(index, "tax_exchange_rate", rate); // Convert back to number on blur
                                      }}
                                      style={detailFormStyle()}
                                      disabled
                                    />
                                  </td>
                                  <td>{item.total_price_idr?.toLocaleString("en-US", { style: "currency", currency: "IDR" }) ?? "IDR 0.00"}</td>
                                  <td>
                                    <Form.Control as="select" value={items[index].type_of_vat || ""} onChange={(selectedOption) => handleItemChange(index, "type_of_vat", selectedOption.target.value)} style={detailFormStyle()}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                      <option value="non_ppn">Non PPN</option>
                                      {currency !== "IDR" ? <option value="PPNRoyalty">PPN Royalty</option> : <></>}
                                    </Form.Control>
                                  </td>

                                  <td>
                                    <Select
                                      value={
                                        items[index].type_of_vat === "PPNRoyalty"
                                          ? tax_ppn_royalty_option.find((option) => option.value === item.tax_ppn)
                                          : items[index].type_of_vat === "include"
                                          ? taxTypeIncludeOptions.find((option) => option.value === items[index].tax_ppn) || null
                                          : items[index].type_of_vat === "exclude"
                                          ? taxTypeExcludeOptions.find((option) => option.value === items[index].tax_ppn) || null
                                          : taxPpnTypeOption.find((option) => option.value === items[index].tax_ppn) || null
                                      }
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn for the specific item
                                        handleItemChange(index, "tax_ppn", selectedOption ? selectedOption.value : "");
                                        handleItemChange(index, "tax_ppn_id", selectedOption ? selectedOption.id : "");
                                        handleItemChange(index, "tax_account_ppn", selectedOption ? selectedOption.tax_account : "");

                                        // Update the PpnRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_ppn_rate", selectedOption.RATE);
                                          setPpnRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_ppn_rate", 0);
                                          setPpnRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                        // Update the tax_code based on ppn dan pph summary
                                        const pphSelectedOption = tax_pph_type_option.find((option) => option.value === items[index].tax_pph);
                                        const newTaxCode = `PPN: ${selectedOption ? selectedOption.label : "None"}, PPH: ${pphSelectedOption ? pphSelectedOption.label : "None"}`;
                                        handleItemChange(index, "tax_code", newTaxCode);
                                      }}
                                      // options={items[index].type_of_vat === "PPNRoyalty" ? tax_ppn_royalty_option : taxPpnTypeOption}
                                      options={
                                        items[index].type_of_vat === "PPNRoyalty"
                                          ? tax_ppn_royalty_option
                                          : items[index].type_of_vat === "include"
                                          ? taxTypeIncludeOptions
                                          : items[index].type_of_vat === "exclude"
                                          ? taxTypeExcludeOptions
                                          : taxPpnTypeOption
                                      }
                                      isClearable
                                      placeholder="Select Tax PPN Type..."
                                      isDisabled={items[index].type_of_vat === "non_ppn"}
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.tax_ppn_rate} onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))} readOnly style={detailFormStyle()} />
                                  </td>

                                  <td>
                                    <Form.Control
                                      as="select"
                                      value={item.type_of_pph}
                                      onChange={(e) => handleItemChange(index, "type_of_pph", e.target.value)}
                                      disabled={item.type_of_vat === "PPNRoyalty"} // Disable if PPN Royalty is selected
                                      style={detailFormStyle()}
                                    >
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="gross">Gross</option>
                                      <option value="nett">Nett</option>
                                    </Form.Control>
                                  </td>

                                  <td>
                                    <Select
                                      value={
                                        items[index].type_of_vat === "include"
                                          ? taxTypeIncludepphOptions.find((option) => option.value === items[index].tax_pph) || null
                                          : items[index].type_of_vat === "exclude"
                                          ? taxTypeExcludepphOptions.find((option) => option.value === items[index].tax_pph) || null
                                          : tax_pph_type_option.find((option) => option.value === items[index].tax_pph) || null
                                      }
                                      // value={tax_pph_type_option.find((option) => option.value === items[index].tax_pph) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_pph_type for the specific item
                                        handleItemChange(index, "tax_pph", selectedOption ? selectedOption.value : "");
                                        handleItemChange(index, "tax_pph_id", selectedOption ? selectedOption.id : "");
                                        handleItemChange(index, "tax_account_pph", selectedOption ? selectedOption.tax_account : "");

                                        // Update the PphRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_pph_rate", selectedOption.RATE);
                                          setPphRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_pph_rate", 0);
                                          setPphRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                        // Update the tax_code based on ppn dan pph summary
                                        const ppnSelectedOption = taxPpnTypeOption.find((option) => option.value === items[index].tax_ppn);
                                        const newTaxCode = `PPN: ${ppnSelectedOption ? ppnSelectedOption.label : "None"}, PPH: ${selectedOption ? selectedOption.label : "None"}`;
                                        handleItemChange(index, "tax_code", newTaxCode);
                                      }}
                                      options={tax_pph_type_option}
                                      isClearable
                                      placeholder="Select Tax PPH Type..."
                                      isDisabled={item.type_of_vat === "PPNRoyalty"} // Disable if PPN Royalty is selected
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>

                                  <td>
                                    <Form.Control type="number" value={item.tax_pph_rate} onChange={(e) => handleItemChange(index, "tax_pph_rate", parseFloat(e.target.value))} readOnly style={detailFormStyle()} />
                                  </td>
                                  <td className="">
                                    {item.currency === "IDR" ? (
                                      <Form.Control
                                        type="text"
                                        disabled
                                        style={{
                                          ...detailFormStyle(),
                                          textAlign: "right",
                                          width: `${inputWidth}px`,
                                          marginLeft: "auto",
                                          display: "flex",
                                        }}
                                        value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base.toLocaleString("en-US") : 0}
                                        onChange={(e) => {
                                          const newTaxBase = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                          handleItemChange(index, "tax_base", Math.max(0, newTaxBase));
                                          dynamicFormWidth(e);
                                        }}
                                      />
                                    ) : (
                                      <Form.Control
                                        type="text"
                                        disabled
                                        style={{
                                          ...detailFormStyle(),
                                          textAlign: "right",
                                          width: `${inputWidth}px`,
                                          marginLeft: "auto",
                                          display: "flex",
                                        }}
                                        value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base : 0}
                                        onChange={(e) => {
                                          handleItemChange(index, "tax_base", Math.max(0, parseFloat(e.target.value) || 0));
                                          dynamicFormWidth(e);
                                        }}
                                      />
                                    )}
                                  </td>
                                  <td>
                                    <Form.Control
                                      type="text"
                                      disabled
                                      style={{
                                        ...detailFormStyle(),
                                        textAlign: "right",
                                        width: `${inputWidth}px`,
                                        marginLeft: "auto",
                                        display: "flex",
                                      }}
                                      value={item.tax_base_idr !== undefined && item.tax_base_idr !== null ? item.tax_base_idr : 0}
                                      onChange={(e) => {
                                        handleItemChange(index, "tax_base_idr", Math.max(0, parseFloat(e.target.value) || 0));
                                        dynamicFormWidth(e);
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.tax_invoice_number} onChange={(e) => handleItemChange(index, "tax_invoice_number", e.target.value)} style={detailFormStyle()} />
                                  </td>
                                  <td>
                                    {docRef === "purchaseRequest" && (
                                      <Form.Group controlId="formPrNumber">
                                        <Select
                                          value={prNumberOptions.find((option) => option.value === item.doc_reff_no)}
                                          options={optionsWithDisabled}
                                          onChange={(selectedOption) => {
                                            handleItemChange(index, "doc_reff_no", selectedOption ? selectedOption.value : null);
                                            handlePrNumberChange(index, selectedOption);
                                          }}
                                          isClearable
                                          required
                                          placeholder="Select PR Number..."
                                          styles={{
                                            control: (provided) => ({
                                              ...provided,
                                              ...detailFormStyle(),
                                            }),
                                          }}
                                        />
                                      </Form.Group>
                                    )}

                                    {docRef === "purchaseOrder" && (
                                      <Form.Group controlId="formPoNumber">
                                        <Select
                                          value={poNumberOptions.find((option) => option.value === item.doc_reff_no)}
                                          options={optionsWithDisabled1}
                                          onChange={(selectedOption) => {
                                            handleItemChange(index, "doc_reff_no", selectedOption ? selectedOption.value : null);
                                            handlePoNumberChange(index, selectedOption);
                                          }}
                                          isClearable
                                          required
                                          placeholder="Select PO Number..."
                                          styles={{
                                            control: (provided) => ({
                                              ...provided,
                                              ...detailFormStyle(),
                                            }),
                                          }}
                                        />
                                      </Form.Group>
                                    )}

                                    {docRef === "internalMemo" && (
                                      <Form.Group controlId="formInternalMemo">
                                        <Form.Control type="text" placeholder="Enter Internal Memo" value={item.doc_reff_no} onChange={(e) => handleItemChange(index, "doc_reff_no", e.target.value)} required style={detailFormStyle()} />
                                      </Form.Group>
                                    )}

                                    {docRef === "customerContract" && (
                                      <Form.Group controlId="formCustomerContract">
                                        <Form.Control type="text" placeholder="Enter Document Contract" value={item.doc_reff_no} onChange={(e) => handleItemChange(index, "doc_reff_no", e.target.value)} required style={detailFormStyle()} />
                                      </Form.Group>
                                    )}

                                    {docRef !== "purchaseRequest" && docRef !== "purchaseOrder" && docRef !== "internalMemo" && docRef !== "customerContract" && (
                                      <Form.Control type="number" value={item.doc_reff_no} onChange={(e) => handleItemChange(index, "doc_reff_no", parseFloat(e.target.value))} disabled style={detailFormStyle()} />
                                    )}
                                  </td>
                                  <td>
                                    {isAddFile ? (
                                      <div className="d-flex">
                                        <Form.Control type="file" placeholder="Upload Document" onChange={(e) => handleItemChange(index, "file", e)} />
                                        <button className="btn btn-danger ms-2" onClick={() => setIsAddFile(false)}>
                                          <i className="fa fa-times" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        {item.doc_source ? (
                                          <a
                                            href="#"
                                            className="me-2"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              getFileDocument(item.endtoendid);
                                            }}
                                          >
                                            {item.doc_source}
                                          </a>
                                        ) : (
                                          <span className="me-2">No Data</span>
                                        )}
                                        <button className="btn btn-success" onClick={() => setIsAddFile(true)}>
                                          <i className="fa fa-edit" />
                                        </button>
                                      </div>
                                    )}
                                  </td>

                                  {docRef === "purchaseRequest" ? (
                                    <td>
                                      <Form.Group controlId="formProject">
                                        <Select
                                          value={
                                            items[index].project_id ?
                                              projectOptions.find(option => option.id === item.project_id)
                                            :
                                              null
                                          }
                                          onChange={(selectedOption) => {
                                            handleItemChange(index, "project", selectedOption ? selectedOption.value : null);
                                            handleItemChange(index, "project_id", selectedOption ? selectedOption.id : null);

                                            if (selectedOption) {
                                              const prjtNum = selectedOption.contract_number || ""; // Check for null
                                              handleItemChange(index, "project_contract_number", prjtNum);

                                              // Assuming selectedOption contains customer information
                                              const customer = selectedOption.customer || ""; // Adjust this based on your data structure
                                              handleItemChange(index, "customer", customer);
                                              handleItemChange(index, "customer_id", selectedOption ? selectedOption.id : "");
                                            } else {
                                              handleItemChange(index, "customer", ""); // Clear if null
                                              handleItemChange(index, "project_contract_number", ""); // Clear if null
                                            }
                                          }}
                                          options={projectOptions}
                                          isClearable
                                          placeholder="Select Project..."
                                          styles={{
                                            control: (provided) => ({
                                              ...provided,
                                              ...detailFormStyle(),
                                            }),

                                            placeholder: (base) => ({
                                              ...base,
                                              color: "#8d8080",
                                            }),
                                          }}
                                        />
                                      </Form.Group>
                                    </td>
                                  ) : (
                                    <td>
                                      <Form.Group controlId="formProject">
                                        {/* <Form.Label>Project</Form.Label> */}
                                        <Select
                                          value={
                                            items[index].project_id ?
                                              projectOptions.find(option => option.id === item.project_id)
                                            :
                                              null
                                          }
                                          onChange={(selectedOption) => {
                                            handleItemChange(index, "project", selectedOption ? selectedOption.value : null);
                                            handleItemChange(index, "project_id", selectedOption ? selectedOption.id : null);

                                            if (selectedOption) {
                                              const prjtNum = selectedOption.contract_number || ""; // Check for null
                                              handleItemChange(index, "project_contract_number", prjtNum);

                                              // Assuming selectedOption contains customer information
                                              const customer = selectedOption.customer || ""; // Adjust this based on your data structure
                                              handleItemChange(index, "customer", customer);
                                              handleItemChange(index, "customer_id", selectedOption ? selectedOption.id : "");
                                            } else {
                                              handleItemChange(index, "customer", ""); // Clear if null
                                              handleItemChange(index, "project_contract_number", ""); // Clear if null
                                            }
                                          }}
                                          options={projectOptions}
                                          isClearable
                                          placeholder="Select Project..."
                                          styles={{
                                            control: (provided) => ({
                                              ...provided,
                                              ...detailFormStyle(),
                                            }),

                                            placeholder: (base) => ({
                                              ...base,
                                              color: "#8d8080",
                                            }),
                                          }}
                                        />
                                      </Form.Group>
                                    </td>
                                  )}

                                  <td>
                                    <Select
                                      id="projectContractNumber"
                                      value={contractNumberOptions.find((option) => option.value === item.project_contract_number)}
                                      options={contractNumberOptions}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "project_contract_number", selectedOption ? selectedOption.value : null);
                                      }}
                                      placeholder="Project Contract Number..."
                                      isClearable
                                      isDisabled={!!item.project}
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),

                                        placeholder: (base) => ({
                                          ...base,
                                          color: "#8d8080",
                                        }),
                                      }}
                                    />
                                  </td>

                                  <td>
                                    <Select
                                      id="customer"
                                      value={
                                        items[index].customer_id ?
                                          customerOptions.find(option => option.id === item.customer_id)
                                        :
                                          null
                                      }
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "customer", selectedOption ? selectedOption.value : null);
                                        handleItemChange(index, "customer_id", selectedOption ? selectedOption.id : null);
                                      }}
                                      options={customerOptions}
                                      placeholder="Customer..."
                                      isDisabled={!!item.project}
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                      isClearable
                                    />
                                  </td>
                                  <td>
                                    <Select
                                      id="department"
                                      value={
                                        items[index].departement_id ?
                                          departementOptions.find(option => option.id === item.departement_id)
                                        :
                                          null
                                      }
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "departement", selectedOption ? selectedOption.value : null);
                                        handleItemChange(index, "department_id", selectedOption ? selectedOption.id : null);
                                      }}
                                      options={departementOptions}
                                      placeholder="Department..."
                                      isClearable
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                      required
                                    />
                                  </td>

                                  <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                        <div className="pb-4">
                          <Button className="rounded-3" variant="success" size="sm" onClick={handleAddItem}>
                            <i className="fas fa-plus"></i> New Item
                          </Button>
                          <Button variant="danger" size="sm" className="ml-2 rounded-3" onClick={handleDeleteLast} disabled={items.length === 0}>
                            <i className="fas fa-trash"></i> Delete
                          </Button>
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Card.Body>
              <Card.Footer>
                <table className="table table-bordered">
                  <tbody>
                    <tr className="text-right" hidden>
                      <td colSpan="16">Subtotal Before Discount:</td>
                      <td className="text-right col-3">
                        <strong>
                          {items.length > 0
                            ? calculateTotalAmount(currency).subTotal.toLocaleString("en-US", {
                                style: "currency",
                                currency: currency,
                                minimumFractionDigits: 0, // No decimal places
                                maximumFractionDigits: 0,
                              })
                            : "IDR 0.00"}
                        </strong>
                      </td>
                    </tr>
                    <tr className="text-right" hidden>
                      <td colSpan="16">taxbase with pph:</td>
                      <td>
                        <strong>{calculateTotalAmount().taxbasePPH.toLocaleString("en-US", { style: "currency", currency: "IDR" })}</strong>
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td colSpan="16">Subtotal:</td>
                      <td className="col-3">
                        <strong>
                          {items.length > 0
                            ? calculateTotalAmount().subtotalAfterDiscount.toLocaleString("en-US", {
                                style: "currency",
                                currency: currency,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })
                            : "IDR 0.00"}
                        </strong>
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td colSpan="16">Total Discount:</td>
                      <td>
                        <strong>
                          {items.length > 0
                            ? calculateTotalAmount().discount.toLocaleString("en-US", {
                                style: "currency",
                                currency: currency,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })
                            : "IDR 0.00"}
                        </strong>
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td colSpan="16">Total PPN Amount:</td>
                      <td>
                        <Form.Control
                          className="text-right"
                          type="text"
                          value={calculateTotalAmount().totalPPNAmount.toLocaleString("en-US") || 0}
                          onChange={(e) => {
                            // dynamicFormWidth(e.target.value, index);
                            const newItems = [...items];
                            const totalPPNAmount = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                            newItems.forEach((item) => {
                              item.tax_ppn_amount = totalPPNAmount / newItems.length;
                              item.tax_amount = (item.tax_pph_amount || 0) + item.tax_ppn_amount; // Update tax_amount based on PPN
                            });
                            setItems(newItems);
                          }}
                          style={{
                            textAlign: "right",
                            marginLeft: "auto",
                            display: "flex",
                          }}
                        />
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td colSpan="16">Total PPN Amount IDR:</td>
                      <td>
                        <Form.Control
                          className="text-right"
                          type="text"
                          value={calculateTotalAmount().totalPPNAmountIDR.toLocaleString("en-US") || 0}
                          onChange={(e) => {
                            // dynamicFormWidth(e.target.value, index);
                            const newItems = [...items];
                            const totalPPNAmountIDR = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                            newItems.forEach((item) => {
                              item.tax_ppn_amount = totalPPNAmountIDR / newItems.length;
                            });
                            setItems(newItems);
                          }}
                          style={{
                            textAlign: "right",
                            marginLeft: "auto",
                            display: "flex",
                          }}
                        />
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td colSpan="16">Total PPh Amount:</td>
                      <td>
                        <Form.Control
                          className="text-right"
                          type="text"
                          value={calculateTotalAmount().totalPPHAmount.toLocaleString("en-US") || 0}
                          onChange={(e) => {
                            // dynamicFormWidth(e.target.value, index);
                            const newItems = [...items];
                            const totalPPHAmount = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                            newItems.forEach((item) => {
                              item.tax_pph_amount = totalPPHAmount / newItems.length;
                              item.tax_amount = (item.tax_ppn_amount || 0) + item.tax_pph_amount; // Update tax_amount based on PPN and PPH
                            });
                            setItems(newItems);
                          }}
                          style={{
                            textAlign: "right",
                            marginLeft: "auto",
                            display: "flex",
                          }}
                        />
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td colSpan="16">Total PPh Amount IDR:</td>
                      <td>
                        <Form.Control
                          className="text-right"
                          type="text"
                          value={calculateTotalAmount().totalPPHAmountIDR.toLocaleString("en-US") || 0}
                          onChange={(e) => {
                            // dynamicFormWidth(e.target.value, index);
                            const newItems = [...items];
                            const totalPPHAmountIDR = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                            newItems.forEach((item) => {
                              item.tax_pph_amount = totalPPHAmountIDR / newItems.length;
                            });
                            setItems(newItems);
                          }}
                          style={{
                            textAlign: "right",
                            marginLeft: "auto",
                            display: "flex",
                          }}
                        />
                      </td>
                    </tr>
                    <tr className="text-right">
                      <td colSpan="16">Total Amount:</td>
                      <td>
                        <strong>
                          {items.length > 0
                            ? calculateTotalAmount(currency).totalAmount.toLocaleString("en-US", {
                                style: "currency",
                                currency: currency,
                                minimumFractionDigits: 0, // No decimal places
                                maximumFractionDigits: 0,
                              })
                            : "IDR 0.00"}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Form.Group controlId="formDescription">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter Notes"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}

                    // Add state and event handling logic as needed
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>Tax Invoice</Card.Title>
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
                              <th>Tax Account</th>
                              <th>Tax Code</th>
                              <th>Tax Amount</th>
                              <th>Tax Amount IDR</th>
                              <th>Base Amount</th>
                              <th>Base Amount IDR</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {taxSummaryItems.length === 0 ? (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  No data available
                                </td>
                              </tr>
                            ) : (
                              taxSummaryItems.map((item, index) => (
                                <tr key={index} className={selectedItems.includes(index) ? "table-active" : ""}>
                                  <td>
                                    <input type="checkbox" checked={selectedItems.includes(index)} onChange={() => handleSelectItem(index)} />
                                  </td>
                                  {/* <td>
                                    <Select
                                      id="tax_account"
                                      value={coaOptions.find((option) => option.value === item.tax_account)}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "tax_account", selectedOption ? selectedOption.value : null);
                                      }}
                                      options={coaOptions}
                                      placeholder="Tax Account..."
                                      isClearable
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                      required
                                    />
                                  </td> */}
                                  <td>
                                    <Form.Control type="text" value={item.tax_account} onChange={(e) => handleItemChange(index, "tax_account", e.target.value)} style={detailFormStyle()} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.tax_code} onChange={(e) => handleItemChange(index, "tax_code", e.target.value)} style={detailFormStyle()} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_amount} onChange={(e) => handleItemChange(index, "tax_amount", parseFloat(e.target.value))} style={detailFormStyle()} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.tax_amount_idr} onChange={(e) => handleItemChange(index, "tax_amount_idr", parseFloat(e.target.value))} style={detailFormStyle()} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.base_amount} onChange={(e) => handleItemChange(index, "base_amount", parseFloat(e.target.value))} style={detailFormStyle()} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" value={item.base_amount_idr} onChange={(e) => handleItemChange(index, "base_amount_idr", parseFloat(e.target.value))} style={detailFormStyle()} />
                                  </td>
                                  <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
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
          <Col md={12} className="d-flex justify-content-end">
            {setIsEditingPurchaseInvoice ? (
              <Button
                variant="secondary"
                className="mr-2"
                onClick={() => {
                  handleRefresh();
                  if (duplicateFlag) {
                    setIsAddingNewDuplicatePurchaseInvoice(false);
                    setDuplicateFlag(false);
                  } else {
                    setIsEditingPurchaseInvoice(false);
                  }
                }}
              >
                <i className="fas fa-arrow-left"></i> Go Back
              </Button>
            ) : (
              <></>
            )}
            {isSubmited === true ? (
              <Button onClick={resetForm}>
                <i className="fas fa-plus"></i> Add New
              </Button>
            ) : (
              <>
                <Button variant="primary" className="mr-2" onClick={handleSave}>
                  <i className="fas fa-save"></i> Save
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  <i className="fas fa-check"></i> Submit
                </Button>
              </>
            )}
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
