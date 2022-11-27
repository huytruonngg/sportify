import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventHistoryScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartEvents },
  } = state;

  const removeEventHandler = (event) => {
    ctxDispatch({ type: 'CART_REMOVE_EVENT', payload: event });
  };

  const signupmoreHandler = () => {
    navigate('/');
  };

  return (
    <div>
      <Helmet>
        <title>Signed Up Events</title>
      </Helmet>
      <h1>Signed Up Events</h1>
      <Row>
        <Col md={8}>
          {cartEvents.length === 0 ? (
            <MessageBox>
              No event is signed up. <Link to="/">Go Signing Up</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartEvents.map((event) => (
                <ListGroup.Item key={event._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={event.image}
                        alt={event.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/event/${event.slug}`}>{event.name}</Link>
                    </Col>
                    <Col md={3}>
                    </Col>
                    <Col md={3}></Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeEventHandler(event)}
                        variant="light"
                      >
                        <p>Delete</p>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <div className="d-grid">
                <Button
                  type="button"
                  variant="primary"
                  onClick={signupmoreHandler}
                  disabled={cartEvents.length === 0}
                >
                  Proceed to sign up more events
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}