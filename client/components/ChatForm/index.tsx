import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { ChangeEvent, KeyboardEvent, SyntheticEvent, useState } from 'react';

const ChatForm = ({
  addMessage
}: {
  addMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState<string>('');

  const onSubmit = {
    onSubmit: (e: SyntheticEvent) => {
      e.preventDefault();
      addMessage(message);
      setMessage('');
    }
  };

  const onChange = {
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    }
  };

  const onKeyPress = {
    onKeyPress: (e: KeyboardEvent) => {
      e.key === 'Enter' && onSubmit.onSubmit(e);
    }
  };

  return (
    <Form {...onSubmit} autoComplete='off'>
      <Container fluid={true}>
        <Row>
          <Col className='d-flex' xs='auto' sm={12}>
            <Form.Control
              type='text'
              placeholder='Send Message'
              {...onKeyPress}
              {...onChange}
              name='message'
              value={message}
            />
            <Button
              className='ms-3 fw-bold primary__btn'
              variant='primary'
              type='submit'
            >
              Send
            </Button>
          </Col>
        </Row>

        <Row>
          <Form.Text className='tx-nlight my-sm-1'>
            {/* {!errors.message
              ? 'Never send sensitive data.'
              : 'The message is required to continue.'} */}
            The message is required to continue.
          </Form.Text>
        </Row>
      </Container>
    </Form>
  );
};

export default ChatForm;
