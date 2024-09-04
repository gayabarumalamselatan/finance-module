import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Card } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import { messageAlertSwal } from "../config/Swal";
import InsertDataService from '../service/InsertDataService';
import { getBranch, getToken } from '../config/Constant';
import Select from 'react-select';
import LookupParamService from '../service/LookupParamService';
import CreatableSelect from 'react-select/creatable';

const ViewPurchaseRequest = ({ purchaseRequestId, setIsEditing, handleRefresh }) => {
  const headers = getToken();
  const branchId = getBranch();
  const [pr_number, setPrNumber] = useState('');
  const [request_date, setRequestDate] = useState('');
  const [title, setTitle] = useState('');
  const [schedule_date, setScheduleDate] = useState('');
  const [doc_no, setDocNo] = useState('FRM.PTAP.PRC.21a-01');
  const [requestor, setRequestor] = useState('');
  const [departement, setDepartment] = useState('');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [status_request, setStatusRequest] = useState('New');
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
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

  const authToken = headers;

  useEffect(() => {
    // Fetch existing data for the purchase request
    const fetchPurchaseRequestData = async () => {
      try {
        const response = await InsertDataService.getDataById(purchaseRequestId, "PUREQ", authToken, branchId);
        const prData = response.data;
        setPrNumber(prData.pr_number);
        setRequestDate(prData.request_date);
        setTitle(prData.title);
        setScheduleDate(prData.schedule_date);
        setDocNo(prData.doc_no);
        setRequestor(prData.requestor);
        setDepartment(prData.departement);
        setCompany(prData.company);
        setProject(prData.project);
        setDescription(prData.description);
        setItems(prData.items || []);

        // Set selected options for Select components
        setSelectedRequestor({ value: prData.requestor, label: prData.requestor });
        setSelectedDepartement({ value: prData.departement, label: prData.departement });
        setSelectedCompany({ value: prData.company, label: prData.company });
        setSelectedProject({ value: prData.project, label: prData.project });
      } catch (error) {
        console.error('Failed to fetch purchase request data:', error);
      }
    };

    fetchPurchaseRequestData();

    // Fetch lookup data as in the AddPurchaseRequest component
    LookupParamService.fetchLookupData("MSDT_FORMEMPL", authToken, branchId)
      .then(data => {
        const transformedData = data.data.map(item =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        const options = transformedData.map(item => ({
          value: item.NAME,
          label: item.NAME
        }));
        setRequestorOptions(options);
      })
      .catch(error => {
        console.error('Failed to fetch requestor lookup:', error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMCCY", authToken, branchId)
      .then(data => {
        const transformedData = data.data.map(item =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        const options = transformedData.map(item => ({
          value: item.CODE,
          label: item.CODE
        }));
        setCurrencyOptions(options);
      })
      .catch(error => {
        console.error('Failed to fetch currency lookup:', error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMDPRT", authToken, branchId)
      .then(data => {
        const transformedData = data.data.map(item =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        const options = transformedData.map(item => ({
          value: item.NAME,
          label: item.NAME
        }));
        setDepartementOptions(options);
      })
      .catch(error => {
        console.error('Failed to fetch departement lookup:', error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMVNDR", authToken, branchId)
      .then(data => {
        const transformedData = data.data.map(item =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        const options = transformedData.map(item => ({
          value: item.NAME,
          label: item.NAME
        }));
        setCompanyOptions(options);
      })
      .catch(error => {
        console.error('Failed to fetch company lookup:', error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMPRJT", authToken, branchId)
      .then(data => {
        const transformedData = data.data.map(item =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        const options = transformedData.map(item => ({
          value: item.NAME,
          label: item.NAME
        }));
        setProjectOptions(options);
      })
      .catch(error => {
        console.error('Failed to fetch project lookup:', error);
      });

    LookupParamService.fetchLookupData("MSDT_FORMPRDT", authToken, branchId)
      .then(data => {
        const transformedData = data.data.map(item =>
          Object.keys(item).reduce((acc, key) => {
            acc[key.toUpperCase()] = item[key];
            return acc;
          }, {})
        );
        const options = transformedData.map(item => ({
          value: item.NAME,
          label: item.NAME
        }));
        setProductOptions(options);
      })
      .catch(error => {
        console.error('Failed to fetch product lookup:', error);
      });
  }, [purchaseRequestId]);

  const handleRequestorChange = (selectedOption) => {
    setSelectedRequestor(selectedOption);
    setRequestor(selectedOption ? selectedOption.value : '');
  };

  const handleDeppartementChange = (selectedOption) => {
    setSelectedDepartement(selectedOption);
    setDepartment(selectedOption ? selectedOption.value : '');
  };

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setCompany(selectedOption ? selectedOption.value : '');
  };

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setProject(selectedOption ? selectedOption.value : '');
  };

  const handleAddItem = () => {
    setItems([...items, { product: '', product_note: '', quantity: 0, currency: 'IDR', unit_price: 0, total_price: 0 }]);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (items.length === 0) {
      messageAlertSwal('Please add at least one item.', 'warning');
      return;
    }

    const data = {
      pr_number,
      request_date,
      title,
      schedule_date,
      doc_no,
      requestor,
      departement,
      company,
      project,
      status_request,
      description,
      items
    };

    setIsLoading(true);

    try {
      await InsertDataService.updateData(purchaseRequestId, data, "PUREQ", authToken, branchId);
      Swal.fire('Success', 'Purchase Request updated successfully', 'success');
      handleRefresh();  // Refresh the list or perform necessary actions after editing
      setIsEditing(false);  // Close the edit form
    } catch (error) {
      Swal.fire('Error', 'Failed to update Purchase Request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);  // Close the edit form
  };

  return (
    <Card>
      <Card.Header>
        <h4>Edit Purchase Request</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>PR Number</Form.Label>
                <Form.Control
                  type="text"
                  value={pr_number}
                  onChange={(e) => setPrNumber(e.target.value)}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Request Date</Form.Label>
                <Form.Control
                  type="date"
                  value={request_date}
                  onChange={(e) => setRequestDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Schedule Date</Form.Label>
                <Form.Control
                  type="date"
                  value={schedule_date}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Requestor</Form.Label>
                <Select
                  value={selectedRequestor}
                  onChange={handleRequestorChange}
                  options={requestorOptions}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Select
                  value={selectedDepartement}
                  onChange={handleDeppartementChange}
                  options={departementOptions}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company</Form.Label>
                <Select
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  options={companyOptions}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Project</Form.Label>
                <Select
                  value={selectedProject}
                  onChange={handleProjectChange}
                  options={projectOptions}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>Items</Form.Label>
            <Button variant="success" onClick={handleAddItem}>
              Add Item
            </Button>
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Product</th>
                  <th>Product Note</th>
                  <th>Quantity</th>
                  <th>Currency</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems.includes(index)}
                        onChange={() => handleSelectItem(index)}
                      />
                    </td>
                    <td>
                      <CreatableSelect
                        value={selectedProduct}
                        onChange={(value) => handleItemChange(index, 'product', value)}
                        options={productOptions}
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
                        onChange={(value) => handleItemChange(index, 'currency', value)}
                        options={currencyOptions}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                      />
                    </td>
                    <td>{item.total_price.toFixed(2)}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleDeleteItem(index)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="secondary" onClick={handleCancel} className="ml-2">
            Cancel
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ViewPurchaseRequest;
