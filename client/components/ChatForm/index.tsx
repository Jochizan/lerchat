import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Message } from '../../interfaces/form.interfaces';
import { io } from 'socket.io-client';
import { KeyboardEvent } from 'react';

const socket = io('http://localhost:5500');

const ChatForm = () => {
  const { register, reset, handleSubmit, formState: { errors } } = useForm<Message>();

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit);
    }
  };

  const onSubmit: SubmitHandler<Message> = (data) => {
    socket.emit('send-message', data.message);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
      <Container>
        <Row>
          <Col className='d-flex' xs='auto' sm={12}>
            <Form.Control
              type='text'
              placeholder='Send Message'
              onKeyPress={handleKeyPress}
              {...register('message', { required: true })}
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
            {!errors.message ? 'Never send sensitive data.' : 'The message is required to continue.'}
          </Form.Text>
        </Row>
      </Container>
    </Form>
  );
};

export default ChatForm;
