import { Button, Col, Container, Form, Row } from 'react-bootstrap';
// import { SubmitHandler, useForm } from 'react-hook-form';
import { ChangeEvent, KeyboardEvent, SyntheticEvent, useState } from 'react';
import { Message } from '../../interfaces/props.interfaces';

const ChatForm = ({
  addMessage
}: {
  addMessage: (message: Message) => void;
}) => {
  // const {
  //   reset,
  //   register,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm<Message>();
  const [message, setMessage] = useState<Message>({
    message: '',
    namespace: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage({ ...message, [e.target.name]: [e.target.value] });
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    addMessage(message);
    setMessage({ message: '', namespace: '' });
  };

  const handleKeyPress = (e: KeyboardEvent) => e.key === 'Enter' && onSubmit(e);

  return (
    <Form onSubmit={onSubmit} autoComplete='off'>
      <Container fluid={true}>
        <Row>
          <Col className='d-flex' xs='auto' sm={12}>
            <Form.Control
              type='text'
              placeholder='Send Message'
              onKeyPress={handleKeyPress}
              value={message.message}
              name='message'
              onChange={handleChange}
              // {...register('message', { required: true })}
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
          </Form.Text>
        </Row>
      </Container>
    </Form>
  );
};

export default ChatForm;
