import React, { Fragment, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Card } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import InsertDataService from '../service/InsertDataService';
import { getBranch, getToken } from '../config/Constant';

function PurchaseRequest() {
  const headers = getToken();
  const branchId = getBranch();
  const [pr_number, setPrNumber] = useState('');
  const [request_date, setRequestDate] = useState('');
  const [title, setTitle] = useState('');
  const [schedule_date, setScheduleDate] = useState('');
  const [doc_no, setDocNo] = useState('');
  const [requestor, setRequestor] = useState('');
  const [departement, setDepartment] = useState('');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const authToken = headers;

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

  const handleSave = async (event) => {
    event.preventDefault();

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to save the Purchase Request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        // Save general information and description
        const generalInfo = {
          pr_number,
          request_date: new Date(request_date).toLocaleDateString(), // Converts to date format
          title,
          schedule_date: new Date(schedule_date).toLocaleDateString(), // Converts to date format
          doc_no,
          requestor,
          departement,
          company,
          project,
          description
        };
        

        console.log('Master', generalInfo);
        const updatedItems = items.map(item => ({
          ...item,
          pr_number
        }));
        console.log('Items', updatedItems);

        const response = await InsertDataService.postData(generalInfo, "PUREQ", authToken, branchId);
        console.log('Data posted successfully:', response);

        if (response.message === "insert Data Successfully") {


          const response = await InsertDataService.postData(generalInfo, "PUREQD", authToken, branchId);

          messageAlertSwal('Success', response.message, 'success');

          console.log('Form DATA AFTER SUBMIT :', formData);
        }
      } catch (err) {
        // setError('An error occurred while saving data.');
        console.error(err);
      } finally {
        // setLoading(false);
      }
    } else {
      console.log('Form submission was canceled.');
    }
  };

  return (
    <Fragment>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Purchase Request</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Purchase Request</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title>General Information</Card.Title>
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
                      <Form.Group controlId="formPrNumber">
                        <Form.Label>PR. Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter No Request"
                          value={pr_number}
                          onChange={(e) => setPrNumber(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formScheduleDate">
                        <Form.Label>Schedule Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={schedule_date}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formDocNo">
                        <Form.Label>Doc No</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Document Number"
                          value={doc_no}
                          onChange={(e) => setDocNo(e.target.value)}
                        />
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
                        <Form.Label>Departement</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Department"
                          value={departement}
                          onChange={(e) => setDepartment(e.target.value)}
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
                        <Form.Control
                          type="text"
                          placeholder="Enter Project"
                          value={project}
                          onChange={(e) => setProject(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formRequestDate">
                        <Form.Label>Request Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={request_date}
                          onChange={(e) => setRequestDate(e.target.value)}
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
                    >
                      <i className="fas fa-plus"></i> New Item
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ml-2"
                      onClick={handleDeleteSelected}
                      disabled={selectedItems.length === 0}
                    >
                      <i className="fas fa-trash"></i> Delete Selected
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="items">
                    {(provided) => (
                      <div
                        className="table-responsive"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
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
                              <th>Total Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center">No data available</td>
                              </tr>
                            ) : (
                              items.map((item, index) => (
                                <Draggable key={index} draggableId={`item-${index}`} index={index}>
                                  {(provided) => (
                                    <tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={selectedItems.includes(index) ? 'table-active' : ''}
                                    >
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
                                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          as="select"
                                          value={item.currency}
                                          onChange={(e) => handleItemChange(index, 'currency', e.target.value)}
                                        >
                                          <option>IDR</option>
                                          <option>USD</option>
                                          {/* Add more currencies if needed */}
                                        </Form.Control>
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          value={item.unit_price}
                                          onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                        />
                                      </td>
                                      <td>{item.total_price.toLocaleString('en-US', { style: 'currency', currency: item.currency })}</td>
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
                                  )}
                                </Draggable>
                              ))
                            )}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="6" className="text-right">Total Amount:</td>
                              <td><strong>{calculateTotalAmount().toLocaleString('en-US', { style: 'currency', currency: 'IDR' })} </strong></td>
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
            <Button variant="secondary" className="mr-2">
              <i className="fas fa-times"></i> Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <i className="fas fa-save"></i> Save
            </Button>
          </Col>
        </Row>
      </section>
    </Fragment>
  );
}

export default PurchaseRequest;
