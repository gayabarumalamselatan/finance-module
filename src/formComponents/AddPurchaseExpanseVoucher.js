import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Card, CardFooter } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from "../service/InsertDataService";
import { getBranch, getToken } from "../config/Constant";
import { GENERATED_NUMBER } from "../config/ConfigUrl";
import { generateUniqueId } from "../service/GeneratedId";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import '../css/DatePicker.css';
import { FaCalendar } from "react-icons/fa";
import LookupParamService from "../service/LookupParamService";
import LookupService from "../service/LookupService";
import UpdateDataService from "../service/UpdateDataService";
import DeleteDataService from "../service/DeleteDataService";   
import UpdateStatusService from "../service/UpdateStatusService";
// import CreatableSelect from "react-select/creatable";
// import { Color } from "antd/es/color-picker";

const AddPurchaseExpanseVoucher = ({ setIsAddingNewPurchaseExpanse, setIsEditingPurchaseExpanse, handleRefresh, index, item, selectedData }) => {
  const headers = getToken();
  const branchId = getBranch();
  const userId = sessionStorage.getItem("userId");
  const idUser = sessionStorage.getItem("id");
  const [voucher_number, setVoucherNumber] = useState("");
  const [voucher_date, setVoucherDate] = useState(new Date().toISOString().split("T")[0]);
  const [bank_name, setBankName] = useState("");
  const [account_bank, setAccountBank] = useState("");
  const [exchange_rate, setExchangeRate] = useState("");
  const [status, setStatus] = useState("Draft");
  const [status_detail, setStatusDetail] = useState("");
  const [paid_to, setPayTo] = useState("");
  const [number_check_giro, setNumberCheckGiro] = useState("");
  const [giro_no, setNoGiro] = useState("");
  const [amount_idr, setIDRAmount] = useState("");
  const [payment_source, setPaymentSource] = useState("");
  const [coa, setCoa] = useState("");
  const [amount, setAmount] = useState([]);
  const [invoice_id, setInvoiceID] = useState("");
  const [db_cr, setDbCr] = useState("");
  const [tax_base, setTaxBase] = useState("");
  const [amount_paid, setAmountPaid] = useState("");
  const [employee, setEmployee] = useState("");
  const [department, setDepartment] = useState("");
  const [customer, setCustomer] = useState("");
  const [project_contract_number, setProjectContractNumber] = useState("");
  const [purchase_invoice_date, setPurchaseInvoiceDate] = useState("");
  const [total_debt, setTotalDebt] = useState("");
  const [total_paid, setTotalPaid] = useState("");
  const [tax_pph, setTaxPhh] = useState("");
  const [tax_ppn, setTaxPnn] = useState("");
  const [tax_pph_rate, setTaxPhhRate] = useState("");
  const [tax_ppn_rate, setTaxPnnRate] = useState("");
  const [exchange_rate_bank, setExchangeRateBank] = useState("");

  const [currency, setCurrency] = useState("IDR");
  const [pr_number, setPrNumber] = useState("");
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [product, setProduct] = useState("");
  const [product_account, setProductAccount] = useState("");
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestorOptions, setRequestorOptions] = useState([]);
  const [selectedRequestor, setSelectedRequestor] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [amountOptions, setAmountOptions] = useState([]);
  // const [exchangeOptions, setExchangeRateOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectContractOptions, setProjectContractOptions] = useState([]);
  const [selectedProjectContract, setSelectedProjectContract] = useState(null);
  const [productOptions, setProductOptions] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vendor, setVendor] = useState("");
  const [payment_term, setPaymentTerm] = useState("");
  const [invoice_date, setInvoiceDate] = useState("");
  const [ID, setID] = useState("");
  const [due_date, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [purchase_invoice_number, setInvoiceNumber] = useState("");
  const [piNumberOptions, setPiNumberOptions] = useState([]);
  const [selectedPiNumber, setSelectedPiNumber] = useState(null);
  const [po_number, setPoNumber] = useState("");
  const [internalmemo, setInternalMemo] = useState("");
  const [tax_rate, setTaxRate] = useState("");
  const [bi_middle_rate, setBiMiddleRate] = useState("");
  const [tax_invoice_number, setTaxInvoiceNumber] = useState("");

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedPaidTo, setSelectedPaidTo] = useState(null);
  const [selectedBankName, setSelectedBankName] = useState(null);
  const [selectedAccountBank, setSelectedAccountBank] = useState(null);
  const [selectedCurrencyBank, setSelectedCurrencyBank] = useState(null);
  const [selectedExchangeRate, setSelectedExchangeRate] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [paidToOptions, setPaidToOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [currencyBankOptions, setCurrencyBankOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [ExchangeRateOptions, setExchangeRateOptions] = useState([]);
  const [paymentTermOptions, setPaymentTermOptions] = useState([]);
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
  const [doc_reff, setDocRef] = useState("");
  const [prNumberOptions, setPrNumberOptions] = useState([]);
  const [selectedPrNumber, setSelectedPrNumber] = useState(null);
  const [poNumberOptions, setPoNumberOptions] = useState([]);
  const [selectedPoNumber, setSelectedPoNumber] = useState(null);

  const [invoice_type, setInvoiceType] = useState("");
  const [tax_pph_type_option, setTax_Pph_Type_Option] = useState([]);
  const [tax_pph_type2_option, setTax_Pph_Type2_Option] = useState([]);
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
  const [invoice_status, setInvoiceStatus] = useState("IN_PROCESS");
  const [doc_reference, setDocReference] = useState("");
  const [allvendoroptions, setAllVendorOptions] = useState([]);
  const [selectedbothvendor, setSelectedBothVendor] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formattedDiscount, setFormattedDiscount] = useState("IDR 0.00");
  const [discount, setDiscount] = useState(0);
  const [tax_ppn_royalty_option, setTaxPpnRoyaltyOption] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [taxTypeIncludeOptions, setTaxTypeIncludeOptions] = useState([]);
  const [taxTypeExcludeOptions, setTaxTypExcludeeOptions] = useState([]);
  const [taxTypeIncludepphOptions, setTaxTypeIncludePphOptions] = useState([]);
  const [taxTypeExcludepphOptions, setTaxTypExcludeePphOptions] = useState([]);

  const [bank_id, setBankId] = useState('');
  const create_by_id = parseInt(idUser);
  const [paid_to_id, setPaidToId] = useState('');
  const [currency_id, setCurrencyId] = useState('');
  
  const authToken = headers;

  const [inputWidth, setInputWidth] = useState(100);

  useEffect(() => {
    if (selectedData) {
      const { ID, VOUCHER_NUMBER } = selectedData[0];
      // Set data awal dari selectedData
      console.log("id and invoice number", ID, VOUCHER_NUMBER);
      setVoucherNumber(VOUCHER_NUMBER);

      LookupService.fetchLookupData(`VOUC_FORMVCBANK&filterBy=VOUCHER_NUMBER&filterValue=${VOUCHER_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const data = response.data[0];
          if (data) {
            setVoucherNumber(data.voucher_number);
            setVoucherDate(data.voucher_date);
            setPaymentSource(data.payment_source);
            setBankName(data.bank_name);
            setBankId(data.bank_id);
            // const selectedBankOption = bankOptions.find((option) => option.id === data.bank_id);
            // setSelectedBankName(selectedBankOption); // Set the selected paid to 
            // setSelectedBankName(data.bank_name);
            setPayTo(data.paid_to);
            setPaidToId(data.paid_to_id); // Set the paid to ID
            // const selectedPaidToOption = paidToOptions.find((option) => option.id === data.paid_to_id);
            // setSelectedPaidTo(selectedPaidToOption); // Set the selected paid to 
            setAccountBank(data.account_bank);
            // setSelectedPaidTo(data.paid_to);
            setNumberCheckGiro(data.number_check_giro);
            setExchangeRate(data.exchange_rate);
            setStatus(data.status);
            setDueDate(data.due_date);
            setTaxInvoiceNumber(data.tax_invoice_number);
            setCurrency(data.currency);
            setCurrencyId(data.currency_id); // Set the currency ID
            // const selectedCurrencyOption = currencyOptions.find((option) => option.id === data.currency_id);
            // setSelectedCurrency(selectedCurrencyOption); // Set the selected currency   
            setExchangeRateBank(data.exchange_rate);
            // setSelectedCurrency(data.currency);
            // setProject(data.project);
            setDescription(data.description);
            setSelectedTaxType(data.tax_ppn_type); // For PPN Type
            setSelectedTaxPphType(data.tax_pph_type); // For PPh Type
            // setTotalTaxBase(data.total_tax_base);
            setTaxRate(data.tax_rate);         

            //buat paid_to edit
            LookupParamService.fetchLookupDataView("VOUC_VIEWVCBANK", authToken, branchId)
            .then((Data) => {
              console.log("Paid to lookup data:", Data);

              // Transform and map currency data to options
              const transformedPaidToData = Data.data.map((item) =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {})
              );

              const paidToOptions = transformedPaidToData.map((item) => ({
                id: item.ID,
                value: item.NAME,
                label: item.NAME,
              }));

              setPaidToOptions(paidToOptions); // Set currency options to state
              if (selectedData) {
                const selectedPaidTo = paidToOptions.find((option) => option.id === selectedData[0].PAID_TO_ID || "");
                setSelectedPaidTo(selectedPaidTo || null);
                setPayTo(selectedPaidTo.value);
                setPaidToId(selectedPaidTo.id);
              } else if (!selectedData) {
                // const defaultPaidTo = PaidToOptions.find((option) => option.id === null);
                setSelectedPaidTo(selectedPaidTo || null);
                setPayTo(selectedPaidTo.value);
                setPaidToId(selectedPaidTo.id);
              }
            })
            .catch((error) => {
              console.error("Failed to fetch paid_to lookup:", error);
            });


             //buat Bank edit
             LookupParamService.fetchLookupDataView("MSDT_FORMBNCS", authToken, branchId)
             .then((BankData) => {
               console.log("Bank lookup data:", BankData);
 
               // Transform and map currency data to options
               const transformedBankData = BankData.data.map((item) =>
                 Object.keys(item).reduce((acc, key) => {
                   acc[key.toUpperCase()] = item[key];
                   return acc;
                 }, {})
               );
 
               const bankOptions = transformedBankData 
               .map((item) => ({
                value: item.BANK_NAME,
                label: item.BANK_NAME,
                id: item.ID,
                bank_account: item.BANK_ACCOUNT,
               }));
 
               setBankOptions(bankOptions); // Set currency options to state
               if (selectedData) {
                 const selectedBankName = bankOptions.find((option) => option.id === selectedData[0].BANK_ID || "");
                 setSelectedBankName(selectedBankName || null);
                 setBankName(selectedBankName.value);
                 setBankId(selectedBankName.id);
                //  setAccountBank(selectedBankName.value);
               } else if (!selectedData) {
                //  const defaultBankTo = bankOptions.find((option) => option.id === null);
                 setSelectedBankName(selectedBankName || null);
                 setBankName(selectedBankName.value);
                 setBankId(selectedBankName.id);
                //  setAccountBank(selectedBankName.value);
               }
             })
             .catch((error) => {
               console.error("Failed to fetch bank lookup:", error);
             });


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
                id: item.ID,
                value: item.CODE,
                label: item.CODE,
              }));

              setCurrencyOptions(currencyOptions); // Set currency options to state
              if (selectedData) {
                const selectCurrency = currencyOptions.find((option) => option.id === selectedData[0].CURRENCY_ID || "");
                setSelectedCurrency(selectCurrency || null);
                setCurrency(selectCurrency.value);
                setCurrencyId(selectCurrency.id);
              } else if (!selectedData) {
                const defaultCurrency = currencyOptions.find((option) => option.id === 61);
                setSelectedCurrency(defaultCurrency);
                setCurrencyId(defaultCurrency.id);
                setCurrency(defaultCurrency.value);
              }
            })
            .catch((error) => {
              console.error("Failed to fetch currency lookup:", error);
            });

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

      // Fetch items based on INVOICE_NUMBER and set them to state
      LookupService.fetchLookupData(`VOUC_FORMVCBANKD&filterBy=voucher_number&filterValue=${VOUCHER_NUMBER}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          // Set fetched items to state
          setItems(fetchedItems);

          // Lookup PPN & PPh
          LookupParamService.fetchLookupDataView("MSDT_FORMTAX", authToken, branchId)
            .then((data) => {
              console.log("tax lookup data:", data);

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
                }));
              setTax_Pph_Type_Option(options);

              const optionsPpn = transformedData
                .filter((item) => item.TAX_TYPE === "PPN")
                .map((item) => ({
                  id: item.ID,
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                }));
              setTaxPpnTypeOption(optionsPpn);

              const IncludeOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypeIncludeOptions(IncludeOptions);

              const ExcludeOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypExcludeeOptions(ExcludeOptions);

              const IncludepphOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypeIncludePphOptions(IncludepphOptions);

              const ExcludepphOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypExcludeePphOptions(ExcludepphOptions);

              const optionsPpnRoyalty = transformedData
                .filter((item) => item.ROYALTY === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  id: item.ID,
                  RATE: item.RATE,
                }));
              setTaxPpnRoyaltyOption(optionsPpnRoyalty);
            })
            .catch((error) => {
              console.error("Failed to fetch tax lookup:", error);
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
                id: item.ID,
                expenseAccount: item.EXPENSE_ACCOUNT,
                product_account: item.PRODUCT_ACCOUNT,
              }));

              setProductOptions(productOptions); // Set product options to state

              LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
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
                    id: item.ID,
                    value: item.NAME,
                    label: item.NAME,
                    project_contract_number: item.CONTRACT_NUMBER,
                    customer: item.CUSTOMER,
                  }));
                  setProjectOptions(options);

                  //buat employee
                  LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
                    .then((employeeData) => {
                      console.log("Employee lookup data:", employeeData);

                      // Transform and map product data to options
                      const transformedEmployeeData = employeeData.data.map((item) =>
                        Object.keys(item).reduce((acc, key) => {
                          acc[key.toUpperCase()] = item[key];
                          return acc;
                        }, {})
                      );

                      const employeeOptions = transformedEmployeeData.map((item) => ({
                        value: item.NAME,
                        label: item.NAME,
                        id: item.ID,
                      }));
                      setEmployeeOptions(employeeOptions); // Set product options to state

                      // Fetch currency lookup data
                      // LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                      //   .then((currencyData) => {
                      //     console.log("Currency lookup data:", currencyData);

                      //     // Transform and map currency data to options
                      //     const transformedCurrencyData = currencyData.data.map((item) =>
                      //       Object.keys(item).reduce((acc, key) => {
                      //         acc[key.toUpperCase()] = item[key];
                      //         return acc;
                      //       }, {})
                      //     );

                      //     const currencyOptions = transformedCurrencyData.map((item) => ({
                      //       value: item.CODE,
                      //       label: item.CODE,
                      //     }));

                      //     setCurrencyOptions(currencyOptions); // Set currency options to state

                          // Update fetched items with selected options
                          const updatedItems = fetchedItems.map((item) => {
                            const selectedProductOption = productOptions.find((option) => option.value === item.product);

                            console.log("Selected product option:", selectedProductOption);

                            const selectedProjectOption = projectOptions.find((option) => option.value === item.project);

                            console.log("Selected project option:", selectedProjectOption);

                            const selectedEmployeeOption = employeeOptions.find((option) => option.value === item.employee);

                            console.log("Selected product option:", selectedEmployeeOption);

                            // const selectedCurrencyOption = currencyOptions.find((option) => option.value === item.currency);

                            // console.log("Selected currency option:", selectedCurrencyOption);

                            // setSelectedCurrency(selectedCurrencyOption);
                            setSelectedEmployee(selectedEmployeeOption);
                            setSelectedProduct(selectedProductOption);
                            setSelectedProject(selectedProjectOption);
                          });

                          // Set the updated items with selected product and currency options to state
                          setItems(fetchedItems);
                        })
                        .catch((error) => {
                          console.error("Failed to fetch currency lookup:", error);
                        });
                    // })
                    // .catch((error) => {
                    //   console.error("Failed to fetch currency lookup:", error);
                    // });
                })
                .catch((error) => {
                  console.error("Failed to fetch product lookup:", error);
                });
            })
            .catch((error) => {
              console.error("Failed to fetch product lookup:", error);
            });
        })
        .catch((error) => {
          console.error("Failed to load items:", error);
        });

      //buat bank
      LookupParamService.fetchLookupData("MSDT_FORMBNCS", authToken, branchId)
        .then((data) => {
          console.log("Bank lookup data:", data);

          // Transform keys to uppercase directly in the received data
          const transformedData = data.data.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          );
          //console.log('Transformed data:', transformedData);

          const options = transformedData
            .filter((item) => item.TYPE !== "PETTY CASH")
            .map((item) => ({
              value: item.BANK_NAME,
              label: item.BANK_NAME,
              id: item.ID,
              bank_account: item.BANK_ACCOUNT,
            }));
          setBankOptions(options);
          if (selectedData?.[0]?.BANK_NAME) {
            const matchingOption = options.find(
              (option) => option.value === selectedData[0].BANK_NAME
            );
            if (matchingOption) {
              setSelectedBankName(matchingOption);
              setBankName(matchingOption.value);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to fetch Bank lookup:", error);
        });

      //Pi Number
      LookupParamService.fetchLookupData("PURC_FORMPUINVC&filterBy=INVOICE_STATUS&filterValue=IN_PROCESS&operation=EQUAL", authToken, branchId)
        .then((data) => {
          console.log("Invoice Number lookup data:", data);

          // Transform keys to uppercase directly in the received data
          const transformedData = data.data.map((item) =>
            Object.keys(item).reduce((acc, key) => {
              acc[key.toUpperCase()] = item[key];
              return acc;
            }, {})
          );
          //console.log('Transformed data:', transformedData);

          // const filteredData = transformedData.filter(item => item.STATUS_INVOICE === "IN_PROCESS");
          const options = transformedData.map((item) => ({
            value: item.INVOICE_NUMBER,
            label: item.INVOICE_NUMBER,
            product: item.PRODUCT,
            product_id: item.PRODUCT,
            currency: item.CURRENCY,
            // quantity: item.QUANTITY,
            unit_price: item.UNIT_PRICE,
            total_price: item.TOTAL_PRICE,
            // product_note: item.PRODUCT_NOTE,
            tax_ppn: item.TAX_PPN,
            tax_ppn_id: item.TAX_PPN_ID,
            tax_ppn_rate: item.TAX_PPN_RATE,
            tax_ppn_amount: item.TAX_PPN_AMOUNT,
            tax_pph: item.TAX_PPH,
            tax_pph_id: item.TAX_PPH_ID,
            tax_pph_rate: item.TAX_PPH_RATE,
            tax_pph_amount: item.TAX_PPH_AMOUNT,
            tax_base: item.TAX_BASE,
            type_of_vat: item.TYPE_OF_VAT,
            type_of_pph: item.TYPE_OF_PPH,
            tax_exchange_rate: item.TAX_EXCHANGE_RATE,
            total_price_idr: item.TOTAL_PRICE_IDR,
            project: item.PROJECT,
            project_id: item.PROJECT_ID,
            project_contract_number: item.PROJECT_CONTRACT_NUMBER,
            customer: item.CUSTOMER,
            vendor: item.VENDOR,
            department: item.DEPARTEMENT,
            department_id: item.DEPARTEMENT_ID,
            tax_invocie_number: item.TAX_INVOICE_NUMBER,
            cod_cor_skb: item.COD_COR_SKB,
            doc_source: item.DOC_SOURCE,
            doc_reff_no: item.DOC_REFF_NO,
            invoice_number_vendor: item.INVOICE_NUMBER_VENDOR,
            status_detail: item.STATUS_DETAIL,
            id_upload: item.ID_UPLOAD,
          }));
          setPiNumberOptions(options);
        })
        .catch((error) => {
          console.error("Failed to fetch Invoice lookup:", error);
        });

      //buat Product
      LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
        .then((data) => {
          console.log("Product lookup data:", data);

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
            expenseAccount: item.EXPENSE_ACCOUNT,
            product_account: item.PRODUCT_ACCOUNT,
          }));
          setProductOptions(options);
        })
        .catch((error) => {
          console.error("Failed to fetch Product lookup:", error);
        });

      //      LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
      // .then((data) => {
      //   console.log("Description lookup data:", data);

      //   // Transform keys to uppercase directly in the received data
      //   const transformedData = data.data.map((item) =>
      //     Object.keys(item).reduce((acc, key) => {
      //       acc[key.toUpperCase()] = item[key];
      //       return acc;
      //     }, {})
      //   );
      //   //console.log('Transformed data:', transformedData);

      //   const options = transformedData.map((item) => ({
      //     value: item.DESCRIPTION,
      //     label: item.DESCRIPTION,
      //   }));
      //   setDescriptionOptions(options);
      // })
      // .catch((error) => {
      //   console.error("Failed to fetch Description lookup:", error);
      // });

      //buat project
      LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
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
            id: item.ID,
            project_contract_number: item.CONTRACT_NUMBER,
            customer: item.CUSTOMER,
          }));
          setProjectOptions(options);
        })
        .catch((error) => {
          console.error("Failed to fetch project number lookup:", error);
        });

      //buat project
      // LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
      //   .then((data) => {
      //     console.log("Project lookup data:", data);

      //     // Transform keys to uppercase directly in the received data
      //     const transformedData = data.data.map((item) =>
      //       Object.keys(item).reduce((acc, key) => {
      //         acc[key.toUpperCase()] = item[key];
      //         return acc;
      //       }, {})
      //     );
      //     //console.log('Transformed data:', transformedData);

      //     const options = transformedData.map((item) => ({
      //       value: item.CONTRACT_NUMBER,
      //       label: item.CONTRACT_NUMBER,
      //     }));
      //     setProjectContractOptions(options);
      //   })
      //   .catch((error) => {
      //     console.error("Failed to fetch project number lookup:", error);
      //   });

      //buat Paid_to
      LookupParamService.fetchLookupDataView("VOUC_VIEWVCBANK", authToken, branchId)
        .then((data) => {
          console.log("paid to lookup data:", data);

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
          setPaidToOptions(options);
          if (selectedData?.[0]?.PAID_TO) {
            const matchingOption = options.find(
              (option) => option.value === selectedData[0].PAID_TO
            );
            if (matchingOption) {
              setSelectedPaidTo(matchingOption);
              setPayTo(matchingOption.value);
            }
          }      
        })
        .catch((error) => {
          console.error("Failed to fetch paid to lookup:", error);
        });

      //buat vendor
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
            .filter((item) => item.ENTITY_TYPE === "BOTH" || item.ENTITY_TYPE === "Vendor")
            .map((item) => ({
              value: item.NAME,
              label: item.NAME,
            }));
          setVendorOptions(bothOptions);
        })
        .catch((error) => {
          console.error("Failed to fetch vendor lookup:", error);
        });

      //buat customer
      // LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
      //   .then((data) => {
      //     console.log("Customer lookup data:", data);

      //     // Transform keys to uppercase directly in the received data
      //     const transformedData = data.data.map((item) =>
      //       Object.keys(item).reduce((acc, key) => {
      //         acc[key.toUpperCase()] = item[key];
      //         return acc;
      //       }, {})
      //     );
      //     //console.log('Transformed data:', transformedData);

      //     const options = transformedData.map((item) => ({
      //       value: item.CUSTOMER,
      //       label: item.CUSTOMER,
      //     }));
      //     setCustomerOptions(options);
      //   })
      //   .catch((error) => {
      //     console.error("Failed to fetch Customer lookup:", error);
      //   });

      //buat Department
      // LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
      // .then((data) => {
      //   console.log("Department lookup data:", data);

      //   // Transform keys to uppercase directly in the received data
      //   const transformedData = data.data.map((item) =>
      //     Object.keys(item).reduce((acc, key) => {
      //       acc[key.toUpperCase()] = item[key];
      //       return acc;
      //     }, {})
      //   );
      //   //console.log('Transformed data:', transformedData);

      //   const options = transformedData.map((item) => ({
      //     value: item.NAME,
      //     label: item.NAME,
      //   }));
      //   setDepartmentOptions(options);
      // })
      // .catch((error) => {
      //   console.error("Failed to fetch Department lookup:", error);
      // });

      // Lookup PPN & PPh
      LookupParamService.fetchLookupData("MSDT_FORMTAX", authToken, branchId)
        .then((data) => {
          console.log("Tax lookup data:", data);

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
              id: item.ID,
              RATE: item.RATE,
            }));
          setTax_Pph_Type_Option(options);
          // console.log("Tax_PPh :", options);
          // const selectedTaxPphType = options.find((option) => option.value === selectedData[0].TAX_PPH);
          // setSelectedTaxPphType(selectedTaxPphType || null);

          const optionsPpn = transformedData
            .filter((item) => item.TAX_TYPE === "PPN")
            .map((item) => ({
              value: item.NAME,
              label: item.NAME,
              id: item.ID,
              RATE: item.RATE,
            }));
          setTaxPpnTypeOption(optionsPpn);
          // console.log("Tax_PPN :", optionsPpn);
          // const selectedPPNOption = optionsPpn.find((option) => option.value === selectedData[0].TAX_PPN);
          // setSelectedTaxType(selectedPPNOption || null);

          const IncludeOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypeIncludeOptions(IncludeOptions);

              const ExcludeOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypExcludeeOptions(ExcludeOptions);

              const IncludepphOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypeIncludePphOptions(IncludepphOptions);

              const ExcludepphOptions = transformedData
                .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
                .map((item) => ({
                  value: item.NAME,
                  label: item.NAME,
                  RATE: item.RATE,
                  id: item.ID,
                }));
              setTaxTypExcludeePphOptions(ExcludepphOptions);


          const optionsPpnRoyalty = transformedData
            .filter((item) => item.ROYALTY === true)
            .map((item) => ({
              value: item.NAME,
              label: item.NAME,
              id: item.ID,
              RATE: item.RATE,
            }));
          setTaxPpnRoyaltyOption(optionsPpnRoyalty);
          
        })
        .catch((error) => {
          console.error("Failed to fetch tax lookup:", error);
        });

      //buat Currency
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
            id: item.ID,
          }));
          setCurrencyOptions(options);
         
        })
        .catch((error) => {
          console.error("Failed to fetch Currency lookup:", error);
        });

      //buat Employee
      LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
        .then((data) => {
          console.log("Employee lookup data:", data);

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
          setEmployeeOptions(options);
        })
        .catch((error) => {
          console.error("Failed to fetch Employee lookup:", error);
        });

      //project
      LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
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
            id: item.ID,
            value: item.NAME,
            label: item.NAME,
            
          }));
          setProjectOptions(options);
          const selectedProjectOption = options.find((option) => option.value === selectedData[0].PROJECT);
          setSelectedProject(selectedProjectOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch project lookup:", error);
        });

      //buat payment term 
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
          const selectedPaymentTermOption = options.find((option) => option.value === selectedData[0].PAYMENT_TERM);
          setSelectedPaymentTerm(selectedPaymentTermOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch payment term lookup:", error);
        });

      //buat product
      LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
        .then((data) => {
          console.log("product lookup data:", data);

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
          const selectedProductOption = options.find((option) => option.value === selectedData[0].PRODUCT);
          setSelectedProduct(selectedProductOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch product lookup:", error);
        });

      //buat department 
      LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
        .then((data) => {
          console.log("Department lookup data:", data);

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
          setDepartmentOptions(options);
          console.log("Department :", options);
          const selectedDepartmentOption = options.find((option) => option.value === selectedData[0].DEPARTMENT);
          setSelectedDepartment(selectedDepartmentOption || null);
        })
        .catch((error) => {
          console.error("Failed to fetch department lookup:", error);
        });

      //buat customer
      // LookupParamService.fetchLookupData("MSDT_FORMCUST", authToken, branchId)
      //   .then((data) => {
      //     console.log("Customer lookup data:", data);

      //     // Transform keys to uppercase directly in the received data
      //     const transformedData = data.data.map((item) =>
      //       Object.keys(item).reduce((acc, key) => {
      //         acc[key.toUpperCase()] = item[key];
      //         return acc;
      //       }, {})
      //     );
      //     //console.log('Transformed data:', transformedData);

      //     const options = transformedData.map((item) => ({
      //       id: item.ID,
      //       value: item.NAME,
      //       label: item.NAME,
      //     }));
      //     setCustomerOptions(options);
      //     console.log("Customer :", customer);
      //     const selectedCustomerOption = options.find((option) => option.value === selectedData[0].CUSTOMER);
      //     setSelectedCustomer(selectedCustomerOption || null);
      //   })
      //   .catch((error) => {
      //     console.error("Failed to fetch customer lookup:", error);
      //   });
    }
  }, [selectedData]);

  useEffect(() => {
    const generateInitialVoucherNumber = async () => {
      const generatedVoucherNumber = await generateVoucherNumber("DRAFT_VOUC"); // Adjust the code as needed

      setVoucherNumber(generatedVoucherNumber);
    };

    generateInitialVoucherNumber();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Ambil data lookup untuk currency
    // MSDT_FORMEMPL adalah nama table yang menyimpan data lookup untuk currency
    // authToken dan branchId digunakan untuk mengirimkan token otorisasi dan kode cabang ke server
    LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
      .then((data) => {
        console.log("Requestor lookup data:", data);

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
        console.error("Failed to fetch Requestor lookup:", error);
      });

    // buat PI number
    // LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
    // .then((data) => {
    //   console.log("PI number lookup data:", data);

    //   // Transform keys to uppercase directly in the received data
    //   const transformedData = data.data.map((item) =>
    //     Object.keys(item).reduce((acc, key) => {
    //       acc[key.toUpperCase()] = item[key];
    //       return acc;
    //     }, {})
    //   );

    //   // Filter out PR numbers that start with "DRAFT"
    //   const filteredData = transformedData.filter((item) => !item.INVOICE_NUMBER.startsWith("DRAFT"));

    //   const options = filteredData.map((item) => ({
    //     value: item.INVOICE_NUMBER,
    //     label: item.INVOICE_NUMBER,
    //     project: item.PROJECT,
    //     id: item.ID,
    //     totalAmount: item.TOTAL_AMOUNT,
    //     currency: item.CURRENCY,
    //     quantity: item.QUANTITY,
    //     description: item.DESCRIPTION,
    //     paymentTerm: item.PAYMENT_TERM, // Include payment term in the options
    //     dueDate: item.DUE_DATE,
    //     vendor: item.VENDOR,
    //     // ENDTOENDID: item.ENDTOENDID,
    //     customer: item.CUSTOMER,
    //     departement: item.DEPARTEMENT,
    //   }));
    //   setPiNumberOptions(options);
    // })
    // .catch((error) => {
    //   console.error("Failed to fetch PI number lookup:", error);
    // });

    // buat Currency Bank
    // LookupParamService.fetchLookupData("MSDT_FORMBNCS", authToken, branchId)
    // .then((data) => {
    //   console.log("Bank Currency lookup data:", data);

    //   // Transform keys to uppercase directly in the received data
    //   const transformedData = data.data.map((item) =>
    //     Object.keys(item).reduce((acc, key) => {
    //       acc[key.toUpperCase()] = item[key];
    //       return acc;
    //     }, {})
    //   );
    //   //console.log('Transformed data:', transformedData);

    //   const options = transformedData.map((item) => ({
    //     value: item.CURRENCY,
    //     label: item.CURRENCY,
    //   }));
    //   setCurrencyBankOptions(options);
    // })
    // .catch((error) => {
    //   console.error("Failed to fetch Bank Currency lookup:", error);
    // });

    // buat Bank_Name
    LookupParamService.fetchLookupData("MSDT_FORMBNCS", authToken, branchId)
      .then((data) => {
        console.log("Bank lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData
          .filter((item) => item.TYPE !== "PETTY CASH")
          .map((item) => ({
            value: item.BANK_NAME,
            label: item.BANK_NAME,
            id: item.ID,
            bank_account: item.BANK_ACCOUNT,
          }));
        setBankOptions(options);
        
      })
      .catch((error) => {
        console.error("Failed to fetch Bank lookup:", error);
      });

    // buat Account Bank
    // LookupParamService.fetchLookupData("MSDT_FORMBNCS", authToken, branchId)
    // .then((data) => {
    //   console.log("Account Bank lookup data:", data);

    //   // Transform keys to uppercase directly in the received data
    //   const transformedData = data.data.map((item) =>
    //     Object.keys(item).reduce((acc, key) => {
    //       acc[key.toUpperCase()] = item[key];
    //       return acc;
    //     }, {})
    //   );
    //   //console.log('Transformed data:', transformedData);

    //   const options = transformedData.map((item) => ({
    //     value: item.BANK_ACCOUNT,
    //     label: item.BANK_ACCOUNT,
    //   }));
    //   setAccountOptions(options);
    // })
    // .catch((error) => {
    //   console.error("Failed to fetch Account lookup:", error);
    // });

    //Invoice Number
    // LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
    // .then((data) => {
    //   console.log("Invoice Number lookup data:", data);

    //   // Transform keys to uppercase directly in the received data
    //   const transformedData = data.data.map((item) =>
    //     Object.keys(item).reduce((acc, key) => {
    //       acc[key.toUpperCase()] = item[key];
    //       return acc;
    //     }, {})
    //   );
    //   //console.log('Transformed data:', transformedData);

    //   const options = transformedData.map((item) => ({
    //     value: item.INVOICE_NUMBER,
    //     label: item.INVOICE_NUMBER,
    //     id: item.ID,
    //     doc_reff: item.DOC_REFF,
    //     invoice_date: item.INVOICE_DATE,
    //     payment_term: item.PAYMENT_TERM,
    //     due_date: item.DUE_DATE,
    //     invoice_status: item.INVOICE_STATUS,
    //     description: item.DESCRIPTION,
    //     total_amount: item.TOTAL_AMOUNT,
    //     term_of_payment: Item.TERM_OF_PAYMENT,
    //     tax_exchange_rate: item.TAX_EXCHANGE_RATE,
    //     total_after_discount: item.TOTAL_AFTER_DISCOUNT,
    //     total_amount_ppn: item.TOTAL_AMOUNT_PPH,
    //     total_amount_pph: item.TOTAL_AMOUNT_PPN,
    //     endtoendid: item.ENDTOENDID,
    //     total_before_discount: item.TOTAL_BEFORE_DISCOUNT,
    //     discount: item.DISCOUNT,
    //   }));
    //   setPiNumberOptions(options);
    // })
    // .catch((error) => {
    //   console.error("Failed to fetch Invoice lookup:", error);
    // });

    LookupParamService.fetchLookupData("PURC_FORMPUINVC&filterBy=INVOICE_STATUS&filterValue=IN_PROCESS&operation=EQUAL", authToken, branchId)
      .then((data) => {
        console.log("Invoice Number lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        // const filteredData = transformedData.filter(item => item.STATUS_INVOICE === "IN_PROCESS");
        const options = transformedData.map((item) => ({
          id: item.ID,
          value: item.INVOICE_NUMBER,
          label: item.INVOICE_NUMBER,
          invoice_status: item.INVOICE_STATUS,
          product: item.PRODUCT,
          currency: item.CURRENCY,
          // quantity: item.QUANTITY,
          unit_price: item.UNIT_PRICE,
          total_price: item.TOTAL_PRICE,
          // product_note: item.PRODUCT_NOTE,
          tax_ppn: item.TAX_PPN,
          tax_ppn_rate: item.TAX_PPN_RATE,
          tax_ppn_amount: item.TAX_PPN_AMOUNT,
          tax_pph: item.TAX_PPH,
          tax_pph_rate: item.TAX_PPH_RATE,
          tax_pph_amount: item.TAX_PPH_AMOUNT,
          tax_base: item.TAX_BASE,
          type_of_vat: item.TYPE_OF_VAT,
          type_of_pph: item.TYPE_OF_PPH,
          tax_exchange_rate: item.TAX_EXCHANGE_RATE,
          total_price_idr: item.TOTAL_PRICE_IDR,
          project: item.PROJECT,
          project_contract_number: item.PROJECT_CONTRACT_NUMBER,
          customer: item.CUSTOMER,
          vendor: item.VENDOR,
          department: item.DEPARTEMENT,
          tax_invocie_number: item.TAX_INVOICE_NUMBER,
          cod_cor_skb: item.COD_COR_SKB,
          doc_source: item.DOC_SOURCE,
          doc_reff_no: item.DOC_REFF_NO,
          invoice_number_vendor: item.INVOICE_NUMBER_VENDOR,
          status_detail: item.STATUS_DETAIL,
          id_upload: item.ID_UPLOAD,
        }));
        setPiNumberOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch Invoice lookup:", error);
      });

    //buat Product
    LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
      .then((data) => {
        console.log("Product lookup data:", data);

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
          expenseAccount: item.EXPENSE_ACCOUNT,
          product_account: item.PRODUCT_ACCOUNT,
        }));
        setProductOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch Product lookup:", error);
      });

    LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
      .then((data) => {
        console.log("Description lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData.map((item) => ({
          value: item.DESCRIPTION,
          label: item.DESCRIPTION,
        }));
        setDescriptionOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch Description lookup:", error);
      });

    //buat project
    LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
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
          id: item.ID,
          project_contract_number: item.CONTRACT_NUMBER,
          customer: item.CUSTOMER,
        }));
        setProjectOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch project number lookup:", error);
      });

    //buat project contract number
    // LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
    //   .then((data) => {
    //     console.log("Project lookup data:", data);

    //     // Transform keys to uppercase directly in the received data
    //     const transformedData = data.data.map((item) =>
    //       Object.keys(item).reduce((acc, key) => {
    //         acc[key.toUpperCase()] = item[key];
    //         return acc;
    //       }, {})
    //     );
    //     //console.log('Transformed data:', transformedData);

    //     const options = transformedData.map((item) => ({
    //       value: item.CONTRACT_NUMBER,
    //       label: item.CONTRACT_NUMBER,
    //     }));
    //     setProjectContractOptions(options);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to fetch project number lookup:", error);
    //   });

    //buat Paid_to
    LookupParamService.fetchLookupDataView("VOUC_VIEWVCBANK", authToken, branchId)
      .then((data) => {
        console.log("paid to lookup data:", data);

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
        setPaidToOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch paid to lookup:", error);
      });


    //buat vendor
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

        // const allOptions = transformedData.map((item) => ({
        //   value: item.NAME,
        //   label: item.NAME,
        // }));
        // setAllVendorOptions(allOptions);

        const bothOptions = transformedData
          .filter((item) => item.ENTITY_TYPE === "BOTH" || item.ENTITY_TYPE === "Vendor")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
          }));
        setVendorOptions(bothOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch vendor lookup:", error);
      });

    //buat Customer
    LookupParamService.fetchLookupData("MSDT_FORMCUST", authToken, branchId)
      .then((data) => {
        console.log("Customer lookup data:", data);

        // Transform keys to uppercase directly in the received data
        const transformedData = data.data.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        //console.log('Transformed data:', transformedData);

        const options = transformedData
        .filter((item) => item.ENTITY_TYPE === "Customer")
        .map((item) => ({
          id: item.ID,
          value: item.NAME,
          label: item.NAME,
        }));
        setCustomerOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch Customer lookup:", error);
      });

    //buat Department
    LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
      .then((data) => {
        console.log("Department lookup data:", data);

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
        setDepartmentOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch Department lookup:", error);
      });

    //buat Currency
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
          id: item.ID,
        }));
        setCurrencyOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch Currency lookup:", error);
      });

    //buat Employee
    LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
      .then((data) => {
        console.log("Employee lookup data:", data);

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
        setEmployeeOptions(options);
      })
      .catch((error) => {
        console.error("Failed to fetch Employee lookup:", error);
      });

    //buat Exchnage rate
    // LookupParamService.fetchLookupData("PURC_FORMPUINVCD", authToken, branchId)
    // .then((data) => {
    //   console.log("Departmen lookup data:", data);

    //   // Transform keys to uppercase directly in the received data
    //   const transformedData = data.data.map((item) =>
    //     Object.keys(item).reduce((acc, key) => {
    //       acc[key.toUpperCase()] = item[key];
    //       return acc;
    //     }, {})
    //   );
    //   //console.log('Transformed data:', transformedData);

    //   const options = transformedData.map((item) => ({
    //     value: item.TAX_EXCHANGE_RATE,
    //     label: item.TAX_EXCHANGE_RATE,
    //   }));
    //   setExchangeRateOptions(options);
    // })
    // .catch((error) => {
    //   console.error("Failed to fetch project lookup:", error);
    // });

    //lookup tax PPN & tax PPh
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
            id: item.ID,
            RATE: item.RATE,
          }));
        setTax_Pph_Type_Option(options);

        const optionsPpn = transformedData
          .filter((item) => item.TAX_TYPE === "PPN")
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            id: item.ID,
            RATE: item.RATE,
          }));
        setTaxPpnTypeOption(optionsPpn);

        const IncludeOptions = transformedData
        .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
        .map((item) => ({
          value: item.NAME,
          label: item.NAME,
          RATE: item.RATE,
          id: item.ID,
        }));
      setTaxTypeIncludeOptions(IncludeOptions);

      const ExcludeOptions = transformedData
        .filter((item) => item.TAX_TYPE === "PPN" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
        .map((item) => ({
          value: item.NAME,
          label: item.NAME,
          RATE: item.RATE,
          id: item.ID,
        }));
      setTaxTypExcludeeOptions(ExcludeOptions);

      const IncludepphOptions = transformedData
        .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === true && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
        .map((item) => ({
          value: item.NAME,
          label: item.NAME,
          RATE: item.RATE,
          id: item.ID,
        }));
      setTaxTypeIncludePphOptions(IncludepphOptions);

      const ExcludepphOptions = transformedData
        .filter((item) => item.TAX_TYPE === "PPh" && item.BASE_TAX_FLAG === false && (item.TAX_TYPE_USE === "Purchase" || item.TAX_TYPE_USE === "All") && item.ACTIVE === true)
        .map((item) => ({
          value: item.NAME,
          label: item.NAME,
          RATE: item.RATE,
          id: item.ID,
        }));
      setTaxTypExcludeePphOptions(ExcludepphOptions);

        const optionsPpnRoyalty = transformedData
          .filter((item) => item.ROYALTY === true)
          .map((item) => ({
            value: item.NAME,
            label: item.NAME,
            id: item.ID,
            RATE: item.RATE,
          }));
        setTaxPpnRoyaltyOption(optionsPpnRoyalty);
      })
      .catch((error) => {
        console.error("Failed to fetch currency lookup:", error);
      });
  }, []);
  

  const handlePaymentTermChange = (selectedOption) => {
    setSelectedPaymentTerm(selectedOption);
    setPaymentTerm(selectedOption ? selectedOption.value : "");
  };

  //Handle PI
  const handlePiNumberChange = (index, selectedOption) => {
    if (selectedOption) {
      LookupService.fetchLookupData(`PURC_FORMPUINVCD&filterBy=INVOICE_NUMBER&filterValue=${selectedOption.value}&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched:", fetchedItems);

          // Fetch product lookup data with expense_account
          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
            .then((productData) => {
              console.log("Product lookup data:", productData);

              const transformedProductData = productData.data.map((item) =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {})
              );

              const productOptions = transformedProductData.map((item) => ({
                id: item.ID,
                value: item.NAME,
                label: item.NAME,
                expenseAccount: item.EXPENSE_ACCOUNT, // Include expense account field
                product_account: item.PRODUCT_ACCOUNT,
              }));

              setProductOptions(productOptions); // Set product options to state

              // Fetch currency lookup data
              LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
                .then((currencyData) => {
                  console.log("Currency lookup data:", currencyData);

                  const transformedCurrencyData = currencyData.data.map((item) =>
                    Object.keys(item).reduce((acc, key) => {
                      acc[key.toUpperCase()] = item[key];
                      return acc;
                    }, {})
                  );

                  const currencyOptions = transformedCurrencyData.map((item) => ({
                    id: item.ID,
                    value: item.CODE,
                    label: item.CODE,
                  }));

                  setCurrencyOptions(currencyOptions); // Set currency options to state

                  // Fetch description, total amount, invoice date, and invoice_number_vendor from "PURC_FORMPUINVC"
                  LookupParamService.fetchLookupData("PURC_FORMPUINVC", authToken, branchId)
                    .then((descriptionData) => {
                      console.log("Description lookup data:", descriptionData);

                      const transformedDescriptionData = descriptionData.data.map((item) =>
                        Object.keys(item).reduce((acc, key) => {
                          acc[key.toUpperCase()] = item[key];
                          return acc;
                        }, {})
                      );

                      const descriptionOptions = transformedDescriptionData.map((item) => ({
                        value: item.INVOICE_NUMBER,
                        description: item.DESCRIPTION,
                        totalAmount: item.TOTAL_AMOUNT,
                        invoice_date: item.INVOICE_DATE,
                        status_detail: item.INVOICE_STATUS,
                        // invoice_number_vendor: item.INVOICE_NUMBER_VENDOR
                      }));

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
                            }));
                          setTax_Pph_Type_Option(options);

                          const optionsPpn = transformedData
                            .filter((item) => item.TAX_TYPE === "PPN")
                            .map((item) => ({
                              id: item.ID,
                              value: item.NAME,
                              label: item.NAME,
                              RATE: item.RATE,
                            }));
                          setTaxPpnTypeOption(optionsPpn);

                          const optionsPpnRoyalty = transformedData
                            .filter((item) => item.ROYALTY === true)
                            .map((item) => ({
                              id: item.ID,
                              value: item.NAME,
                              label: item.NAME,
                              RATE: item.RATE,
                            }));
                          setTaxPpnRoyaltyOption(optionsPpnRoyalty);
                        })
                        .catch((error) => {
                          console.error("Failed to fetch currency lookup:", error);
                        });

                      const newItems = [...items];

                      const updatedFetchedItems = fetchedItems.map((item) => {
                        const selectedProductOption = productOptions.find((option) => option.value === item.product);
                        
                        return {
                          ...item,
                          purchase_invoice_number: item.invoice_number,
                          department: item.departement,
                          exchange_rate: item.tax_exchange_rate,
                          tax_invoice_number: item.invoice_number_vendor,
                          // selectedProduct: selectedProductOption,
                          // selectedCurrency: currencyOptions.find((option) => option.value === item.currency),
                          // selectedProject: projectOptions.find((option) => option.value === item.project),
                          // selectedCustomer: customerOptions.find((option) => option.value === item.customer),

                          description: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.description || "",
                          // amount: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.totalAmount || 0,
                          purchase_invoice_date: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_date || "",
                          status_detail: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.status_detail || "",
                          // invoice_number_vendor: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_number_vendor || "",
                          coa: selectedProductOption?.expenseAccount || "", // Autofill expense_account
                          product_account: selectedProductOption?.product_account || "",
                        };
                      });

                      updatedFetchedItems.forEach((fetchedItem, i) => {
                        newItems[index + i] = {
                          ...newItems[index + i],
                          ...fetchedItem,
                        };
                      });

                      setItems(newItems); // Update items state with new data
                    })
                    .catch((error) => {
                      console.error("Failed to fetch description lookup:", error);
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
        currency: "IDR",
        unit_price: 0,
        quantity: 1,
        type_of_vat: "",
        // original_unit_price: 0,
        total_price: 0,
        vat_type: "",
        tax_ppn: "",
        tax_ppn_rate: 0,
        tax_ppn_amount: 0,
        tax_pph: "",
        tax_pph_rate: 0,
        tax_pph_amount: 0,
        tax_base: 0,
        tax_invoice_number: "",
        discount: 0,
        subTotal: 0,
        vat_included: false,
        new_unit_price: 0,
        doc_reff_num: "",
        // vendor: "",
        project: "",
        customer: "",
        department: "",
        project_contract_number: "",
        description: "",
        // amount: 0,
        purchase_invoice_date: "",
        invoice_number_vendor: "",
        coa: "", // Reset expense_account on reset
        status_detail: "",
        // product_account: "",
        exchange_rate: 0,
        type_of_pph: "",
        contract_number: "",
      };
      setItems(newItems); // Update state with reset selections
    }
  };

  const handlePaidToChange = (selectedOption) => {
    setSelectedPaidTo(selectedOption);
    setPayTo(selectedOption ? selectedOption.value : "");
    setPaidToId(selectedOption ? selectedOption.id : '');

    if (selectedOption) {
      // Fetch data for the selected "paid_to"
      LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=VENDOR_ID&filterValue=${selectedOption.id}&operation=EQUAL&filterBy=INVOICE_STATUS&filterValue=IN_PROCESS&operation=EQUAL`, authToken, branchId)
        .then((response) => {
          const fetchedItems = response.data || [];
          console.log("Items fetched for Paid To:", fetchedItems);

          LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
            .then((productData) => {
              console.log("Product lookup data:", productData);

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
                expenseAccount: item.EXPENSE_ACCOUNT, // Include expense account field
                product_account: item.PRODUCT_ACCOUNT,
              }));

              setProductOptions(productOptions); // Set product options to state


              LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
            .then((projectData) => {
              console.log("Product lookup data:", projectData);

              const transformedProjectData = projectData.data.map((item) =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {})
              );

              const projectOptions = transformedProjectData.map((item) => ({
                value: item.NAME,
                label: item.NAME,
                id: item.ID,
                project_contract_number: item.CONTRACT_NUMBER,
                customer: item.CUSTOMER,
              }));

              setProjectOptions(projectOptions);


              // Fetch description, total amount, invoice date, and invoice_number_vendor from "PURC_FORMPUINVC"
              LookupParamService.fetchLookupData("PURC_FORMPUINVCD", authToken, branchId)
                .then((descriptionData) => {
                  console.log("Description lookup data:", descriptionData);

                  const transformedDescriptionData = descriptionData.data.map((item) =>
                    Object.keys(item).reduce((acc, key) => {
                      acc[key.toUpperCase()] = item[key];
                      return acc;
                    }, {})
                  );

                  const descriptionOptions = transformedDescriptionData.map((item) => ({
                    id: item.ID,
                    value: item.INVOICE_NUMBER,
                    label: item.INVOICE_NUMBER,
                    invoice_status: item.INVOICE_STATUS,
                    product: item.PRODUCT,
                    product_id: item.PRODUCT_ID,
                    currency: item.CURRENCY,
                    // quantity: item.QUANTITY,
                    unit_price: item.UNIT_PRICE,
                    total_price: item.TOTAL_PRICE,
                    // product_note: item.PRODUCT_NOTE,
                    tax_ppn: item.TAX_PPN,
                    tax_ppn_id: item.TAX_PPN_ID,
                    tax_ppn_rate: item.TAX_PPN_RATE,
                    tax_ppn_amount: item.TAX_PPN_AMOUNT,
                    tax_pph: item.TAX_PPH,
                    tax_pph_id: item.TAX_PPH_ID,
                    tax_pph_rate: item.TAX_PPH_RATE,
                    tax_pph_amount: item.TAX_PPH_AMOUNT,
                    tax_base: item.TAX_BASE,
                    type_of_vat: item.TYPE_OF_VAT,
                    type_of_pph: item.TYPE_OF_PPH,
                    tax_exchange_rate: item.TAX_EXCHANGE_RATE,
                    total_price_idr: item.TOTAL_PRICE_IDR,
                    project: item.PROJECT,
                    project_id: item.PROJECT_ID,
                    project_contract_number: item.PROJECT_CONTRACT_NUMBER,
                    customer: item.CUSTOMER,
                    customer_id: item.CUSTOMER_ID,
                    vendor: item.VENDOR,
                    departement: item.DEPARTEMENT,
                    department_id: item.DEPARTMENT_ID,
                    tax_invocie_number: item.TAX_INVOICE_NUMBER,
                    cod_cor_skb: item.COD_COR_SKB,
                    doc_source: item.DOC_SOURCE,
                    doc_reff_no: item.DOC_REFF_NO,
                    invoice_number_vendor: item.INVOICE_NUMBER_VENDOR,
                    // description: item.DESCRIPTION,
                    // totalAmount: item.TOTAL_AMOUNT,
                    // invoice_date: item.INVOICE_DATE,
                    // status_detail: item.INVOICE_STATUS,
                    // invoice_number_vendor: item.INVOICE_NUMBER_VENDOR
                  }));

                  const newItems = [...items];

                  // Map the fetched data to items
                  const updatedItems = fetchedItems.map((item) => {
                    const productFromDescription = descriptionOptions.find((option) => option.value === item.invoice_number)?.product_id;
                    const relatedProduct = productOptions.find((option) => option.id === productFromDescription);

                    const projectFromDescription = descriptionOptions.find((option) => option.value === item.invoice_number)?.project_id;
                    const relatedProject = projectOptions.find((option) => option.id === projectFromDescription);

                    const description = descriptionOptions.find((desc) => desc.value === item.invoice_number) || {};
                    const taxRate = description.tax_ppn_rate / 100;
                    const pphRate = description.tax_pph_rate / 100;
  
                    let taxBase = description.total_price || 0;
                    let taxPpnAmount = 0;
                    let taxPphAmount = 0;
                    let amountPaid = 0;
  
                    // Calculate tax amounts and amount_paid
                    if (description.type_of_vat === "include") {
                      taxBase = Math.round(taxBase / (1 + taxRate));
                      taxPpnAmount = Math.floor(taxBase * taxRate);
                      if (description.type_of_pph === "gross") {
                        taxPphAmount = Math.floor(taxBase * pphRate);
                        amountPaid = Math.round(taxBase - taxPphAmount + taxPpnAmount);
                      } else if (description.type_of_pph === "nett") {
                        const adjustedTaxBase = taxBase / (1 - pphRate);
                        taxPphAmount = Math.floor(adjustedTaxBase * pphRate);
                        amountPaid = Math.round(adjustedTaxBase - taxPphAmount + taxPpnAmount);
                      }
                    } else if (description.type_of_vat === "exclude") {
                      taxPpnAmount = Math.floor(taxBase * taxRate);
                      if (description.type_of_pph === "gross") {
                        taxPphAmount = Math.floor(taxBase * pphRate);
                        amountPaid = Math.round(taxBase - taxPphAmount + taxPpnAmount);
                      } else if (description.type_of_pph === "nett") {
                        const adjustedTaxBase = taxBase / (1 - pphRate);
                        taxPphAmount = Math.floor(adjustedTaxBase * pphRate);
                        amountPaid = Math.round(adjustedTaxBase - taxPphAmount + taxPpnAmount);
                      }
                    } else if (description.type_of_vat === "non_ppn") {
                      taxPpnAmount = 0;
                      if (description.type_of_pph === "gross") {
                        taxPphAmount = Math.floor(taxBase * pphRate);
                        amountPaid = Math.round(taxBase - taxPphAmount);
                      } else if (description.type_of_pph === "nett") {
                        amountPaid = Math.round(taxBase / (1 - pphRate));
                      }
                    }
  
                    return {
                      ...item,
                      db_cr: item.db_cr || "Db",
                      purchase_invoice_number: item.invoice_number,
                      purchase_invoice_date: item.invoice_date,
                      // exchange_rate: item.tax_exchange_rate,
                      // department: item.departement,
                      // purchase_invoice_date: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_date || "",
                      // description: descriptionOptions.find((desc) => desc.value === item.invoice_number) ?.description || "",
                      // product: descriptionOptions.find((option) => option.value === item.invoice_number)?.product || "",
                      // product:  productFromDescription || 0,
                      product_id: productFromDescription || 0,
                      // product_id: relatedProduct?.product_id || 0,
                      coa_id: relatedProduct?.id || 0,
                      tax_invoice_number: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_invocie_number || "",
                      project_id: projectFromDescription || 0,
                      project_contract_number: relatedProject?.project_contract_number || "",
                      customer: relatedProject?.customer || "",
                      // customer: descriptionOptions.find((option) => option.value === item.invoice_number)?.customer || "",
                      // customer_id: descriptionOptions.find((option) => option.value === item.invoice_number)?.customer_id || 0,
                      department: descriptionOptions.find((option) => option.value === item.invoice_number)?.departement || "",
                      department_id: descriptionOptions.find((option) => option.value === item.invoice_number)?.department_id || 0,
                      exchange_rate: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_exchange_rate || 1,
                      quantity: descriptionOptions.find((option) => option.value === item.invoice_number)?.quantity || 1,
                      unit_price: descriptionOptions.find((option) => option.value === item.invoice_number)?.unit_price || 0,
                      total_price: descriptionOptions.find((option) => option.value === item.invoice_number)?.total_price || 0,
                      type_of_vat: descriptionOptions.find((option) => option.value === item.invoice_number)?.type_of_vat || "",
                      tax_ppn: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_ppn || "",
                      tax_ppn_id: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_ppn_id || 0,
                      // tax_ppn_amount: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_ppn_amount || 0,
                      type_of_pph: descriptionOptions.find((option) => option.value === item.invoice_number)?.type_of_pph || "",
                      tax_pph: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_pph || "",
                      tax_pph_id: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_pph_id || 0,
                      // tax_pph_amount: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_pph_amount || 0,
                      // tax_base: descriptionOptions.find((option) => option.value === item.invoice_number)?.tax_base || 0,
                      // amount: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.totalAmount || 0,
                      // status_detail: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.status_detail || "",
                      // invoice_number_vendor: descriptionOptions.find((desc) => desc.value === item.invoice_number)?.invoice_number_vendor || "",
                      coa: relatedProduct?.expenseAccount || "", // Autofill expense_account
                      product_account: relatedProduct?.product_account || "",
                      tax_base: taxBase,
                      tax_ppn_amount: taxPpnAmount,
                      tax_pph_amount: taxPphAmount,
                      amount_paid: amountPaid,
                      // amount_paid: amountPaid,
                    };
                  });

                  updatedItems.forEach((fetchedItem, i) => {
                    newItems[i] = {
                      ...newItems[i],
                      ...fetchedItem,
                    };
                  });

                  console.log("new", newItems);
                  setItems(newItems); // Update state with the autofilled items

                  // updatedFetchedItems.forEach((fetchedItem, i) => {
                  //     newItems[index + i] = {
                  //         ...newItems[index + i],
                  //         ...fetchedItem,
                  //     };
                  // });

                  // setItems(newItems); // Update items state with new data
                })
                .catch((error) => {
                  console.error("Failed to fetch data for Paid To:", error);
                });

                 })
            .catch((error) => {
              console.error("Failed to fetch data for Paid To:", error);
            });
  
            })
            .catch((error) => {
              console.error("Failed to fetch data for Paid To:", error);
            });
        })
        .catch((error) => {
          console.error("Failed to fetch data for Paid To:", error);
        });
    } else {
      // Reset fields when no option is selected
      const newItems = items.map((item) => ({
        ...item,
        product: "",
        // currency: "IDR",
        unit_price: 0,
        quantity: 1,
        type_of_vat: "",
        // original_unit_price: 0,
        total_price: 0,
        vat_type: "",
        tax_ppn: "",
        tax_ppn_rate: 0,
        tax_ppn_amount: 0,
        tax_pph: "",
        tax_pph_rate: 0,
        tax_pph_amount: 0,
        tax_base: 0,
        tax_invoice_number: "",
        purchase_invoice_number: "",
        discount: 0,
        subTotal: 0,
        vat_included: false,
        new_unit_price: 0,
        doc_reff_num: "",
        // vendor: "",
        project: "",
        customer: "",
        department: "",
        contract_number: "",
        description: "",
        // amount: 0,
        purchase_invoice_date: "",
        invoice_number_vendor: "",
        coa: "", // Reset expense_account on reset
        // status_detail: "",
        // product_account: "",
        exchange_rate: 1,
        amount_paid: 0,
        project_contract_number: "",
        type_of_pph: "",
        product_id: 0,
        coa_id: 0,
        employee_id: 0,
        department_id: 0,
        project_id: 0,
        tax_ppn_id: 0,
        tax_pph_id: 0,
      }));
      console.log("items new", newItems);
      setItems(newItems);
    }
  };

  console.log('itemsss', items)

  const handleProductChange = (index, selectedProduct) => {
    const newItems = [...items];
    if (selectedProduct) {
      const selectedProductOption = productOptions.find((option) => option.id === selectedProduct.id);
      
      newItems[index] = {
        ...newItems[index],
        product: selectedProduct.id,
        product_id: selectedProductOption?.product_id || 0,
        coa_id: selectedProductOption?.id || 0,
        coa: selectedProductOption?.expenseAccount || "",
        product_account: selectedProductOption?.product_account || "",
      };
    } else {s
      newItems[index] = {
        ...newItems[index],
        product: "", 
        product_id: 0,
        coa_id: 0,
        coa: "",
        product_account: "",
      };
    }

    setItems(newItems); // Update items state with new data
  };

  const handleProjectChange = (index, selectedProject) => {
    const newItems = [...items];
    if (selectedProject) {
      const selectedProjectOption = projectOptions.find((option) => option.id === selectedProject.id);

      newItems[index] = {
        ...newItems[index],
        project: selectedProject.id,
        project_id: selectedProjectOption?.project_id || 0,
        project_contract_number: selectedProjectOption?.project_contract_number || "",
        customer: selectedProjectOption?.customer || "",
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        project: "",
        project_id: 0,
        project_contract_number: "",
        customer: "",
      };
    }

    setItems(newItems); // Update items state with new data
  };

  // bank Name
  const handleBankSelection = (selectedOption) => {
    
    if (selectedOption) {
      const selectedAccount = accountOptions.find((option) => option.value === selectedOption.bank_account);
      setSelectedAccountBank(selectedAccount ? selectedAccount : null);
      setSelectedBankName(selectedOption);
      setAccountBank(selectedOption.bank_account || "");
      setBankName(selectedOption ? selectedOption.value : "");
      setBankId(selectedOption ? selectedOption.id : '');
    } else {
      setSelectedAccountBank(null);
      setSelectedBankName(null);
      setAccountBank(""); // Clear bank account
      setBankName(""); // Clear bank name
      setBankId('');
    }
  };

    console.log('bankId', bank_id)
 
  //payment Source
  // const handlePaymentSourceChange = (selectedOption) => {
  //   setPaymentSource(selectedOption);

  //   if (selectedOption === "Cash") {
  //     const kasBesarOption = bankOptions.find(option => option.value === "Kas Besar");
  //     if (kasBesarOption) {
  //       setSelectedBankName(kasBesarOption); // Reset bank name when payment source changes
  //       setSelectedAccountBank(kasBesarOption); // Reset account bank
  //       setAccountBank("");
  //       setBankName("");
  //     }
  //   } else if (selectedOption === "" || "Bank") {
  //     setSelectedBankName(null); // Reset bank name when payment source changes
  //     setSelectedAccountBank(null); // Reset account bank
  //     setAccountBank("");
  //     setBankName("");
  //   }

  // };

  const handlePaymentSourceChange = (selectedOption) => {
    setPaymentSource(selectedOption);

    if (selectedOption === "" || "Bank" || "Cash") {
      setSelectedBankName(null); // Reset bank name when payment source changes
      setSelectedAccountBank(null); // Reset account bank
      setAccountBank("");
      setBankName("");
    }
  };

  const handleBankChange = (selectedOption) => {
    setSelectedBankName(selectedOption);
    setBankName(selectedOption ? selectedOption.value : "");
    console.log("bank name", bank_name);
  };

  // const handleAccountChange = (selectedOption) => {
  //   setSelectedAccountBank(selectedOption);
  //   setAccountBank(selectedOption ? selectedOption.value : "");
  // };

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
    setCurrency(selectedOption ? selectedOption.value : "");
    setCurrencyId(selectedOption ? selectedOption.id : "");
  };

  console.log("currencyId", currency_id);

  useEffect(() => {
    if (selectedData && selectedData.length > 0) {
        const currencyFromData = selectedData[0]?.CURRENCY;
        const matchingCurrencyOption = currencyOptions.find(
            (option) => option.value === currencyFromData
        );

        if (matchingCurrencyOption) {
            setSelectedCurrency(matchingCurrencyOption);
            setCurrencyId(matchingCurrencyOption.id); // Set currency_id
        } else {
            // Set default to IDR if no valid currency is found
            const defaultCurrencyOption = currencyOptions.find(
                (option) => option.value === "IDR"
            );
            if (defaultCurrencyOption) {
                setSelectedCurrency(defaultCurrencyOption);
                setCurrencyId(defaultCurrencyOption.id); // Set default currency_id
            }
        }
    } else {
        // Ensure default to IDR when there's no data
        const defaultCurrencyOption = currencyOptions.find(
            (option) => option.value === "IDR"
        );
        if (defaultCurrencyOption) {
            setSelectedCurrency(defaultCurrencyOption);
            setCurrencyId(defaultCurrencyOption.id); // Set default currency_id
        }
    }
}, [selectedData, currencyOptions]);

  
  // const handleCurrencyChange = (selectedOption) => {
  //   // Update the selected currency state
  //   setSelectedCurrency(selectedOption);
  //   setCurrency(selectedOption ? selectedOption.value : "");

  //   // Adjust exchange rates or related logic
  //   const currencyValue = selectedOption ? selectedOption.value : "IDR";

  //   // Example: Updating default exchange rate if not IDR
  //   if (currencyValue !== "IDR") {
  //     setExchangeRate(1.5); // Placeholder exchange rate
  //   } else {
  //     setExchangeRate(1);
  //   }

  //   // Update all items if needed to reflect the selected currency
  //   const updatedItems = items.map((item) => ({
  //     ...item,
  //     currency: currencyValue,
  //     exchange_rate: currencyValue === "IDR" ? 1 : item.exchange_rate || 1,
  //     total_price_idr:
  //       currencyValue === "IDR"
  //         ? item.total_price
  //         : item.total_price * (item.exchange_rate || 1),
  //   }));

  //   setItems(updatedItems); // Save the updated items array
  // };

  // const handleCurrencyBankChange = (selectedOption) => {
  //   setSelectedCurrencyBank(selectedOption);
  //   setCurrency(selectedOption ? selectedOption.value : "");
  // };

  const handleEmployeeChange = (selectedOption) => {
    setSelectedEmployee(selectedOption);
    setEmployee(selectedOption ? selectedOption.value : "");
  };

  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setPayTo(selectedOption ? selectedOption.value : "");
  };

  // const handlePaidToChange = (selectedOption) => {
  //   setSelectedPaidTo(selectedOption);
  //   setPayTo(selectedOption ? selectedOption.value : "");
  // };

  const handleBothVendorChange = (selectedOption) => {
    setSelectedBothVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : "");
  };

  const handleExchangeRateBankChange = (value) => {
    const parsedValue = parseFloat(value) || 0; // Ensure numeric value, default to 0 if invalid
    setExchangeRateBank(value); // Update exchange_rate_bank
    setExchangeRate(parsedValue); // Update exchange_rate
  };

  useEffect(() => {
    if (selectedData) {
      const { EXCHANGE_RATE_BANK } = selectedData[0];
      
      // Preload the exchange rate bank field with the value being edited
      if (EXCHANGE_RATE_BANK !== undefined) {
        setExchangeRateBank(EXCHANGE_RATE_BANK);
        setExchangeRate(parseFloat(EXCHANGE_RATE_BANK)); // Set the parsed value for calculations
      }
  
      // Existing logic to initialize other fields
      // ...
    }
  }, [selectedData]);
  

  // const handleProjectChange = (selectedOption) => {
  //   setSelectedProject(selectedOption);
  //   setProject(selectedOption ? selectedOption.value : "");
  // };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        ID: "",
        voucher_number: "",
        purchase_invoice_number: "",
        purchase_invoice_date: "",
        // status_detail: "",
        quantity: 1,
        unit_price: 0,
        coa_id: 0,
        product_id: 0,
        description: "",
        // amount: 0,
        db_cr: "Db",
        // vendor: "",
        currency: "IDR",
        exchange_rate: 1,
        // employee: "",
        department_id: 0,
        project_id: 0,
        tax_invoice_number: "",
        project_contract_number: "",
        tax_base: 0,
        vat: "Select an Option",
        customer: "",
        tax_ppn_id: 0,
        // tax_ppn_type: "",
        tax_ppn_rate: "",
        tax_ppn_amount: 0,
        tax_pph_id: 0,
        type_of_pph: "",
        tax_pph_rate: "",
        tax_pph_amount: 0,
        amount_paid: 0,
        total_tax_base: 0,
        // total_amount_ppn: 0,
        // total_amount_pph: 0,
        total_price: 0,
        total_price_idr: 0,
        paid_to_id: paid_to_id,
        bank_id: bank_id,
        currency_id: currency_id,
      },
    ]);
  };

  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    ////// currency
    // Update dependent fields for the currency
    //    if (field === "currency") {
    //     const isIDR = value === "IDR";
    //     newItems[index].exchange_rate = isIDR ? 1 : (newItems[index].exchange_rate || 1); // Default to 1 for IDR
    //     newItems[index].total_price_idr = isIDR
    //         ? newItems[index].total_price
    //         : newItems[index].total_price * (newItems[index].exchange_rate || 1);
    // }

    // // Existing logic for quantity and unit_price
    // if (field === "quantity" || field === "unit_price") {
    //     newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;

    //     // Update IDR amount if currency is not IDR
    //     if (newItems[index].currency !== "IDR") {
    //         newItems[index].total_price_idr = newItems[index].total_price * (newItems[index].exchange_rate || 1);
    //     } else {
    //         newItems[index].total_price_idr = newItems[index].total_price;
    //     }
    // }

    ////////////////

    // Reset fields when 'unit_price' or 'quantity' changes
    if (field === "unit_price" || field === "quantity") {
      newItems[index].type_of_vat = "";
      newItems[index].tax_ppn = "";
      newItems[index].tax_base = 0;
      newItems[index].amount_paid = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph = "";
      newItems[index].type_of_pph = "";
      newItems[index].tax_pph_rate = 0;
      if (newItems[index].vat_included){
        coa_id: 0,

    newItems[index].vat_included = false;
      }
    }

    if (field === "type_of_vat") {
      newItems[index].tax_ppn = "";
      newItems[index].tax_base = 0;
      newItems[index].amount_paid = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].tax_pph_amount = 0;
      newItems[index].tax_pph = "";
      newItems[index].type_of_pph = "";
      newItems[index].tax_pph_rate = 0;
    }

    if (field === "type_of_pph") {
      newItems[index].tax_pph = ""; // Reset tax_pph
      newItems[index].tax_pph_rate = 0; // Reset tax_pph_rate
      newItems[index].tax_pph_amount = 0;
    }

    // Update total price and total price IDR
    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;

      // Calculate total_price_idr based on exchange rate if currency is not IDR
      if (newItems[index].currency === "IDR") {
        newItems[index].total_price_idr = newItems[index].total_price;
      } else {
        newItems[index].total_price_idr = newItems[index].total_price * (newItems[index].tax_exchange_rate || 1);
      }
    }

    // Calculate VAT, PPN, and new unit price
    if (field === "tax_ppn" || field === "tax_ppn_rate") {
      const taxRate = newItems[index].tax_ppn_rate / 100;
      if (newItems[index].type_of_vat === "include") {
        newItems[index].new_unit_price = newItems[index].unit_price + newItems[index].unit_price * taxRate;
        newItems[index].tax_base = Math.round(newItems[index].total_price / (1 + taxRate));
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].tax_base * taxRate);
        newItems[index].vat_included = true;
      } else if (["exclude"].includes(newItems[index].type_of_vat)) {
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].total_price * taxRate);
        newItems[index].tax_base = newItems[index].total_price;
      } else if (newItems[index].type_of_vat === "ppn_royalty" && currency !== "IDR") {
        newItems[index].tax_ppn_amount = Math.floor(newItems[index].total_price * taxRate);
        newItems[index].tax_base = newItems[index].total_price;
        newItems[index].amount_paid = Math.round(newItems[index].tax_base + newItems[index].tax_ppn_amount);
      }
    }

    // Handle non-PPN case
    if (newItems[index].type_of_vat === "non_ppn") {
      newItems[index].tax_ppn = "";
      newItems[index].tax_ppn_rate = 0;
      newItems[index].tax_ppn_amount = 0;
      newItems[index].new_unit_price = newItems[index].unit_price;
      newItems[index].tax_base = newItems[index].total_price;
      newItems[index].tax_pph_amount = Math.floor(newItems[index].tax_base * (newItems[index].tax_pph_rate / 100));
    }

    // Calculate PPh
    if (field === "type_of_pph" || field === "tax_pph_rate") {
      if (newItems[index].type_of_pph === "gross") {
        const base = newItems[index].type_of_vat === "exclude" ? newItems[index].total_price : newItems[index].tax_base;
        newItems[index].tax_pph_amount = Math.floor(base * (newItems[index].tax_pph_rate / 100));
        if (newItems[index].type_of_vat === "non_ppn") {
          newItems[index].amount_paid = Math.round(newItems[index].tax_base - newItems[index].tax_pph_amount);
        }
      } else if (newItems[index].type_of_pph === "nett") {
        const adjustedTaxBase = newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100);
        newItems[index].tax_pph_amount = Math.floor(adjustedTaxBase * (newItems[index].tax_pph_rate / 100));
        newItems[index].tax_ppn_amount = Math.floor(adjustedTaxBase * (newItems[index].tax_ppn_rate / 100));
        if (newItems[index].type_of_vat === "non_ppn") {
          newItems[index].amount_paid = Math.round(newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100) - newItems[index].tax_pph_amount * 2);
        }
      }
    }
    //calculate amount paid
    if (field === "tax_ppn" || field === "tax_ppn_rate" || field === "type_of_pph" || field === "tax_pph_rate") {
      if ((newItems[index].type_of_vat === "include" || newItems[index].type_of_vat === "exclude") && (newItems[index].type_of_pph === "gross" || newItems[index].type_of_pph === "")) {
        newItems[index].amount_paid = Math.round(newItems[index].tax_base - newItems[index].tax_pph_amount + newItems[index].tax_ppn_amount);
      } else if (newItems[index].type_of_vat === "include" && (newItems[index].type_of_pph === "nett" || newItems[index].type_of_pph === "")) {
        newItems[index].amount_paid = Math.round(newItems[index].tax_base / (1 - newItems[index].tax_pph_rate / 100) - newItems[index].tax_pph_amount + newItems[index].tax_ppn_amount);
      } else if (newItems[index].type_of_vat === "exclude" && (newItems[index].type_of_pph === "nett" || newItems[index].type_of_pph === "")) {
        newItems[index].amount_paid = Math.round(newItems[index].unit_price / (1 - newItems[index].tax_pph_rate / 100) - newItems[index].tax_pph_amount + newItems[index].tax_ppn_amount);
      }
    }

    console.log("dbcr", newItems[index].db_cr);
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

  console.log('item', items)

  // const calculateTotalAmount = () => {
  //   return items.reduce((total, item) => total + item.total_price, 0);
  // };

  const calculateTotalAmount = () => {
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

    const subtotalAfterDiscount = subTotal - discount;

    const totalPPNAmount = items.reduce((total, item) => {
      const taxPPNAmount = isNaN(item.tax_ppn_amount) ? 0 : item.tax_ppn_amount;
      return total + taxPPNAmount;
    }, 0);

    const totalPPHAmount = items.reduce((total, item) => {
      const taxPPHAmount = isNaN(item.tax_pph_amount) ? 0 : item.tax_pph_amount;
      return total + taxPPHAmount;
    }, 0);

    // Initialize total_amount
    let total_amount = subtotalAfterDiscount;

    // Determine if any items qualify for royalty
    const hasRoyalty = items.some((item) => item.type_of_vat === "ppn_royalty");

    // Determine if any items are non_ppn
    const hasNonPPN = items.some((item) => item.type_of_vat === "non_ppn");

    // Calculate total_amount based on type_of_vat and type_of_pph
    if (hasRoyalty) {
      // If there are royalties, total amount is subtotalAfterDiscount + totalPPNAmount
      total_amount = subtotalAfterDiscount + totalPPNAmount;
    } else if (hasNonPPN) {
      // If there are non_ppn items, total amount is subtotalAfterDiscount - totalPPHAmount
      total_amount = subtotalAfterDiscount - totalPPHAmount;
    } else {
      // Calculate total amount based on the cases
      const case1 = items.some((item) => item.type_of_vat === "include" && item.type_of_pph === "gross" || item.type_of_pph === "");
      const case2 = items.some((item) => item.type_of_vat === "include" && item.type_of_pph === "nett" );
      const case3 = items.some((item) => item.type_of_vat === "exclude" && item.type_of_pph === "gross" || item.type_of_pph === "");
      const case4 = items.some((item) => item.type_of_vat === "exclude" && item.type_of_pph === "nett" );

      if (case1 || case3) {
        total_amount += totalPPNAmount - totalPPHAmount;
      }

      if (case2) {
        const taxBasePPNAF = Math.round(taxbasePPH);
        total_amount = taxBasePPNAF - totalPPHAmount + totalPPNAmount;
      }

      if (case4) {
        const taxBase = taxbasePPH;
        total_amount = taxBase - totalPPHAmount  + totalPPNAmount;
      }
    }

    // Ensure valid total amount
    const validTotalAmount = isNaN(total_amount) ? 0 : total_amount;

    const total_paid = isNaN(total_amount) ? 0 : total_amount;

    const amount_idr = validTotalAmount * (exchange_rate_bank || 1);

    // console.log("kols", subTotal);
    return {
      subTotal,
      subtotalAfterDiscount,
      taxbasePPH,
      totalPPNAmount,
      totalPPHAmount,
      totalAmount: validTotalAmount && total_paid,
      amount_idr,
    };
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [exchange_rate_bank, items, discount]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = [...items];
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const resetForm = () => {
    generateVoucherNumber("DRAFT_VOUC");
    setInvoiceNumber("");
    setTitle("");
    setInternalMemo("");
    setID(null);
    setInvoiceNumber("");
    setInvoiceType("");
    setInvoiceDate("");
    setEmployee("");
    setVendor("");
    setPayTo("");
    setPaymentTerm("");
    setDueDate("");
    setTaxRate("");
    setCoa("");
    setExchangeRateBank("");
    setNumberCheckGiro("");
    setExchangeRate("");
    setPaymentSource("");
    setProductAccount("");
    setTaxInvoiceNumber("");
    setInvoiceStatus("");
    setBiMiddleRate("");
    setTypeOfPayment("");
    setTermOfPayment("");
    setProject("");
    setDescription("");
    setAccountBank("");
    setAmountPaid("");
    setItems([]);
    setSelectedItems([]);
    setSelectedPiNumber(null);
    setSelectedVendor(null);
    setSelectedPaidTo(null);
    // setSelected(null);
    // setSelectedPrNumber(null);
    setSelectedBankName(null);
    setSelectedEmployee(null);
    setSelectedAccountBank(null);
    // setSelectedPoNumber(null);
    setSelectedProduct(null);
    setSelectedProject(null);
    setSelectedCurrency(null);
    setIsSubmited(false);
    setSelectedCurrencyBank(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if (!tax_exchange_rate) {
    //   messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
    //   return;
    // }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the Expanse Voucher?",
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
        // const pr_number = await generatePrNumber("PR");
        // console.log("pr_number", pr_number);

        // let endToEndId;
        // if (!endToEnd) {
        //   endToEndId = await generatePrNumber("PURC");
        // } else {
        //   endToEndId = endToEnd;
        //   console.log("endtoendId is not empty");
        // }

        const voucher_number = await generateVoucherNumber("VOUCHER");

        const checkDataResponse = await LookupService.fetchLookupData(`VOUC_FORMVCBANK&filterBy=voucher_number&filterValue=${voucher_number}&operation=EQUAL`, authToken, branchId);
        const existingData = checkDataResponse.data;

        // const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount, total_amount_idr, total_before_discount_idr } = calculateTotalAmount();
        const total_amount = calculateTotalAmount();
        // Save general information
        const generalInfo = {
          // internalmemo,
          voucher_number,
          voucher_date, // Converts to date format
          // bank_name,
          account_bank,
          exchange_rate,
          // currency,
          status: "IN_PROCESS",
          // total_amount,
          // doc_reff,
          // paid_to,
          payment_source,
          number_check_giro,
          // giro_no,
          // currency,
          amount_idr: calculateTotalAmount().amount_idr,
          total_paid: calculateTotalAmount().totalAmount,
          paid_to_id: parseInt(paid_to_id, 10),
          currency_id:  parseInt(currency_id, 10),
          bank_id:  parseInt(bank_id, 10),
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        let response;

        // Check if updating existing data or inserting new data
        if (selectedData) {
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `VCBANK&column=id&value=${id}`, authToken, branchId);
        } else if (existingData && existingData.length > 0) {
          const id = existingData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `VCBANK&column=id&value=${id}`, authToken, branchId);
        } else {
          response = await InsertDataService.postData(generalInfo, "VCBANK", authToken, branchId);
        }

        console.log("Data posted successfully:", response);

        // // Update Status for PR or PO
        // if (idPr) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}, { status_request: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // } else if (idPo) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}, { status_po: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // }

        // Handle item deletion and insertion
        if (response.message === "Update Data Successfully") {
          if (existingData && existingData.length > 0) {
            const PettyNum = existingData[0].voucher_number;
            const lookupResponse = await LookupService.fetchLookupData(`VOUC_FORMVCBANKD&filterBy=voucher_number&filterValue=${PettyNum}&operation=EQUAL`, authToken, branchId);

            const ids = lookupResponse.data.map((item) => item.ID); // Dapatkan semua ID dari respons array
            console.log("IDs to delete:", ids);

            // Delete each item based on fetched IDs
            for (const id of ids) {
              try {
                await DeleteDataService.postData(`column=id&value=${id}`, "VCBANKD", authToken, branchId);
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
                  const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "VCBANKD", authToken, branchId);
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
              voucher_number,
              // purchase_invoice_number: item.invoice_number,

              // tax_invoice_number: item.invoice_number_vendor,
              // type_of_vat: item.vat,
              // tax_ppn: item.tax_ppn_type,
              // tax_pph: item.tax_pph_type,
              // tax_pph: item.tax_pph_type_2,

              // tax_pph_amount_2: item.total_amount_pph_2,
            };
            delete updatedItem.ID;
            delete updatedItem.vendor;
            delete updatedItem.coa;
            delete updatedItem.employee;
            delete updatedItem.department;
            delete updatedItem.project;
            delete updatedItem.product;
            delete updatedItem.tax_ppn;
            delete updatedItem.tax_pph;
            delete updatedItem.vat_included;
            delete updatedItem.invoice_number;
            delete updatedItem.invoice_date;
            delete updatedItem.vat;
            delete updatedItem.vat_type;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.tax_pph_type_2;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_pph_2;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.doc_reference;
            delete updatedItem.doc_reff;
            // delete updatedItem.total_price;
            delete updatedItem.kurs_deal;
            // delete updatedItem.unit_price;
            delete updatedItem.rwnum;
            // delete updatedItem.quantity;
            delete updatedItem.product_note;
            // delete updatedItem.tax_ppn_rate;
            // delete updatedItem.tax_pph_rate;
            // delete updatedItem.type_of_vat;
            // delete updatedItem.type_of_pph;
            delete updatedItem.tax_exchange_rate;
            delete updatedItem.total_price_idr;
            delete updatedItem.departement;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.doc_reff_no;
            delete updatedItem.doc_source;
            delete updatedItem.invoice_number_vendor;
            delete updatedItem.id_upload;
            delete updatedItem.totalAmount;
            delete updatedItem.expense_account;
            delete updatedItem.discount;
            delete updatedItem.doc_reff_num;
            delete updatedItem.contract_number;
            delete updatedItem.discount;
            delete updatedItem.subTotal;
            delete updatedItem.new_unit_price;
            delete updatedItem.tax_invoice_number_vendor;
            delete updatedItem.tax_base_idr;
            delete updatedItem.invoice_id;
            delete updatedItem.tax_ppn_amount_idr;
            delete updatedItem.tax_pph_amount_idr;
            delete updatedItem.subtotal;
            delete updatedItem.currency;
            delete updatedItem.payment_term;
            delete updatedItem.due_date;
            delete updatedItem.invoice_status;
            delete updatedItem.total_amount;
            delete updatedItem.term_of_payment;
            delete updatedItem.total_after_discount;
            delete updatedItem.endtoendid;
            delete updatedItem.total_before_discount;
            delete updatedItem.created_by;
            delete updatedItem.approved_by;
            delete updatedItem.journal_number;
            delete updatedItem.journal_type;
            delete updatedItem.bi_middle_rate;
            delete updatedItem.total_amount_ppn_idr;
            delete updatedItem.total_amount_pph_idr;
            delete updatedItem.total_after_discount_idr;
            delete updatedItem.total_before_discount_idr;
            delete updatedItem.total_amount_idr;
            delete updatedItem.payment_term_id;
            delete updatedItem.create_by_id;
            delete updatedItem.approve_by_id;
            delete updatedItem.currency_id;
            delete updatedItem.journal_id;
            delete updatedItem.vendor_id;
            delete updatedItem.customer_id;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "VCBANKD", authToken, branchId);
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
              voucher_number,
              // purchase_invoice_number: item.invoice_number,

              // tax_invoice_number: item.invoice_number_vendor,
              // type_of_vat: item.vat,
              // tax_ppn: item.tax_ppn_type,
              // tax_pph: item.tax_pph_type,
              // tax_pph: item.tax_pph_type_2,

              // tax_pph_amount_2: item.total_amount_pph_2,
            };
            delete updatedItem.ID;
            delete updatedItem.vendor;
            delete updatedItem.coa;
            delete updatedItem.employee;
            delete updatedItem.department;
            delete updatedItem.project;
            delete updatedItem.product;
            delete updatedItem.tax_ppn;
            delete updatedItem.tax_pph;
            delete updatedItem.vat_included;
            delete updatedItem.invoice_number;
            delete updatedItem.invoice_date;
            delete updatedItem.vat;
            delete updatedItem.vat_type;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.tax_pph_type_2;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_pph_2;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.doc_reference;
            delete updatedItem.doc_reff;
            // delete updatedItem.total_price;
            delete updatedItem.kurs_deal;
            // delete updatedItem.unit_price;
            delete updatedItem.rwnum;
            // delete updatedItem.quantity;
            delete updatedItem.product_note;
            // delete updatedItem.tax_ppn_rate;
            // delete updatedItem.tax_pph_rate;
            // delete updatedItem.type_of_vat;
            // delete updatedItem.type_of_pph;
            delete updatedItem.tax_exchange_rate;
            delete updatedItem.total_price_idr;
            delete updatedItem.departement;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.doc_reff_no;
            delete updatedItem.doc_source;
            delete updatedItem.invoice_number_vendor;
            delete updatedItem.id_upload;
            delete updatedItem.totalAmount;
            delete updatedItem.expense_account;
            delete updatedItem.discount;
            delete updatedItem.doc_reff_num;
            delete updatedItem.contract_number;
            delete updatedItem.discount;
            delete updatedItem.subTotal;
            delete updatedItem.new_unit_price;
            delete updatedItem.tax_invoice_number_vendor;
            delete updatedItem.tax_base_idr;
            delete updatedItem.invoice_id;
            delete updatedItem.tax_ppn_amount_idr;
            delete updatedItem.tax_pph_amount_idr;
            delete updatedItem.subtotal;
            delete updatedItem.currency;
            delete updatedItem.payment_term;
            delete updatedItem.due_date;
            delete updatedItem.invoice_status;
            delete updatedItem.total_amount;
            delete updatedItem.term_of_payment;
            delete updatedItem.total_after_discount;
            delete updatedItem.endtoendid;
            delete updatedItem.total_before_discount;
            delete updatedItem.created_by;
            delete updatedItem.approved_by;
            delete updatedItem.journal_number;
            delete updatedItem.journal_type;
            delete updatedItem.bi_middle_rate;
            delete updatedItem.total_amount_ppn_idr;
            delete updatedItem.total_amount_pph_idr;
            delete updatedItem.total_after_discount_idr;
            delete updatedItem.total_before_discount_idr;
            delete updatedItem.total_amount_idr;
            delete updatedItem.payment_term_id;
            delete updatedItem.create_by_id;
            delete updatedItem.approve_by_id;
            delete updatedItem.currency_id;
            delete updatedItem.journal_id;
            delete updatedItem.vendor_id;
            delete updatedItem.customer_id;

            const itemResponse = await InsertDataService.postData(updatedItem, "VCBANKD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          //Set status workflow VERIFIED
          //   LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
          //     .then((response) => {
          //       const data = response.data[0];
          //       console.log("Data:", data);

          //       const requestData = {
          //         idTrx: data.ID,
          //         status: "DRAFT", // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
          //       };
          //       UpdateStatusService.postData(requestData, "PUINVC", authToken, branchId)
          //         .then((response) => {
          //           console.log("Data updated successfully:", response);
          //         })
          //         .catch((error) => {
          //           console.error("Failed to update data:", error);
          //         });
          //     })
          //     .catch((error) => {
          //       console.error("Failed to load purchase request data:", error);
          //     });
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

  // const handleSave = async (event) => {
  //   event.preventDefault();

  //   // Show SweetAlert2 confirmation
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to save the Purchase Invoice?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Save It!",
  //     cancelButtonText: "No, Cancel!",
  //     reverseButtons: true,
  //   });

  //   if (result.isConfirmed) {
  //     setIsLoading(true);
  //     try {
  //       const voucher_number = await generateVoucherNumber("DRAFT_VOUC");
  //       const total_amount = calculateTotalAmount();
  //       // Save general information and description
  //       const createBy = sessionStorage.getItem("userId");
  //       const generalInfo = {
  //         // internalmemo,
  //         voucher_number,
  //         voucher_date, // Converts to date format
  //         bank_name,
  //         account_bank,
  //         exchange_rate,
  //         // currency,
  //         status: "DRAFT",
  //         // total_amount,
  //         // doc_reff,
  //         paid_to,
  //         payment_source,
  //         number_check_giro,
  //         // giro_no,
  //         currency,
  //         amount_idr: calculateTotalAmount().amount_idr,
  //         total_paid: calculateTotalAmount().totalAmount,
  //       };

  //       console.log("Master", generalInfo);
  //       console.log("Items", items);

  //       const response = await InsertDataService.postData(generalInfo, "VCBANK", authToken, branchId);
  //       console.log("Data posted successfully:", response);

  //       if (response.message === "insert Data Successfully") {
  //         // Iterate over items array and post each item individually
  //         for (const item of items) {
  //           const updatedItem = {
  //             ...item,
  //             voucher_number,
  //             purchase_invoice_number: item.invoice_number,

  //             // tax_invoice_number: item.invoice_number_vendor,
  //             // type_of_vat: item.vat,
  //             // tax_ppn: item.tax_ppn_type,
  //             // tax_pph: item.tax_pph_type,
  //             // tax_pph: item.tax_pph_type_2,

  //             // tax_pph_amount_2: item.total_amount_pph_2,
  //           };
  //           delete updatedItem.ID;
  //           delete updatedItem.vat_included;
  //           delete updatedItem.invoice_number;
  //           delete updatedItem.invoice_date;
  //           delete updatedItem.vat;
  //           delete updatedItem.vat_type;
  //           delete updatedItem.tax_ppn_type;
  //           delete updatedItem.tax_pph_type;
  //           delete updatedItem.tax_pph_type_2;
  //           delete updatedItem.total_tax_base;
  //           delete updatedItem.total_amount_pph;
  //           delete updatedItem.total_amount_pph_2;
  //           delete updatedItem.total_amount_ppn;
  //           delete updatedItem.doc_reference;
  //           delete updatedItem.doc_reff;
  //           // delete updatedItem.total_price;
  //           delete updatedItem.kurs_deal;
  //           // delete updatedItem.unit_price;
  //           delete updatedItem.rwnum;
  //           // delete updatedItem.quantity;
  //           delete updatedItem.product_note;
  //           // delete updatedItem.tax_ppn_rate;
  //           // delete updatedItem.tax_pph_rate;
  //           // delete updatedItem.type_of_vat;
  //           // delete updatedItem.type_of_pph;
  //           delete updatedItem.tax_exchange_rate;
  //           delete updatedItem.total_price_idr;
  //           delete updatedItem.departement;
  //           delete updatedItem.cod_cor_skb;
  //           delete updatedItem.doc_reff_no;
  //           delete updatedItem.doc_source;
  //           delete updatedItem.invoice_number_vendor;
  //           delete updatedItem.id_upload;
  //           delete updatedItem.totalAmount;
  //           delete updatedItem.expense_account;
  //           delete updatedItem.discount;
  //           delete updatedItem.doc_reff_num;
  //           delete updatedItem.contract_number;
  //           delete updatedItem.discount;
  //           delete updatedItem.subTotal;
  //           delete updatedItem.new_unit_price;
  //           delete updatedItem.tax_invoice_number_vendor;
  //           delete updatedItem.tax_base_idr;
  //           delete updatedItem.invoice_id;
  //           delete updatedItem.tax_ppn_amount_idr;
  //           delete updatedItem.tax_pph_amount_idr;
  //           delete updatedItem.subtotal;
  //           delete updatedItem.currency;
  //           delete updatedItem.payment_term;
  //           delete updatedItem.due_date;
  //           delete updatedItem.invoice_status;
  //           delete updatedItem.total_amount;
  //           delete updatedItem.term_of_payment;
  //           delete updatedItem.total_after_discount;
  //           delete updatedItem.endtoendid;
  //           delete updatedItem.total_before_discount;
  //           delete updatedItem.created_by;
  //           delete updatedItem.approved_by;
  //           delete updatedItem.journal_number;
  //           delete updatedItem.journal_type;
  //           delete updatedItem.bi_middle_rate;
  //           delete updatedItem.total_amount_ppn_idr;
  //           delete updatedItem.total_amount_pph_idr;
  //           delete updatedItem.total_after_discount_idr;
  //           delete updatedItem.total_before_discount_idr;
  //           delete updatedItem.total_amount_idr;

  //           const itemResponse = await InsertDataService.postData(updatedItem, "VCBANKD", authToken, branchId);
  //           console.log("Item posted successfully:", itemResponse);
  //         }

  //         messageAlertSwal("Success", response.message, "success");
  //         resetForm();
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setIsLoading(false);
  //       messageAlertSwal("Error", err.message, "error");
  //     } finally {
  //       setIsLoading(false); // Set loading state back to false after completion
  //     }
  //   } else {
  //     console.log("Form submission was canceled.");
  //   }
  // };

  const generateVoucherNumber = async (code) => {
    try {
      const uniqueVoucherNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=${code}`, authToken);
      setVoucherNumber(uniqueVoucherNumber); // Updates state, if needed elsewhere in your component
      return uniqueVoucherNumber; // Return the generated PR number for further use
    } catch (error) {
      console.error("Failed to generate Voucher Number:", error);
      throw error; // Rethrow the error for proper handling in the calling function
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    // if (!tax_exchange_rate) {
    //   messageAlertSwal("Error", "Tax Exchange Rate cannot be empty.", "error");
    //   return;
    // }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the Expanse Voucher?",
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
        // const pr_number = await generatePrNumber("PR");
        // console.log("pr_number", pr_number);

        // let endToEndId;
        // if (!endToEnd) {
        //   endToEndId = await generatePrNumber("PURC");
        // } else {
        //   endToEndId = endToEnd;
        //   console.log("endtoendId is not empty");
        // }

        const voucher_number = await generateVoucherNumber("DRAFT_VOUC");
        const checkDataResponse = await LookupService.fetchLookupData(`VOUC_FORMVCBANK&filterBy=voucher_number&filterValue=${voucher_number}&operation=EQUAL`, authToken, branchId);
        const existingData = checkDataResponse.data;

        // const { subtotalAfterDiscount, subTotal, totalPPNAmount, totalPPHAmount, totalAmount, total_amount_idr, total_before_discount_idr } = calculateTotalAmount();
        const total_amount = calculateTotalAmount();
        // Save general information
        const generalInfo = {
          // internalmemo,
          voucher_number,
          voucher_date, // Converts to date format
          // bank_name,
          account_bank,
          exchange_rate,
          // currency,
          status: "DRAFT",
          // total_amount,
          // doc_reff,
          // paid_to: paid_to_id,
          payment_source,
          number_check_giro,
          // giro_no,
          // currency,
          amount_idr: calculateTotalAmount().amount_idr,
          total_paid: calculateTotalAmount().totalAmount,
          paid_to_id: parseInt(paid_to_id, 10),
          currency_id:  parseInt(currency_id, 10),
          bank_id:  parseInt(bank_id, 10),
        };

        console.log("Master", generalInfo);
        console.log("Items", items);

        let response;

        // Check if updating existing data or inserting new data
        if (selectedData) {
          const id = selectedData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `VCBANK&column=id&value=${id}`, authToken, branchId);
        } else if (existingData && existingData.length > 0) {
          const id = existingData[0].ID;
          response = await UpdateDataService.postData(generalInfo, `VCBANK&column=id&value=${id}`, authToken, branchId);
        } else {
          response = await InsertDataService.postData(generalInfo, "VCBANK", authToken, branchId);
        }

        console.log("Data posted successfully:", response);

        // // Update Status for PR or PO
        // if (idPr) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUREQ&column=id&value=${idPr}&branchId=${branchId}, { status_request: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // } else if (idPo) {
        //   await axios.post(${FORM_SERVICE_UPDATE_DATA}?f=PUOR&column=id&value=${idPo}&branchId=${branchId}, { status_po: "INVOICE" }, { headers: { Authorization: Bearer ${authToken} } });
        // }

        // Handle item deletion and insertion
        if (response.message === "Update Data Successfully") {
          if (existingData && existingData.length > 0) {
            const PettyNum = existingData[0].voucher_number;
            const lookupResponse = await LookupService.fetchLookupData(`VOUC_FORMVCBANKD&filterBy=voucher_number&filterValue=${PettyNum}&operation=EQUAL`, authToken, branchId);

            const ids = lookupResponse.data.map((item) => item.ID); // Dapatkan semua ID dari respons array
            console.log("IDs to delete:", ids);

            // Delete each item based on fetched IDs
            for (const id of ids) {
              try {
                await DeleteDataService.postData(`column=id&value=${id}`, "VCBANKD", authToken, branchId);
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
                  const itemResponse = await DeleteDataService.postData(`column=id&value=${itemId}`, "VCBANKD", authToken, branchId);
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
              voucher_number,
              // purchase_invoice_number: item.invoice_number,

              // tax_invoice_number: item.invoice_number_vendor,
              // type_of_vat: item.vat,
              // tax_ppn: item.tax_ppn_type,
              // tax_pph: item.tax_pph_type,
              // tax_pph: item.tax_pph_type_2,

              // tax_pph_amount_2: item.total_amount_pph_2,
            };
            delete updatedItem.ID;
            delete updatedItem.vendor;
            delete updatedItem.coa;
            delete updatedItem.employee;
            delete updatedItem.department;
            delete updatedItem.project;
            delete updatedItem.product;
            delete updatedItem.tax_ppn;
            delete updatedItem.tax_pph;
            delete updatedItem.vat_included;
            delete updatedItem.invoice_number;
            delete updatedItem.invoice_date;
            delete updatedItem.vat;
            delete updatedItem.vat_type;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.tax_pph_type_2;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_pph_2;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.doc_reference;
            delete updatedItem.doc_reff;
            // delete updatedItem.total_price;
            delete updatedItem.kurs_deal;
            // delete updatedItem.unit_price;
            delete updatedItem.rwnum;
            // delete updatedItem.quantity;
            delete updatedItem.product_note;
            // delete updatedItem.tax_ppn_rate;
            // delete updatedItem.tax_pph_rate;
            // delete updatedItem.type_of_vat;
            // delete updatedItem.type_of_pph;
            delete updatedItem.tax_exchange_rate;
            delete updatedItem.total_price_idr;
            delete updatedItem.departement;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.doc_reff_no;
            delete updatedItem.doc_source;
            delete updatedItem.invoice_number_vendor;
            delete updatedItem.id_upload;
            delete updatedItem.totalAmount;
            delete updatedItem.expense_account;
            delete updatedItem.discount;
            delete updatedItem.doc_reff_num;
            delete updatedItem.contract_number;
            delete updatedItem.discount;
            delete updatedItem.subTotal;
            delete updatedItem.new_unit_price;
            delete updatedItem.tax_invoice_number_vendor;
            delete updatedItem.tax_base_idr;
            delete updatedItem.invoice_id;
            delete updatedItem.tax_ppn_amount_idr;
            delete updatedItem.tax_pph_amount_idr;
            delete updatedItem.subtotal;
            delete updatedItem.currency;
            delete updatedItem.payment_term;
            delete updatedItem.due_date;
            delete updatedItem.invoice_status;
            delete updatedItem.total_amount;
            delete updatedItem.term_of_payment;
            delete updatedItem.total_after_discount;
            delete updatedItem.endtoendid;
            delete updatedItem.total_before_discount;
            delete updatedItem.created_by;
            delete updatedItem.approved_by;
            delete updatedItem.journal_number;
            delete updatedItem.journal_type;
            delete updatedItem.bi_middle_rate;
            delete updatedItem.total_amount_ppn_idr;
            delete updatedItem.total_amount_pph_idr;
            delete updatedItem.total_after_discount_idr;
            delete updatedItem.total_before_discount_idr;
            delete updatedItem.total_amount_idr;
            delete updatedItem.payment_term_id;
            delete updatedItem.create_by_id;
            delete updatedItem.approve_by_id;
            delete updatedItem.currency_id;
            delete updatedItem.journal_id;
            delete updatedItem.vendor_id;
            delete updatedItem.customer_id;

            try {
              const itemResponse = await InsertDataService.postData(updatedItem, "VCBANKD", authToken, branchId);
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
              voucher_number,
              // purchase_invoice_number: item.invoice_number,

              // tax_invoice_number: item.invoice_number_vendor,
              // type_of_vat: item.vat,
              // tax_ppn: item.tax_ppn_type,
              // tax_pph: item.tax_pph_type,
              // tax_pph: item.tax_pph_type_2,

              // tax_pph_amount_2: item.total_amount_pph_2,
            };
            delete updatedItem.ID;
            delete updatedItem.vendor;
            delete updatedItem.coa;
            delete updatedItem.employee;
            delete updatedItem.department;
            delete updatedItem.project;
            delete updatedItem.product;
            delete updatedItem.tax_ppn;
            delete updatedItem.tax_pph;
            delete updatedItem.vat_included;
            delete updatedItem.invoice_number;
            delete updatedItem.invoice_date;
            delete updatedItem.vat;
            delete updatedItem.vat_type;
            delete updatedItem.tax_ppn_type;
            delete updatedItem.tax_pph_type;
            delete updatedItem.tax_pph_type_2;
            delete updatedItem.total_tax_base;
            delete updatedItem.total_amount_pph;
            delete updatedItem.total_amount_pph_2;
            delete updatedItem.total_amount_ppn;
            delete updatedItem.doc_reference;
            delete updatedItem.doc_reff;
            // delete updatedItem.total_price;
            delete updatedItem.kurs_deal;
            // delete updatedItem.unit_price;
            delete updatedItem.rwnum;
            // delete updatedItem.quantity;
            delete updatedItem.product_note;
            // delete updatedItem.tax_ppn_rate;
            // delete updatedItem.tax_pph_rate;
            // delete updatedItem.type_of_vat;
            // delete updatedItem.type_of_pph;
            delete updatedItem.tax_exchange_rate;
            delete updatedItem.total_price_idr;
            delete updatedItem.departement;
            delete updatedItem.cod_cor_skb;
            delete updatedItem.doc_reff_no;
            delete updatedItem.doc_source;
            delete updatedItem.invoice_number_vendor;
            delete updatedItem.id_upload;
            delete updatedItem.totalAmount;
            delete updatedItem.expense_account;
            delete updatedItem.discount;
            delete updatedItem.doc_reff_num;
            delete updatedItem.contract_number;
            delete updatedItem.discount;
            delete updatedItem.subTotal;
            delete updatedItem.new_unit_price;
            delete updatedItem.tax_invoice_number_vendor;
            delete updatedItem.tax_base_idr;
            delete updatedItem.invoice_id;
            delete updatedItem.tax_ppn_amount_idr;
            delete updatedItem.tax_pph_amount_idr;
            delete updatedItem.subtotal;
            delete updatedItem.currency;
            delete updatedItem.payment_term;
            delete updatedItem.due_date;
            delete updatedItem.invoice_status;
            delete updatedItem.total_amount;
            delete updatedItem.term_of_payment;
            delete updatedItem.total_after_discount;
            delete updatedItem.endtoendid;
            delete updatedItem.total_before_discount;
            delete updatedItem.created_by;
            delete updatedItem.approved_by;
            delete updatedItem.journal_number;
            delete updatedItem.journal_type;
            delete updatedItem.bi_middle_rate;
            delete updatedItem.total_amount_ppn_idr;
            delete updatedItem.total_amount_pph_idr;
            delete updatedItem.total_after_discount_idr;
            delete updatedItem.total_before_discount_idr;
            delete updatedItem.total_amount_idr;
            delete updatedItem.payment_term_id;
            delete updatedItem.create_by_id;
            delete updatedItem.approve_by_id;
            delete updatedItem.currency_id;
            delete updatedItem.journal_id;
            delete updatedItem.vendor_id;
            delete updatedItem.customer_id;

            const itemResponse = await InsertDataService.postData(updatedItem, "VCBANKD", authToken, branchId);
            console.log("Item posted successfully:", itemResponse);
          }

          //Set status workflow VERIFIED
          //   LookupService.fetchLookupData(`PURC_FORMPUINVC&filterBy=endtoendid&filterValue=${endToEndId}&operation=EQUAL`, authToken, branchId)
          //     .then((response) => {
          //       const data = response.data[0];
          //       console.log("Data:", data);

          //       const requestData = {
          //         idTrx: data.ID,
          //         status: "DRAFT", // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
          //       };
          //       UpdateStatusService.postData(requestData, "PUINVC", authToken, branchId)
          //         .then((response) => {
          //           console.log("Data updated successfully:", response);
          //         })
          //         .catch((error) => {
          //           console.error("Failed to update data:", error);
          //         });
          //     })
          //     .catch((error) => {
          //       console.error("Failed to load purchase request data:", error);
          //     });
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

  const dynamicFormWidth = (e) => {
    const contentLength = e.target.value.length;
    const newWidth = Math.max(100, contentLength * 12); // 8px per character, adjust as needed
    setInputWidth(newWidth);
  };

  const detailFormStyle = () => {
    return {
      border: "none",
      background: "transparent",
      color: "#000",
    };
  };
  
  // const taxExchangeChange = (e) => {
  //   setExchangeRate(e);
  //   console.log("taxe", exchange_rate_bank);
  //   items.forEach((item) => {
  //     item.exchange_rate = parseFloat(e) || 0;
  //   });
  // };

  // const taxExchangeChange = (e) => {
  //   setExchangeRate(e); // This sets the string version
  //   const numericExchangeRate = parseFloat(e) || 0; // Parse to number or default to 0
  //   items.forEach((item) => {
  //     item.exchange_rate = numericExchangeRate; // Assign the numeric value to items
  //   });
  //   console.log("Numeric exchange rate:", numericExchangeRate);
  // };

  return (
    <Fragment>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>{selectedData ? "Edit Purchase Expanse Voucher By Bank" : "Add Purchase Expanse Voucher By Bank"}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">{selectedData ? "Edit Purchase Expanse Voucher By Bank" : "Add Purchase Expanse Voucher By Bank"}</li>
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
                  {setIsEditingPurchaseExpanse && (
                    <>
                      <Button
                        variant="secondary"
                        className="mr-2"
                        onClick={() => {
                          handleRefresh();
                          setIsEditingPurchaseExpanse(false);
                        }}
                      >
                        <i className="fas fa-arrow-left"></i> Go Back
                      </Button>
                    </>
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
                    {/* <Col md={6}>
                      <Form.Group controlId="formPayToSource">
                        <Form.Label>Pay To Source</Form.Label>
                        <Form.Control type="text" placeholder="Enter Pay To Source" value={pay_to_source} onChange={(e) => setPayToSource(e.target.value)} disabled > */}
                    {/* <option value="">Select...</option> */}
                    {/* </Form.Control>
                      </Form.Group>
                    </Col> */}

                    {/* {doc_reff === "purchaseInvoice" ? (
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
                    )} */}

                    <Col md={6}>
                      <Form.Group controlId="formVoucherNumber">
                        <Form.Label>Voucher Number</Form.Label>
                        <Form.Control type="text" value={voucher_number} readOnly />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formVoucherDate">
                        <Form.Label>Voucher Date</Form.Label>
                        {/* <Form.Control type="date" value={voucher_date} onChange={(e) => setVoucherDate(e.target.value)} required /> */}
                        <div className="input-group">
                          {/* Custom DatePicker with integrated icon */}
                          <DatePicker
                            selected={voucher_date}
                            onChange={setVoucherDate}
                            dateFormat="dd-MM-yyyy" // Display date in dd-MM-yyyy format
                            className="form-control"
                            placeholderText="Select a date"
                            required
                          />
                           <FaCalendar style={{ marginLeft: "-30px", zIndex: "2" }} className="my-auto" />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formaPaymenSource">
                        <Form.Label>Payment Source</Form.Label>
                        <Form.Control as="select" placeholder="" value={payment_source} onChange={(e) => handlePaymentSourceChange(e.target.value)}>
                          <option value="">Select Payment Source</option>
                          <option value="Bank">Bank</option>
                          <option value="Cash">Cash</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    {payment_source === "Bank" && (
                      <Col md={6}>
                        <Form.Group controlId="formBank">
                          <Form.Label>Bank</Form.Label>
                          <Select 
                            value={selectedBankName}  
                            // onChange={handleBankSelection} 
                            onChange={(selectedOption) => {
                              handleBankSelection(selectedOption); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                              setBankId(selectedOption ? selectedOption.id : "");
                            }}
                            options={bankOptions} 
                            isClearable 
                            placeholder="Select Bank" />
                        </Form.Group>
                      </Col>
                    )}

                    {payment_source === "Cash" && (
                      <Col md={6}>
                        <Form.Group controlId="formKas">
                          <Form.Label>Cash</Form.Label>
                          <Select 
                            value={selectedBankName} 
                            // onChange={handleBankSelection}
                            onChange={(selectedOption) => {
                              handleBankSelection(selectedOption); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                              setBankId(selectedOption ? selectedOption.id : "");
                            }} 
                            options={bankOptions} 
                            isClearable 
                            placeholder="Select Cash" />
                        </Form.Group>
                      </Col>
                    )}

                    <Col md={6}>
                      <Form.Group controlId="formAccountBank">
                        <Form.Label>Bank Account Number </Form.Label>
                        {/* <Select
                          value={selectedAccountBank}
                          onChange={setSelectedAccountBank}
                          options={accountOptions}
                          isClearable
                          placeholder="Select..." 
                        /> */}
                        <Form.Control type="text" value={account_bank} onChange={(e) => setAccountBank(e.target.value)} placeholder="Enter..." />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formNoCheck">
                        <Form.Label>Check Number/Giro Number</Form.Label>
                        <Form.Control type="text" value={number_check_giro} placeholder="Enter Check Number" onChange={(e) => setNumberCheckGiro(e.target.value)} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formVendor">
                        <Form.Label>Paid To</Form.Label>
                        <Select 
                        value={selectedPaidTo} 
                        // onChange={(selectedOption) => handlePaidToChange(selectedOption)} 
                        onChange={(selectedOption) => {
                          handlePaidToChange(selectedOption); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                          setPaidToId(selectedOption ? selectedOption.id : "");
                        }}
                        options={paidToOptions} 
                        isClearable 
                        placeholder="Select..." />
                      </Form.Group>
                    </Col>

                    {/* 
                    <Col md={6}>
                      <Form.Group controlId="formPayTo">
                        <Form.Label>Paid To</Form.Label>
                        <Form.Control tyoe="text" placeholder="Select..." value={pay_to} onChange={(e) => setPayTo(e.target.value)}required>
                          <option value="">Select...</option>
                          <option value="purchaseRequest">Purchase Request</option>
                          <option value="internalMemo">Internal Memo</option>
                          <option value="purchaseOrder">Purchase Order</option>
                        </Form.Control>
                      </Form.Group>
                    </Col> */}

                    {/* {doc_reff === "purchaseRequest" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Paid To</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}
                    {doc_reff === "purchaseOrder" && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Paid To</Form.Label>
                          <Select value={selectedbothvendor} onChange={handleBothVendorChange} options={allvendoroptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )}
                    {!(doc_reff === "purchaseRequest" || doc_reff === "purchaseOrder") && (
                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Paid To</Form.Label>
                          <Select value={selectedVendor} onChange={handleVendorChange} options={vendorOptions} isClearable placeholder="Select Vendor..." />
                        </Form.Group>
                      </Col>
                    )} */}

                    <Col md={6}>
                      <Form.Group controlId="formExchangeRateBank">
                        <Form.Label>Exchange Rate Bank (Amount)</Form.Label>
                        <Form.Control type="number" value={exchange_rate_bank} placeholder="Enter Exchange Rate Bank..." onChange={(e) => handleExchangeRateBankChange(parseFloat(e.target.value))} />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formVoucherStatus">
                        <Form.Label>Voucher Status</Form.Label>
                        <Form.Control type="text" value={status} placeholder="" onChange={(e) => setStatus(e.target.value)} disabled />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                      <Form.Group controlId="formCurrency">
                       <Form.Label>Currency</Form.Label>
                        <Select
                          value={selectedCurrencyBank}
                          onChange={handleCurrencyBankChange}
                          options={currencyBankOptions}
                          isClearable
                          placeholder="Select..." 
                        />
                    </Form.Group>
                    </Col>     */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formTotalAmount">
                        <Form.Label>Total Amount</Form.Label>
                        <Form.Control type="number" value={totalAmount} placeholder="0"  onChange={(e) => setTotalAmount(e.target.value)} />
                      </Form.Group>
                    </Col> */}

                    {/* <Col md={6}>
                      <Form.Group controlId="formTotalAmount">
                        <Form.Label>Total Amount</Form.Label>
                        <Form.Control
                          type="number"
                          value={calculateTotalAmount().totalAmount}
                          placeholder="0"
                          onChange={(e) => setTotalAmount(parseFloat(e.target.value))} // Convert input to a number
                          readOnly
                        />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formCurrency">
                        <Form.Label>Currency</Form.Label>
                        <Select
                          value={selectedCurrency} // Menemukan mata uang yang sesuai
                          onChange={(selectedOption) => {
                            handleCurrencyChange(selectedOption); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                            setCurrencyId(selectedOption ? selectedOption.id : "");
                          }}
                          options={currencyOptions}
                          isClearable
                          placeholder="Select Currency..."
                        />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                          <Form.Group controlId="formCurrency">
                            <Form.Label>Currency</Form.Label>
                            <Select
                              value={selectedCurrency || currencyOptions.find((option) => option.value === "IDR")}
                              onChange={(selectedOption) => {
                                handleCurrencyChange(selectedOption);

                                // Update the currency for all items if needed
                                const currencyValue = selectedOption ? selectedOption.value : "IDR";
                                items.forEach((_, index) => {
                                  handleItemChange(index, "currency", currencyValue);
                                });
                              }}
                              options={currencyOptions}
                              isClearable
                              placeholder="Select Currency..."
                            />
                          </Form.Group>
                        </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formIDRAmount">
                        <Form.Label>IDR Amount</Form.Label>
                        <Form.Control
                          type="text"
                          value={calculateTotalAmount().amount_idr.toLocaleString("en-US")}
                          placeholder="0"
                          onChange={(e) => {
                            const newIdrAmount = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                            setIDRAmount(index, "amount_idr", newIdrAmount);
                          }}
                          readOnly
                        />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6}>
                      <Form.Group controlId="formTotalDebt">
                        <Form.Label>Total Debt</Form.Label>
                        <Form.Control
                          type="number"
                          value={total_debt}
                          placeholder="0"
                          onChange={(e) => setTotalDebt(parseFloat(e.target.value))} // Convert input to a number
                          readOnly
                        />
                      </Form.Group>
                    </Col> */}

                    <Col md={6}>
                      <Form.Group controlId="formTotalPaid">
                        <Form.Label>Total Paid</Form.Label>
                        <Form.Control
                          type="text"
                          value={calculateTotalAmount().totalAmount.toLocaleString("en-US")}
                          placeholder="0"
                          onChange={(e) => {
                            const newTotalPaid = parseFloat(e.target.value.replace(/[^\d.-]/g, ""));
                            setTotalPaid(index, "total_paid", newTotalPaid);
                          }} // Convert input to a number
                          readOnly
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
                              <th>Purchase Invoice Number</th>
                              <th>Purchase Invoice Date</th>
                              {/* <th>Status Detail</th> */}
                              <th>Chart of Account (COA)</th>
                              <th>Product</th>
                              {/* <th>Product Account</th> */}
                              <th>Description</th>
                              <th>Tax Invoice Number Vendor</th>
                              <th>Db/Cr</th>
                              {/* <th>Vendor</th> */}
                              <th>Project</th>
                              <th>Project Contract Number</th>
                              <th>Customer</th>
                              <th>Department</th>
                              {/* <th>Employee</th> */}
                              {/* <th>Tax Invoice Number</th> */}
                              {/* <th>Amount</th> */}
                              {/* <th>Currency</th> */}

                              <th>Exchange Rate</th>
                              {/* <th>Kurs Deal</th> */}
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Quantity</th>} */}
                              <th>Quantity</th>
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Unit Price</th>} */}
                              <th>Unit Price</th>
                              <th>Total Price</th>
                              <th hidden>Amount IDR</th>
                              {/* <th>Type of VAT</th> */}
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Type of VAT</th>} */}
                              <th>Type of VAT</th>
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Tax PPN</th>} */}
                              <th>Tax PPN</th>
                              <th>Amount PPN</th>
                              {/* <th>Total Amount PPN in IDR</th> */}
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Tax PPh Type</th>} */}
                              <th>Tax PPh Type</th>
                              {/* {!items.some((item) => item.purchase_invoice_number) && <th>Tax PPh</th>} */}
                              <th>Tax PPh</th>
                              <th>Amount PPh</th>
                              {/* <th>PPh 2</th>
                              <th>Total Amount PPh 2</th> */}
                              <th>Tax Base</th>
                              <th>Amount to be Paid</th>
                              {/* <th>Total Price</th> */}
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="30" className="text-center">
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
                                    <Select
                                      value={piNumberOptions.find((option) => option.value === item.purchase_invoice_number) || null}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "purchase_invoice_number", selectedOption ? selectedOption.value : null);
                                        handlePiNumberChange(index, selectedOption);
                                      }}
                                      options={piNumberOptions}
                                      isClearable
                                      placeholder="Select Invoice Number"
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>

                                  <td>
                                      <DatePicker
                                        selected={item.purchase_invoice_date}
                                        onChange={(date) => handleItemChange(index, "purchase_invoice_date", date)}
                                        dateFormat="dd-MM-yyyy" // Display date in dd-MM-yyyy format
                                        className="form-control"
                                        placeholderText="Select a date"
                                        required
                                         customInput={<input type="text" style={{ border: 'none', background: 'transparent', width: '100%' }} />} 
                                      />
                                       <FaCalendar style={{ marginLeft: "-30px", zIndex: "2" }} className="my-auto" />
                                    </td>

                                  {/* <td>
                               <Form.Control
                                      type="text"
                                      value={item.status_detail}
                                      onChange={(e) => setSelectedDescription(e.target.value)} 
                                      placeholder="..." 
                                      readOnly
                                    />
                               </td> */}

                                  <td>
                                    <Form.Control 
                                    type="text" 
                                    value={
                                      productOptions.find(option => option.id === items[index].coa_id)?.expenseAccount || ""
                                    } 
                                    onChange={(e) => handleProductChange(e.target.value)} 
                                    placeholder="..." 
                                    readOnly 
                                    style={detailFormStyle()} />
                                  </td>

                                  <td>
                                    <Select
                                      value={productOptions.find((option) => option.id === items[index].product_id)}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "product", selectedOption ? selectedOption.value : null);
                                        handleItemChange(index, "product_id", selectedOption ? selectedOption.id : null);
                                        handleProductChange(index, selectedOption);
                                      }}
                                      // value={productOptions.find(option => option.value === items[index]?.product)}
                                      // onChange={(selectedProduct) => handleProductChange(index, selectedProduct)}
                                      options={productOptions}
                                      isClearable
                                      placeholder="Select Product"
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>

                                  {/* 
                              <td>
                               <Form.Control
                                      type="text"
                                      value={item.product_account}
                                      onChange={(e) => handleProductChange(e.target.value)} 
                                      placeholder="..." 
                                      readOnly
                                    />
                               </td> */}

                                  <td>
                                    <Form.Control type="text" value={item.description} placeholder="Enter..." onChange={(e) => handleItemChange(index, "description", e.target.value)} style={detailFormStyle()} />
                                  </td>

                                  <td>
                                    <Form.Control type="text" value={item.tax_invoice_number} placeholder="Enter.." onChange={(e) => handleItemChange(index, "tax_invoice_number", e.target.value)} style={detailFormStyle()} />
                                  </td>

                                  <td>
                                    <Form.Control as="select" value={item.db_cr || "Db"} onChange={(e) => handleItemChange(index, "db_cr", e.target.value)} style={detailFormStyle()}>
                                      {/* <option value="Select an Option">Select an Option</option> */}
                                      <option value="Db">Db</option>
                                      <option value="Cr">Cr</option>
                                    </Form.Control>
                                  </td>

                                  {/* <td>
                               <Select 
                                  value={vendorOptions.find((option) => option.value === item.vendor)}
                                  onChange={(selectedOption) => handleItemChange(index, "vendor", selectedOption ? selectedOption.value : null)}
                                  options={vendorOptions}
                                  isClearable
                                  placeholder="Select Vendor..." 
                                />
                               </td> */}

                                  {/* <td>
                                 <Form.Control type="text"  onChange={(e) => handleItemChange(index, "project", e.target.value)} />
                               </td> */}

                                  <td>
                                    {/* <Select
                                  value={projectOptions.find(option => option.value === item.project)}
                                  onChange={setSelectedProject} 
                                  options={projectOptions}
                                  isClearable
                                  placeholder="Select Project..." 
                                /> */}
                                    {/* <Select
                                      value={projectOptions.find(option => option.value === items[index]?.project)}
                                      onChange={(selectedProject) => handleProjectChange(index, selectedProject)}
                                      options={projectOptions}
                                      placeholder="Select Project"
                                  /> */}
                                    <Select
                                      value={projectOptions.find((option) => option.id === items[index].project_id)}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "project", selectedOption ? selectedOption.value : null);
                                        handleItemChange(index, "project_id", selectedOption ? selectedOption.id : null);
                                        handleProjectChange(index, selectedOption);
                                      }}
                                      // value={productOptions.find(option => option.value === items[index]?.product)}
                                      // onChange={(selectedProduct) => handleProductChange(index, selectedProduct)}
                                      options={projectOptions}
                                      isClearable
                                      placeholder="Select Project"
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>

                                  <td>
                                    <Form.Control type="text" value={item.project_contract_number} onChange={(e) => handleProjectChange(e.target.value)} placeholder="Enter..." readOnly style={detailFormStyle()} />
                                  </td>

                                  {/* <td>
                                  <Select
                                  value={projectContractOptions.find(option => option.value === item.project_contract_number)}
                                  onChange={setSelectedProjectContract} 
                                  options={projectContractOptions}
                                  isClearable
                                  placeholder="Project Contract..." 
                                />
                               </td> */}

                                  <td>
                                    <Select
                                    value={customerOptions.find((option) => option.value === items[index].customer)}
                                      // value={customerOptions.find((option) => option.id === items[index].customer_id)}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "customer", selectedOption ? selectedOption.value : null);
                                        handleItemChange(index, "customer_id", selectedOption ? selectedOption.id : null);
                                      }}
                                      options={customerOptions}
                                      isClearable
                                      placeholder="Select Customer..."
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>

                                  <td>
                                    <Select
                                      value={departmentOptions.find((option) => option.id === item.department_id) || null}
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "department", selectedOption ? selectedOption.value : null);
                                        handleItemChange(index, "department_id", selectedOption ? selectedOption.id : null);
                                      }}
                                      options={departmentOptions}
                                      isClearable
                                      placeholder="Select Department..."
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>

                                  {/* <td>
                               <Select 
                                  value={employeeOptions.find((option) => option.value === item.employee)}
                                  onChange={(selectedOption) => {
                                    handleItemChange(index, "employee", selectedOption ? selectedOption.value : null);
                                  }}
                                  options={employeeOptions}
                                  isClearable
                                  placeholder="Select Employee..." 
                                />
                               </td> */}

                                  {/* <td>
                                 <Form.Control type="number" value={item.invoice_number} onChange={(e) => handleItemChange(index, "invoice_number", e.target.value)} />
                               </td> */}
                                  {/* <td>
                               <Form.Control 
                                 type="number"
                                 value={item.amount}
                                 onChange={(e) => handleItemChange(e.target.value)} 
                                 placeholder="0" 
                               />
                               </td> */}

                                  {/* <td>
                                    <Select
                                      value={productOptions.find((option) => option.value === item.product)} // Menemukan produk yang sesuai
                                      onChange={(selectedOption) => {
                                        handleItemChange(index, "product", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui state
                                      }}
                                      options={productOptions} // Daftar opsi produk
                                      isClearable
                                      placeholder="Select Product..."
                                    />
                                  </td> */}
                                  {/* 
                                  <td>
                                  <Select
                                    value={currencyOptions.find((option) => option.value === item.currency)} // Menemukan mata uang yang sesuai
                                    onChange={(selectedOption) => {
                                      handleItemChange(index, "currency", selectedOption ? selectedOption.value : null); // Memanggil handleItemChange untuk memperbarui mata uang per baris
                                    }}
                                    options={currencyOptions}
                                    // isClearable
                                    placeholder="Select Currency..." 
                                    styles={{
                                      control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle()
                                      }),
                                    }}
                                  />
                                  </td> */}

                                  <td>
                                    <Form.Control type="number" value={item.exchange_rate} min="0" onChange={(e) => handleItemChange(index, "exchange_rate", parseFloat(e.target.value))} disabled style={detailFormStyle()} />
                                  </td>

                                  {/* {purchase_invoice_number === "quantity" && (
                                  <td>
                                    <Form.Control 
                                      type="number" 
                                      value={item.quantity || 0} 
                                      min="0" 
                                      onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} hidden
                                    />
                                  </td>
                                )} */}

                                  {/* {!item.purchase_invoice_number && (
                                  <td>
                                    <Form.Control 
                                      type="number" 
                                      value={item.quantity || 0} 
                                      min="0" 
                                      onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} 
                                    />
                                  </td>
                                )} */}

                                  <td>
                                    {/* {!item.purchase_invoice_number ? ( */}
                                    <Form.Control type="number" value={item.quantity || 0} min="0" onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} style={detailFormStyle()} />
                                    {/* ) : null} */}
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

                                  {/* <td>
                                  <Form.Control 
                                  type="number" 
                                  value={item.amount} 
                                  min="0" 
                                  onChange={(e) => handleItemChange(index, "amount", parseFloat(e.target.value))}/>
                              </td> */}
                                  <td className={currency || "default-currency"}>
                                    {item.total_price != null && !isNaN(item.total_price)
                                      ? item.total_price.toLocaleString("en-US", {
                                          style: "currency",
                                          currency: currency || "IDR", // Fallback to "USD"
                                        })
                                      : 0}
                                  </td>

                                  {/* <td className={currency}>{item.total_price.toLocaleString("en-US", { style: "currency", currency: "currency" }) || 0}</td> */}

                                  <td hidden>{item.total_price_idr?.toLocaleString("en-US", { style: "currency", currency: "IDR" }) ?? "IDR 0.00"}</td>

                                  {/*
                               <td>
                                 <Form.Control type="text" value={item.kurs_deal} onChange={(e) => handleItemChange(index, "kurs_deal", e.target.value)} />
                               </td> */}

                                  {/* <td>
                                    <Form.Control type="number" value={item.quantity || 0} min="0" onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} />
                                  </td>
                                  <td>
                                    <Form.Control type="number" value={item.unit_price || 0} min="0" onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))} />
                                  </td> */}

                                  <td>
                                    {/* {!item.purchase_invoice_number ? ( */}
                                    <Form.Control as="select" value={items[index].type_of_vat || ""} onChange={(selectedOption) => handleItemChange(index, "type_of_vat", selectedOption.target.value)} style={detailFormStyle()}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                      <option value="non_ppn">Non PPN</option>
                                      {currency !== "IDR" ? <option value="ppn_royalty">PPN Royalty</option> : <></>}
                                    </Form.Control>
                                    {/* ) : null} */}
                                  </td>

                                  {/* <td>
                                    <Form.Control as="select" value={item.vat} onChange={(e) => handleItemChange(index, "vat", e.target.value)}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="include">Include</option>
                                      <option value="exclude">Exclude</option>
                                    </Form.Control>
                                  </td> */}
                                  {/* <td>
                                    <Form.Control type="text" value={item.product_note} onChange={(e) => handleItemChange(index, "product_note", e.target.value)} />
                                  </td> */}
                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_ppn} onChange={(e) => handleItemChange(index, "tax_ppn", parseFloat(e.target.value))} />
                                  </td> */}

                                  <td>
                                    {/* {!item.purchase_invoice_number ? ( */}
                                    <Select
                                     value={
                                      items[index].type_of_vat === "PPNRoyalty"
                                        ? tax_ppn_royalty_option.find((option) => option.id === item.tax_ppn_id)
                                        : items[index].type_of_vat === "include"
                                        ? taxTypeIncludeOptions.find((option) => option.id === items[index].tax_ppn_id) || null
                                        : items[index].type_of_vat === "exclude"
                                        ? taxTypeExcludeOptions.find((option) => option.id === items[index].tax_ppn_id) || null
                                        : taxPpnTypeOption.find((option) => option.id === items[index].tax_ppn_id) || null
                                    }
                                      // value={
                                      //   items[index].type_of_vat === "ppn_royalty" ? tax_ppn_royalty_option.find((option) => option.value === item.tax_ppn) : taxPpnTypeOption.find((option) => option.value === items[index].tax_ppn) || null
                                      // }
                                      onChange={(selectedOption) => {
                                        // Update the tax_ppn for the specific item
                                        handleItemChange(index, "tax_ppn", selectedOption ? selectedOption.value : "");
                                        handleItemChange(index, "tax_ppn_id", selectedOption ? selectedOption.id : 0);

                                        // Update the PpnRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_ppn_rate", selectedOption.RATE);
                                          setPpnRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_ppn_rate", 0);
                                          setPpnRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      // options={items[index].type_of_vat === "ppn_royalty" ? tax_ppn_royalty_option : taxPpnTypeOption}
                                      options={
                                        items[index].type_of_vat === "ppn_royalty"
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

                                  <td hidden>
                                    <Form.Control type="number" value={item.tax_ppn_rate} onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))} readOnly />
                                  </td>

                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_ppn_rate} onChange={(e) => handleItemChange(index, "tax_ppn_rate", parseFloat(e.target.value))} readOnly />
                                  </td> */}

                                  <td>
                                    <Form.Control
                                      className="text-end"
                                      type="text"
                                      // value={item.tax_ppn_amount}
                                      value={item.tax_ppn_amount !== undefined && item.tax_ppn_amount !== null ? item.tax_ppn_amount.toLocaleString("en-US") : 0}
                                      onChange={(e) => {
                                        const newAmountPpn = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                        handleItemChange(index, "tax_ppn_amount", newAmountPpn);
                                      }}
                                      readOnly
                                      style={detailFormStyle()}
                                    />
                                  </td>

                                  {/* <td>
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
                              </td> */}

                             

                                  <td>
                                    {/* {!item.purchase_invoice_number ? ( */}
                                    <Form.Control as="select" value={item.type_of_pph} onChange={(e) => handleItemChange(index, "type_of_pph", e.target.value)} style={detailFormStyle()}>
                                      <option value="Select an Option">Select an Option</option>
                                      <option value="gross">Gross</option>
                                      <option value="nett">Nett</option>
                                    </Form.Control>
                                    {/* ) : null} */}
                                  </td>

                                  <td>
                                    {/* {!item.purchase_invoice_number ? ( */}
                                    <Select
                                     value={
                                      items[index].type_of_vat === "include"
                                        ? taxTypeIncludepphOptions.find((option) => option.id === items[index].tax_pph_id) || null
                                        : items[index].type_of_vat === "exclude"
                                        ? taxTypeExcludepphOptions.find((option) => option.id === items[index].tax_pph_id) || null
                                        : tax_pph_type_option.find((option) => option.id === items[index].tax_pph_id) || null
                                    }
                                      // value={tax_pph_type_option.find((option) => option.value === items[index].tax_pph) || null}
                                      onChange={(selectedOption) => {
                                        // Update the tax_pph_type for the specific item
                                        handleItemChange(index, "tax_pph", selectedOption ? selectedOption.value : "");
                                        handleItemChange(index, "tax_pph_id", selectedOption ? selectedOption.id : 0);

                                        // Update the PphRate for the specific item
                                        if (selectedOption) {
                                          handleItemChange(index, "tax_pph_rate", selectedOption.RATE);
                                          setPphRate(selectedOption.RATE); // Memperbarui nilai RATE jika ada selectedOption
                                        } else {
                                          handleItemChange(index, "tax_pph_rate", 0);
                                          setPphRate(null); // Menghapus RATE jika tidak ada selectedOption
                                        }
                                      }}
                                      // options={tax_pph_type_option}
                                      options={
                                        items[index].type_of_vat === "include"
                                          ? taxTypeIncludepphOptions
                                          : items[index].type_of_vat === "exclude"
                                          ? taxTypeExcludepphOptions
                                          : tax_pph_type_option
                                      }
                                      isClearable
                                      placeholder="Select Tax PPH Type..."
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          ...detailFormStyle(),
                                        }),
                                      }}
                                    />
                                  </td>

                                  <td hidden>
                                    <Form.Control type="number" value={item.tax_pph_rate} onChange={(e) => handleItemChange(index, "tax_pph_rate", parseFloat(e.target.value))} readOnly />
                                  </td>

                                  {/* <td>
                                 <Form.Control type="number"  onChange={(e) => handleItemChange(index, "", e.target.value)} />
                               </td> */}

                                  <td>
                                    <Form.Control
                                      className="text-end "
                                      type="text"
                                      // value={item.tax_pph_amount}
                                      value={item.tax_pph_amount !== undefined && item.tax_pph_amount !== null ? item.tax_pph_amount.toLocaleString("en-US") : 0}
                                      onChange={(e) => {
                                        const newAmountPph = parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0;
                                        handleItemChange(index, "tax_pph_amount", newAmountPph);
                                      }}
                                      readOnly
                                      style={detailFormStyle()}
                                    />
                                  </td>

                                  {/* <td>
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
                              </td> */}

                                  <td className="">
                                    {currency === "IDR" ? (
                                      <Form.Control
                                        type="text"
                                        disabled
                                        style={detailFormStyle()}
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
                                        style={detailFormStyle()}
                                        value={item.tax_base !== undefined && item.tax_base !== null ? item.tax_base : 0}
                                        onChange={(e) => {
                                          handleItemChange(index, "tax_base", Math.max(0, parseFloat(e.target.value) || 0));
                                          dynamicFormWidth(e);
                                        }}
                                      />
                                    )}
                                  </td>

                                  {/* <td>
                                    <Form.Control type="number" value={item.tax_base} onChange={(e) => handleItemChange(index, "tax_base", parseFloat(e.target.value))} />
                                  </td> */}

                                  <td>
                                    <Form.Control
                                      type="text"
                                      value={item.amount_paid !== undefined && item.amount_paid !== null ? item.amount_paid.toLocaleString("en-US") : 0}
                                      onChange={(e) => {
                                        // handleItemChange(index, "amount_paid", parseFloat(e.target.value))
                                        const newAmountPaid = parseFloat(e.target.value.replace(/[^\d.-]/g, ""));
                                        handleItemChange(index, "amount_paid", newAmountPaid);
                                      }}
                                      style={detailFormStyle()}
                                    />
                                  </td>

                                  {/* <td>
                                    <Form.Control 
                                    type="number" 
                                    value={item.amountPaid} 
                                    onChange={(e) => handleItemChange(index, "amount_paid", parseFloat(e.target.value))} />
                                  </td> */}

                                  <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(index)}>
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                          {/*                           
                          <Card.Header>
                            <div className="d-flex justify-content-between align-items-center">
                            
                              <div>
                                <Button variant="success" size="sm" onClick={handleAddItem}>
                                  <i className="fas fa-plus"></i> New Item
                                </Button>
                                <Button variant="danger" size="sm" className="ml-2" onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                                  <i className="fas fa-trash"></i> Delete Selected
                                </Button>
                              </div>
                            </div>
                          </Card.Header> */}

                          <tr>
                            <td colSpan="30" className="text-left">
                              <div>
                                <Button variant="success" size="sm" onClick={handleAddItem}>
                                  <i className="fas fa-plus"></i> New Item
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </table>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Card.Body>

              <Card.Footer>
                <table className="table table-bordered">
                  <tbody>
                    {/* <tr>
                              <td colSpan="24" className="text-right">
                                Sub Total:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="24" className="text-right">
                                Total PPN Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="24" className="text-right">
                                Total PPh Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="24" className="text-right">
                                Total Amount:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>

                            <tr>
                              <td colSpan="24" className="text-right">
                                Total Dept:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td colSpan="24" className="text-right">
                                Total Paid:
                              </td>
                              <td>
                                <strong>{calculateTotalAmount().toLocaleString("en-US", { style: "currency", currency: "IDR" || 0 })}</strong>
                              </td>
                              <td></td>
                            </tr> */}

                    <tr className="text-right">
                      <td colSpan="16">Subtotal:</td>
                      <td className="text-right col-2">
                        <strong>
                          {items.length > 0
                            ? calculateTotalAmount().subtotalAfterDiscount.toLocaleString("en-US", {
                                style: "currency",
                                currency: currency || "IDR",
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
                                currency: currency || "IDR",
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
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12} className="d-flex justify-content-end">
            {setIsEditingPurchaseExpanse ? (
              <Button
                variant="secondary"
                className="mr-2"
                onClick={() => {
                  handleRefresh();
                  setIsAddingNewPurchaseExpanse(false);
                }}
              >
                <i className="fas fa-arrow-left"></i> Back
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

export default AddPurchaseExpanseVoucher;
