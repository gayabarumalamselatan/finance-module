import React, { useState, useEffect, createContext } from 'react';
import { Fragment } from 'react';
import {FaAddressBook, FaFilter, FaSave, FaSyncAlt, FaTimes} from 'react-icons/fa'
import { Button, Col, Form, Row, Card } from 'react-bootstrap';
import { generateUniqueId } from '../service/GeneratedId';
import { GENERATED_NUMBER, FORM_SERVICE_LOAD_FIELD } from '../config/ConfigUrl';
import FormService from '../service/FormService'
import axios from 'axios';
import { getBranch, getToken } from '../config/Constant';
import LookupParamService from '../service/LookupParamService'
import {HandleToUppercase} from '../utils/HandleToUpercase'
import Select from 'react-select';
import { NumericFormat } from 'react-number-format';


const PurchaseOrderFormer = () => {
  const [showAdd, setShowAdd] = useState(true);
  const [title, setTitle] = useState(''); 
  const [poNumber, setPoNumber] = useState(''); 
  const [prNumber, setPrNumber] = useState(''); 
  const [orderDate, setOrderDate] = useState('');
  const [paymentTerm, setPaymentTerm] = useState('');
  const [approveBy, setApproveBy] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [createdBy, setCreatedBy] = useState('');
  const [date, setDate] = useState('');
  const [docNo, setDocNo] = useState('');
  const [requestor, setRequestor] = useState('');
  const [company, setCompany] = useState('');
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');

  // table
  const [formCode, setFormCode] = useState([]);
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterSet, setIsFilterSet] = useState(false); 

  // Inquiry table variable
  const [dataTable, setDataTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshTable, setRefreshTable] = useState(true);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [filterColumn, setfilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterOperation, setFilterOperation] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);


  // Lookup
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [project, setProject] = useState('');
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [vendor, setVendor] = useState('');
  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [department, setDepartment] = useState('');
  const [departmentOptions, setDepartementOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [customer, setCustomer] = useState('');
  // const [selectedCustomer, setSelectedCustomer] = useState(null);
  // const [customerOptions, setCustomerOptions] = useState([]);
 
  const branchId = getBranch();
  const headers = getToken();
  const authToken = headers;

  const tokenAccess = { Authorization: `Bearer ${headers}` };
  const idForm = sessionStorage.getItem('idForm');
  
  const userLoggin = () => sessionStorage.getItem('userId');

  useEffect(()=>{
    setCreatedBy(userLoggin);
  },[]);


  // Generate unique po
  // useEffect(() => {
  //   const generatePoNumber = async () => {
  //     try {
  //       const uniquePoNumber = await generateUniqueId(`${GENERATED_NUMBER}?code=PO`, authToken);
  //       setPoNumber(uniquePoNumber);
  //     } catch (error) {
  //       console.error('Failed to generate PO Number:', error);
  //     }
  //   };

  //   generatePoNumber();
  // }, []);

  useEffect(() => {
    // Ambil data lookup untuk currency

    // Department Lookup
    LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
    .then(data => {
      console.log('Currency lookup data:', data);

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );
      //console.log('Transformed data:', transformedData);

      const options = transformedData.map(item => ({
        value: item.NAME,
        label: item.NAME
      }));
      setDepartementOptions(options);
    })
    .catch(error => {
      console.error('Failed to fetch currency lookup:', error);
    });

    // Project Lookup
    LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
    .then(data => {
      console.log('Currency lookup data:', data);

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );
      //console.log('Transformed data:', transformedData);

      const options = transformedData.map(item => ({
        value: item.NAME,
        label: item.NAME
      }));
      setProjectOptions(options);
    })
    .catch(error => {
      console.error('Failed to fetch currency lookup:', error);
    });

    // Vendor Lookup
    LookupParamService.fetchLookupData("MSDT_FORMVNDR", authToken, branchId)
    .then(data => {
      console.log('Currency lookup data:', data);

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );
      //console.log('Transformed data:', transformedData);

      const options = transformedData.map(item => ({
        value: item.NAME,
        label: item.NAME
      }));
      setVendorOptions(options);
    })
    .catch(error => {
      console.error('Failed to fetch currency lookup:', error);
    });

    // Currency Lookup
    LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
    .then(data => {
      console.log('Currency lookup data:', data);

      // Transform keys to uppercase directly in the received data
      const transformedData = data.data.map(item =>
        Object.keys(item).reduce((acc, key) => {
          acc[key.toUpperCase()] = item[key];
          return acc;
        }, {})
      );
      //console.log('Transformed data:', transformedData);

      const options = transformedData.map(item => ({
        value: item.CODE,
        label: item.CODE
      }));
      setCurrencyOptions(options);
    })
    .catch(error => {
      console.error('Failed to fetch currency lookup:', error);
    });

   
  }, []);


  const fetchFormCode = async () => {
    if (idForm) {
        try {
            const response = await axios.get(`${FORM_SERVICE_LOAD_FIELD}?formId=${idForm}`, { headers: tokenAccess });

            if (response.data && response.data.coreFields) {
                const codes = response.data.coreFields.map(field => field.formCode);
                setFormCode(codes);
                console.log('Get Form code', codes);
            } else {
                console.error('Invalid response structure:', response.data);
            }
        } catch (error) {
            console.error('Error fetching form fields:', error);
        }
    } else {
        console.error('idForm not found in sessionStorage');
    }
  };

  useEffect(() => {
      if (idForm) {
          fetchFormCode();
      }
  }, [idForm]);

  useEffect(() => {
      if (formCode.length > 0) {
          let formMmtData = [];

          let filterColumnParam = filterColumn;
          let filterOperationParam = filterOperation;
          let filterValueParam = filterValue;

          // Check if URL parameter `status` is set
          const statusParam = new URLSearchParams(window.location.search).get('status');
          if (statusParam) {
              filterColumnParam = 'STATUS';
              filterOperationParam = 'EQUAL';
              filterValueParam = statusParam;
          }

          const fetchFormMmtData = FormService.fetchData(
              "",
              filterColumnParam,
              filterOperationParam,
              filterValueParam,
              currentPage,
              pageSize,
              `PURC_FORM${formCode[0]}`, 
              branchId,
              authToken,
              true
          )
          .then((response) => {
              console.log("Form Purchase Request lookup data:", response);
              formMmtData = HandleToUppercase(response.data);
              setTotalItems(response.totalAllData);
          })
          .catch((error) => {
              console.error("Failed to fetch form Purchase Request lookup:", error);
          });

          fetchFormMmtData.then(() => {
              console.log('MMT DATA', formMmtData);
              setDataTable(formMmtData);
              setIsLoadingTable(false);
          });
      }
  }, [formCode, pageSize, currentPage, refreshTable, isFilterSet]);

  const handlePageSizeChange = (event) => {
      setPageSize(parseInt(event.target.value, 10));
      setCurrentPage(1); 
  };

  const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
  };

  const handleRefresh = () => {
      setRefreshTable(!refreshTable);
      setIsLoadingTable(true);
      setFormData([]);
  };

  const handleFilterSearch = ({ filterColumn, filterOperation, filterValue }) => {
      console.log('filter Purchase Request list:', filterColumn, filterOperation, filterValue);
      setFilterOperation(filterOperation);
      setfilterColumn(filterColumn);
      setFilterValue(filterValue);
      setIsFilterSet(!isFilterSet);
      setIsLoadingTable(true);
  }

  const handleResetFilters = () => {
      setfilterColumn('');
      setFilterValue('');
      setFilterOperation('');
      setIsFilterSet(!isFilterSet);
      setIsLoadingTable(true);
  };
  const handleRowSelect = (item) => {
    setSelectedRows(prevSelectedRows => {
        if (prevSelectedRows.includes(item.PR_NUMBER)) {
            return prevSelectedRows.filter(row => row !== item.PR_NUMBER);
        } else {
            return [...prevSelectedRows, item.PR_NUMBER];
        }
    });
};





  const handleAddItem = () => {
    setItems([...items, { product: '', product_note: '', quantity: 0, currency: 'IDR', unit_price: 0, tax_ppn: 0, tax_ppn_type: '', tax_ppn_amount: 0, tax_base:'', total_price: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
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

  const handledepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    setDepartment(selectedOption ? selectedOption.value : '');
  }

  const handleVendorChange = (selectedOption) => {
    setSelectedVendor(selectedOption);
    setVendor(selectedOption ? selectedOption.value : '');
  }

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : '');
  }

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.total_price, 0);
  };

  const navigateToAdd = () => {
    setShowAdd(false);
  };

  return (
    <Fragment>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Purchase Order</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Purchase Order</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      {showAdd ? (
        <section className='content'>
          <Card>
            <Card.Header>
              <div className="row my-1">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <label htmlFor="pageSizeSelect" className="me-2">
                    Rows per page:
                  </label>
                  <select
                    id="pageSizeSelect"
                    className="form-form-select form-select-sm"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div className="col-6 d-flex justify-content-end align-items-center">
                    <div className="btn-group ml-2">
                      <button
                          type="button"
                          className="btn btn-default"
                      >
                          <FaSyncAlt />
                      </button>
                      <button
                          type="button"
                          className="btn btn-default"
                          onClick={navigateToAdd}
                      >
                          <FaAddressBook/> Add New
                      </button>
                      <button
                          type="button"
                          className="btn btn-default rounded-end-4"
                      >
                          <FaFilter /> Filter
                      </button>
                    </div>
                  </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className='table-responsive'>
                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedItems.length === items.length && items.length > 0}
                        />
                      </th>
                      <th>PO Number</th>
                      <th>Title</th>
                      <th>Request Date</th>
                      <th>Schedule Date</th>
                      <th>Document Number</th>
                      <th>Requestor</th>
                      <th>Department</th>
                      <th>Company</th>
                      <th>Project</th>
                      <th>Total Amount</th>
                      <th>Description</th>
                      <th>Created By</th>
                      <th>Checked By 1</th>
                      <th>Checked By 2</th>
                      <th>Approved By</th>
                      <th>Status Request</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingTable ? (
                                    <tr>
                                        <td colSpan="17" className="text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : dataTable.length === 0 ? (
                                    <tr>
                                        <td colSpan="17" className="text-center">
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    dataTable.map((item) => (
                                        <tr key={item.PR_NUMBER}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(item.PR_NUMBER)}
                                                    onChange={() => handleRowSelect(item)}
                                                />
                                            </td>
                                            <td>{item.po_number}</td>
                                            <td>{item.TITLE}</td>
                                            <td>{item.REQUEST_DATE}</td>
                                            <td>{item.SCHEDULE_DATE}</td>
                                            <td>{item.DOC_NO}</td>
                                            <td>{item.REQUESTOR}</td>
                                            <td>{item.DEPARTEMENT}</td>
                                            <td>{item.COMPANY}</td>
                                            <td>{item.PROJECT}</td>
                                            <td>
                                                <NumericFormat
                                                    value={item.TOTAL_AMOUNT}
                                                    displayType="text"
                                                    thousandSeparator=","
                                                    prefix="Rp "
                                                />
                                            </td>
                                            <td>{item.DESCRIPTION}</td>
                                            <td>{item.CREATED_BY}</td>
                                            <td>{item.CHECKED_BY_1}</td>
                                            <td>{item.CHECKED_BY_2}</td>
                                            <td>{item.APPROVED_BY}</td>
                                            <td>{item.STATUS_REQUEST}</td>
                                        </tr>
                                    ))
                                )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </section>
      ) : (
        <section className="content">
          <Row>
            <Col md={12}>
              <Card>
                <Card.Header>
                  <div className='row my-1'>
                    <Card.Title className='col-6 d-flex align-items-center justify-content-start'>General Information</Card.Title>
                    <div className='d-flex col-6 gap-2 justify-content-end text-end'>
                      <button className='btn btn-secondary' onClick={() => setShowAdd(true)}><FaTimes/> Cancel</button>
                      <button className='btn btn-primary'><FaSave/> Save</button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>

                      <Col md={6}>
                        <Form.Group controlId="formTitle">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formDocNo">
                          <Form.Label>Document Reference</Form.Label>
                          <Form.Control
                            as="select"
                            placeholder="Enter Document Number"
                            value={docNo}
                            onChange={(e) => setDocNo(e.target.value)}
                          >
                            <option value="">Select Document Number</option>
                            {/* Add more options here */}
                            <option value="purchaseRequest">Purchase Request</option>
                            <option value="internalMemo">Internal Memo</option>
                            <option value="customerContract">Customer Contract</option>
                            {/* Add more options if needed */}
                          </Form.Control>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formRequestor">
                          <Form.Label>Requestor</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Requestor"
                            value={requestor}
                            onChange={(e) => setRequestor(e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formDepartment">
                          <Form.Label>Department</Form.Label>
                            <Select
                            id='department'
                            value={selectedDepartment}
                            onChange={handledepartmentChange}
                            options={departmentOptions}
                            placeholder='Department...'
                            isClearable
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formCompany">
                          <Form.Label>Company</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                      <Form.Group controlId="formProject">
                        <Form.Label>Project</Form.Label>
                        <Select
                          id="project"
                          value={selectedProject}
                          options={projectOptions}
                          onChange={handleProjectChange}
                          isClearable 
                          placeholder="Project..."
                          required
                        />
                        
                      </Form.Group>
                    </Col>

                      <Col md={6}>
                        <Form.Group controlId="formRequestDate">
                          <Form.Label>Request Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formVendor">
                          <Form.Label>Vendor</Form.Label>
                          <Select
                            id='vendor'
                            value={selectedVendor}
                            options={vendorOptions}
                            onChange={handleVendorChange}
                            isClearable
                            placeholder="Vendor..."
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formPRNumber">
                          <Form.Label>PR Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Insert PR Number'
                            value={prNumber}
                            onChange={(e) => setPrNumber(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formOrderDate">
                          <Form.Label>Order Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formPaymentTerm">
                          <Form.Label>Payment Term</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Insert Payment Term'
                            value={paymentTerm}
                            onChange={(e) => setPaymentTerm(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formCreatedBy">
                          <Form.Label>Created By</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Insert Created By'
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                            disabled
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group controlId="formApprovedBy">
                          <Form.Label>Approved By</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Insert Approved By'
                            value={approveBy}
                            onChange={(e) => setApproveBy(e.target.value)}
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
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleAddItem}
                        className='rounded-3'
                      >
                        <i className="fas fa-plus"></i> New Item
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ml-2 rounded-3"
                        onClick={handleDeleteSelected}
                        disabled={selectedItems.length === 0}
                      >
                        <i className="fas fa-trash"></i> Delete Selected
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="table-container">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={selectedItems.length === items.length && items.length > 0}
                            />
                          </th>
                          <th>Product</th>
                          <th>Notes</th>
                          <th>Quantity</th>
                          <th>Currency</th>
                          <th>Unit Price</th>
                          <th>Tax PPN</th>
                          <th>Tax PPN Type</th>
                          <th>Tax PPN Amount</th>
                          <th>Tax Base</th>
                          <th>Total Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr>
                            <td colSpan="11" className="text-center">No data available</td>
                          </tr>
                        ) : (
                          items.map((item, index) => (
                            <tr key={index} className={selectedItems.includes(index) ? 'table-active' : ''}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(index)}
                                  onChange={() => handleSelectItem(index)}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="text"
                                  value={item.product}
                                  onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="text"
                                  value={item.product_note}
                                  onChange={(e) => handleItemChange(index, 'product_note', e.target.value)}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                />
                              </td>
                              <td>
                                <Select
                                  value={selectedCurrency}
                                  onChange={(selectedOption) => {
                                    setSelectedCurrency(selectedOption);
                                    handleItemChange(index, 'currency', selectedOption ? selectedOption.value : 'IDR');
                                  }}
                                  options={currencyOptions}
                                  isClearable
                                  placeholder="Select Currency"
                                />
                                
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={item.unit_price}
                                  onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                                />
                              </td>

                              <td>
                                <Form.Control
                                  type="number"
                                  value={item.tax_ppn}
                                  onChange={(e) => handleItemChange(index, 'tax_ppn', parseFloat(e.target.value))}
                                />
                              </td>

                              <td>
                                <Form.Control
                                  type="text"
                                  value={item.tax_ppn_type}
                                  onChange={(e) => handleItemChange(index, 'tax_ppn_type', e.target.value)}
                                />
                              </td>

                              <td>
                                <Form.Control
                                  type="number"
                                  value={item.tax_ppn_amount}
                                  onChange={(e) => handleItemChange(index, 'tax_ppn_amount', parseFloat(e.target.value))}
                                />
                              </td>

                              <td>
                                <Form.Control
                                  type="text"
                                  value={item.tax_base}
                                  onChange={(e) => handleItemChange(index, 'tax_base', e.target.value)}
                                />
                              </td>


                              <td>{item.total_price.toLocaleString('en-Us', {style: 'currency', currency: item.currency})}</td>

                              <td>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteItem(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="10" className="text-right">Sub Total:</td>
                          <td><strong>{calculateTotalAmount().toLocaleString('en-US', { style: 'currency', currency: 'IDR' })}</strong></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td colSpan="10" className="text-right">Ppn 10%:</td>
                          <td><strong>{calculateTotalAmount().toLocaleString('en-US', { style: 'currency', currency: 'IDR' })}</strong></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td colSpan="10" className="text-right">Total Amount:</td>
                          <td><strong>{calculateTotalAmount().toLocaleString('en-US', { style: 'currency', currency: 'IDR' })}</strong></td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder='Insert Description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className='row my-1'>
            <div className='d-flex col-12 gap-2 justify-content-end text-end'>
              <button className='btn btn-secondary' onClick={() => setShowAdd(true)}><FaTimes/> Cancel</button>
              <button className='btn btn-primary'><FaSave/> Save</button>
            </div>
          </div>
          
        </section>
      )}
    </Fragment>
  );
};

export default PurchaseOrderFormer;