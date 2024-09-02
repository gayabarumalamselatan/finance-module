import React, { Fragment, useState } from 'react';
import { Button, Col, Form, Row, Card } from 'react-bootstrap';

function PurchaseRequest() {
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [docNo, setDocNo] = useState('');
  const [requestor, setRequestor] = useState('');
  const [department, setDepartment] = useState('');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

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
                      <Form.Group controlId="formSupplier">
                        <Form.Label>No Request</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter No Request"
                          value={supplier}
                          onChange={(e) => setSupplier(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formScheduleDate">
                        <Form.Label>Schedule Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={scheduleDate}
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
                          value={docNo}
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
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Department"
                          value={department}
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
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
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
                <div className="table-responsive">
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
                          <td colSpan="8" className="text-center">No data available</td>
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
                              <Form.Control
                                type="text"
                                value={item.currency}
                                onChange={(e) => handleItemChange(index, 'currency', e.target.value)}
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
                        <td colSpan="6" className="text-right">Total Amount:</td>
                        <td>{calculateTotalAmount().toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Fragment>
  );
}

export default PurchaseRequest;
